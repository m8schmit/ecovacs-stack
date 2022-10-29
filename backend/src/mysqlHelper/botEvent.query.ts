import { BotEventType } from '../mqttClient/commands/event.type';
import { connection, execMysqlQuery } from './mysql';

// Errors
export const addBotEvent = (code: BotEventType) =>
  execMysqlQuery(`INSERT INTO \`bot_events\` (\`evt_code\`, \`timestamp\`) VALUES ('${code}', now());`);

export const delBotEvent = (id: number) => execMysqlQuery(`DELETE FROM \`bot_events\` WHERE ((\`id\` = '${id}'));`);

export const delAllBotEvent = () => execMysqlQuery(`DROP TABLE  \`bot_events\``);

export const getBotEvent = () => execMysqlQuery('SELECT * FROM `bot_events` ORDER BY `timestamp` DESC LIMIT 50');
