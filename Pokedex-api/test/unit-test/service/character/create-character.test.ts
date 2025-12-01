import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";
import * as repo from "../../../../src/repositories/character-repository.js";
import type { CreateCharacterDTO } from "../../../../src/types/character.js";

vi.mock("../../../../src/repositories/character-repository.js");
(global as any).fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

// TEST AGE
const VALID_AGE = 15;
const TOO_YOUNG_AGE = 5;

// POKEMON DATA
const VALID_STARTER_NAME = "Bulbasaur";
const VALID_STARTER_DB_NAME = "bulbasaur";
const POKEMON_ID = 1;
const POKEMON_NAME = "bulbasaur";
const POKEMON_TYPE = "grass";
const POKEMON_HP = 45;
const POKEMON_ATTACK = 49;
const POKEMON_DEFENCE = 49;

const POKEMON_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";

const POKEMON_SPRITE_OFFICIAL_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png";

const VALID_CHARACTER: CreateCharacterDTO = {
  firstName: "Ash",
  lastName: "Ketchum",
  age: VALID_AGE,
  gender: "male",
  starter: VALID_STARTER_NAME,
};

const MOCK_STARTER_POKEMON_ROW = {
  id: 1,
  name: VALID_STARTER_DB_NAME,
  types: "grass",
  hp: 45,
  attack: 49,
  defence: 49,
  spriteUrl: "http://img.com/1.png",
  spriteOfficialUrl: "http://img.com/official.png",
};

// ERROR MESSAGE REGEX PATTERNS
const ERROR_AGE_RANGE = /between 13 and 110/i;
const ERROR_STARTER_NOT_FOUND = /starter pokemon not found in database/i;

// ====================================================================
// TEST
// ====================================================================

describe("CharacterService.createCharacter", () => {
  // -------------------------------
  // VALIDATION: AGE TOO YOUNG
  // -------------------------------
  it("throws validation error if age is below 13", async () => {
    const invalidDto: CreateCharacterDTO = {
      ...VALID_CHARACTER,
      age: TOO_YOUNG_AGE,
    };

    await expect(CharacterService.createCharacter(invalidDto)).rejects.toThrow(
      ERROR_AGE_RANGE,
    );

    expect(repo.insertCharacter).not.toHaveBeenCalled();
    expect(repo.findPokemonByName).not.toHaveBeenCalled();
  });

  // -------------------------------
  // SUCCESS: SEED MISSING STARTERS
  // -------------------------------
  it("fetches and seeds starter pokemon if missing, then creates character", async () => {
    vi.spyOn(repo, "pokemonExistsById").mockResolvedValue(false);

    const mockApiResponse = {
      id: POKEMON_ID,
      name: POKEMON_NAME,
      types: [{ type: { name: POKEMON_TYPE } }],
      stats: [
        { base_stat: POKEMON_HP },
        { base_stat: POKEMON_ATTACK },
        { base_stat: POKEMON_DEFENCE },
      ],
      sprites: {
        front_default: POKEMON_SPRITE_URL,
        other: {
          "official-artwork": {
            front_default: POKEMON_SPRITE_OFFICIAL_URL,
          },
        },
      },
    };

    (global.fetch as any).mockResolvedValue({
      json: async () => mockApiResponse,
    });

    vi.spyOn(repo, "insertPokemonRow").mockResolvedValue(undefined);
    vi.spyOn(repo, "insertCharacter").mockResolvedValue(100);
    vi.spyOn(repo, "findPokemonByName").mockResolvedValue(
      MOCK_STARTER_POKEMON_ROW as any,
    );
    vi.spyOn(repo, "addPokemonToCharacter").mockResolvedValue(undefined);

    await CharacterService.createCharacter(VALID_CHARACTER);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(repo.insertPokemonRow).toHaveBeenCalledTimes(3);
    expect(repo.insertCharacter).toHaveBeenCalled();
    expect(repo.addPokemonToCharacter).toHaveBeenCalledWith(100, 1);
  });

  // -------------------------------
  // STARTER NOT FOUND IN DB
  // -------------------------------
  it("throws if starter pokemon is not found in DB after creation", async () => {
    vi.spyOn(repo, "pokemonExistsById").mockResolvedValue(true);
    vi.spyOn(repo, "insertCharacter").mockResolvedValue(100);
    vi.spyOn(repo, "findPokemonByName").mockResolvedValue(null as any);

    await expect(
      CharacterService.createCharacter(VALID_CHARACTER),
    ).rejects.toThrow(ERROR_STARTER_NOT_FOUND);

    expect(repo.insertCharacter).toHaveBeenCalled();
    expect(repo.addPokemonToCharacter).not.toHaveBeenCalled();
  });

  // -------------------------------
  // SUCCESS: STARTER ALREADY IN DB
  // -------------------------------
  it("creates character and links existing starter pokemon", async () => {
    vi.spyOn(repo, "pokemonExistsById").mockResolvedValue(true);
    vi.spyOn(repo, "insertCharacter").mockResolvedValue(100);
    vi.spyOn(repo, "findPokemonByName").mockResolvedValue(
      MOCK_STARTER_POKEMON_ROW as any,
    );
    vi.spyOn(repo, "addPokemonToCharacter").mockResolvedValue(undefined);

    const result = await CharacterService.createCharacter(VALID_CHARACTER);

    expect(result.character).toMatchObject({
      id: 100,
      firstName: "Ash",
      lastName: "Ketchum",
      age: VALID_AGE,
      gender: "male",
    });
    expect(result.starter).toEqual(MOCK_STARTER_POKEMON_ROW);

    expect(repo.pokemonExistsById).toHaveBeenCalledTimes(3);
    expect(repo.insertCharacter).toHaveBeenCalledWith(
      "Ash",
      "Ketchum",
      VALID_AGE,
      "male",
    );
    expect(repo.findPokemonByName).toHaveBeenCalledWith(VALID_STARTER_DB_NAME);
    expect(repo.addPokemonToCharacter).toHaveBeenCalledWith(100, 1);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
