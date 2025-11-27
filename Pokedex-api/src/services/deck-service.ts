// src/services/deck-service.ts
import type { CreateDeckDTO } from "../types/deck.js";
import {
  validateCreateDeckDTO,
  validateUpdateDeckDTO,
} from "../validation/deck-validation.js";
import {
  characterExistsById,
  getOwnedPokemonForCharacterSubset,
  insertDeck,
  insertDeckPokemon,
  findDeckById,
  updateDeckName,
  clearDeckPokemon,
  deleteDeckById,
  deckExistsById,
} from "../repositories/deck-repository.js";

export class DeckService {
  // ---------------------------------------------------------
  // CREATE DECK
  // ---------------------------------------------------------
  static async createDeck(characterId: number, data: CreateDeckDTO) {
    const { name, pokemonIds } = validateCreateDeckDTO(data);

    const charExists = await characterExistsById(characterId);
    if (!charExists) {
      throw new Error("Character not found.");
    }

    const ownedRows = await getOwnedPokemonForCharacterSubset(
      characterId,
      pokemonIds,
    );

    if (ownedRows.length !== pokemonIds.length) {
      throw new Error("Character does not own all selected Pokemon.");
    }

    const deckId = await insertDeck(name, characterId);

    for (const pokemonId of pokemonIds) {
      await insertDeckPokemon(deckId, pokemonId);
    }

    return {
      deckId,
      name,
      pokemonIds,
    };
  }

  // ---------------------------------------------------------
  // UPDATE DECK
  // ---------------------------------------------------------
  static async updateDeck(
    deckId: number,
    data: { name: string; pokemonIds: number[] },
  ) {
    const { name, pokemonIds } = validateUpdateDeckDTO(data);

    const deckRow = await findDeckById(deckId);
    if (!deckRow) {
      throw new Error("Deck not found.");
    }

    const characterId = deckRow.characterId as number;

    const ownedRows = await getOwnedPokemonForCharacterSubset(
      characterId,
      pokemonIds,
    );

    if (ownedRows.length !== pokemonIds.length) {
      throw new Error("Character does not own all selected Pokemon.");
    }

    await updateDeckName(deckId, name);
    await clearDeckPokemon(deckId);

    for (const pokemonId of pokemonIds) {
      await insertDeckPokemon(deckId, pokemonId);
    }

    return {
      deckId,
      name,
      pokemonIds,
    };
  }

  // ---------------------------------------------------------
  // DELETE DECK
  // ---------------------------------------------------------
  static async deleteDeck(deckId: number) {
    const exists = await deckExistsById(deckId);
    if (!exists) {
      throw new Error("Deck not found.");
    }

    await clearDeckPokemon(deckId);
    await deleteDeckById(deckId);

    return { message: "Deck deleted successfully", deckId };
  }
}