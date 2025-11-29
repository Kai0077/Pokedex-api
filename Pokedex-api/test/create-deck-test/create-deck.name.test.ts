import { describe, it, expect } from "vitest";
import { validateCreateDeckDTO } from "../../src/validation/deck-validation.js";

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

describe("CreateDeckDTO – Deck name partition (B1–B11)", () => {
  it('B1: Deckname = "" -> invalid (empty)', () => {
    runCase({ name: "" }, false, /deck name cannot be empty/i);
  });

  it('B2: Deckname < 5 characters ("A") -> invalid', () => {
    runCase({ name: "A" }, false, /too short/i);
  });

  it('B3: Deckname = 4 characters ("Alph") -> invalid', () => {
    runCase({ name: "Alph" }, false, /too short/i);
  });

  it('B4: Deckname = 5 characters ("Alpha") -> valid boundary', () => {
    runCase({ name: "Alpha" }, true);
  });

  it('B5: Deckname = 6 characters ("AlphaA") -> valid', () => {
    runCase({ name: "AlphaA" }, true);
  });

  it("B6: Deckname 25 characters -> valid", () => {
    runCase({ name: "A".repeat(25) }, true);
  });

  it("B7: Deckname 44 characters -> valid", () => {
    runCase({ name: "A".repeat(44) }, true);
  });

  it("B8: Deckname 45 characters -> valid upper boundary", () => {
    runCase({ name: "A".repeat(45) }, true);
  });

  it("B9: Deckname 46 characters -> invalid (too long)", () => {
    runCase({ name: "A".repeat(46) }, false, /too long/i);
  });

  it("B10: Deckname > 45 characters -> invalid", () => {
    runCase({ name: "A".repeat(60) }, false, /too long/i);
  });
});
