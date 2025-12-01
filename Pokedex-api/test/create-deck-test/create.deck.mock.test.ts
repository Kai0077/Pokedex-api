import { describe, it, expect, vi, beforeEach } from "vitest";
import * as deckRepo from "../../src/repositories/deck-repository.js";
import { DeckService } from "../../src/services/deck-service.js";

// Only the repository layer is mocked:
vi.mock("../../src/repositories/deck-repository.js", () => ({
  characterExistsById: vi.fn(),
  getOwnedPokemonForCharacterSubset: vi.fn(),
  insertDeck: vi.fn(),
  insertDeckPokemon: vi.fn(),
  findDeckById: vi.fn(),
  updateDeckName: vi.fn(),
  clearDeckPokemon: vi.fn(),
  deleteDeckById: vi.fn(),
  deckExistsById: vi.fn(),
}));

describe("DeckService.createDeck (with real validation, mocked repo)", () => {
  const mockedRepo = deckRepo as unknown as {
    characterExistsById: ReturnType<typeof vi.fn>;
    getOwnedPokemonForCharacterSubset: ReturnType<typeof vi.fn>;
    insertDeck: ReturnType<typeof vi.fn>;
    insertDeckPokemon: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // HAPPY PATH
  it("creates a deck when character exists, owns all 5 Pokémon, and DTO is valid", async () => {
    const characterId = 1;
    const dto = {
      name: "My First Deck",
      pokemonIds: [1, 4, 7, 25, 52],
    };

    mockedRepo.characterExistsById.mockResolvedValue(true);
    mockedRepo.getOwnedPokemonForCharacterSubset.mockResolvedValue([
      { pokemonId: 1 },
      { pokemonId: 4 },
      { pokemonId: 7 },
      { pokemonId: 25 },
      { pokemonId: 52 },
    ]);
    mockedRepo.insertDeck.mockResolvedValue(123);
    mockedRepo.insertDeckPokemon.mockResolvedValue(undefined);

    const result = await DeckService.createDeck(characterId, dto);

    // Returned object from service
    expect(result).toEqual({
      deckId: 123,
      name: "My First Deck",
      pokemonIds: [1, 4, 7, 25, 52],
    });

    // Repository calls
    expect(mockedRepo.characterExistsById).toHaveBeenCalledWith(characterId);
    expect(mockedRepo.getOwnedPokemonForCharacterSubset).toHaveBeenCalledWith(
      characterId,
      [1, 4, 7, 25, 52],
    );
    expect(mockedRepo.insertDeck).toHaveBeenCalledWith(
      "My First Deck",
      characterId,
    );

    expect(mockedRepo.insertDeckPokemon).toHaveBeenCalledTimes(5);
    expect(mockedRepo.insertDeckPokemon).toHaveBeenNthCalledWith(1, 123, 1);
    expect(mockedRepo.insertDeckPokemon).toHaveBeenNthCalledWith(2, 123, 4);
    expect(mockedRepo.insertDeckPokemon).toHaveBeenNthCalledWith(3, 123, 7);
    expect(mockedRepo.insertDeckPokemon).toHaveBeenNthCalledWith(4, 123, 25);
    expect(mockedRepo.insertDeckPokemon).toHaveBeenNthCalledWith(5, 123, 52);
  });

  // CHARACTER / OWNERSHIP ERRORS
  it("throws 'Character not found.' if character does not exist", async () => {
    const characterId = 999;
    const dto = {
      name: "Ghost Deck",
      pokemonIds: [1, 2, 3, 4, 5],
    };

    mockedRepo.characterExistsById.mockResolvedValue(false);

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Character not found.",
    );

    expect(mockedRepo.getOwnedPokemonForCharacterSubset).not.toHaveBeenCalled();
    expect(mockedRepo.insertDeck).not.toHaveBeenCalled();
    expect(mockedRepo.insertDeckPokemon).not.toHaveBeenCalled();
  });

  it("throws if character does not own all 5 selected Pokémon", async () => {
    const characterId = 1;
    const dto = {
      name: "Cheater Deck",
      pokemonIds: [1, 2, 3, 4, 999], // 999 is not owned
    };

    mockedRepo.characterExistsById.mockResolvedValue(true);

    // Only 4 owned rows returned instead of 5
    mockedRepo.getOwnedPokemonForCharacterSubset.mockResolvedValue([
      { pokemonId: 1 },
      { pokemonId: 2 },
      { pokemonId: 3 },
      { pokemonId: 4 },
    ]);

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Character does not own all selected Pokemon.",
    );

    expect(mockedRepo.insertDeck).not.toHaveBeenCalled();
    expect(mockedRepo.insertDeckPokemon).not.toHaveBeenCalled();
  });

  // VALIDATION: NAME
  it("throws 'Deck name is too short' if name < 5 chars", async () => {
    const characterId = 1;
    const dto = {
      name: "Abc", // too short
      pokemonIds: [1, 2, 3, 4, 5],
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Deck name is too short",
    );

    // Validation should fail before any repo calls:
    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
    expect(mockedRepo.getOwnedPokemonForCharacterSubset).not.toHaveBeenCalled();
    expect(mockedRepo.insertDeck).not.toHaveBeenCalled();
    expect(mockedRepo.insertDeckPokemon).not.toHaveBeenCalled();
  });

  it("throws 'Deck name cannot be empty or null' if name is only whitespace", async () => {
    const characterId = 1;
    const dto = {
      name: "   ", // trimmed length 0
      pokemonIds: [1, 2, 3, 4, 5],
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Deck name cannot be empty or null",
    );

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws 'Deck name is required.' if name is not a string", async () => {
    const characterId = 1;
    const dto: any = {
      name: 123, // not a string
      pokemonIds: [1, 2, 3, 4, 5],
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Deck name is required.",
    );

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });

  // VALIDATION: POKEMON IDS
  it("throws 'A deck must contain exactly 5 Pokemon.' if pokemonIds is not an array", async () => {
    const characterId = 1;
    const dto: any = {
      name: "Valid Name",
      pokemonIds: "not-an-array",
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "A deck must contain exactly 5 Pokemon.",
    );

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws 'A deck must contain exactly 5 Pokemon.' if there are not exactly 5 ids", async () => {
    const characterId = 1;
    const dtoTooFew = {
      name: "Valid Name",
      pokemonIds: [1, 2, 3, 4], // 4 only
    };

    await expect(
      DeckService.createDeck(characterId, dtoTooFew),
    ).rejects.toThrowError("A deck must contain exactly 5 Pokemon.");

    const dtoTooMany = {
      name: "Valid Name",
      pokemonIds: [1, 2, 3, 4, 5, 6], // 6
    };

    await expect(
      DeckService.createDeck(characterId, dtoTooMany),
    ).rejects.toThrowError("A deck must contain exactly 5 Pokemon.");

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws 'Pokemon IDs must be numbers.' if any id is NaN", async () => {
    const characterId = 1;
    const dto = {
      name: "Valid Name",
      pokemonIds: [1, "abc" as any, 3, 4, 5], // 'abc' → NaN after Number()
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Pokemon IDs must be numbers.",
    );

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });

  it("throws 'Deck cannot contain duplicate Pokemon.' if ids are duplicated", async () => {
    const characterId = 1;
    const dto = {
      name: "Valid Name",
      pokemonIds: [1, 2, 2, 3, 4], // duplicate 2
    };

    await expect(DeckService.createDeck(characterId, dto)).rejects.toThrowError(
      "Deck cannot contain duplicate Pokemon.",
    );

    expect(mockedRepo.characterExistsById).not.toHaveBeenCalled();
  });
});
