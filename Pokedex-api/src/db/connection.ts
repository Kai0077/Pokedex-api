import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
if (process.env.NODE_ENV !== "test") {
  db.getConnection()
    .then((conn) => {
      console.log("#### Database connected successfully");
      conn.release();
    })
    .catch((err) => {
      console.error("##### Database connection failed:", err);
    });
}
