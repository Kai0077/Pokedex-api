// src/repositories/pokemon-repository.ts
import { db } from "../db/connection.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getPokemonRowById(id: number) {
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
  await db.execute<ResultSetHeader>(
    "INSERT IGNORE INTO character_pokemon (characterId, pokemonId) VALUES (?, ?)",
    [characterId, pokemonId],
  );
}
