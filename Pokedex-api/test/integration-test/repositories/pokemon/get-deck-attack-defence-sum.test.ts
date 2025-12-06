import { describe, it, beforeEach, expect } from "vitest";
import { getDB } from "../../../../src/db/connection.js";
import { getDeckAttackDefenceSum } from "../../../../src/repositories/pokemon-repository.js";

describe("getDeckAttackDefenceSum(deckId) – integration", () => {
  const db = getDB();

  beforeEach(async () => {
    // Clear child tables first because of FKs
    await db.execute("DELETE FROM pokemon_deck");
    await db.execute("DELETE FROM character_pokemon");
    await db.execute("DELETE FROM deck");
    await db.execute("DELETE FROM `character`");
    await db.execute("DELETE FROM pokemon");
  });

  it("returns the correct sum for a deck with 2 Pokémon", async () => {
    // 1) Insert Pokémon
    await db.execute(
      `INSERT INTO pokemon (id, name, types, hp, attack, defence, spriteUrl, spriteOfficialUrl)
       VALUES
       (1, 'P1', 'fire', 50, 100, 50, 'url1', 'ourl1'),
       (2, 'P2', 'water', 60, 80,  40, 'url2', 'ourl2')`,
    );

    // 2) Insert character + deck
    const [charRes] = await db.execute<any>(
      "INSERT INTO `character` (firstname, lastname, age, gender) VALUES ('Ash', 'K', 20, 'male')",
    );
    const characterId = charRes.insertId as number;

    const [deckRes] = await db.execute<any>(
      "INSERT INTO deck (name, characterId) VALUES ('Test Deck', ?)",
      [characterId],
    );
    const deckId = deckRes.insertId as number;

    // 3) Link Pokémon to deck
    await db.execute(
      "INSERT INTO pokemon_deck (deckId, pokemonId) VALUES (?, ?), (?, ?)",
      [deckId, 1, deckId, 2],
    );

    // 4) Call the function under test
    const total = await getDeckAttackDefenceSum(deckId);

    // P1: 100 + 50 = 150
    // P2:  80 + 40 = 120
    // total = 270
    expect(total).toBe(270);
  });
});
