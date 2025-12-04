import { describe, it, expect, beforeEach } from "vitest";
import {
  findPokemonByName,
  insertPokemonRow,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("findPokemonByName", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns pokemon when it exists", async () => {
    await insertPokemonRow({
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
    });

    const result = await findPokemonByName("bulbasaur");

    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.name).toBe("bulbasaur");
    expect(result?.types).toBe("grass");
    expect(result?.hp).toBe(45);
    expect(result?.attack).toBe(49);
    expect(result?.defence).toBe(49);
    expect(result?.spriteUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    );
    expect(result?.spriteOfficialUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    );
  });

  it("returns null when pokemon does not exist", async () => {
    const result = await findPokemonByName("missing");
    expect(result).toBeNull();
  });
});
