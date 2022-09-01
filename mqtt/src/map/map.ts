// ALL this may move in the frontend ?

// onMapInfo_V2
// XQAABAA/AgAAAC2WwEIAXhQm9CPDU7ViTh9YrTvpuU9h+9Dd9nRTB9P4RXB1wqDeCC3JjQzxgpU6VMac2FPew6gP3FNcvd66b2/mSf6j1S6O5Yo/PkOujOzaOjryt/1nEf0la9KmXeqfRir8LE3IHOKa4BBJ3YAwRR5vNUP0rfEMgP8MdqoIcmd/L4TOugujv2XBnPsSwrbBB3G98hsCNx0Zz5s/TdJcB6/ORLN3S7HDI7zJTYw7FUo8jgZBHUQfPt4pxYygQaJhjEfTGyh5ysAxJT6R4U2TYztaXJ+gWMDydxNwKwA=
import { createCanvas } from 'canvas';
import { decompress } from 'lzma-native';
import fs from 'fs';

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
const mapColors = ['#252525', '#FF0000', '#00FF00', '#0000FF'];

const decodeB64 = (str: string) => Buffer.from(str, 'base64');

const toBigIndian = (buffer: Buffer) => {
  const fourBytesBuffer = Buffer.allocUnsafe(4);
  fourBytesBuffer.writeUintLE(0, 0, 4);
  const start = buffer.subarray(0, 9);
  const end = buffer.subarray(9);
  const mergedBuffer = Buffer.concat([start, fourBytesBuffer, end]);
  return mergedBuffer;
};

const fillBuffer = (majorMap: MajorMap, pieceData: number[], pieceIndex: number): MapBuffer[] => {
  let buffer: MapBuffer[] = [];
  const rowStart = pieceIndex / majorMap.cellHeight;
  const columnStart = pieceIndex % majorMap.cellWidth;
  console.log(pieceIndex, majorMap.cellHeight);

  for (let row = 0; row < majorMap.pieceHeight; row++) {
    for (let column = 0; column < majorMap.pieceWidth; column++) {
      const bufferRow = row + rowStart * majorMap.cellHeight;
      const bufferColumn = column + columnStart * majorMap.pieceWidth;
      const pieceDataPosition = majorMap.pieceHeight * row + column;
      buffer[row] = { row: bufferRow, column: bufferColumn, pieceData: pieceData[pieceDataPosition] };
    }
  }
  //   console.log('buffer ', buffer);
  return buffer;
};

const getBufferValue = (buffer: MapBuffer[], row: number, col: number) => {
  return buffer.find((current) => current.row === row && current.column === col)?.pieceData;
};

const getMapsize = (buffer: MapBuffer[]) => {
  let maxMap = {
    x: 0,
    y: 0,
  };

  buffer.forEach((current) => {
    maxMap.x = current.row > maxMap.x ? current.row : maxMap.x;
    maxMap.y = current.column > maxMap.y ? current.column : maxMap.y;
  });
  console.log(maxMap);
  return maxMap;
};

const drawCanvas = (buffer: MapBuffer[]) => {
  const maxMap = getMapsize(buffer);
  const imgX = 10;
  const imgY = 10;
  const canvas = createCanvas(imgX, imgY);
  const ctx = canvas.getContext('2d');
  for (let x = 0; x < imgX; x++) {
    for (let y = 0; y < imgY; y++) {
      //   const pixel = ctx.createImageData(1, 1);
      //   pixel.data.fill(parseInt('ff0000',));
      //   ctx.putImageData(pixel, x, y);
      console.log(
        'will color',
        x,
        y,
        ' with ',
        mapColors[getBufferValue(buffer, x, y) || 0],
        getBufferValue(buffer, x, y),
      );
      ctx.fillStyle = mapColors[getBufferValue(buffer, x, y) || 0];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const canvasBuffer = canvas.toBuffer('image/png');
  fs.writeFile('/opt/app/src/test.png', canvasBuffer, () => console.log);
};

export const BuildMap = () => {
  //// mock
  const pieceData =
    'XQAABAAQJwAAAABpftpH+4yFqTiOMxoS2kYMCu47vWGBTekIqZVCGdI4cGyNmRZjI2iiZmnsOp2mePcwFyobNz2gUoKkGDXzxP+zfkw5y7fbIYr5LHftxOd5r1k43KJTzrfnVvEtaAdtQBVhLxbuycXHZ72dmNL9mskLIjMvCQA="';
  const pieceIndex = 37;
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
  decompress(toBigIndian(decodeB64(pieceData)), undefined, (res) => {
    let buffer = fillBuffer(test, res.toJSON().data, pieceIndex);
    drawCanvas(buffer);
  });
};
