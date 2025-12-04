import { getDB } from "./connection.js";
import { seedData } from "./seed-data.js";

export async function resetData() {
  const db = getDB();

  await db.query("SET FOREIGN_KEY_CHECKS = 0");
  await db.query("TRUNCATE TABLE pokemon");
  await db.query("TRUNCATE TABLE `character`");
  await db.query("TRUNCATE TABLE deck");
  await db.query("TRUNCATE TABLE character_pokemon");
  await db.query("TRUNCATE TABLE pokemon_deck");
  await db.query("SET FOREIGN_KEY_CHECKS = 1");

  await seedData();
}
