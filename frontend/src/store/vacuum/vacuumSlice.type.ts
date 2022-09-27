// CleanState

export interface CleanState {
  state: BotState;
  cleanState: {
    id?: string /* 3 digits */;
    cid?: string /* 3 digits */;
    router?: BotRoute;
    type?: BotType;
    motionState?: BotMotionState;
    content?: CleanStateContent | string;
  };
}

export interface CleanStateContent {
  value?: string;
  type?: BotType;
}

type BotState = 'clean' | 'pause' | 'idle' | 'goCharging';
type BotRoute = 'plan';
type BotType = 'auto';
type BotMotionState = 'working' | 'pause';

// ChargeState
export interface ChargeState {
  isCharging: boolean;
  mode?: botMode;
}

type botMode = 'slot' | 'autoEmpty';

// cleanTask
export interface CleanTask {
  act: BotAct;
  type: BotCleanType;
  value?: string | null /* array of mssid or 4 xy value for a customArea, alway separated by commans */;
}

export type BotAct = 'go' | 'start' | 'stop' | 'resume' | 'pause';
export type BotCleanType = 'auto' | 'spotArea' | 'customArea';

// Map
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

export type Devices = 'bot' | 'dock';

export interface DevicesCoordinates {
  x: number;
  y: number;
  a: number;
  invalid: number /* boolean number*/;
}

export interface BatteryState {
  level: number;
  isLow: boolean;
}

export interface DevicesPayload {
  device: Devices;
  devicesCoordinates: DevicesCoordinates;
}

// AutoEmpty

export interface AutoEmptyState {
  active: boolean;
  enable: boolean;
}

//  VacuumingOptionState

export interface VacuumingOptionState {
  speed: number;
  count: number;
}

// mapTrace

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

// location

export interface LocationState {
  isLoading: boolean;
  isInvalid: boolean;
}
