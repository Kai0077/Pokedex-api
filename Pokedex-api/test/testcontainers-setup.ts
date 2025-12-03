import { MySqlContainer } from "@testcontainers/mysql";

export default async function () {
  const container = await new MySqlContainer("mysql:8.0")
    .withDatabase("pokedex_test")
    .withUsername("pokedex_user_test")
    .withRootPassword("3a!k$YD@$")
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getRootPassword();
  process.env.DB_NAME = container.getDatabase();

  return async () => {
    await container.stop();
  };
}
