import { describe, it, expect, beforeEach } from "vitest";
import {
  deleteDeckById,
  insertDeck,
  findDeckById,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("deleteDeckById", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("deletes a deck", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Team Fire", characterId);

    await deleteDeckById(deckId);

    const row = await findDeckById(deckId);
    expect(row).toBeNull();
  });
});
