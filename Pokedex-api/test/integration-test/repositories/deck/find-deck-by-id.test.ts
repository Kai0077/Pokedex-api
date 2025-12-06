import { describe, it, expect, beforeEach } from "vitest";
import {
  findDeckById,
  insertDeck,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("findDeckById", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns null when deck does not exist", async () => {
    const result = await findDeckById(9999);
    expect(result).toBeNull();
  });

  it("returns deck row when deck exists", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Water Team", characterId);

    const deck = await findDeckById(deckId);

    expect(deck).not.toBeNull();
    expect(deck.id).toBe(deckId);
    expect(deck.characterId).toBe(characterId);
    expect(deck.name).toBe("Water Team");
  });
});
