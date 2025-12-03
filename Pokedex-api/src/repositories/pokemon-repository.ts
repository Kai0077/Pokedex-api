import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { getDB } from "../db/connection.js";

export async function getPokemonRowById(id: number) {
  const db = getDB();
  const query = "SELECT * FROM pokemon WHERE id = ?";
  const [rows] = await db.query<RowDataPacket[]>(query, [id]);
  return rows[0] ?? null;
}

export async function insertOrUpdatePokemonBatch(
  rows: {
    id: number;
    name: string;
    types: string;
    hp: number;
    attack: number;
    defence: number;
    spriteUrl: string;
    spriteOfficialUrl: string;
  }[],
): Promise<void> {
  const db = getDB();
  if (rows.length === 0) return;

  const query = `
    INSERT INTO pokemon 
      (id, name, types, hp, attack, defence, spriteUrl, spriteOfficialUrl) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE
      name = VALUES(name), 
      types = VALUES(types), 
      hp = VALUES(hp), 
      attack = VALUES(attack), 
      defence = VALUES(defence), 
      spriteUrl = VALUES(spriteUrl), 
      spriteOfficialUrl = VALUES(spriteOfficialUrl)
  `;

  const values = rows.map((p) => [
    p.id,
    p.name,
    p.types,
    p.hp,
    p.attack,
    p.defence,
    p.spriteUrl,
    p.spriteOfficialUrl,
  ]);

  await db.query(query, [values]);
}

export async function linkPokemonToCharacter(
  characterId: number,
  pokemonId: number,
) {
  const db = getDB();
  await db.execute<ResultSetHeader>(
    "INSERT IGNORE INTO character_pokemon (characterId, pokemonId) VALUES (?, ?)",
    [characterId, pokemonId],
  );
}

export async function getDeckAttackDefenceSum(
  deckId: number,
): Promise<number | null> {
  const db = getDB();
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
  const db = getDB();
  if (pokemonIds.length === 0) return [];

  const placeholders = pokemonIds.map(() => "?").join(",");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, attack, defence FROM pokemon WHERE id IN (${placeholders})`,
    pokemonIds,
  );

  return rows as any;
}
