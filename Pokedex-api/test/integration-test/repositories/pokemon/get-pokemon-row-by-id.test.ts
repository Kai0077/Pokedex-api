import { describe, it, expect, beforeEach } from "vitest";
import {
  getPokemonRowById,
  insertOrUpdatePokemonBatch,
} from "../../../../src/repositories/pokemon-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("getPokemonRowById", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("return a pokemon when it exists", async () => {
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
    ]);

    const row = await getPokemonRowById(1);

    expect(row).not.toBeNull();
    expect(row.id).toBe(1);
    expect(row.name).toBe("bulbasaur");
    expect(row.types).toBe("grass");
    expect(row.hp).toBe(45);
    expect(row.attack).toBe(49);
    expect(row.defence).toBe(49);
    expect(row.spriteUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    );
    expect(row.spriteOfficialUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    );
  });

  it("returns null when pokemon does not exist", async () => {
    const row = await getPokemonRowById(99999);
    expect(row).toBeNull();
  });
});
