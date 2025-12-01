import { describe, it, expect } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const service = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.savePokemonToCharacter", () => {
  // ---------------------------------------------------------
  // ADD MULTIPLE POKEMON TO A CHARACTER
  // ---------------------------------------------------------
  it("adds pokemon to character successfully", async () => {
    const characterId = 1;

    const pokemons = await service.fetchRandomPokemon(2);

    expect(pokemons.length).toBe(2);

    await expect(
      service.savePokemonToCharacter(characterId, pokemons),
    ).resolves.not.toThrow();
  });
});
