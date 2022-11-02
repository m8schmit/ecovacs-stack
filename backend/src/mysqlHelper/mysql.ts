import { createPool } from 'mysql2';

const connection = createPool({
  host: 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const execMysqlQuery = (query: string) =>
  connection
    .promise()
    .query(query)
    .then(([rows, fields]) => rows);

export { connection, execMysqlQuery };
