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

// DECK & CHARACTER IDS
const VALID_DECK_ID = 1;
const INVALID_DECK_ID = 999;
const DECK_OWNER_ID = 10;

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
const DUPLICATES_OF_POKEMON = [1, 2, 2, 3, 4];
const POKEMON_WITH_NAN = [1, "abc" as any, 3, 4, 5];
const CHARACTER_NOT_OWNED_POKEMON = [10, 20, 30, 40, 999];

// OWNERSHIP ROWS
const OWNED_ROWS = VALID_POKEMON_AMOUNT.map((id) => ({ pokemonId: id }));

// ERROR MESSAGE REGEX
const ERROR_DECK_NOT_FOUND = /deck not found/i;
const ERROR_NOT_OWNED = /does not own all selected pokemon/i;
const ERROR_NAME = /deck name/i;
const ERROR_DECK_SIZE = /exactly 5 pokemon/i;
const ERROR_DUPLICATE = /duplicate pokemon/i;
const TOTAL_STATS = 600;
const EXPECTED_RANK = "A";

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.updateDeck", () => {
  // -------------------------------
  // DECK DOES NOT EXIST
  // -------------------------------
  it("throws if deck does not exist", async () => {
    vi.spyOn(deckRepo, "findDeckById").mockResolvedValue(null as any);

    await expect(
      DeckService.updateDeck(INVALID_DECK_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_NOT_FOUND);
  });

  // -------------------------------
  // VALIDATION: DECK NAME TOO SHORT
  // -------------------------------
  it("throws if name is shorter than 5 characters", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: TOO_SHORT_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);
  });

  // -------------------------------
  // VALIDATION: DECK NAME TOO LONG
  // -------------------------------
  it("throws if name is longer than 45 characters", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: TOO_LONG_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);
  });

  // -------------------------------------
  // VALIDATION: DECK NAME ONLY WHITESPACE
  // -------------------------------------
  it("throws if name is only whitespace", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: EMPTY_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);
  });

  // ----------------------------------
  // VALIDATION: DECK NAME NOT A STRING
  // ----------------------------------
  it("throws if name is not a string", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: NON_STRING_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);
  });

  // ------------------------------------
  // VALIDATION: POKEMON IDS NOT AN ARRAY
  // ------------------------------------
  it("throws if pokemonIds is not an array", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: NOT_ARRAY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);
  });

  // ----------------------------------
  // VALIDATION: POKEMON AMOUNT TOO FEW
  // ----------------------------------
  it("throws if there are not exactly 5 Pokémon - too few", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
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
      DeckService.updateDeck(VALID_DECK_ID, {
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
      DeckService.updateDeck(VALID_DECK_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: POKEMON_WITH_NAN,
      }),
    ).rejects.toThrow(/numbers/i);
  });

  // ------------------------------
  // VALIDATION: POKEMON DUPLICATES
  // ------------------------------
  it("throws if deck contains duplicate Pokémon", async () => {
    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: DUPLICATES_OF_POKEMON,
      }),
    ).rejects.toThrow(ERROR_DUPLICATE);
  });

  // ---------------------------------------------
  // OWNERSHIP: CHARACTER DOES NOT OWN POKEMON
  // ---------------------------------------------
  it("throws if character does not own all selected Pokémon", async () => {
    vi.spyOn(deckRepo, "findDeckById").mockResolvedValue({
      id: VALID_DECK_ID,
      characterId: DECK_OWNER_ID,
    } as any);

    vi.spyOn(
      characterRepo,
      "getOwnedPokemonForCharacterSubset",
    ).mockResolvedValue([]);

    await expect(
      DeckService.updateDeck(VALID_DECK_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: CHARACTER_NOT_OWNED_POKEMON,
      }),
    ).rejects.toThrow(ERROR_NOT_OWNED);
  });

  // ------------------------------------------------------------
  // SUCCESSFUL UPDATE
  // ------------------------------------------------------------
  it("updates deck successfully when everything is valid", async () => {
    vi.spyOn(deckRepo, "findDeckById").mockResolvedValue({
      id: VALID_DECK_ID,
      characterId: DECK_OWNER_ID,
    } as any);

    vi.spyOn(
      characterRepo,
      "getOwnedPokemonForCharacterSubset",
    ).mockResolvedValue(OWNED_ROWS as any);

    vi.spyOn(deckRepo, "updateDeckName").mockResolvedValue(undefined);
    vi.spyOn(deckRepo, "clearDeckPokemon").mockResolvedValue(undefined);
    vi.spyOn(deckRepo, "insertDeckPokemon").mockResolvedValue(undefined);
    vi.spyOn(pokemonRepo, "getDeckAttackDefenceSum").mockResolvedValue(
      TOTAL_STATS,
    );

    const result = await DeckService.updateDeck(VALID_DECK_ID, {
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    expect(result).toEqual({
      deckId: VALID_DECK_ID,
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
      total: TOTAL_STATS,
      rank: EXPECTED_RANK,
    });

    expect(deckRepo.updateDeckName).toHaveBeenCalledWith(
      VALID_DECK_ID,
      VALID_DECK_NAME,
    );
    expect(deckRepo.clearDeckPokemon).toHaveBeenCalledWith(VALID_DECK_ID);
    expect(deckRepo.insertDeckPokemon).toHaveBeenCalledTimes(5);
    expect(pokemonRepo.getDeckAttackDefenceSum).toHaveBeenCalledWith(
      VALID_DECK_ID,
    );
  });
});
