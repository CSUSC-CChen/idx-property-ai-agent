// db.ts — Week 3
// MySQL connection pool + a small typed query helper.
// Reads credentials from environment variables (see .env).
//
/* WEEK 9 NOTE:
  dotenv is loaded HERE rather than relying on each runner to
  import it first. The pool is created at module scope, so if any importer
  resolved this file before dotenv ran, the pool would be built with
  undefined credentials and every query would fail with a confusing
  connection error. Loading it here makes import order irrelevant.
*/
import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Run a parameterized query and get typed rows back.
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/*
  Close the pool. WEEK 9: this is now called ONLY by whoever owns the process
  (a CLI wrapper, or orchestrate.ts) — never from inside an agent function.
  Agents may run concurrently via Promise.all, and an agent closing the shared
  pool would break whichever sibling agent is still mid-query.
*/
export async function closePool(): Promise<void> {
  await pool.end();
}