import { describe, it, expect } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const deck = DeckService;
const pokemon = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.deleteDeck", async () => {
  // ---------------------------------------------------------
  // DELETES A DECK SUCCESSFULLY
  // ---------------------------------------------------------
  it("deletes a deck and its pokemon", async () => {
    const characterId = 1;

    const pokemons = await pokemon.fetchRandomPokemon(5);
    await pokemon.savePokemonBatch(pokemons);
    await pokemon.savePokemonToCharacter(characterId, pokemons);

    const ids = pokemons.map((pokemon) => pokemon.id);

    const created = await deck.createDeck(characterId, {
      name: "AlphaTeam",
      pokemonIds: ids,
    });

    const result = await deck.deleteDeck(created.deckId);

    expect(result).toMatchObject({
      message: "Deck deleted successfully",
      deckId: created.deckId,
    });
  });
});
