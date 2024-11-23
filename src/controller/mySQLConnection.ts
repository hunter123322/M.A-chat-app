import mysql from "mysql2/promise";

async function mysqlConnect() {
  const sqlConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "karen2002",
    database: "my_new_database",
  });
  return sqlConnect;
}

export default mysqlConnect;
