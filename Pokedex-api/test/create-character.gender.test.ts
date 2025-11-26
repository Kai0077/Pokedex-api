import { describe, it, expect } from "vitest";
import { validateCreateCharacterDTO } from "../src/validation/character-validation.js";

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
    if (msgPattern) {
      expect(act).toThrow(msgPattern);
    } else {
      expect(act).toThrow();
    }
  }
}

describe("CreateCharacterDTO – Gender partition (A34–A38)", () => {
  it("A34: Gender empty -> invalid", () => {
    runCase({ gender: "" }, false, /gender/i);
  });

  it('A35: Gender value not in allowed list ("Unknown") -> invalid', () => {
    runCase({ gender: "Unknown" }, false, /invalid gender/i);
  });

  it('A36: Gender = "Male" -> valid (case-insensitive)', () => {
    runCase({ gender: "Male" }, true);
  });

  it('A37: Gender = "Female" -> valid', () => {
    runCase({ gender: "Female" }, true);
  });

  it('A38: Gender = "Other" -> valid', () => {
    runCase({ gender: "Other" }, true);
  });
});