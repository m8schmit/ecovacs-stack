import { execMysqlQuery } from './mysql';

export const getBotPattern = () => execMysqlQuery(`SELECT * FROM \`bot_saved_pattern\``);

export const addBotPattern = (pattern: string) =>
  execMysqlQuery(`INSERT INTO \`bot_saved_pattern\` (\`pattern\`) VALUES ('${pattern}');`);

export const removeBotPattern = (patternId: string) =>
  execMysqlQuery(`DELETE FROM \`bot_saved_pattern\` WHERE (\'id\' = '${patternId}');`);
