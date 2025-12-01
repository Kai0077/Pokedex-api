import { db } from "../db/connection.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function characterExistsById(
  characterId: number,
): Promise<boolean> {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM `character` WHERE id = ?",
    [characterId],
  );
  return rows.length > 0;
}

export async function getOwnedPokemonForCharacterSubset(
  characterId: number,
  pokemonIds: number[],
) {
  const pokemonIdList = pokemonIds.join(",");

  const [ownedRows] = await db.execute<RowDataPacket[]>(
    `SELECT pokemonId
     FROM character_pokemon
     WHERE characterId = ?
       AND FIND_IN_SET(pokemonId, ?)`,
    [characterId, pokemonIdList],
  );

  return ownedRows;
}

export async function insertDeck(
  name: string,
  characterId: number,
): Promise<number> {
  const [deckResult] = await db.execute<ResultSetHeader>(
    "INSERT INTO deck (name, characterId) VALUES (?, ?)",
    [name, characterId],
  );

  return deckResult.insertId;
}

export async function insertDeckPokemon(deckId: number, pokemonId: number) {
  await db.execute(
    "INSERT INTO pokemon_deck (deckId, pokemonId) VALUES (?, ?)",
    [deckId, pokemonId],
  );
}

export async function findDeckById(deckId: number) {
  const [deckRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, characterId, name FROM deck WHERE id = ?",
    [deckId],
  );

  return deckRows[0] ?? null;
}

export async function updateDeckName(deckId: number, name: string) {
  await db.execute("UPDATE deck SET name = ? WHERE id = ?", [name, deckId]);
}

export async function clearDeckPokemon(deckId: number) {
  await db.execute("DELETE FROM pokemon_deck WHERE deckId = ?", [deckId]);
}

export async function deleteDeckById(deckId: number) {
  await db.execute("DELETE FROM deck WHERE id = ?", [deckId]);
}

export async function deckExistsById(deckId: number): Promise<boolean> {
  const [deckRows] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM deck WHERE id = ?",
    [deckId],
  );
  return deckRows.length > 0;
}

export async function getDeckAttackDefenceSum(
  deckId: number,
): Promise<number | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `
    SELECT SUM(p.attack + p.defence) AS total
    FROM pokemon_deck pd
    JOIN pokemon p ON p.id = pd.pokemonId
    WHERE pd.deckId = ?
    `,
    [deckId],
  );

  if (rows.length === 0 || rows[0].total === null) {
    return null;
  }

  return Number(rows[0].total);
}

export async function getPokemonStatsByIds(
  pokemonIds: number[],
): Promise<{ id: number; attack: number; defence: number }[]> {
  if (pokemonIds.length === 0) return [];

  const placeholders = pokemonIds.map(() => "?").join(",");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, attack, defence FROM pokemon WHERE id IN (${placeholders})`,
    pokemonIds,
  );

  return rows as any;
}
