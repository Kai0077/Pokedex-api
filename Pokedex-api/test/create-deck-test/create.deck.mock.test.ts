import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeckService } from "../../src/services/deck-service.js";
import * as repo from "../../src/repositories/deck-repository.js";

// Turn the whole repo module into mocks
vi.mock("../../src/repositories/deck-repository.js");

beforeEach(() => {
  vi.clearAllMocks();
});

// CHARACTER IDS
const VALID_CHARACTER_ID = 1;
const INVALID_CHARACTER_ID = 999;

// DECK NAMES
const VALID_DECK_NAME = "My First Deck";
const TOO_SHORT_DECK_NAME = "Abc";
const EMPTY_DECK_NAME = "   ";
const NON_STRING_DECK_NAME: any = 123;

// POKEMON SETS
const VALID_POKEMON_AMOUNT = [1, 4, 7, 25, 52];
const TOO_FEW_POKEMON_AMOUNT = [1, 2, 3, 4];
const TOO_MANY_POKEMON_AMOUNT = [1, 2, 3, 4, 5, 6];
const NOT_ARRAY_POKEMON_AMOUNT: any = "not-an-array";
const DUPLICATES_OF_POKEMON = [1, 2, 2, 3, 4];
const POKEMON_WITH_NAN = [1, "abc" as any, 3, 4, 5];

// Ownership sets
const OWNED_POKEMON_ROWS = VALID_POKEMON_AMOUNT.map((id) => ({
  pokemonId: id,
}));
const PARTIALLY_OWNED_ROWS = [
  { pokemonId: 1 },
  { pokemonId: 2 },
  { pokemonId: 3 },
  { pokemonId: 4 },
];

// ERROR MESSAGE REGEX PATTERNS
const ERROR_CHARACTER_NOT_FOUND = /character not found/i;
const ERROR_NOT_OWNED = /does not own all selected pokemon/i;
const ERROR_NAME = /deck name/i;
const ERROR_DECK_SIZE = /exactly 5 pokemon/i;
const ERROR_POKEMON_NAN = /must be numbers/i;
const ERROR_DUPLICATE = /duplicate pokemon/i;

// TESTS
describe("DeckService.createDeck", () => {
  // HAPPY PATH
  it("creates a deck when character exists, owns all 5 Pokémon, and DTO is valid", async () => {
    // Arrange
    vi.spyOn(repo, "characterExistsById").mockResolvedValue(true);
    vi.spyOn(repo, "getOwnedPokemonForCharacterSubset").mockResolvedValue(
      OWNED_POKEMON_ROWS as any,
    );
    vi.spyOn(repo, "insertDeck").mockResolvedValue(123 as any);
    vi.spyOn(repo, "insertDeckPokemon").mockResolvedValue(undefined);

    // Act
    const result = await DeckService.createDeck(VALID_CHARACTER_ID, {
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    // Assert – return value
    expect(result).toEqual({
      deckId: 123,
      name: VALID_DECK_NAME,
      pokemonIds: VALID_POKEMON_AMOUNT,
    });

    // Assert – repo calls
    expect(repo.characterExistsById).toHaveBeenCalledWith(VALID_CHARACTER_ID);
    expect(repo.getOwnedPokemonForCharacterSubset).toHaveBeenCalledWith(
      VALID_CHARACTER_ID,
      VALID_POKEMON_AMOUNT,
    );
    expect(repo.insertDeck).toHaveBeenCalledWith(
      VALID_DECK_NAME,
      VALID_CHARACTER_ID,
    );
    expect(repo.insertDeckPokemon).toHaveBeenCalledTimes(5);
  });

  // CHARACTER / OWNERSHIP ERRORS
  it("throws if character does not exist", async () => {
    vi.spyOn(repo, "characterExistsById").mockResolvedValue(false);

    await expect(
      DeckService.createDeck(INVALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_CHARACTER_NOT_FOUND);

    expect(repo.getOwnedPokemonForCharacterSubset).not.toHaveBeenCalled();
    expect(repo.insertDeck).not.toHaveBeenCalled();
    expect(repo.insertDeckPokemon).not.toHaveBeenCalled();
  });

  it("throws if character does not own all 5 selected Pokémon", async () => {
    vi.spyOn(repo, "characterExistsById").mockResolvedValue(true);
    vi.spyOn(repo, "getOwnedPokemonForCharacterSubset").mockResolvedValue(
      PARTIALLY_OWNED_ROWS as any,
    );

    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: [1, 2, 3, 4, 999],
      }),
    ).rejects.toThrow(ERROR_NOT_OWNED);

    expect(repo.insertDeck).not.toHaveBeenCalled();
    expect(repo.insertDeckPokemon).not.toHaveBeenCalled();
  });

  // VALIDATION: NAME
  it("throws if name is shorter than 5 characters", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: TOO_SHORT_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if name is only whitespace", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: EMPTY_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if name is not a string", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: NON_STRING_DECK_NAME,
        pokemonIds: VALID_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_NAME);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  // VALIDATION: POKEMON IDS
  it("throws if pokemonIds is not an array", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: NOT_ARRAY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if there are not exactly 5 Pokémon - too few", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_FEW_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if there are not exactly 5 Pokémon - too many", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: TOO_MANY_POKEMON_AMOUNT,
      }),
    ).rejects.toThrow(ERROR_DECK_SIZE);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if any Pokémon id is NaN", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: POKEMON_WITH_NAN,
      }),
    ).rejects.toThrow(ERROR_POKEMON_NAN);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws if deck contains duplicate Pokémon", async () => {
    await expect(
      DeckService.createDeck(VALID_CHARACTER_ID, {
        name: VALID_DECK_NAME,
        pokemonIds: DUPLICATES_OF_POKEMON,
      }),
    ).rejects.toThrow(ERROR_DUPLICATE);

    expect(repo.characterExistsById).not.toHaveBeenCalled();
  });
});
