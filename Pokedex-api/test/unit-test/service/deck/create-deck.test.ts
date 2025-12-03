import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";

import * as deckRepo from "../../../../src/repositories/deck-repository.js";
import * as characterRepo from "../../../../src/repositories/character-repository.js";
import * as pokemonRepo from "../../../../src/repositories/pokemon-repository.js";

vi.mock("../../../../src/repositories/deck-repository.js");
vi.mock("../../../../src/repositories/character-repository.js");
vi.mock("../../../../src/repositories/pokemon-repository.js");

beforeEach(() => {
  vi.clearAllMocks();
});

// CHARACTER IDS
const VALID_CHARACTER_ID = 1;
const INVALID_CHARACTER_ID = 999;

// DECK NAMES
const VALID_DECK_NAME = "AlphaTeam";
const TOO_SHORT_DECK_NAME = "Abc";
const EMPTY_DECK_NAME = "   ";
const NON_STRING_DECK_NAME: any = 123;
const TOO_LONG_DECK_NAME = "A".repeat(60);

// POKEMON SETS
const VALID_POKEMON_AMOUNT = [1, 2, 3, 4, 5];
const TOO_FEW_POKEMON_AMOUNT = [1, 2, 3, 4];
const TOO_MANY_POKEMON_AMOUNT = [1, 2, 3, 4, 5, 6];
const NOT_ARRAY_POKEMON_AMOUNT: any = "not-an-array";
const DUPLICATES_OF_POKEMON = [1, 2, 2, 3, 5];
const POKEMON_WITH_NAN = [1, "abc" as any, 3, 4, 5];
const POKEMON_NOT_OWN = [1, 2, 3, 4, 999];

// Ownership sets
const OWNED_POKEMON_ROWS = VALID_POKEMON_AMOUNT.map((id) => ({
  pokemonId: id,
}));
const PARTIALLY_OWNED_ROWS = [{ pokemonId: 1 }, { pokemonId: 2 }];

// ERROR MESSAGE REGEX PATTERNS
const ERROR_CHARACTER_NOT_FOUND = /character not found/i;
const ERROR_NOT_OWNED = /does not own all selected pokemon/i;
const ERROR_NAME = /deck name/i;
const ERROR_DECK_SIZE = /exactly 5 pokemon/i;
const ERROR_POKEMON_NAN = /numbers/i;
const ERROR_DUPLICATE = /duplicate pokemon/i;
const TOTAL_STATS = 600;
const EXPECTED_RANK = "A";

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.createDeck", () => {
  // ------------------------------------
  // VALIDATION: CHARACTER DOES NOT EXIST
  // ------------------------------------
  it("throws if character does not exist", async () => {
    vi.spyOn(characterRepo, "characterExistsById").mockResolvedValue(false);

    await expect(
      DeckService.createDeck(INVALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_CHARACTER_NOT_FOUND);

    expect(
      characterRepo.getOwnedPokemonForCharacterSubset,
    ).not.toHaveBeenCalled();
  });

  // -------------------------------
  // VALIDATION: DECK NAME TOO SHORT
  // -------------------------------
  it("throws if name is shorter than 5 characters", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: TOO_SHORT_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(characterRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // ------------------------------------
  // VALIDATION: DECK NAME TOO LONG
  // ------------------------------------
  it("throws if name is longer than 45 characters", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: TOO_LONG_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(characterRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // -------------------------------------
  // VALIDATION: DECK NAME ONLY WHITESPACE
  // -------------------------------------
  it("throws if name is only whitespace", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: EMPTY_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(characterRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // ----------------------------------
  // VALIDATION: DECK NAME NOT A STRING
  // ----------------------------------
  it("throws if name is not a string", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: NON_STRING_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(characterRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // ----------------------------------
  // VALIDATION: POKEMON IDS NOT AN ARRAY
  // ----------------------------------
  it("throws if pokemonIds is not an array", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: NOT_ARRAY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);

    expect(characterRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // ----------------------------------
  // VALIDATION: POKEMON AMOUNT TOO FEW
  // ----------------------------------
  it("throws if there are not exactly 5 Pokémon - too few", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_FEW_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);
  });

  // -----------------------------------
  // VALIDATION: POKEMON AMOUNT TOO MANY
  // -----------------------------------
  it("throws if there are not exactly 5 Pokémon - too many", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_MANY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);
  });

  // ------------------------------
  // VALIDATION: POKEMON IDS IS NAN
  // ------------------------------
  it("throws if any Pokémon id is NaN", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: POKEMON_WITH_NAN,
      }),
    ).rejects.toThrow(ERROR_POKEMON_NAN);
  });

  // ------------------------------
  // VALIDATION: POKEMON DUPLICATES
  // ------------------------------
  it("throws if deck contains duplicate Pokémon", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: DUPLICATES_OF_POKEMON,
      }),
    ).rejects.toThrow(ERROR_DUPLICATE);
  });

  // ------------------------------------------------
  // VALIDATION: CHARACTER DOES NOT OWN ALL 5 POKEMON
  // ------------------------------------------------
  it("throws if character does not own all selected Pokémon", async () => {
    vi.spyOn(characterRepo, "characterExistsById").mockResolvedValue(true);
    vi.spyOn(
      characterRepo,
      "getOwnedPokemonForCharacterSubset",
    ).mockResolvedValue(PARTIALLY_OWNED_ROWS as any);

    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: POKEMON_NOT_OWN,
      }),
    ).rejects.toThrow(ERROR_NOT_OWNED);

    expect(deckRepo.insertDeck).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------------
  // SUCCESSFUL CREATE DECK
  // ------------------------------------------------------------
  it("creates a deck when character exists, owns all 5 Pokémon, and DTO is valid", async () => {
    vi.spyOn(characterRepo, "characterExistsById").mockResolvedValue(true);
    vi.spyOn(
      characterRepo,
      "getOwnedPokemonForCharacterSubset",
    ).mockResolvedValue(OWNED_POKEMON_ROWS as any);

    vi.spyOn(deckRepo, "insertDeck").mockResolvedValue(123 as any);
    vi.spyOn(deckRepo, "insertDeckPokemon").mockResolvedValue(undefined);
    vi.spyOn(pokemonRepo, "getDeckAttackDefenceSum").mockResolvedValue(
      TOTAL_STATS,
    );

    const result = await DeckService.createDeck(VALID_CHARACTER_ID, {
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    expect(result).toEqual({
      deckId: 123,
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
      total: TOTAL_STATS,
      rank: EXPECTED_RANK,
    });

    expect(deckRepo.insertDeck).toHaveBeenCalledWith(
      VALID_DECK_NAME,
      VALID_CHARACTER_ID,
    );
    expect(deckRepo.insertDeckPokemon).toHaveBeenCalledTimes(5);
    expect(pokemonRepo.getDeckAttackDefenceSum).toHaveBeenCalledWith(123);
  });
});
