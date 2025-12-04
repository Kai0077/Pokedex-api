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

describe("addPokemonToCharacter", () => {
  beforeEach(async () => {
    await resetDB();
  });

  it("add a pokemon to a character and return pokemon", async () => {
    const characterId = await insertCharacter("Kai", "Hans", 20, "male");

    await insertPokemonRow({
      id: 10,
      name: "caterpie",
      types: "bug",
      hp: 45,
      attack: 30,
      defence: 35,
      spriteUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
      spriteOfficialUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png",
    });

    await addPokemonToCharacter(characterId, 10);

    const rows = await getCharacterPokemonRows(characterId);

    expect(rows.length).toBe(1);

    const pokemon = rows[0];

    expect(pokemon.id).toBe(10);
    expect(pokemon.name).toBe("caterpie");
    expect(pokemon.types).toBe("bug");
    expect(pokemon.hp).toBe(45);
    expect(pokemon.attack).toBe(30);
    expect(pokemon.defence).toBe(35);
    expect(pokemon.spriteUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
    );
    expect(pokemon.spriteOfficialUrl).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png",
    );
  });
});
