type BotCommandName = 'playSound' | 'clean_V2' | 'getMajorMap' | 'getMinorMap' | 'charge' | 'getMapInfo_v2';

type BotAct = 'go' | 'start' | 'stop';

export interface DevicesCoordinates {
  x: number;
  y: number;
  a: number;
  invalid: number /* boolean number*/;
}
export interface BotCommand {
  name: BotCommandName;
  payload: {};
}
