import { BotErrorType } from '../mqttClient/commands/error.type';
import { execMysqlQuery } from './mysql';

// Errors
export const addBotError = (codesList: BotErrorType[]) =>
  execMysqlQuery(
    `INSERT INTO \`bot_errors\` (\`error_code\`, \`timestamp\`) VALUES ${codesList
      .map((code) => `('${code}', now())`)
      .join(', ')};`,
  );

export const delBotError = (id: number) => execMysqlQuery(`DELETE FROM \`bot_errors\` WHERE ((\`id\` = '${id}'));`);

export const delAllBotError = () => execMysqlQuery(`DELETE FROM \`bot_errors\``);

export const getBotError = () => execMysqlQuery('SELECT * FROM `bot_errors` ORDER BY `timestamp` DESC LIMIT 50');
