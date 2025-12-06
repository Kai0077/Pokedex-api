import { describe, it, expect, beforeEach } from "vitest";
import type { RowDataPacket } from "mysql2";
import {
  linkPokemonToCharacter,
  insertOrUpdatePokemonBatch,
} from "../../../../src/repositories/pokemon-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";
import { getDB } from "../../../../src/db/connection.js";

// ============================
// TESTS
// ============================

describe("linkPokemonToCharacter", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("links pokemon to a character", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");

    await insertOrUpdatePokemonBatch([
      {
        id: 1,
        name: "bulbasaur",
        types: "grass",
        hp: 45,
        attack: 49,
        defence: 49,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
    ]);

    await linkPokemonToCharacter(characterId, 1);

    const db = getDB();
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM character_pokemon WHERE characterId = ?",
      [characterId],
    );

    expect(rows.length).toBe(1);
    expect(rows[0].characterId).toBe(characterId);
    expect(rows[0].pokemonId).toBe(1);
  });
});
