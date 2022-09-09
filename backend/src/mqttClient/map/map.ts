// ALL this may move in the frontend ?
// TODO crop the transparent pixel
import { createCanvas } from 'canvas';
import fs from 'fs';
import { WSsocket } from '../../websocketServer/websocketServer';
import { Maybe } from '../types';

import { translateCanvas, trimCanvas } from './canvas.utils';
import { decompressLZMA } from './LZMA.utils';
import { MajorMap, MapData, MapTrace } from './map.model';

/*
 * Thanks to https://gitlab.com/michael.becker/vacuumclean/-/blob/master/deebot/deebot-core/src/main/java/de/caterdev/vacuumclean/deebot/core/DataParseUtils.java#L94
 */
export const parseTracePoints = async (data: string, startIndex: number): Promise<MapTrace[]> => {
  const LEN_TRACEPOINT_FIELD = 5;
  if (!data) {
    console.error('Trace is empty');
    return [];
  }
  return await decompressLZMA(data).then((res) => {
    let mapTrace: MapTrace[] = [];
    for (let i = 0; i < res.byteLength; i += LEN_TRACEPOINT_FIELD) {
      // Dont know yet why the '* 10' but with this the coordinate are the same as the bot coordinates
      mapTrace = [
        ...mapTrace,
        {
          index: startIndex++,
          mapTracePointsList: {
            x: res.readInt16LE(i) * 10,
            y: res.readInt16LE(i + 2) * 10,
          },
          type: res[i + 4],
          isConnectedWithPrevious: res[i + 4] >>> 7 !== 0,
        },
      ];
    }
    return mapTrace;
  });
};

// https://gitlab.com/michael.becker/vacuumclean/-/blob/master/deebot/deebot-core/README.md#map-details
export class VacuumMap {
  private _settings!: MajorMap;
  private _piecesIDsList: number[] = [];
  private _mapBuffer = [...Array(800)].map(() => Array(800).fill(null));
  private _mapDataList: MapData[] = [];
  private readonly _intervalDuration = 2000;
  private _buildMapInterval!: NodeJS.Timeout;

  // 0 no data
  // 1 floor
  // 2 wall
  // 3 carpet
  private readonly _mapColors = ['rgba(0,0,0,0.0)', '#A69E9D', '#696362', '#574C4A'];

  constructor(data: MajorMap) {
    this._settings = data;
    this.InitPiecesIDsList();
    console.log('PIXEL', this._settings.pixel);
  }

  /**
   * To get the piece ID after 'getMajorMap'
   * @param param0
   * @returns
   */
  private InitPiecesIDsList() {
    const NO_PIECE = '1295764014';
    this._piecesIDsList = this._settings.value
      .split(',')
      .reduce((acc: number[], curr, index) => (curr !== NO_PIECE ? [...acc, index] : acc), []);
  }

  public addPiecesIDsList(value: number) {
    this._piecesIDsList = [...this._piecesIDsList.filter((current) => current !== value), value];
  }

  public get piecesIDsList() {
    return this._piecesIDsList;
  }

  public addMapDataList(value: MapData) {
    this._mapDataList = [...this._mapDataList.filter((current) => current.index !== value.index), value];
  }

  public get mapDataList() {
    return this._mapDataList;
  }

  public get settings() {
    return this._settings;
  }

  public buildMap() {
    this._mapDataList.forEach(async (current, index) => {
      await decompressLZMA(current.data).then((res) => {
        this.fillBuffer(this._settings, res.toJSON().data, current.index);
      });
      if (index === this._mapDataList.length - 1) {
        clearTimeout(this._buildMapInterval);
        this._buildMapInterval = setTimeout(() => {
          this.drawCanvas();
        }, this._intervalDuration);
      }
    });
  }

  private fillBuffer(majorMap: MajorMap, pieceData: number[], pieceIndex: number) {
    const rowStart = (pieceIndex / majorMap.cellHeight) >> 0;
    const columnStart = pieceIndex % majorMap.cellWidth >> 0;

    for (let row = 0; row < majorMap.pieceHeight; row++) {
      for (let column = 0; column < majorMap.pieceWidth; column++) {
        const bufferRow = row + rowStart * majorMap.pieceHeight;
        const bufferColumn = column + columnStart * majorMap.pieceWidth;
        const pieceDataPosition = majorMap.pieceHeight * row + column;

        this._mapBuffer[bufferRow][bufferColumn] = pieceData[pieceDataPosition];
      }
    }
  }

  private drawCanvas() {
    const canvas = createCanvas(1600, 1600);
    const ctx = canvas.getContext('2d');
    const PixelRatio = 2;
    let x = 0;
    for (let rowIndex = 0; rowIndex < this._mapBuffer.length; rowIndex++) {
      let y = 0;
      for (let colIndex = 0; colIndex < this._mapBuffer[rowIndex].length; colIndex++) {
        // if (this._mapBuffer[rowIndex][colIndex] !== null) {
        ctx.fillStyle = this._mapColors[this._mapBuffer[rowIndex][colIndex] || 0];
        ctx.fillRect(x, y, PixelRatio, PixelRatio);
        // }
        y += PixelRatio;
      }
      x += PixelRatio;
    }
    if (canvas) {
      const canvasBuffer = translateCanvas(canvas, 'y').toBuffer('image/png');
      WSsocket.emit('vacuumMap', canvasBuffer.toString('base64'));
      console.info('generate map.png');
      fs.writeFile(`/opt/app/src/map.png`, canvasBuffer, () => console.log);
    }
  }
}
