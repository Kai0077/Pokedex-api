import { describe, it, expect, vi, beforeEach } from "vitest";
import { PokemonService } from "../../../../src/services/pokemon-service.js";

import * as repo from "../../../../src/repositories/pokemon-repository.js";
vi.mock("../../../../src/repositories/pokemon-repository.js");

// ====================================================================
// TEST
// ====================================================================

describe("PokemonService.savePokemonToCharacter", () => {
  const service = new PokemonService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("add each pokemon to character", async () => {
    const spy = vi.spyOn(repo, "linkPokemonToCharacter").mockResolvedValue();

    await service.savePokemonToCharacter(5, [{ id: 1 }, { id: 2 }] as any);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(5, 1);
    expect(spy).toHaveBeenCalledWith(5, 2);
  });
});
