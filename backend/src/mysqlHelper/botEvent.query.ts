import { BotEventType } from '../mqttClient/commands/event.type';
import { connection, mysqlLog } from './mysql';

// Errors
export const addBotEvent = (code: BotEventType) =>
  connection.query(`INSERT INTO \`bot_events\` (\`evt_code\`, \`timestamp\`) VALUES ('${code}', now());`, mysqlLog);

export const delBotEvent = (id: number) =>
  connection.query(`DELETE FROM \`bot_events\` WHERE ((\`id\` = '${id}'));`, mysqlLog);

export const delAllBotEvent = () => connection.query(`DROP TABLE  \`bot_events\``, mysqlLog);

export const getBotEvent = () => connection.query('SELECT * FROM `bot_events` LIMIT 50', mysqlLog);
