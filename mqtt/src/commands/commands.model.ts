type BotCommandName = 'playSound' | 'clean_V2';

export interface BotCommand {
  name: BotCommandName;
  payload: {};
}
