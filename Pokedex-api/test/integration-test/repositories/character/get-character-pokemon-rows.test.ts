import { describe, it, expect, beforeEach } from "vitest";
import {
  insertCharacter,
  insertPokemonRow,
  addPokemonToCharacter,
  getCharacterPokemonRows,
} from "../../../../src/repositories/character-repository.js";
import { resetDB } from "../../../reset-db.js";

// ============================
// TESTS
// ============================

describe("getCharacterPokemonRows", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("returns all pokemon linked to a character with full attributes", async () => {
    const characterId = await insertCharacter("Hans", "Larsen", 25, "male");

    await insertPokemonRow({
      id: 7,
      name: "squirtle",
      types: "water",
      hp: 44,
      attack: 48,
      defence: 65,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    });

    await addPokemonToCharacter(characterId, 7);

    const rows = await getCharacterPokemonRows(characterId);

    expect(rows.length).toBe(1);

    const pokemon = rows[0];
    expect(pokemon.id).toBe(7);
    expect(pokemon.name).toBe("squirtle");
    expect(pokemon.types).toBe("water");
    expect(pokemon.hp).toBe(44);
    expect(pokemon.attack).toBe(48);
    expect(pokemon.defence).toBe(65);
    expect(pokemon.spriteUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    );
    expect(pokemon.spriteOfficialUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    );
  });
});
