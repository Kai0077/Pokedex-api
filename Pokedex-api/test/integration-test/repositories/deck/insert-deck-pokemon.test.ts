import { describe, it, expect, beforeEach } from "vitest";
import type { RowDataPacket } from "mysql2";
import {
  insertDeck,
  insertDeckPokemon,
} from "../../../../src/repositories/deck-repository.js";
import {
  insertCharacter,
  insertPokemonRow,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";
import { getDB } from "../../../../src/db/connection.js";

// ============================
// TESTS
// ============================

describe("insertDeckPokemon", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("adds pokemon to a deck", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Grass Squad", characterId);

    await insertPokemonRow({
      id: 10,
      name: "catepie",
      types: "bug",
      hp: 45,
      attack: 30,
      defence: 35,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png",
    });

    await insertPokemonRow({
      id: 25,
      name: "pikachu",
      types: "electric",
      hp: 35,
      attack: 55,
      defence: 40,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    });

    await insertDeckPokemon(deckId, 10);
    await insertDeckPokemon(deckId, 25);

    const db = getDB();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT deckId, pokemonId FROM pokemon_deck WHERE deckId = ? ORDER BY pokemonId",
      [deckId],
    );

    expect(rows.length).toBe(2);
    expect(rows[0].pokemonId).toBe(10);
    expect(rows[1].pokemonId).toBe(25);
  });
});
