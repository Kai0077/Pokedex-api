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

describe("PokemonService.getPokemonById", () => {
  const service = new PokemonService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when a Pokemon not found", async () => {
    vi.spyOn(repo, "getPokemonRowById").mockResolvedValue(null as any);

    const result = await service.getPokemonById(999);
    expect(result).toBeNull();
  });

  it("returns a Pokemon when found", async () => {
    vi.spyOn(repo, "getPokemonRowById").mockResolvedValue({
      id: POKEMON_ID,
      name: POKEMON_NAME,
      types: POKEMON_TYPE,
      hp: POKEMON_HP,
      attack: POKEMON_ATTACK,
      defence: POKEMON_DEFENCE,
      spriteUrl: POKEMON_SPRITE_URL,
      spriteOfficialUrl: POKEMON_SPRITE_OFFICIAL_URL,
    } as any);

    const result = await service.getPokemonById(1);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(POKEMON_ID);
    expect(result?.name).toBe(POKEMON_NAME);
    expect(result?.types).toBe(POKEMON_TYPE);
    expect(result?.hp).toBe(POKEMON_HP);
    expect(result?.attack).toBe(POKEMON_ATTACK);
    expect(result?.defence).toBe(POKEMON_DEFENCE);
    expect(result?.spriteUrl).toBe(POKEMON_SPRITE_URL);
    expect(result?.spriteOfficialUrl).toBe(POKEMON_SPRITE_OFFICIAL_URL);
  });
});
