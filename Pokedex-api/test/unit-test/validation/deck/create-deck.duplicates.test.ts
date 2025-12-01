import { describe, it, expect } from "vitest";
import { validateCreateDeckDTO } from "../../../../src/validation/deck-validation.js";

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

describe("CreateDeckDTO – Duplicate pokemons (B18–B19)", () => {
  it("B17: has duplicates [1, 2, 3, 2, 5] -> invalid", () => {
    runCase({ pokemonIds: [1, 2, 3, 2, 5] }, false, /duplicate pokemon/i);
  });

  it("B18: no duplicates [1, 2, 3, 4, 5] -> valid", () => {
    runCase({ pokemonIds: [1, 2, 3, 4, 5] }, true);
  });
});
