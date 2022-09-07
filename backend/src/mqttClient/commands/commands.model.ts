type BotCommandName =
  | 'playSound'
  | 'clean_V2'
  | 'getMajorMap'
  | 'getMinorMap'
  | 'charge'
  | 'getMapInfo_v2'
  | 'getCleanInfo' /* there a V2, but it only seems triggered by the bot though 'onCleanInfo_V2 */
  | 'GetCharge'
  | 'getBattery';

export type BotAct = 'go' | 'start' | 'stop' | 'resume';

// export type BotState = 'working' | 'pause' | 'idle';

// CleanState
export interface CleanState {
  state: BotState;
  cleanState: {
    id?: string /* 3 digits */;
    router?: BotRoute;
    type?: BotType;
    motionState?: BotMotionState;
    content?: {
      type?: BotType;
    };
  };
}

type BotState = 'clean' | 'pause' | 'idle';
type BotRoute = 'plan';
type BotType = 'auto';
type BotMotionState = 'working' | 'pause';

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
