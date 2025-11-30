import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeckService } from "../../src/services/deck-service.js";

import * as repo from "../../src/repositories/deck-repository.js";
vi.mock("../../src/repositories/deck-repository.js");

beforeEach(() => {
  vi.clearAllMocks();
});

// DECK NAMES
const VALID_DECK_NAME = "AlphaTeam";
const TOO_SHORT_DECK_NAME = "All";
const TOO_LONG_DECK_NAME = "A".repeat(60);

// POKEMON SETS
const VALID_POKEMON_AMOUNT = [1, 2, 3, 4, 5];
const TOO_FEW_POKEMON_AMOUNT = [1, 2, 3];
const TOO_MANY_POKEMON_AMOUNT = [1, 2, 3, 4, 5, 6];
const DUPLICATES_OF_POKEMON = [1, 2, 3, 3, 5];

const CHARACTER_OWNED_POKEMON = [
  4, 605, 496, 660, 12, 956, 859, 678, 832, 778, 252,
];

const CHARACTER_NOT_OWNED_POKEMON = [100, 60, 96, 20, 37];

// ERROR MESSAGE REGEX PATTERNS
const ERROR_DECK_NOT_FOUND = /deck not found/i;
const ERROR_NAME = /name/i;
const ERROR_DECK_SIZE = /exactly 5/i;
const ERROR_DUPLICATE = /duplicate/i;
const ERROR_NOT_OWNED = /does not own/i;

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.updateDeck", () => {
  // -------------------------------
  // DECK DOES NOT EXIST
  // -------------------------------
  it("throws if deck does not exist", async () => {
    vi.spyOn(repo, "findDeckById").mockResolvedValue(null as any);

    await expect(
      DeckService.updateDeck(999, {
        name: VALID_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_NOT_FOUND);
  });

  // -------------------------------
  // VALIDATION: DECK NAME
  // -------------------------------
  it("throws if name is shorter than 5 characters", async () => {
    await expect(
      DeckService.updateDeck(1, {
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
      DeckService.updateDeck(1, {
        name: TOO_LONG_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);
  });

  // -------------------------------
  // VALIDATION: POKEMON AMOUNT
  // -------------------------------
  it("throws if the deck does not contain exactly 5 pokemon - too few", async () => {
    await expect(
      DeckService.updateDeck(1, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_FEW_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);
  });

  it("throws if the deck does not contain exactly 5 pokemon - too many", async () => {
    await expect(
      DeckService.updateDeck(1, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_MANY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);
  });

  // -------------------------------
  // VALIDATION: DUPLICATES
  // -------------------------------
  it("throws if deck contains duplicates Pokémon", async () => {
    await expect(
      DeckService.updateDeck(1, {
        name: VALID_DECK_NAME,
        pokemonIds: DUPLICATES_OF_POKEMON,
      }),
    ).rejects.toThrow(ERROR_DUPLICATE);
  });

  // ---------------------------------------------
  // OWNERSHIP: CHARACTER DOES NOT OWN POKEMON
  // ---------------------------------------------
  it("throws if character does not own pokemon", async () => {
    vi.spyOn(repo, "findDeckById").mockResolvedValue({
      id: 1,
      characterId: 1,
    } as any);

    vi.spyOn(repo, "getOwnedPokemonForCharacterSubset").mockResolvedValue(
      CHARACTER_OWNED_POKEMON.map((id) => ({ pokemonId: id })) as any,
    );

    await expect(
      DeckService.updateDeck(10, {
        name: VALID_DECK_NAME,
        pokemonIds: CHARACTER_NOT_OWNED_POKEMON,
      }),
    ).rejects.toThrow(ERROR_NOT_OWNED);
  });

  // ------------------------------------------------------------
  // SUCCESSFUL UPDATE
  // ------------------------------------------------------------
  it("updates deck successfully when everything is valid", async () => {
    vi.spyOn(repo, "findDeckById").mockResolvedValue({
      id: 1,
      characterId: 1,
    } as any);

    vi.spyOn(repo, "getOwnedPokemonForCharacterSubset").mockResolvedValue(
      VALID_POKEMON_AMOUNT.map((id) => ({ pokemonId: id })) as any,
    );

    vi.spyOn(repo, "updateDeckName").mockResolvedValue(undefined);
    vi.spyOn(repo, "clearDeckPokemon").mockResolvedValue(undefined);
    vi.spyOn(repo, "insertDeckPokemon").mockResolvedValue(undefined);

    const result = await DeckService.updateDeck(1, {
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    expect(result).toEqual({
      deckId: 1,
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    expect(repo.updateDeckName).toHaveBeenCalledWith(1, VALID_DECK_NAME);
    expect(repo.clearDeckPokemon).toHaveBeenCalledWith(1);
    expect(repo.insertDeckPokemon).toHaveBeenCalledTimes(5);
  });
});
