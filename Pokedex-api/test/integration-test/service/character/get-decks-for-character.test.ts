import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("CharacterService.getDecksForCharacter", () => {
  // ---------------------------------------------------------
  // CHARACTER DOES NOT EXIST
  // ---------------------------------------------------------
  it("throws an error when character does not exist", async () => {
    await expect(CharacterService.getDecksForCharacter(999999)).rejects.toThrow(
      /character not found/i,
    );
  });

  // ---------------------------------------------------------
  // RETURNS DECKS
  // ---------------------------------------------------------
  it("returns decks for a valid character", async () => {
    const created = await CharacterService.createCharacter({
      firstName: "Sarah",
      lastName: "Olsen",
      age: 32,
      gender: "female",
      starter: "Squirtle",
    });

    const decks = await CharacterService.getDecksForCharacter(
      created.character.id,
    );

    expect(Array.isArray(decks)).toBe(true);
  });
});
