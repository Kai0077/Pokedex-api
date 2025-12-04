import { describe, it, expect, beforeEach } from "vitest";
import {
  insertDeck,
  updateDeckName,
  findDeckById,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("updateDeckName", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("updates the name of a deck", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Team Fire", characterId);

    await updateDeckName(deckId, "Team Water");

    const updated = await findDeckById(deckId);
    expect(updated.name).toBe("Team Water");
  });
});
