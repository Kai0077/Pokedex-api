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

describe("CreateCharacterDTO – Firstname partition (A1–A11)", () => {
  it('A1: Firstname = "" -> invalid', () => {
    runCase({ firstName: "" }, false, /first name/i);
  });

  it("A2: Firstname < 3 characters ('K') -> invalid", () => {
    runCase({ firstName: "K" }, false, /first name/i);
  });

  it("A3: Firstname = 2 characters ('Ka') -> invalid", () => {
    runCase({ firstName: "Ka" }, false, /first name/i);
  });

  it("A4: Firstname = 3 characters ('Kai') -> valid boundary", () => {
    runCase({ firstName: "Kai" }, true);
  });

  it("A5: Firstname = 4 characters ('Mikk') -> valid", () => {
    runCase({ firstName: "Mikk" }, true);
  });

  it("A6: Firstname 3–45 characters ('Mikkel') -> valid", () => {
    runCase({ firstName: "Mikkel" }, true);
  });

  it("A7: Firstname 25 characters -> valid", () => {
    runCase({ firstName: "M".repeat(25) }, true);
  });

  it("A8: Firstname 44 characters -> valid", () => {
    runCase({ firstName: "M".repeat(44) }, true);
  });

  it("A9: Firstname 45 characters -> valid upper boundary", () => {
    runCase({ firstName: "M".repeat(45) }, true);
  });

  it("A10: Firstname 46 characters -> invalid (too long)", () => {
    runCase({ firstName: "M".repeat(46) }, false, /first name/i);
  });

  it("A11: Firstname > 45 characters -> invalid", () => {
    runCase({ firstName: "M".repeat(60) }, false, /first name/i);
  });
});