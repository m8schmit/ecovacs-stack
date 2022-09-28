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
