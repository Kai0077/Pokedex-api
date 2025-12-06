import { describe, it, expect, beforeEach } from "vitest";
import {
  insertOrUpdatePokemonBatch,
  getPokemonRowById,
} from "../../../../src/repositories/pokemon-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("insertOrUpdatePokemonBatch", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("insert a new pokemon", async () => {
    await insertOrUpdatePokemonBatch([
      {
        id: 6,
        name: "charizard",
        types: "fire",
        hp: 78,
        attack: 84,
        defence: 78,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      },
    ]);

    const row = await getPokemonRowById(6);

    expect(row).not.toBeNull();
    expect(row.id).toBe(6);
    expect(row.name).toBe("charizard");
    expect(row.types).toBe("fire");
    expect(row.hp).toBe(78);
    expect(row.attack).toBe(84);
    expect(row.defence).toBe(78);
  });

  it("update an existing pokemon", async () => {
    await insertOrUpdatePokemonBatch([
      {
        id: 6,
        name: "charizard",
        types: "fire",
        hp: 78,
        attack: 84,
        defence: 78,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      },
    ]);

    await insertOrUpdatePokemonBatch([
      {
        id: 6,
        name: "charizard",
        types: "flying",
        hp: 100,
        attack: 120,
        defence: 90,
        spriteUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        spriteOfficialUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      },
    ]);

    const updatedPokemon = await getPokemonRowById(6);

    expect(updatedPokemon.types).toBe("flying");
    expect(updatedPokemon.hp).toBe(100);
    expect(updatedPokemon.attack).toBe(120);
    expect(updatedPokemon.defence).toBe(90);

    expect(updatedPokemon.name).toBe("charizard");
    expect(updatedPokemon.spriteUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    );
    expect(updatedPokemon.spriteOfficialUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    );
  });
});
