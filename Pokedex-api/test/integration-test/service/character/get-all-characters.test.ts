import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("CharacterService.getAllCharacters", () => {
  // ---------------------------------------------------------
  // RETURNS A LIST OF EXISTING CHARACTERS
  // ---------------------------------------------------------
  it("returns multiple characters after creating new ones", async () => {
    await CharacterService.createCharacter({
      firstName: "Jonas",
      lastName: "Mortensen",
      age: 30,
      gender: "male",
      starter: "Bulbasaur",
    });

    await CharacterService.createCharacter({
      firstName: "Laura",
      lastName: "Hvidt",
      age: 26,
      gender: "female",
      starter: "Charmander",
    });

    const rows = await CharacterService.getAllCharacters();

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });
});
