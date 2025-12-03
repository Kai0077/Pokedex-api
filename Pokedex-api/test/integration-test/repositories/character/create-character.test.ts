import { describe, it, expect } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("CharacterService.createCharacter", () => {
  // ---------------------------------------------------------
  // CREATES CHARACTER SUCCESSFULLY
  // ---------------------------------------------------------
  it("creates a character successfully with a valid starter", async () => {
    const dto = {
      firstName: "Oliver",
      lastName: "Holm",
      age: 22,
      gender: "male",
      starter: "Bulbasaur",
    };

    const result = await CharacterService.createCharacter(dto as any);

    expect(result.character.firstName).toBe("Oliver");
    expect(result.character.lastName).toBe("Holm");
    expect(result.character.age).toBe(22);
    expect(result.starter.name).toBe("bulbasaur");
  });

  // ---------------------------------------------------------
  // AUTO-SEEDS STARTER WHEN MISSING
  // ---------------------------------------------------------
  it("auto-seeds starter pokemon if missing and still creates character", async () => {
    const dto = {
      firstName: "Emil",
      lastName: "Kristensen",
      age: 28,
      gender: "male",
      starter: "Charmander",
    };

    const result = await CharacterService.createCharacter(dto as any);

    expect(result.character.firstName).toBe("Emil");
    expect(result.starter.name).toBe("charmander");
  });

  // ---------------------------------------------------------
  // VALIDATION: AGE TOO LOW
  // ---------------------------------------------------------
  it("throws when age is below the allowed range", async () => {
    const dto = {
      firstName: "Sofie",
      lastName: "Jensen",
      age: 7,
      gender: "female",
      starter: "Squirtle",
    };

    await expect(
      CharacterService.createCharacter(dto as any),
    ).rejects.toThrow();
  });
});
