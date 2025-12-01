import { describe, it, expect, vi, beforeEach } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

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

describe("PokemonService.fetchRandomPokemon", () => {
  const service = new PokemonService();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("returns a list of Pokemon", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: POKEMON_ID,
        name: POKEMON_NAME,
        types: [
          {
            slot: 1,
            type: { name: POKEMON_TYPE },
          },
        ],
        stats: [
          { stat: { name: "hp" }, base_stat: POKEMON_HP },
          { stat: { name: "attack" }, base_stat: POKEMON_ATTACK },
          { stat: { name: "defense" }, base_stat: POKEMON_DEFENCE },
        ],
        sprites: {
          front_default: POKEMON_SPRITE_URL,
          other: {
            "official-artwork": { front_default: POKEMON_SPRITE_OFFICIAL_URL },
          },
        },
      }),
    });

    const result = await service.fetchRandomPokemon(2);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe(POKEMON_NAME);
  });
});
