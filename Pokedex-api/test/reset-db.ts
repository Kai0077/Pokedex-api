import { getDB } from "../src/db/connection.js";

export async function resetDB() {
  const db = getDB();

  await db.query("DELETE FROM character_pokemon");
  await db.query("DELETE FROM pokemon_deck");
  await db.query("DELETE FROM deck");

  await db.query("DELETE FROM pokemon");
  await db.query("DELETE FROM `character`");
}
