import { describe, it, expect, beforeEach } from "vitest";
import {
  deckExistsById,
  insertDeck,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("deckExistsById", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns false when deck does not exist", async () => {
    const exists = await deckExistsById(9999);
    expect(exists).toBe(false);
  });

  it("returns true when deck exists", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Team Grass", characterId);

    const exists = await deckExistsById(deckId);
    expect(exists).toBe(true);
  });
});
