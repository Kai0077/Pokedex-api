import { describe, it, expect } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";
import { CharacterService } from "../../../../src/services/character-service.js";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.createDeck", () => {
  // ---------------------------------------------------------
  // CREATES DECK SUCCESSFULLY
  // ---------------------------------------------------------
  it("creates a deck successfully when character owns all Pokemon", async () => {
    const character = await CharacterService.createCharacter({
      firstName: "Kristian",
      lastName: "Dam",
      age: 36,
      gender: "male",
      starter: "Bulbasaur",
    });

    const pokemonService = new PokemonService();
    const gathered = await pokemonService.fetchRandomPokemon(5);
    await pokemonService.savePokemonBatch(gathered);
    await pokemonService.savePokemonToCharacter(
      character.character.id,
      gathered,
    );

    const ids = gathered.map((p) => p.id);

    const deck = await DeckService.createDeck(character.character.id, {
      name: "PowerTeam",
      pokemonIds: ids,
    });

    expect(deck.name).toBe("PowerTeam");
    expect(deck.pokemonIds.length).toBe(5);
  });
});
