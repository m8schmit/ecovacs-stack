import { BotErrorId } from '../mqttClient/commands/error.type';
import { BotEventId, BotEventType } from '../mqttClient/commands/event.type';
import { execMysqlQuery } from './mysql';

// Errors
export const addBotEvent = (code: BotEventId | BotErrorId, type: BotEventType) =>
  execMysqlQuery(
    `INSERT INTO \`bot_events\` (\`evt_code\`, \`type\`, \`timestamp\`) VALUES ('${code}', '${type}', now());`,
  );

export const delBotEvent = (id: number) => execMysqlQuery(`DELETE FROM \`bot_events\` WHERE ((\`id\` = '${id}'));`);

export const delAllBotEvent = () => execMysqlQuery(`DELETE FROM \`bot_events\``);

export const getBotEvent = () => execMysqlQuery('SELECT * FROM `bot_events` ORDER BY `timestamp` DESC LIMIT 50');
