// db.ts — Week 3
// MySQL connection pool + a small typed query helper.
// Reads credentials from environment variables (see .env).

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

// Close the pool (used by standalone scripts so the process can exit).
export async function closePool(): Promise<void> {
  await pool.end();
}
