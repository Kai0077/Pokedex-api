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
    if (msgPattern) expect(act).toThrow(msgPattern);
    else expect(act).toThrow();
  }
}

// ---------------------------------------------------------
// REGEX MESSAGE PATTERNS
// ---------------------------------------------------------
const ERROR_AMOUNT = /exactly 5 pokemon/i;

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("CreateDeckDTO – Amount of pokemons (B12–B17)", () => {
  it.each([
    {
      label: "B11: amount = 0",
      overrides: { pokemonIds: [] },
      valid: false,
      msg: ERROR_AMOUNT,
    },
    {
      label: "B13: amount = 1",
      overrides: { pokemonIds: [1] },
      valid: false,
      msg: ERROR_AMOUNT,
    },
    {
      label: "B14: amount = 2",
      overrides: { pokemonIds: [1, 2] },
      valid: false,
      msg: ERROR_AMOUNT,
    },
    {
      label: "B15: amount = 4",
      overrides: { pokemonIds: [1, 2, 3, 4] },
      valid: false,
      msg: ERROR_AMOUNT,
    },

    {
      label: "B16: amount = 5 (boundary)",
      overrides: { pokemonIds: [1, 2, 3, 4, 5] },
      valid: true,
    },

    {
      label: "B17: amount = 6",
      overrides: { pokemonIds: [1, 2, 3, 4, 5, 6] },
      valid: false,
      msg: ERROR_AMOUNT,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
