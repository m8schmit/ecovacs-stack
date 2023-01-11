import { MapSubSetType } from './mapSlice.type';

type MapShape = 'wall' | 'zone';
export interface NoGo {
  mssid: number;
  type: MapSubSetType;
  shape: MapShape;
}
