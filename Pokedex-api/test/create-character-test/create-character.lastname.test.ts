import { describe, it, expect } from "vitest";
import { validateCreateCharacterDTO } from "../../src/validation/character-validation.js";

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

describe("CreateCharacterDTO – Lastname partition (A12–A22)", () => {
  it('A12: Lastname = "" -> invalid', () => {
    runCase({ lastName: "" }, false, /last name/i);
  });

  it("A13: Lastname < 3 characters ('H') -> invalid", () => {
    runCase({ lastName: "H" }, false, /last name/i);
  });

  it("A14: Lastname = 2 characters ('Ha') -> invalid", () => {
    runCase({ lastName: "Ha" }, false, /last name/i);
  });

  it("A15: Lastname = 3 characters ('Han') -> valid", () => {
    runCase({ lastName: "Han" }, true);
  });

  it("A16: Lastname = 4 characters ('Hans') -> valid", () => {
    runCase({ lastName: "Hans" }, true);
  });

  it("A17: Lastname 3–45 characters ('HansenHansenHansen') -> valid", () => {
    runCase({ lastName: "HansenHansenHansen" }, true);
  });

  it("A18: Lastname 25 characters -> valid", () => {
    runCase({ lastName: "H".repeat(25) }, true);
  });

  it("A19: Lastname 44 characters -> valid", () => {
    runCase({ lastName: "H".repeat(44) }, true);
  });

  it("A20: Lastname 45 characters -> valid", () => {
    runCase({ lastName: "H".repeat(45) }, true);
  });

  it("A21: Lastname 46 characters -> invalid (too long)", () => {
    runCase({ lastName: "H".repeat(46) }, false, /last name/i);
  });

  it("A22: Lastname > 45 characters -> invalid", () => {
    runCase({ lastName: "H".repeat(60) }, false, /last name/i);
  });
});