import { describe, it, expect } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

const service = new PokemonService();

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.fetchRandomPokemon", () => {
  // ---------------------------------------------------------
  // FETCHES POKEMON FROM API
  // ---------------------------------------------------------
  it("fetches N pokemon and returns valid pokemon objects", async () => {
    const result = await service.fetchRandomPokemon(3);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    for (const pokemon of result) {
      expect(pokemon.id).toBeTypeOf("number");
      expect(pokemon.name).toBeTypeOf("string");
      expect(pokemon.types).toBeTypeOf("string");
      expect(pokemon.hp).toBeTypeOf("number");
      expect(pokemon.attack).toBeTypeOf("number");
      expect(pokemon.defence).toBeTypeOf("number");
      expect(pokemon.spriteUrl).toBeTypeOf("string");
      expect(pokemon.spriteOfficialUrl).toBeTypeOf("string");
    }
  });
});
