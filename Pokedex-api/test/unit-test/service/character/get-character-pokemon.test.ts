import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";
import * as repo from "../../../../src/repositories/character-repository.js";

vi.mock("../../../src/repositories/character-repository.js");

// ============================
// CONSTANTS
// =============================

const CHARACTER_ID = 10;

const POKEMON_ID = 1;
const POKEMON_NAME = "bulbasaur";
const POKEMON_TYPE = "grass";
const POKEMON_HP = 45;
const POKEMON_ATTACK = 49;
const POKEMON_DEFENCE = 49;

const POKEMON_SPRITE_URL = "https://example.com/bulbasaur.png";

const POKEMON_SPRITE_OFFICIAL_URL =
  "https://example.com/bulbasaur-official.png";

const MOCK_POKEMON_ROWS = [
  {
    id: POKEMON_ID,
    name: POKEMON_NAME,
    types: POKEMON_TYPE,
    hp: POKEMON_HP,
    attack: POKEMON_ATTACK,
    defence: POKEMON_DEFENCE,
    spriteUrl: POKEMON_SPRITE_URL,
    spriteOfficialUrl: POKEMON_SPRITE_OFFICIAL_URL,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================
// TESTS
// ============================

describe("CharacterService.getCharacterPokemon", () => {
  it("returns all pokemon owned by a character", async () => {
    vi.spyOn(repo, "characterExists").mockResolvedValue(true);

    vi.spyOn(repo, "getCharacterPokemonRows").mockResolvedValue(
      MOCK_POKEMON_ROWS as any,
    );

    const result = await CharacterService.getCharacterPokemon(CHARACTER_ID);

    expect(repo.characterExists).toHaveBeenCalledWith(CHARACTER_ID);
    expect(repo.getCharacterPokemonRows).toHaveBeenCalledWith(CHARACTER_ID);
    expect(result).toEqual(MOCK_POKEMON_ROWS);
  });
});
