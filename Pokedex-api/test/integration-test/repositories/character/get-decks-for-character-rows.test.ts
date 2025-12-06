import { describe, it, expect, beforeEach } from "vitest";
import {
  insertCharacter,
  insertPokemonRow,
  getDecksForCharacterRows,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";
import { getDB } from "../../../../src/db/connection.js";

// ============================
// TESTS
// ============================

describe("getDecksForCharacterRows", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns all decks for a character including their pokemon", async () => {
    const db = getDB();
    const characterId = await insertCharacter("Kai", "Larsen", 21, "male");

    const [deckInsert] = await db.execute(
      "INSERT INTO deck (characterId, name) VALUES (?, ?)",
      [characterId, "AlphaTeam"],
    );
    const deckId = (deckInsert as any).insertId;

    await insertPokemonRow({
      id: 44,
      name: "gloom",
      types: "grass",
      hp: 60,
      attack: 65,
      defence: 70,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/44.png",
    });

    await db.execute(
      "INSERT INTO pokemon_deck (pokemonId, deckId) VALUES (?, ?)",
      [44, deckId],
    );

    const result = await getDecksForCharacterRows(characterId);

    expect(result.length).toBe(1);
    expect(result[0].pokemon.length).toBe(1);
    expect(result[0].pokemon[0].name).toBe("gloom");
  });
});
