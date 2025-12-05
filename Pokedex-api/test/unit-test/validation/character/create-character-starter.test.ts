import { describe, it, expect } from "vitest";
import { validateCreateCharacterDTO } from "../../../../src/validation/character-validation.js";

const baseValid = {
  firstName: "Mikkel",
  lastName: "Hansen",
  age: 20,
  gender: "male",
  starter: "Charmander",
};

function dto(overrides: Partial<typeof baseValid>): any {
  return { ...baseValid, ...overrides };
}

function runCase(
  overrides: Partial<typeof baseValid>,
  valid: boolean,
  msgPattern?: RegExp,
) {
  const act = () => validateCreateCharacterDTO(dto(overrides) as any);

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
const ERROR_STARTER_EMPTY = /starter pokemon/i;
const ERROR_STARTER_INVALID = /invalid starter/i;

describe("CreateCharacterDTO – Starter Pokemon partition (A39–A46)", () => {
  it.each([
    {
      label: "A39: Starter Pokemon empty",
      overrides: { starter: "" },
      valid: false,
      msg: ERROR_STARTER_EMPTY,
    },

    {
      label: 'A40: Starter = "Bulbasaur"',
      overrides: { starter: "Bulbasaur" },
      valid: true,
    },
    {
      label: 'A41: Starter = "Charmander"',
      overrides: { starter: "Charmander" },
      valid: true,
    },
    {
      label: 'A42: Starter = "Squirtle"',
      overrides: { starter: "Squirtle" },
      valid: true,
    },

    {
      label: 'A43: Starter = "Pikachu" (not allowed)',
      overrides: { starter: "Pikachu" },
      valid: false,
      msg: ERROR_STARTER_INVALID,
    },
    {
      label: 'A44: Starter = "Mewtwo" (not allowed)',
      overrides: { starter: "Mewtwo" },
      valid: false,
      msg: ERROR_STARTER_INVALID,
    },

    {
      label: "A45: Multiple starters ['Charmander', 'Pikachu']",
      overrides: { starter: ["Charmander", "Pikachu"] as any },
      valid: false,
      msg: ERROR_STARTER_INVALID,
    },

    {
      label: 'A46: Starter random string "jsjajskjfkdna"',
      overrides: { starter: "jsjajskjfkdna" },
      valid: false,
      msg: ERROR_STARTER_INVALID,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
