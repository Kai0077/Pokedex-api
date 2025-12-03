import { MySqlContainer } from "@testcontainers/mysql";
import fs from "fs";

export default async function () {
  const initSql = fs.readFileSync("test/init.sql", "utf8");

  const container = await new MySqlContainer("mysql:8.0")
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: "3a!k$YD@$",
      MYSQL_DATABASE: "pokedex_test",
    })
    .withCopyContentToContainer([
      {
        content: initSql,
        target: "/docker-entrypoint-initdb.d/init.sql",
      },
    ])
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USER = "pokedex_user_test";
  process.env.DB_PASSWORD = "3a!k$YD@$";
  process.env.DB_NAME = "pokedex_test";

  return async () => container.stop();
}
