import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

describe("CharacterService.getAllCharacters", () => {
  // ---------------------------------------------------------
  // RETURNS LIST OF CHARACTERS INCLUDING NEW ONES
  // ---------------------------------------------------------
  it("returns multiple characters after creating them", async () => {
    await CharacterService.createCharacter({
      firstName: "Hans",
      lastName: "Hansen",
      age: 22,
      gender: "male",
      starter: "Bulbasaur",
    });

    await CharacterService.createCharacter({
      firstName: "Peter",
      lastName: "Petersen",
      age: 30,
      gender: "male",
      starter: "Charmander",
    });

    const rows = await CharacterService.getAllCharacters();

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });
});
