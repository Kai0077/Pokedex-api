import { describe, it, expect } from "vitest";
import { validateCreateDeckDTO } from "../../../src/validation/deck-validation.js";

type TestDto = {
  name: any;
  pokemonIds: any;
};

const baseValid: TestDto = {
  name: "AlphaName",
  pokemonIds: [1, 2, 3, 4, 5],
};

function dto(overrides: Partial<TestDto>): TestDto {
  return { ...baseValid, ...overrides };
}

function runCase(
  overrides: Partial<TestDto>,
  valid: boolean,
  msgPattern?: RegExp,
) {
  const act = () => validateCreateDeckDTO(dto(overrides) as any);

  if (valid) {
    expect(act).not.toThrow();
  } else {
    if (msgPattern) {
      expect(act).toThrow(msgPattern);
    } else {
      expect(act).toThrow();
    }
  }
}

describe("CreateDeckDTO – Amount of pokemons (B12–B17)", () => {
  it("B11: amount = 0 -> invalid", () => {
    runCase({ pokemonIds: [] }, false, /exactly 5 pokemon/i);
  });

  it("B13: amount = 1 -> invalid", () => {
    runCase({ pokemonIds: [1] }, false, /exactly 5 pokemon/i);
  });

  it("B14: amount = 2 -> invalid", () => {
    runCase({ pokemonIds: [1, 2] }, false, /exactly 5 pokemon/i);
  });

  it("B15: amount = 4 -> invalid", () => {
    runCase({ pokemonIds: [1, 2, 3, 4] }, false, /exactly 5 pokemon/i);
  });

  it("B16: amount = 5 -> valid boundary", () => {
    runCase({ pokemonIds: [1, 2, 3, 4, 5] }, true);
  });

  it("B17: amount = 6 -> invalid", () => {
    runCase({ pokemonIds: [1, 2, 3, 4, 5, 6] }, false, /exactly 5 pokemon/i);
  });
});
