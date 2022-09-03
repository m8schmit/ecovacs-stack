type BotCommandName = 'playSound' | 'clean_V2' | 'getMajorMap' | 'getMinorMap';

export interface BotCommand {
  name: BotCommandName;
  payload: {};
}
