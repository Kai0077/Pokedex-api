import { getDB } from "./connection.js";
import { resetData } from "./reset-data.js";
import type { RowDataPacket } from "mysql2";

const MIN_COUNTS = {
  pokemon: 15,
  character: 3,
  deck: 9,
  characterPokemon: 5,
};

export async function verifySeedData() {
  const db = getDB();

  const [pokemonRows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS pokemonCount FROM pokemon",
  );

  const [characterRows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS characterCount FROM `character`",
  );

  const [deckRows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS deckCount FROM deck",
  );

  const [characterPokemonRows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS characterPokemonCount FROM character_pokemon",
  );

  const pokemonCount = Number(pokemonRows[0].pokemonCount);
  const characterCount = Number(characterRows[0].characterCount);
  const deckCount = Number(deckRows[0].deckCount);
  const characterPokemonCount = Number(
    characterPokemonRows[0].characterPokemonCount,
  );

  const missing =
    pokemonCount < MIN_COUNTS.pokemon ||
    characterCount < MIN_COUNTS.character ||
    deckCount < MIN_COUNTS.deck ||
    characterPokemonCount < MIN_COUNTS.characterPokemon;

  if (missing) {
    await resetData();
  }
}
