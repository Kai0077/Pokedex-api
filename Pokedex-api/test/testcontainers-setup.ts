import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { beforeAll, afterAll } from "vitest";

let container: StartedMySqlContainer;

beforeAll(async () => {
  container = await new MySqlContainer("mysql:8.0")
    .withDatabase("pokedex_test")
    .withUsername("pokedex_user_test")
    .withRootPassword("3a!k$YD@$")
    .withReuse()
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getRootPassword();
  process.env.DB_NAME = container.getDatabase();
});

afterAll(async () => {
  await container.stop();
});
