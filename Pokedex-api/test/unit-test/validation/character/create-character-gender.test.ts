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
const ERROR_GENDER_EMPTY = /gender/i;
const ERROR_GENDER_INVALID = /invalid gender/i;

describe("CreateCharacterDTO – Gender partition (A34–A38)", () => {
  it.each([
    {
      label: "A33: Gender empty",
      overrides: { gender: "" },
      valid: false,
      msg: ERROR_GENDER_EMPTY,
    },
    {
      label: 'A34: Gender not in allowed list ("Unknown")',
      overrides: { gender: "Unknown" },
      valid: false,
      msg: ERROR_GENDER_INVALID,
    },

    {
      label: 'A35: Gender = "Male" (case-insensitive)',
      overrides: { gender: "Male" },
      valid: true,
    },
    {
      label: 'A36: Gender = "Female"',
      overrides: { gender: "Female" },
      valid: true,
    },
    {
      label: 'A37: Gender = "Other"',
      overrides: { gender: "Other" },
      valid: true,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
