import { createConnection, QueryError } from 'mysql2';

const connection = createConnection({
  host: 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const mysqlConnection = () => {
  connection.connect((e) => console.log(e ? `MYSQL connection error: ${e}` : 'MYSQL connection successfull!'));
};

const mysqlLog = (err: QueryError, results: any, fields: any) => {
  console.log(`[MYSQL] error:`, err);
  console.log(`[MYSQL] resuls:`, results);
  console.log(`[MYSQL] fields:`, fields);
};

export { mysqlConnection, mysqlLog, connection };
