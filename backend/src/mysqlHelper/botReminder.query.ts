import { execMysqlQuery } from './mysql';

export const getAllReminders = () => execMysqlQuery('SELECT * FROM `bot_reminders` LIMIT 10');

export const updateReminder = (name: string, change: boolean) =>
  execMysqlQuery(`UPDATE \`bot_reminders\` SET \`need_to_change\` = '${+change}',  \`read\` = '${+change}' WHERE \`name\` = '${name}';`);


export const updateReminderRead = (name: string, read: boolean) =>
  execMysqlQuery(`UPDATE \`bot_reminders\` SET \`read\` = '${+read}' WHERE \`name\` = '${name}';`);
