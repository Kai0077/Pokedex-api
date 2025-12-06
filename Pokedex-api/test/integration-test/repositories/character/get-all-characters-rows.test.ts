import { describe, it, expect, beforeEach } from "vitest";
import {
  insertCharacter,
  getAllCharactersRows,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("getAllCharactersRows", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns all characters with full attributes", async () => {
    const characterId1 = await insertCharacter("Kai", "Larsen", 33, "male");
    const characterId2 = await insertCharacter("Laura", "Hvidt", 29, "female");

    const rows = await getAllCharactersRows();

    expect(rows.length).toBe(2);

    const character1 = rows.find((row) => row.id === characterId1);
    const character2 = rows.find((row) => row.id === characterId2);

    expect(character1).toEqual({
      id: characterId1,
      firstname: "Kai",
      lastname: "Larsen",
      age: 33,
      gender: "male",
      deckCount: 0,
    });

    expect(character2).toEqual({
      id: characterId2,
      firstname: "Laura",
      lastname: "Hvidt",
      age: 29,
      gender: "female",
      deckCount: 0,
    });
  });
});
