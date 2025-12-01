import { describe, it, expect } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const deck = DeckService;
const pokemon = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.updateDeck", () => {
  // ---------------------------------------------------------
  // UPDATES A DECK SUCCESSFULLY
  // ---------------------------------------------------------
  it("updates an existing deck with new Pokémon", async () => {
    const characterId = 1; // must exist
    const initialPokemons = await pokemon.fetchRandomPokemon(5);

    // ENSURE OWNERSHIP
    await pokemon.savePokemonBatch(initialPokemons);
    await pokemon.savePokemonToCharacter(characterId, initialPokemons);

    const initialIds = initialPokemons.map((p) => p.id);

    // CREATE DECK
    const created = await deck.createDeck(characterId, {
      name: "UpdateTestDeck",
      pokemonIds: initialIds,
    });

    // GATHER POKEMON AND SAVE TO CHARACTER
    const newPokemons = await pokemon.fetchRandomPokemon(5);
    await pokemon.savePokemonBatch(newPokemons);
    await pokemon.savePokemonToCharacter(characterId, newPokemons);

    const updateIds = newPokemons.map((p) => p.id);

    // UPDATE DECK
    const updated = await deck.updateDeck(created.deckId, {
      name: "AlphaTeam",
      pokemonIds: updateIds,
    });

    expect(updated).toMatchObject({
      deckId: created.deckId,
      name: "AlphaTeam",
      pokemonIds: updateIds,
    });
  });
});
