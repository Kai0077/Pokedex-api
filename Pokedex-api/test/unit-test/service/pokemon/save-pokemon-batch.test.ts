import { describe, it, expect, vi, beforeEach } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

import * as repo from "../../../../src/repositories/pokemon-repository.js";
vi.mock("../../../../src/repositories/pokemon-repository.js");

const POKEMON_ID = 1;
const POKEMON_NAME = "Bulbasaur";
const POKEMON_TYPE = "grass";
const POKEMON_HP = 45;
const POKEMON_ATTACK = 49;
const POKEMON_DEFENCE = 49;
const POKEMON_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
const POKEMON_SPRITE_OFFICIAL_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png";

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.savePokemonBatch", () => {
  const service = new PokemonService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls insertOrUpdatePokemonBatch with correct data", async () => {
    const spy = vi
      .spyOn(repo, "insertOrUpdatePokemonBatch")
      .mockResolvedValue();

    const pokemons = [
      {
        id: POKEMON_ID,
        name: POKEMON_NAME,
        types: POKEMON_TYPE,
        hp: POKEMON_HP,
        attack: POKEMON_ATTACK,
        defence: POKEMON_DEFENCE,
        spriteUrl: POKEMON_SPRITE_URL,
        spriteOfficialUrl: POKEMON_SPRITE_OFFICIAL_URL,
      },
    ];

    await service.savePokemonBatch(pokemons as any);
    expect(spy).toHaveBeenCalledOnce();
  });
});
