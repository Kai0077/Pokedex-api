import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import "dotenv/config";

let pool: Pool | null = null;

export function getDB(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    if (process.env.NODE_ENV !== "test") {
      pool
        .getConnection()
        .then((conn) => {
          console.log("#### Database connected successfully");
          conn.release();
        })
        .catch((err) => {
          console.error("##### Database connection failed:", err);
        });
    }
  }

  return pool;
}
