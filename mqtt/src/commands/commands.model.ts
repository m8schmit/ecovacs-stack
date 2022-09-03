type BotCommandName = 'playSound' | 'clean_V2' | 'getMajorMap' | 'getMinorMap' | 'charge';

export interface BotCommand {
  name: BotCommandName;
  payload: {};
}
