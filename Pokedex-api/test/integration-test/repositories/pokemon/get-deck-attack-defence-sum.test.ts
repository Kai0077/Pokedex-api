import { describe, it, expect, beforeEach } from "vitest";
import {
  insertOrUpdatePokemonBatch,
  getDeckAttackDefenceSum,
} from "../../../../src/repositories/pokemon-repository.js";
import {
  insertDeck,
  insertDeckPokemon,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("getDeckAttackDefenceSum", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns null for an empty deck", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Team Fire", characterId);

    const result = await getDeckAttackDefenceSum(deckId);
    expect(result).toBeNull();
  });

  it("returns the correct sum of attack + defence using pokemon stats", async () => {
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
      {
        id: 4,
        name: "charmander",
        types: "fire",
        hp: 39,
        attack: 52,
        defence: 43,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      },
    ]);

    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Starter Deck", characterId);

    await insertDeckPokemon(deckId, 1);
    await insertDeckPokemon(deckId, 4);

    const result = await getDeckAttackDefenceSum(deckId);

    expect(result).toBe(193);
  });
});
