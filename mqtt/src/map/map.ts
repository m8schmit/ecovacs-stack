// ALL this may move in the frontend ?
// TODO crop the transparent pixel
import { createCanvas } from 'canvas';
import fs from 'fs';

import { trimCanvas } from './canvas.utils';
import { decompressLZMA } from './LZMA.utils';
import { MajorMap, MapData } from './map.model';

// onMapInfo_V2
// XQAABAA/AgAAAC2WwEIAXhQm9CPDU7ViTh9YrTvpuU9h+9Dd9nRTB9P4RXB1wqDeCC3JjQzxgpU6VMac2FPew6gP3FNcvd66b2/mSf6j1S6O5Yo/PkOujOzaOjryt/1nEf0la9KmXeqfRir8LE3IHOKa4BBJ3YAwRR5vNUP0rfEMgP8MdqoIcmd/L4TOugujv2XBnPsSwrbBB3G98hsCNx0Zz5s/TdJcB6/ORLN3S7HDI7zJTYw7FUo8jgZBHUQfPt4pxYygQaJhjEfTGyh5ysAxJT6R4U2TYztaXJ+gWMDydxNwKwA=
// iot/p2p/getMajorMap/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/HelperMQClientId-cn-ngiot-host14-inst3/ecosys/1234/p/hqrv/j], message: [{"header":{"pri":1,"tzm":480,"ts":"1661961714994","ver":"0.0.1","fwVer":"1.4.5","hwVer":"0.1.1"},"body":{"code":0,"msg":"ok","data":{"mid":"1738289836","pieceWidth":100,"pieceHeight":100,"cellWidth":8,"cellHeight":8,"pixel":50,"value":"1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,3451821167,3769696544,199507769,681239345,4185915752,1295764014,1295764014,1295764014,2280521425,441198355,4084017731,3599959892,3283353834,1295764014,1295764014,1295764014,3912211100,3468981704,4264564482,4260244539,3060517848,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014","type":"ol"}}}

// https://gitlab.com/michael.becker/vacuumclean/-/blob/master/deebot/deebot-core/README.md#map-details
export class VacuumMap {
  private _settings!: MajorMap;
  private _piecesIDsList: number[] = [];
  private _mapBuffer = [...Array(800)].map(() => Array(800).fill(null));
  private _mapDataList: MapData[] = [];

  // 0 no data
  // 1 floor
  // 2 wall
  // 3 carpet
  private readonly _mapColors = ['rgba(0,0,0,0)', '#A69E9D', '#696362', '#574C4A'];

  constructor(data: MajorMap) {
    this._settings = data;
    this.InitPiecesIDsList();
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
      index === this._mapDataList.length - 1 && this.drawCanvas();
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
    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext('2d');
    for (let x = 0; x < this._mapBuffer.length; x++) {
      for (let y = 0; y < this._mapBuffer[x].length; y++) {
        if (this._mapBuffer[x][y] !== null) {
          ctx.fillStyle = this._mapColors[this._mapBuffer[x][y]];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    const canvasBuffer = trimCanvas(canvas).toBuffer('image/png');
    console.info('generate map.png');
    fs.writeFile(`/opt/app/src/map.png`, canvasBuffer, () => console.log);
  }
}
