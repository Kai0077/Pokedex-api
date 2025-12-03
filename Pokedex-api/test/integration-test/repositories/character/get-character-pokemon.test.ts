import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("CharacterService.getCharacterPokemon", () => {
  // ---------------------------------------------------------
  // RETURNS THE STARTER POKEMON FOR A NEW CHARACTER
  // ---------------------------------------------------------
  it("returns the starter pokemon for a newly created character", async () => {
    const created = await CharacterService.createCharacter({
      firstName: "Hans",
      lastName: "Hansen",
      age: 25,
      gender: "male",
      starter: "Bulbasaur",
    });

    const rows = await CharacterService.getCharacterPokemon(
      created.character.id,
    );

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(1);

    expect(rows[0].id).toBe(created.starter.id);
  });
});
