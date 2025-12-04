import { readFileSync } from "fs";
import { getDB } from "./connection.js";

export async function runSqlFile(path: string) {
  const db = getDB();
  const sql = readFileSync(path, "utf8");
  await db.query(sql);
}
