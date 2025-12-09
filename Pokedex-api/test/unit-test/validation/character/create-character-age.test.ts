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
const ERROR_AGE_GENERIC = /age/i;
const ERROR_AGE_RANGE = /between 13 and 110/i;

describe("CreateCharacterDTO – Age partition (A23–A33)", () => {
  it.each([
    {
      label: "A21: Age empty (null)",
      overrides: { age: null } as any,
      valid: false,
      msg: ERROR_AGE_GENERIC,
    },
    {
      label: "A22: Age empty (0)",
      overrides: { age: 0 },
      valid: false,
      msg: ERROR_AGE_GENERIC,
    },
    {
      label: "A23: Age < 13 (1)",
      overrides: { age: 1 },
      valid: false,
      msg: ERROR_AGE_GENERIC,
    },
    {
      label: "A24: Age = 12",
      overrides: { age: 12 },
      valid: false,
      msg: ERROR_AGE_RANGE,
    },

    {
      label: "A25: Age = 13 (lower boundary)",
      overrides: { age: 13 },
      valid: true,
    },
    { label: "A26: Age = 14", overrides: { age: 14 }, valid: true },
    { label: "A27: Age = 55 (mid-range)", overrides: { age: 55 }, valid: true },
    { label: "A28: Age = 75 (13–110)", overrides: { age: 75 }, valid: true },
    { label: "A29: Age = 109", overrides: { age: 109 }, valid: true },
    {
      label: "A30: Age = 110 (upper boundary)",
      overrides: { age: 110 },
      valid: true,
    },

    {
      label: "A31: Age = 111",
      overrides: { age: 111 },
      valid: false,
      msg: ERROR_AGE_RANGE,
    },
    {
      label: "A32: Age > 110 (150)",
      overrides: { age: 150 },
      valid: false,
      msg: ERROR_AGE_RANGE,
    },
  ])("$label -> valid: $valid", ({ overrides, valid, msg }) => {
    runCase(overrides, valid, msg);
  });
});
