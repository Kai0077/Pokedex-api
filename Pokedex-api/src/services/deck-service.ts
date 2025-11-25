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
}
