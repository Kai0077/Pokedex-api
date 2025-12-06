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
const ERROR_EMPTY = /deck name cannot be empty/i;
const ERROR_TOO_SHORT = /too short/i;
const ERROR_TOO_LONG = /too long/i;

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("CreateDeckDTO – Deck name partition (B1–B11)", () => {
  it.each([
    {
      label: 'B1: Deckname = "" -> invalid (empty)',
      overrides: { name: "" },
      valid: false,
      msg: ERROR_EMPTY,
    },
    {
      label: 'B2: Deckname < 5 characters ("A") -> invalid',
      overrides: { name: "A" },
      valid: false,
      msg: ERROR_TOO_SHORT,
    },
    {
      label: 'B3: Deckname = 4 characters ("Alph") -> invalid',
      overrides: { name: "Alph" },
      valid: false,
      msg: ERROR_TOO_SHORT,
    },

    {
      label: 'B4: Deckname = 5 characters ("Alpha") -> valid boundary',
      overrides: { name: "Alpha" },
      valid: true,
    },
    {
      label: 'B5: Deckname = 6 characters ("AlphaA") -> valid',
      overrides: { name: "AlphaA" },
      valid: true,
    },
    {
      label: "B6: Deckname 25 characters -> valid",
      overrides: { name: "A".repeat(25) },
      valid: true,
    },
    {
      label: "B7: Deckname 44 characters -> valid",
      overrides: { name: "A".repeat(44) },
      valid: true,
    },
    {
      label: "B8: Deckname 45 characters -> valid upper boundary",
      overrides: { name: "A".repeat(45) },
      valid: true,
    },

    {
      label: "B9: Deckname 46 characters -> invalid (too long)",
      overrides: { name: "A".repeat(46) },
      valid: false,
      msg: ERROR_TOO_LONG,
    },
    {
      label: "B10: Deckname > 45 characters -> invalid",
      overrides: { name: "A".repeat(60) },
      valid: false,
      msg: ERROR_TOO_LONG,
    },
  ])("$label", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
