import { describe, it, expect, beforeEach } from "vitest";
import {
  insertDeck,
  findDeckById,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("insertDeck", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("creates a deck and returns its id", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");

    const deckId = await insertDeck("Team Alpha", characterId);

    expect(deckId).toBeGreaterThan(0);

    const row = await findDeckById(deckId);
    expect(row).not.toBeNull();
    expect(row.name).toBe("Team Alpha");
    expect(row.characterId).toBe(characterId);
  });
});
