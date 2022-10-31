import { execMysqlQuery } from './mysql';

export const getAllReminders = () => execMysqlQuery('SELECT * FROM `bot_reminders` LIMIT 10');

export const updateReminder = (name: string, change: boolean) =>
  execMysqlQuery(`UPDATE \`bot_reminders\` SET \`need_to_change\` = '${+change}' WHERE \`name\` = '${name}';`);
