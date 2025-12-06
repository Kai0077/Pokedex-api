import { join } from "path";
import { fileURLToPath } from "url";
import { runSqlFile } from "./sql-runner.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function seedData() {
  const file = join(__dirname, "db-scripts", "pokedex_dummy.sql");
  await runSqlFile(file);
}
