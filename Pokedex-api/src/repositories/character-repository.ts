import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getDB } from "../db/connection.js";

export async function characterExistsById(
  characterId: number,
): Promise<boolean> {
  const db = getDB();
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
  const db = getDB();
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

export async function insertCharacter(
  firstName: string,
  lastName: string,
  age: number,
  gender: string,
): Promise<number> {
  const db = getDB();
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO `character` (firstname, lastname, age, gender) VALUES (?, ?, ?, ?)",
    [firstName, lastName, age, gender],
  );

  return result.insertId;
}

export async function findPokemonByName(name: string) {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM pokemon WHERE name = ? LIMIT 1",
    [name],
  );
  return rows[0] ?? null;
}

export async function addPokemonToCharacter(
  characterId: number,
  pokemonId: number,
) {
  const db = getDB();
  await db.execute(
    "INSERT INTO character_pokemon (characterId, pokemonId) VALUES (?, ?)",
    [characterId, pokemonId],
  );
}

export async function getCharacterPokemonRows(characterId: number) {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT p.*
     FROM pokemon p
     JOIN character_pokemon cp ON cp.pokemonId = p.id
     WHERE cp.characterId = ?`,
    [characterId],
  );

  return rows;
}

export async function getAllCharactersRows() {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    `
      SELECT
        c.id,
        c.firstname,
        c.lastname,
        c.age,
        c.gender,
        COUNT(d.id) AS deckCount
      FROM \`character\` c
      LEFT JOIN deck d ON d.characterId = c.id
      GROUP BY c.id
    `,
  );

  return rows;
}

export async function characterExists(characterId: number): Promise<boolean> {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM \`character\` WHERE id = ?",
    [characterId],
  );

  return rows.length > 0;
}

export async function getDecksForCharacterRows(characterId: number) {
  const db = getDB();
  const [deckRows] = await db.execute<RowDataPacket[]>(
    "SELECT id AS deckId, name FROM deck WHERE characterId = ?",
    [characterId],
  );

  for (const deck of deckRows) {
    const db = getDB();
    const [pokemonRows] = await db.execute<RowDataPacket[]>(
      `
      SELECT p.id, p.name, p.types, p.hp, p.attack, p.defence,
             p.spriteUrl, p.spriteOfficialUrl
      FROM pokemon_deck pd
      JOIN pokemon p ON p.id = pd.pokemonId
      WHERE pd.deckId = ?
      `,
      [deck.deckId],
    );

    (deck as any).pokemon = pokemonRows;
  }

  return deckRows;
}

export async function pokemonExistsById(id: number): Promise<boolean> {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM pokemon WHERE id = ? LIMIT 1",
    [id],
  );
  return rows.length > 0;
}

export async function insertPokemonRow(row: {
  id: number;
  name: string;
  types: string;
  hp: number;
  attack: number;
  defence: number;
  spriteUrl: string;
  spriteOfficialUrl: string;
}) {
  const db = getDB();
  await db.execute(
    `INSERT INTO pokemon (id, name, types, hp, attack, defence, spriteUrl, spriteOfficialUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.name,
      row.types,
      row.hp,
      row.attack,
      row.defence,
      row.spriteUrl,
      row.spriteOfficialUrl,
    ],
  );
}

export async function getLastGatherAt(
  characterId: number,
): Promise<Date | null> {
  const db = getDB();
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT lastGatherAt FROM `character` WHERE id = ?",
    [characterId],
  );

  if (rows.length === 0) {
    throw new Error("Character not found.");
  }

  const value = rows[0].lastGatherAt as Date | null;
  return value;
}

export async function updateLastGatherAt(
  characterId: number,
  when: Date,
): Promise<void> {
  const db = getDB();
  await db.execute("UPDATE `character` SET lastGatherAt = ? WHERE id = ?", [
    when,
    characterId,
  ]);
}
