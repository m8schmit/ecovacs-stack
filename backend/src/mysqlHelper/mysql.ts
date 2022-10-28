import { createConnection } from 'mysql2';

const connection = createConnection({
  host: 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const mysqlConnection = () => {
  connection.connect((e) => console.log(e ? `MYSQL connection error: ${e}` : 'MYSQL connection successfull!'));
};

const execMysqlQuery = (query: string) =>
  connection
    .promise()
    .query(query)
    .then((res) => res);

export { mysqlConnection, connection, execMysqlQuery };
