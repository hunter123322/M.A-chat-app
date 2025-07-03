// src/config/mySQLConnectionPool.ts
import mysql from "mysql2/promise";
import { Pool } from "mysql2/promise";

const mySQLConnectionPool: Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "karen2002",
  database: "my_new_database",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,             // optional
  idleTimeout: 60000,      // optional
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const SQLConn = mySQLConnectionPool.getConnection()

export default mySQLConnectionPool;

export {SQLConn}