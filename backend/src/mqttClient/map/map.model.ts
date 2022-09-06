export interface MapData {
  data: string /*LZMA B64 Bytes map */;
  index: number;
}

export type Axis = 'x' | 'y';

export interface MajorMap {
  mid: string /*mapId*/;
  pieceWidth: number /*columnGrid*/;
  pieceHeight: number /*rowGrid*/;
  cellWidth: number /*columnPiece-**/;
  cellHeight: number /*rowPiece*/;
  pixel: number /*pixeWidth*/;
  value: string /*crc*/;
  type: string;
}
