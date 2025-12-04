import { describe, it, expect, beforeEach } from "vitest";
import { resetDB } from "../../../reset-db.js";

import {
  insertCharacter,
  characterExistsById,
} from "../../../../src/repositories/character-repository.js";

// ============================
// TESTS
// ============================

describe("characterExistsById", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns true only when the character exists", async () => {
    const characterId = await insertCharacter("Oliver", "Holm", 22, "male");

    expect(await characterExistsById(characterId)).toBe(true);
    expect(await characterExistsById(999)).toBe(false);
  });
});
