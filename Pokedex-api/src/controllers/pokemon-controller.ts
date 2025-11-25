import type { Context } from "hono";
import { PokemonService } from "../services/pokemon-service.js";
import type { PokemonData } from "../types/index.js";

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

      // 1. Fetch
      const pokemonInstances = await this.pokemonService.fetchRandomPokemon(10);

      if (pokemonInstances.length === 0) {
        return c.json({ error: "No pokemon could be fetched from API" }, 502);
      }

      // 2. Save
      await this.pokemonService.savePokemonBatch(pokemonInstances);

      await this.pokemonService.savePokemonToCharacter(
        characterId,
        pokemonInstances,
      );

      // 3. Map Domain Objects to plain JSON response
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

      return c.json(
        {
          message: `Success! 10 random Pokémon assigned to character #${characterId}.`,
          characterId,
          count: responseData.length,
          data: responseData,
        },
        200,
      );
    } catch (error) {
      console.error("Seed error:", error);
      return c.json(
        {
          error: "Failed to seed database",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500,
      );
    }
  };
}
