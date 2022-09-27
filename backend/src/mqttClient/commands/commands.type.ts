import { MapTrace } from '../map/map.model';

type BotCommandName =
  | 'playSound'
  | 'clean_V2'
  | 'setSpeed'
  | 'shell'
  | 'setCleanCount'
  | 'SetTime' /* yes with a capital 'S' */
  | 'setAutoEmpty'
  | 'setRelocationState'
  | 'getPos'
  | 'getSpeed'
  | 'getCleanCount'
  | 'getMajorMap'
  | 'getMinorMap'
  | 'getMapSet'
  | 'getMapSubSet'
  | 'getMapTrace'
  | 'charge'
  | 'getMapInfo_v2'
  | 'getCleanInfo' /* there a V2, but it only seems triggered by the bot though 'onCleanInfo_V2 */
  | 'getChargeState'
  | 'getSched_V2'
  | 'setSched_V2'
  | 'getBattery';

export type BotAct = 'go' | 'start' | 'stop' | 'resume' | 'add' | 'del' | 'mod' | 'merge' | 'divide';
export type PosDevicesType = 'chargePos' | 'deebotPos';

// CleanState
export interface CleanState {
  state: BotState;
  cleanState: {
    id?: string /* 3 digits */;
    cid?: string /* 3 digits */;
    router?: BotRoute;
    type?: BotType;
    motionState?: BotMotionState;
    content?: {
      type?: BotType;
    };
  };
}

type BotState = 'clean' | 'pause' | 'idle' | 'goCharging';
type BotRoute = 'plan';
export type BotType = 'auto' | 'spotArea' | 'customArea';
type BotMotionState = 'working' | 'pause';

// ChargeState
export interface ChargeState {
  isCharging: number /* boolean number*/;
  mode: botMode;
}

type botMode = 'slot' | 'autoEmpty';

// AutoEmpty

export interface AutoEmptyState {
  active: boolean;
  enable: boolean;
}

// MapSubSet
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

export type MapSubSetType = 'ar' | 'vw' | 'mw';

// MapTracesList

export interface MapTracesList {
  isResponse: boolean;
  totalCount: number;
  newEntriesList: MapTrace[];
}
export interface DevicesCoordinates {
  x: number;
  y: number;
  a: number;
  invalid: number /* boolean number*/;
}

export interface BatteryState {
  level: number;
  isLow: number /* boolean number*/;
}
export interface BotCommand {
  name: BotCommandName;
  payload: {} | [];
}
