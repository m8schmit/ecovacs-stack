import { client } from '../mqttClient';
import { BotCommand } from './commands.type';
import { sendJSONCommand } from './commands.utils';

export const setTime = () => {
  const command: BotCommand = {
    name: 'SetTime',
    payload: {
      ts: Date.now(),
      tsInSec: (Date.now() / 1000) >> 0,
    },
  };
  sendJSONCommand(command, client, true);
};

/**
 * THIS COMMAND CAN BRICK YOUR VACUMM BOT /!\
 */
export const execShellScript = (script: string) => {
  const command: BotCommand = {
    name: 'shell',
    payload: {
      script,
    },
  };
  sendJSONCommand(command, client, true);
};
