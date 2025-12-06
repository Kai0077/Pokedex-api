import { describe, it, expect, beforeEach } from "vitest";
import {
  getPokemonStatsByIds,
  insertOrUpdatePokemonBatch,
} from "../../../../src/repositories/pokemon-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("getPokemonStatsByIds", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns an empty array when no pokemon ids", async () => {
    const result = await getPokemonStatsByIds([]);
    expect(result).toEqual([]);
  });

  it("returns attack and defence for pokemon", async () => {
    await insertOrUpdatePokemonBatch([
      {
        id: 1,
        name: "bulbasaur",
        types: "grass",
        hp: 45,
        attack: 49,
        defence: 49,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
      {
        id: 4,
        name: "charmander",
        types: "fire",
        hp: 39,
        attack: 52,
        defence: 43,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      },
    ]);

    const result = await getPokemonStatsByIds([1, 4]);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      id: 1,
      attack: 49,
      defence: 49,
    });
    expect(result[1]).toEqual({
      id: 4,
      attack: 52,
      defence: 43,
    });
  });
});
