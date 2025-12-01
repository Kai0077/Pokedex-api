import { describe, it, expect } from "vitest";
import { DeckService } from "../../../../src/services/deck-service.js";
import { CharacterService } from "../../../../src/services/character-service.js";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("DeckService.updateDeck", () => {
  // ---------------------------------------------------------
  // UPDATES DECK SUCCESSFULLY
  // ---------------------------------------------------------
  it("updates an existing deck with new Pokemon", async () => {
    const character = await CharacterService.createCharacter({
      firstName: "Michael",
      lastName: "Brandt",
      age: 42,
      gender: "male",
      starter: "Squirtle",
    });

    const service = new PokemonService();

    const first = await service.fetchRandomPokemon(5);
    await service.savePokemonBatch(first);
    await service.savePokemonToCharacter(character.character.id, first);

    const deck = await DeckService.createDeck(character.character.id, {
      name: "AlphaTeam",
      pokemonIds: first.map((p) => p.id),
    });

    const second = await service.fetchRandomPokemon(5);
    await service.savePokemonBatch(second);
    await service.savePokemonToCharacter(character.character.id, second);

    const updated = await DeckService.updateDeck(deck.deckId, {
      name: "BetaTeam",
      pokemonIds: second.map((p) => p.id),
    });

    expect(updated.name).toBe("BetaTeam");
  });
});
