import { describe, it, expect } from "vitest";
import { validateCreateCharacterDTO } from "../../../src/validation/character-validation.js";

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

describe("CreateCharacterDTO – Starter Pokemon partition (A39–A46)", () => {
  it("A39: Starter Pokemon = empty -> invalid", () => {
    runCase({ starter: "" }, false, /starter pokemon/i);
  });

  it('A40: Starter = "Bulbasaur" -> valid', () => {
    runCase({ starter: "Bulbasaur" }, true);
  });

  it('A41: Starter = "Charmander" -> valid', () => {
    runCase({ starter: "Charmander" }, true);
  });

  it('A42: Starter = "Squirtle" -> valid', () => {
    runCase({ starter: "Squirtle" }, true);
  });

  it('A43: Starter = "Pikachu" (not in list) -> invalid', () => {
    runCase({ starter: "Pikachu" }, false, /invalid starter/i);
  });

  it('A44: Starter = "Mewtwo" (non-starter) -> invalid', () => {
    runCase({ starter: "Mewtwo" }, false, /invalid starter/i);
  });

  it('A45: User tries to select more than one starter ["Charmander", "Pikachu"] -> invalid', () => {
    runCase(
      { starter: ["Charmander", "Pikachu"] as any },
      false,
      /invalid starter/i,
    );
  });

  it('A46: Starter value random string "jsjajskjfkdna" -> invalid', () => {
    runCase({ starter: "jsjajskjfkdna" }, false, /invalid starter/i);
  });
});
