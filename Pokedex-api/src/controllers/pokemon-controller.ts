import type { Context } from "hono";
import { PokemonService } from "../services/pokemon-service.js";
import type { PokemonData } from "../types/index.js";
import { GATHER_COOLDOWN_SECONDS } from "../validation/gather-validation.js";

export class PokemonController {
  private pokemonService: PokemonService;

  constructor() {
    this.pokemonService = new PokemonService();
  }

  seedDatabase = async (c: Context) => {
    try {
      const characterId = Number(c.req.param("id"));

      if (isNaN(characterId)) {
        return c.json({ error: "Invalid characterId" }, 400);
      }

      const now = new Date();

      const pokemonInstances = await this.pokemonService.gatherForCharacter(
        characterId,
        10,
      );

      const responseData: PokemonData[] = pokemonInstances.map((p) => ({
        id: p.id,
        name: p.name,
        types: p.types,
        hp: p.hp,
        attack: p.attack,
        defence: p.defence,
        spriteUrl: p.spriteUrl,
        spriteOfficialUrl: p.spriteOfficialUrl,
      }));

      const nextGatherAt = new Date(
        now.getTime() + GATHER_COOLDOWN_SECONDS * 1000,
      );

      return c.json(
        {
          message: `Success! 10 random Pokémon assigned to character #${characterId}.`,
          characterId,
          count: responseData.length,
          lastGatherAt: now.toISOString(),
          nextGatherAt: nextGatherAt.toISOString(),
          data: responseData,
        },
        200,
      );
    } catch (error) {
      process.stderr.write(`Seed error: ${error}\n`);
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to seed database",
        },
        400,
      );
    }
  };
}
