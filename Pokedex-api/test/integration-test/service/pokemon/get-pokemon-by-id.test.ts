import { describe, it, expect } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const service = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.getPokemonById", () => {
  // ---------------------------------------------------------
  // RETURNS NULL IF POKEMON NOT FOUND
  // ---------------------------------------------------------
  it("returns null when pokemon does not exist", async () => {
    const result = await service.getPokemonById(999);
    expect(result).toBeNull();
  });

  // ---------------------------------------------------------
  // RETURNS A POKEMON
  // ---------------------------------------------------------
  it("returns a pokemon from the database when found", async () => {
    const pokemon = (await service.fetchRandomPokemon(1))[0];
    await service.savePokemonBatch([pokemon]);

    const found = await service.getPokemonById(pokemon.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(pokemon.id);
    expect(found?.name).toBeTypeOf("string");
  });
});
