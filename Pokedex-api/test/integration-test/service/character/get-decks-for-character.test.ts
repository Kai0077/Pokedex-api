import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

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
  // RETURNS DECKS SUCCESSFULLY FOR CHARACTER
  // ---------------------------------------------------------
  it("returns deck list for a valid character", async () => {
    const created = await CharacterService.createCharacter({
      firstName: "Hans",
      lastName: "Hansen",
      age: 33,
      gender: "male",
      starter: "Bulbasaur",
    });

    const decks = await CharacterService.getDecksForCharacter(
      created.character.id,
    );

    expect(Array.isArray(decks)).toBe(true);
  });
});
