import { describe, it, expect } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const service = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.savePokemonBatch", () => {
  // ---------------------------------------------------------
  // SAVES MULTIPLE POKEMON TO THE DATABASE
  // ---------------------------------------------------------
  it("saves multiple pokemon to the database successfully", async () => {
    const pokemons = await service.fetchRandomPokemon(2);

    await service.savePokemonBatch(pokemons);

    const firstPokemon = await service.getPokemonById(pokemons[0].id);
    const secondPokemon = await service.getPokemonById(pokemons[1].id);

    expect(firstPokemon).not.toBeNull();
    expect(secondPokemon).not.toBeNull();
  });
});
