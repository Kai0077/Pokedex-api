import { describe, it, expect, beforeEach } from "vitest";
import {
  insertCharacter,
  characterExists,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("insertCharacter", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("inserts a character and returns an ID", async () => {
    const id = await insertCharacter("Oliver", "Holm", 22, "male");

    expect(typeof id).toBe("number");
    expect(await characterExists(id)).toBe(true);
  });
});
