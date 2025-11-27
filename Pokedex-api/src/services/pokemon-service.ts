// src/services/pokemon-service.ts
import { Pokemon, type TType } from '../models/Pokemon.js';
import type { PokeApiResponse } from '../types/index.js';
import {
  getPokemonRowById,
  insertOrUpdatePokemonBatch,
  linkPokemonToCharacter,
} from '../repositories/pokemon-repository.js';

export class PokemonService {
  private readonly baseUrl = process.env.POKE_API_BASE_URL;

  /**
   * Get a single Pokemon from the DB by ID
   */
  async getPokemonById(id: number): Promise<Pokemon | null> {
    const row = await getPokemonRowById(id);
    if (!row) return null;

    return new Pokemon(
      row.id,
      row.name,
      row.types as TType,
      row.hp,
      row.attack,
      row.defence,
      row.spriteUrl,
      row.spriteOfficialUrl,
    );
  }

  /**
   * Fetches N random pokemon from the PokeAPI
   */
  async fetchRandomPokemon(count: number): Promise<Pokemon[]> {
    const promises: Promise<Pokemon | null>[] = [];
    const usedIds = new Set<number>();

    while (usedIds.size < count) {
      // Gen random ID between 1 and 1025 (current max)
      const randomId = Math.floor(Math.random() * 1025) + 1;

      if (!usedIds.has(randomId)) {
        usedIds.add(randomId);
        promises.push(this.fetchSinglePokemon(randomId));
      }
    }

    const results = await Promise.all(promises);
    return results.filter((p): p is Pokemon => p !== null);
  }

  /**
   * Helper to fetch a single pokemon
   */
  private async fetchSinglePokemon(id: number): Promise<Pokemon | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        console.warn(
          `Failed to fetch Pokemon ID ${id}: ${response.statusText}`,
        );
        return null;
      }

      const data = (await response.json()) as PokeApiResponse;
      return this.mapApiToDomain(data);
    } catch (error) {
      console.error(`Error fetching Pokemon ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Saves a list of Pokemon to the database
   */
  async savePokemonBatch(pokemons: Pokemon[]): Promise<void> {
    if (pokemons.length === 0) return;

    const rows = pokemons.map((p) => ({
      id: p.id,
      name: p.name,
      types: p.types,
      hp: p.hp,
      attack: p.attack,
      defence: p.defence,
      spriteUrl: p.spriteUrl,
      spriteOfficialUrl: p.spriteOfficialUrl,
    }));

    try {
      await insertOrUpdatePokemonBatch(rows);
      console.log(`Saved ${pokemons.length} pokemon to database.`);
    } catch (error) {
      console.error('Database save error:', error);
      throw new Error('Failed to save pokemon batch');
    }
  }

  /**
   * Maps API response to your Domain Model
   */
  private mapApiToDomain(data: PokeApiResponse): Pokemon {
    // 1. Get primary type
    const primaryTypeStr = data.types[0]?.type.name || 'unknown';

    // 2. Ensure it is a valid TType
    const validTypes: TType[] = [
      'normal',
      'fighting',
      'flying',
      'poison',
      'ground',
      'rock',
      'bug',
      'ghost',
      'steel',
      'fire',
      'water',
      'grass',
      'electric',
      'psychic',
      'ice',
      'dragon',
      'dark',
      'fairy',
      'stellar',
      'unknown',
    ];

    const finalType: TType = validTypes.includes(
      primaryTypeStr as TType,
    )
      ? (primaryTypeStr as TType)
      : 'unknown';

    // 3. Extract Stats
    const getStat = (name: string) =>
      data.stats.find((s) => s.stat.name === name)?.base_stat || 0;

    return new Pokemon(
      data.id,
      data.name,
      finalType,
      getStat('hp'),
      getStat('attack'),
      getStat('defense'),
      data.sprites.front_default || '',
      data.sprites.other['official-artwork'].front_default || '',
    );
  }

  async savePokemonToCharacter(characterId: number, pokemons: Pokemon[]) {
    for (const pokemon of pokemons) {
      await linkPokemonToCharacter(characterId, pokemon.id);
    }
  }
}