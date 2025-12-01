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
    if (msgPattern) {
      expect(act).toThrow(msgPattern);
    } else {
      expect(act).toThrow();
    }
  }
}

describe("CreateCharacterDTO – Age partition (A23–A33)", () => {
  it("A23: Age empty (null) -> invalid", () => {
    runCase({ age: 0 }, false, /age/i);
  });

  it("A24: Age < 13 (1) -> invalid", () => {
    runCase({ age: 1 }, false, /age/i);
  });

  it("A25: Age = 12 -> invalid", () => {
    runCase({ age: 12 }, false, /between 13 and 110/i);
  });

  it("A26: Age = 13 -> valid lower boundary", () => {
    runCase({ age: 13 }, true);
  });

  it("A27: Age = 14 -> valid", () => {
    runCase({ age: 14 }, true);
  });

  it("A28: Age = 55 -> valid mid-range", () => {
    runCase({ age: 55 }, true);
  });

  it("A29: Age = 75 (13–110) -> valid", () => {
    runCase({ age: 75 }, true);
  });

  it("A30: Age = 109 -> valid (just below upper bound)", () => {
    runCase({ age: 109 }, true);
  });

  it("A31: Age = 110 -> valid upper boundary", () => {
    runCase({ age: 110 }, true);
  });

  it("A32: Age = 111 -> invalid", () => {
    runCase({ age: 111 }, false, /between 13 and 110/i);
  });

  it("A33: Age > 110 (150) -> invalid", () => {
    runCase({ age: 150 }, false, /between 13 and 110/i);
  });
});
