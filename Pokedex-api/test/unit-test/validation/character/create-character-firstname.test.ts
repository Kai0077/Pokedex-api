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
const ERROR_FIRSTNAME = /first name/i;

describe("CreateCharacterDTO – Firstname partition (A1–A11)", () => {
  it.each([
    {
      label: 'A1: Firstname = ""',
      overrides: { firstName: "" },
      valid: false,
      msg: ERROR_FIRSTNAME,
    },
    {
      label: "A2: Firstname < 3 characters ('K')",
      overrides: { firstName: "K" },
      valid: false,
      msg: ERROR_FIRSTNAME,
    },
    {
      label: "A3: Firstname = 2 characters ('Ka')",
      overrides: { firstName: "Ka" },
      valid: false,
      msg: ERROR_FIRSTNAME,
    },

    {
      label: "A4: Firstname = 3 characters ('Kai')",
      overrides: { firstName: "Kai" },
      valid: true,
    },
    {
      label: "A5: Firstname = 4 characters ('Mikk')",
      overrides: { firstName: "Mikk" },
      valid: true,
    },
    {
      label: "A6: Firstname 25 characters",
      overrides: { firstName: "M".repeat(25) },
      valid: true,
    },
    {
      label: "A7: Firstname 44 characters",
      overrides: { firstName: "M".repeat(44) },
      valid: true,
    },
    {
      label: "A8: Firstname 45 characters",
      overrides: { firstName: "M".repeat(45) },
      valid: true,
    },

    {
      label: "A9: Firstname 46 characters",
      overrides: { firstName: "M".repeat(46) },
      valid: false,
      msg: ERROR_FIRSTNAME,
    },
    {
      label: "A10: Firstname > 45 characters",
      overrides: { firstName: "M".repeat(60) },
      valid: false,
      msg: ERROR_FIRSTNAME,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
