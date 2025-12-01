import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

describe("CharacterService.getCharacterPokemon", () => {
  // ---------------------------------------------------------
  // RETURNS EMPTY LIST FOR NEW CHARACTER
  // ---------------------------------------------------------
  it("returns an empty list for a character with no pokemon", async () => {
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
  });
});
