import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";
import * as repo from "../../../../src/repositories/character-repository.js";

vi.mock("../../../src/repositories/character-repository.js");

// ============================
// CONSTANTS
// ============================

const CHAR_1_ID = 1;
const CHAR_1_FIRSTNAME = "Ash";
const CHAR_1_LASTNAME = "Ketchum";
const CHAR_1_AGE = 15;
const CHAR_1_GENDER = "male";
const CHAR_1_DECK_COUNT = 2;

const CHAR_2_ID = 2;
const CHAR_2_FIRSTNAME = "Misty";
const CHAR_2_LASTNAME = "Waterflower";
const CHAR_2_AGE = 16;
const CHAR_2_GENDER = "female";
const CHAR_2_DECK_COUNT = 1;

const MOCK_CHARACTER_ROWS = [
  {
    id: CHAR_1_ID,
    firstname: CHAR_1_FIRSTNAME,
    lastname: CHAR_1_LASTNAME,
    age: CHAR_1_AGE,
    gender: CHAR_1_GENDER,
    deckCount: CHAR_1_DECK_COUNT,
  },
  {
    id: CHAR_2_ID,
    firstname: CHAR_2_FIRSTNAME,
    lastname: CHAR_2_LASTNAME,
    age: CHAR_2_AGE,
    gender: CHAR_2_GENDER,
    deckCount: CHAR_2_DECK_COUNT,
  },
];

const ERROR_DB = /db error/i;

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================
// TESTS
// ============================

describe("CharacterService.getAllCharacters", () => {
  it("returns all characters from repository", async () => {
    vi.spyOn(repo, "getAllCharactersRows").mockResolvedValue(
      MOCK_CHARACTER_ROWS as any,
    );

    const result = await CharacterService.getAllCharacters();

    expect(repo.getAllCharactersRows).toHaveBeenCalledTimes(1);
    expect(result).toEqual(MOCK_CHARACTER_ROWS);
  });

  it("propagates repository error", async () => {
    vi.spyOn(repo, "getAllCharactersRows").mockRejectedValue(
      new Error("DB error"),
    );

    await expect(CharacterService.getAllCharacters()).rejects.toThrow(ERROR_DB);
  });
});
