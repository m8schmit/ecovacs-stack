/**
 * Location
 */
export interface LocationState {
  isLoading: boolean;
  isInvalid: boolean;
}

export type Devices = 'bot' | 'dock';

export interface DevicesCoordinates {
  x: number;
  y: number;
  a: number;
  invalid: number /* boolean number*/;
}

export interface DevicesPayload {
  device: Devices;
  devicesCoordinates: DevicesCoordinates;
}

/**
 * Map
 */
export type MapSubSetType = 'ar' | 'vw' | 'mw';

export interface MapSubSet {
  type: MapSubSetType;
  subtype: string /* number length 1*/;
  connections: string /* string list like '9,' */;
  name: string;
  seqIndex: number;
  count: number;
  totalCount: number;
  index: number;
  cleanset: string /* string list like '1,0,2' */;
  valueSize: number;
  center: string /* x y, like '4825,-3125' */;
  mssid: string /* number length 1*/;
  value: string[][] /* decoded B64 LZMA, classic polygon coordinates like [[x, y], [x, y]...] */;
}

export interface ZoneMapSubset {
  type: MapSubSetType;
  mssid: string;
  value: number[][];
  mid: string;
}

/**
 * Map Trace
 */

export interface MapTracesList {
  updateIndex: number;
  totalCount: number;
  newEntriesList: MapTrace[];
}

interface Coordinate {
  x: number;
  y: number;
}

interface MapTrace {
  index: number;
  mapTracePointsList: Coordinate;
  type: number /*dont know yet what it is */;
  isConnectedWithPrevious: boolean;
}

export type SelectionType = 'zone' | 'room' | 'point';

/**
 * AI map
 */

export interface AiMapObstacle {
  x: number;
  y: number;
  type: BotObstacleType;
  pid: number;
  status: number;
}

export type BotObstacleType = 1 | 3 | 4 | 5 | 6;

export type BotObstacleLabel = {
  [key in BotObstacleType]: string;
};

// export const OBSTACLE_LABEL_LIST: BotObstacleLabel = {
//   1: 'mat',
//   3: 'cloth',
//   4: 'chair',
//   5: 'shoe',
//   6: 'wire',
// };

export type RoomType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export type RoomsTypeIcon = {
  [key in RoomType]: string;
};

// 0 default
// 1 living room
// 2 dining room
// 3 bed room
// 4 study room
// 5 kitchen
// 6 bath room
// 7 laundry room
// 8 lounge room
// 9 storage room
// 10 kids room
// 11 sun room
// 12 corridor
// 13 balcony
// 14 fitness room
// 15 cloakroom (dont exist anymore in the last version)
// 16 second bedroom (dont exist in my official version)
