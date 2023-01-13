import { MapSubSetType } from './mapSlice.type';

type MapShape = 'wall' | 'zone';
export interface NoGo {
  mssid: number;
  type: MapSubSetType;
  shape: MapShape;
}

interface MapInfo {
  mid: string;
  backupId: string;
  status: number;
  index: number;
  using: number /* boolean number*/;
  built: number /* boolean number*/;
  name: string;
}
export interface CachedMapInfo {
  enable: number /* boolean number*/;
  info: MapInfo[];
}
