import { Maybe } from '../types';

export interface Info {
  ready: boolean;
  botId: Maybe<string>;
  botClass: Maybe<string>;
  botResource: Maybe<string>;
}

export class BotInfo {
  private _botInfo: Info = {
    ready: false,
    botId: null,
    botClass: null,
    botResource: null,
  };

  constructor() {}

  public set info(info: Info) {
    this._botInfo = info;
  }

  public get info() {
    return this._botInfo;
  }
}
