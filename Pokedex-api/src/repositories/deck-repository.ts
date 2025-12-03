import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { getDB } from "../db/connection.js";

export async function insertDeck(
  name: string,
  characterId: number,
): Promise<number> {
  const db = getDB();
  const [deckResult] = await db.execute<ResultSetHeader>(
    "INSERT INTO deck (name, characterId) VALUES (?, ?)",
    [name, characterId],
  );

  return deckResult.insertId;
}

export async function insertDeckPokemon(deckId: number, pokemonId: number) {
  const db = getDB();
  await db.execute(
    "INSERT INTO pokemon_deck (deckId, pokemonId) VALUES (?, ?)",
    [deckId, pokemonId],
  );
}

export async function findDeckById(deckId: number) {
  const db = getDB();
  const [deckRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, characterId, name FROM deck WHERE id = ?",
    [deckId],
  );

  return deckRows[0] ?? null;
}

export async function updateDeckName(deckId: number, name: string) {
  const db = getDB();
  await db.execute("UPDATE deck SET name = ? WHERE id = ?", [name, deckId]);
}

export async function clearDeckPokemon(deckId: number) {
  const db = getDB();
  await db.execute("DELETE FROM pokemon_deck WHERE deckId = ?", [deckId]);
}

export async function deleteDeckById(deckId: number) {
  const db = getDB();
  await db.execute("DELETE FROM deck WHERE id = ?", [deckId]);
}

export async function deckExistsById(deckId: number): Promise<boolean> {
  const db = getDB();
  const [deckRows] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM deck WHERE id = ?",
    [deckId],
  );
  return deckRows.length > 0;
}
