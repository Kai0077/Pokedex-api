import { db } from "../db/connection.js";
import type { CreateDeckDTO } from "../types/deck.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class DeckService {
  static async createDeck(characterId: number, data: CreateDeckDTO) {
    const { name, pokemonIds } = data;

    if (pokemonIds.length !== 5) {
      throw new Error("A deck must contain exactly 5 pokemon.");
    }

    const [charRows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM `character` WHERE id = ?",
      [characterId],
    );

    if (charRows.length === 0) {
      throw new Error("Character not found.");
    }

    const pokemonIdList = pokemonIds.join(",");

    const [ownedRows] = await db.execute<RowDataPacket[]>(
      `SELECT pokemonId
      FROM character_pokemon
      WHERE characterId = ?
      AND FIND_IN_SET(pokemonId, ?)
      `,
      [characterId, pokemonIdList],
    );

    if (ownedRows.length !== pokemonIds.length) {
      throw new Error("Character does not own all selected Pokemon.");
    }

    const [deckResult] = await db.execute<ResultSetHeader>(
      "INSERT INTO deck (name, characterId) VALUES (?, ?)",
      [name, characterId],
    );

    const deckId = deckResult.insertId;

    for (const pokemonId of pokemonIds) {
      await db.execute(
        "INSERT INTO pokemon_deck (deckId, pokemonId) VALUES (?, ?)",
        [deckId, pokemonId],
      );
    }

    return {
      deckId,
      name,
      pokemonIds,
    };
  }

  static async updateDeck(
    deckId: number,
    data: { name: string; pokemonIds: number[] },
  ) {
    const { name, pokemonIds } = data;

    if (!name || typeof name !== "string") {
      throw new Error("Deck name is required.");
    }

    if (!pokemonIds || pokemonIds.length !== 5) {
      throw new Error("A deck must contain exactly 5 Pokemon.");
    }

    const [deckRows] = await db.execute<RowDataPacket[]>(
      "SELECT id, characterId FROM deck WHERE id = ?",
      [deckId],
    );

    if (deckRows.length === 0) {
      throw new Error("Deck not found.");
    }

    const characterId = deckRows[0].characterId;

    const pokemonList = pokemonIds.join(",");

    const [ownedRows] = await db.execute<RowDataPacket[]>(
      "SELECT pokemonId FROM character_pokemon WHERE characterId = ? AND FIND_IN_SET(pokemonId, ?)",
      [characterId, pokemonList],
    );

    if (ownedRows.length !== pokemonIds.length) {
      throw new Error("Character does not own all selected Pokemon.");
    }

    await db.execute("UPDATE deck SET name = ? WHERE id = ?", [name, deckId]);

    await db.execute("DELETE FROM pokemon_deck WHERE deckId = ?", [deckId]);

    for (const pokemonId of pokemonIds) {
      await db.execute(
        "INSERT INTO pokemon_deck (deckId, pokemonId) VALUES (?, ?)",
        [deckId, pokemonId],
      );
    }

    return {
      deckId,
      name,
      pokemonIds,
    };
  }

  static async deleteDeck(deckId: number) {
    const [deckRows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM deck WHERE id = ?",
      [deckId],
    );

    if (deckRows.length === 0) {
      throw new Error("Deck not found.");
    }

    await db.execute("DELETE FROM pokemon_deck WHERE deckId = ?", [deckId]);

    await db.execute("DELETE FROM deck WHERE id = ?", [deckId]);

    return { message: "Deck deleted successfully", deckId };
  }
}
