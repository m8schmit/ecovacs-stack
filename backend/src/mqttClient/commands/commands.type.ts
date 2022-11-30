import { MapTrace } from '../map/map.model';

export type BotCommandName =
  | 'charge'
  | 'clean_V2'
  | 'getAIMap'
  | 'getAutoEmpty'
  | 'getBattery'
  | 'getBlock'
  | 'getBreakPoint'
  | 'getCachedMapInfo'
  | 'getChargeState'
  | 'getCleanCount'
  | 'getCleanInfo'
  | 'getCleanPreference'
  | 'getDusterRemind'
  | 'getDModule'
  | 'getError'
  | 'getInfo'
  | 'getLifeSpan'
  | 'getMajorMap'
  | 'getMapInfo_v2'
  | 'getMapSet'
  | 'getMapState'
  | 'getMapSubSet'
  | 'getMapTrace'
  | 'getMinorMap'
  | 'getPos'
  | 'getRecognization'
  | 'getSched_V2'
  | 'getSpeed'
  | 'getStats'
  | 'getVoice'
  | 'getVolume'
  | 'getWaterInfo'
  | 'playSound'
  | 'setAutoEmpty'
  | 'setCleanCount'
  | 'getFeiyanInfo'
  | 'resetLifeSpan'
  | 'setLiveLaunchPwd'
  | 'setRelocationState'
  | 'setSched_V2'
  | 'setSpeed'
  | 'SetTime' /* keep the uppercase S */
  | 'setWaterInfo';

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
export type BotType = 'auto' | 'spotArea' | 'customArea' | 'mapPoint';
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
  bagFull: boolean;
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

//TODO is there more ? like mop or dust bag ?
export type LifeSpanDeviceType = 'brush' | 'sideBrush' | 'heap' | 'unitCare' | 'dModule';

export interface LifeSpanDevice {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

export interface AiMapObstacle {
  x: number;
  y: number;
  type: number;
  pid: number;
  status: number;
}
// ['brush', 'sideBrush', 'heap', 'unitCare', 'dModule'],
// [{"type":"sideBrush","left":6778,"total":9000},{"type":"brush","left":16062,"total":18000},{"type":"heap","left":5262,"total":7200},{"type":"unitCare","left":-138,"total":1800},{"type":"dModule","left":3598,"total":3600}
