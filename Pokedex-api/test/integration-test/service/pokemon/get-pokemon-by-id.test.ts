import { describe, it, expect } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.getPokemonById", () => {
  // ---------------------------------------------------------
  // RETURNS A POKEMON WHEN SAVED IN DB
  // ---------------------------------------------------------
  it("returns a pokemon when saved in DB", async () => {
    const service = new PokemonService();

    // FETCH AND SAVE POKEMON
    const [poke] = await service.fetchRandomPokemon(1);
    await service.savePokemonBatch([poke]);

    const found = await service.getPokemonById(poke.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(poke.id);
    expect(found?.name).toBe(poke.name);
  });

  // ---------------------------------------------------------
  // RETURNS NULL WHEN POKEMON DOES NOT EXIST
  // ---------------------------------------------------------
  it("returns null for non-existing pokemon", async () => {
    const service = new PokemonService();

    const result = await service.getPokemonById(-99999);

    expect(result).toBeNull();
  });
});
