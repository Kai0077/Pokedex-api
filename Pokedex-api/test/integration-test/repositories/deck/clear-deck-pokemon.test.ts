import { describe, it, expect, beforeEach } from "vitest";
import type { RowDataPacket } from "mysql2";
import {
  insertDeck,
  insertDeckPokemon,
  clearDeckPokemon,
} from "../../../../src/repositories/deck-repository.js";
import {
  insertCharacter,
  insertPokemonRow,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("clearDeckPokemon", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("removes all pokemon from a deck", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Team Water", characterId);

    await insertPokemonRow({
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
    });

    await insertPokemonRow({
      id: 2,
      name: "ivysaur",
      types: "grass",
      hp: 60,
      attack: 62,
      defence: 63,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    });

    await insertPokemonRow({
      id: 3,
      name: "venusaur",
      types: "grass",
      hp: 80,
      attack: 82,
      defence: 83,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    });

    await insertDeckPokemon(deckId, 1);
    await insertDeckPokemon(deckId, 2);
    await insertDeckPokemon(deckId, 3);

    await clearDeckPokemon(deckId);

    const { getDB } = await import("../../../../src/db/connection.js");
    const db = getDB();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM pokemon_deck WHERE deckId = ?",
      [deckId],
    );

    expect(rows.length).toBe(0);
  });
});
