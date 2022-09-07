type BotCommandName =
  | 'playSound'
  | 'clean_V2'
  | 'getMajorMap'
  | 'getMinorMap'
  | 'charge'
  | 'getMapInfo_v2'
  | 'getCleanInfo'
  | 'GetChargeState'
  | 'getBattery';

export type BotAct = 'go' | 'start' | 'stop' | 'resume';

export type BotStatus = 'working' | 'pause' | 'idle';

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
