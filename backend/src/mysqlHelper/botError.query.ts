import { ADDRGETNETWORKPARAMS } from 'dns';
import { BotErrorType } from '../mqttClient/commands/error.type';
import { connection, mysqlLog } from './mysql';

// Errors
export const addBotError = (codesList: BotErrorType[]) =>
  connection.query(
    `INSERT INTO \`bot_errors\` (\`error_code\`, \`timestamp\`) VALUES ${codesList
      .map((code) => `('${code}', now())`)
      .join(', ')};`,
    mysqlLog,
  );

export const delBotError = (id: number) =>
  connection.query(`DELETE FROM \`bot_errors\` WHERE ((\`id\` = '${id}'));`, mysqlLog);

export const delAllBotError = () => connection.query(`DROP TABLE  \`bot_errors\``, mysqlLog);

export const getBotError = () => connection.query('SELECT * FROM `bot_errors` LIMIT 50', mysqlLog);
