import { describe, it, expect } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const deck = DeckService;
const pokemon = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.createDeck", () => {
  // ---------------------------------------------------------
  // CREATES A DECK SUCCESSFULLY
  // ---------------------------------------------------------
  it("creates a deck successfully when character owns all Pokémon", async () => {
    const characterId = 1;

    // FETCH POKEMON
    const pokemons = await pokemon.fetchRandomPokemon(5);

    // SAVE POKEMONS TO CHARACTER
    await pokemon.savePokemonBatch(pokemons);
    await pokemon.savePokemonToCharacter(characterId, pokemons);

    const ids = pokemons.map((p) => p.id);

    // CREATE A DECK
    const result = await deck.createDeck(characterId, {
      name: "AlphaTeam",
      pokemonIds: ids,
    });

    expect(result).toMatchObject({
      deckId: expect.any(Number),
      name: "AlphaTeam",
      pokemonIds: ids,
    });
  });
});
