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
      firstName: "Hans",
      lastName: "Hansen",
      age: 20,
      gender: "male",
      starter: "Bulbasaur",
    } as const;

    const result = await CharacterService.createCharacter(dto as any);

    expect(result.character.firstName).toBe("Hans");
    expect(result.character.lastName).toBe("Hansen");
    expect(result.character.age).toBe(20);
    expect(result.starter.name).toBe("bulbasaur");
  });

  // ---------------------------------------------------------
  // STARTER SEEDING WHEN MISSING
  // ---------------------------------------------------------
  it("auto-seeds starter pokemon if missing and still creates character", async () => {
    const dto = {
      firstName: "Peter",
      lastName: "Petersen",
      age: 30,
      gender: "male",
      starter: "Charmander",
    } as const;

    const result = await CharacterService.createCharacter(dto as any);

    expect(result.character.firstName).toBe("Peter");
    expect(result.starter.name).toBe("charmander");
  });

  // ---------------------------------------------------------
  // VALIDATION: AGE TOO LOW
  // ---------------------------------------------------------
  it("throws if age is below allowed range", async () => {
    const dto = {
      firstName: "Baby",
      lastName: "Kid",
      age: 5,
      gender: "other",
      starter: "Squirtle",
    } as const;

    await expect(CharacterService.createCharacter(dto)).rejects.toThrow();
  });
});
