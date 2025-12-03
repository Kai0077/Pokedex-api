import { describe, it, expect, beforeEach } from "vitest";
import type { RowDataPacket } from "mysql2";
import {
  insertDeck,
  insertDeckPokemon,
} from "../../../../src/repositories/deck-repository.js";
import { insertCharacter } from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";
import { getDB } from "../../../../src/db/connection.js";

describe("insertDeckPokemon", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("adds pokemon to a deck", async () => {
    const charId = await insertCharacter("Kai", "Hans", 20, "male");
    const deckId = await insertDeck("Grass Squad", charId);

    await insertDeckPokemon(deckId, 10);
    await insertDeckPokemon(deckId, 25);

    const db = getDB();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT deckId, pokemonId FROM pokemon_deck WHERE deckId = ? ORDER BY pokemonId",
      [deckId],
    );

    expect(rows.length).toBe(2);
    expect(rows[0].pokemonId).toBe(10);
    expect(rows[1].pokemonId).toBe(25);
  });
});
