// ALL this may move in the frontend ?

// onMapInfo_V2
// XQAABAA/AgAAAC2WwEIAXhQm9CPDU7ViTh9YrTvpuU9h+9Dd9nRTB9P4RXB1wqDeCC3JjQzxgpU6VMac2FPew6gP3FNcvd66b2/mSf6j1S6O5Yo/PkOujOzaOjryt/1nEf0la9KmXeqfRir8LE3IHOKa4BBJ3YAwRR5vNUP0rfEMgP8MdqoIcmd/L4TOugujv2XBnPsSwrbBB3G98hsCNx0Zz5s/TdJcB6/ORLN3S7HDI7zJTYw7FUo8jgZBHUQfPt4pxYygQaJhjEfTGyh5ysAxJT6R4U2TYztaXJ+gWMDydxNwKwA=
import { createCanvas } from 'canvas';
import { decompress } from 'lzma-native';
import fs from 'fs';
import { makeId } from '../text.utils';

// iot/p2p/getMajorMap/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/HelperMQClientId-cn-ngiot-host14-inst3/ecosys/1234/p/hqrv/j], message: [{"header":{"pri":1,"tzm":480,"ts":"1661961714994","ver":"0.0.1","fwVer":"1.4.5","hwVer":"0.1.1"},"body":{"code":0,"msg":"ok","data":{"mid":"1738289836","pieceWidth":100,"pieceHeight":100,"cellWidth":8,"cellHeight":8,"pixel":50,"value":"1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,3451821167,3769696544,199507769,681239345,4185915752,1295764014,1295764014,1295764014,2280521425,441198355,4084017731,3599959892,3283353834,1295764014,1295764014,1295764014,3912211100,3468981704,4264564482,4260244539,3060517848,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014","type":"ol"}}}

// https://gitlab.com/michael.becker/vacuumclean/-/blob/master/deebot/deebot-core/README.md#map-details
interface MajorMap {
  mid: string /*mapId*/;
  pieceWidth: number /*columnGrid*/;
  pieceHeight: number /*rowGrid*/;
  cellWidth: number /*columnPiece-**/;
  cellHeight: number /*rowPiece*/;
  pixel: number /*pixeWidth*/;
  value: string /*crc*/;
  type: string;
}

interface MapBuffer {
  row: number;
  column: number;
  pieceData: number;
}

// 0 no data
// 1 floor
// 2 wall
// 3 carpet
const mapColors = ['rgba(0,0,0,0)', '#00FF00', '#FF0000', '#0000FF', 'rgba(0,0,0,0) '];

const decodeB64 = (str: string) => Buffer.from(str, 'base64');

const toBigIndian = (buffer: Buffer) => {
  const fourBytesBuffer = Buffer.allocUnsafe(4);
  fourBytesBuffer.writeUintLE(0, 0, 4);
  const start = buffer.subarray(0, 9);
  const end = buffer.subarray(9);
  const mergedBuffer = Buffer.concat([start, fourBytesBuffer, end]);
  return mergedBuffer;
};

const fillBuffer = (majorMap: MajorMap, pieceData: number[], pieceIndex: number): number[][] => {
  const rowStart = pieceIndex / majorMap.cellHeight;
  const columnStart = pieceIndex % majorMap.cellWidth;

  const maxRow = majorMap.pieceHeight + rowStart * majorMap.cellHeight;
  const maxCol = majorMap.pieceWidth + columnStart * majorMap.pieceWidth;
  const buffer = [...Array(maxRow)].map(() => Array(maxCol));

  for (let row = 0; row < majorMap.pieceHeight; row++) {
    for (let column = 0; column < majorMap.pieceWidth; column++) {
      const bufferRow = row + rowStart * majorMap.cellHeight;
      const bufferColumn = column + columnStart * majorMap.pieceWidth;
      const pieceDataPosition = majorMap.pieceHeight * row + column;
      buffer[bufferRow][bufferColumn] = pieceData[pieceDataPosition];
    }
  }
  return buffer;
};

const drawCanvas = (buffer: number[][]) => {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');
  for (let x = 0; x < buffer.length; x++) {
    for (let y = 0; y < buffer[x].length; y++) {
      ctx.fillStyle = mapColors[buffer[x][y] || 4];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const canvasBuffer = canvas.toBuffer('image/png');
  fs.writeFile(`/opt/app/src/${makeId(4)}.png`, canvasBuffer, () => console.log);
};

export const BuildMap = () => {
  const test: MajorMap = {
    mid: '1738289836',
    pieceWidth: 100,
    pieceHeight: 100,
    cellWidth: 8,
    cellHeight: 8,
    pixel: 50,
    value:
      '1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,3451821167,3769696544,199507769,681239345,4185915752,1295764014,1295764014,1295764014,2280521425,441198355,4084017731,3599959892,3283353834,1295764014,1295764014,1295764014,3912211100,3468981704,4264564482,4260244539,3060517848,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014',
    type: 'ol',
  };
  ////
  mapArrayForTest.forEach((current) => {
    decompress(toBigIndian(decodeB64(current.data)), undefined, (res) => {
      let buffer: number[][] = [];
      buffer = fillBuffer(test, res.toJSON().data, current.id);
      drawCanvas(buffer);
    });
  });
};
