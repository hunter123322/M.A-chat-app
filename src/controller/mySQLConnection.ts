import mysql from "mysql2/promise";

async function mysqlConnection() {
  const sqlConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "karen2002",
    database: "my_new_database",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
  return sqlConnect;
}

export default mysqlConnection;
