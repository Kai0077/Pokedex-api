import { MySqlContainer } from "@testcontainers/mysql";
import fs from "fs";

export default async function () {
  const initSql = fs.readFileSync("test/init.sql", "utf8");

  const container = await new MySqlContainer("mysql:8.0")
    .withTmpFs({ "/var/lib/mysql": "rw" })
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
    .withCommand(["--default-authentication-plugin=mysql_native_password"])
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USER = "pokedex_user_test";
  process.env.DB_PASSWORD = "3a!k$YD@$";
  process.env.DB_NAME = "pokedex_test";

  console.log("### Testcontainers env applied:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
  });

  return async () => container.stop();
}
