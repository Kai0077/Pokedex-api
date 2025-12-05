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
const ERROR_LASTNAME = /last name/i;

describe("CreateCharacterDTO – Lastname partition (A12–A22)", () => {
  it.each([
    {
      label: 'A11: Lastname = ""',
      overrides: { lastName: "" },
      valid: false,
      msg: ERROR_LASTNAME,
    },
    {
      label: "A12: Lastname < 3 characters ('H')",
      overrides: { lastName: "H" },
      valid: false,
      msg: ERROR_LASTNAME,
    },
    {
      label: "A13: Lastname = 2 characters ('Ha')",
      overrides: { lastName: "Ha" },
      valid: false,
      msg: ERROR_LASTNAME,
    },

    {
      label: "A14: Lastname = 3 characters ('Han')",
      overrides: { lastName: "Han" },
      valid: true,
    },
    {
      label: "A15: Lastname = 4 characters ('Hans')",
      overrides: { lastName: "Hans" },
      valid: true,
    },
    {
      label: "A16: Lastname 25 characters",
      overrides: { lastName: "H".repeat(25) },
      valid: true,
    },
    {
      label: "A17: Lastname 44 characters",
      overrides: { lastName: "H".repeat(44) },
      valid: true,
    },
    {
      label: "A18: Lastname 45 characters",
      overrides: { lastName: "H".repeat(45) },
      valid: true,
    },

    {
      label: "A19: Lastname 46 characters (too long)",
      overrides: { lastName: "H".repeat(46) },
      valid: false,
      msg: ERROR_LASTNAME,
    },
    {
      label: "A20: Lastname > 45 characters",
      overrides: { lastName: "H".repeat(60) },
      valid: false,
      msg: ERROR_LASTNAME,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
