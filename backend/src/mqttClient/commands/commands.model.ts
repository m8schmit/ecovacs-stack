type BotCommandName =
  | 'playSound'
  | 'clean_V2'
  | 'getMajorMap'
  | 'getMinorMap'
  | 'getMapSet'
  | 'getMapSubSet'
  | 'charge'
  | 'getMapInfo_v2'
  | 'getCleanInfo' /* there a V2, but it only seems triggered by the bot though 'onCleanInfo_V2 */
  | 'getChargeState'
  | 'getBattery';

export type BotAct = 'go' | 'start' | 'stop' | 'resume';

// export type BotState = 'working' | 'pause' | 'idle';

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
type BotType = 'auto';
type BotMotionState = 'working' | 'pause';

// ChargeState
export interface ChargeState {
  isCharging: number /* boolean number*/;
  mode: botMode;
}

type botMode = 'slot' | 'autoEmpty';

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
  payload: {};
}
