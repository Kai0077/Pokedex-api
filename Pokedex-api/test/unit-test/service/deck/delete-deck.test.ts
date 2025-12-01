import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";

import * as repo from "../../../../src/repositories/deck-repository.js";
vi.mock("../../../src/repositories/deck-repository.js");

beforeEach(() => {
  vi.clearAllMocks();
});

const VALID_DECK_ID = 1;
const ERROR_DECK_NOT_FOUND = /deck not found/i;

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.deleteDeck", () => {
  // ------------------------------------------------------------
  // DECK DOES NOT EXIST
  // ------------------------------------------------------------
  it("throws if deck does not exist", async () => {
    vi.spyOn(repo, "deckExistsById").mockResolvedValue(false);

    await expect(DeckService.deleteDeck(999)).rejects.toThrow(
      ERROR_DECK_NOT_FOUND,
    );
  });

  // ------------------------------------------------------------
  // SUCCESSFUL DELETE
  // ------------------------------------------------------------
  it("deletes deck succesfully when it exists", async () => {
    vi.spyOn(repo, "deckExistsById").mockResolvedValue(true);
    vi.spyOn(repo, "clearDeckPokemon").mockResolvedValue(undefined);
    vi.spyOn(repo, "deleteDeckById").mockResolvedValue(undefined);

    const result = await DeckService.deleteDeck(VALID_DECK_ID);

    expect(result).toEqual({
      message: "Deck deleted successfully",
      deckId: VALID_DECK_ID,
    });

    expect(repo.deckExistsById).toHaveBeenCalledWith(VALID_DECK_ID);
    expect(repo.clearDeckPokemon).toHaveBeenCalledWith(VALID_DECK_ID);
    expect(repo.deleteDeckById).toHaveBeenCalledWith(VALID_DECK_ID);

    const clearMock = vi.mocked(repo.clearDeckPokemon);
    const deleteMock = vi.mocked(repo.deleteDeckById);

    expect(clearMock).toHaveBeenCalledBefore(deleteMock);
  });
});
