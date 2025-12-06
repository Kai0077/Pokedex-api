import { Character } from "../models/Character.js";
import type { CreateCharacterDTO } from "../types/character.js";
import { validateCreateCharacterDTO } from "../validation/character-validation.js";
import {
  insertCharacter,
  findPokemonByName,
  addPokemonToCharacter,
  getCharacterPokemonRows,
  getAllCharactersRows,
  getDecksForCharacterRows,
  pokemonExistsById,
  insertPokemonRow,
  characterExists,
} from "../repositories/character-repository.js";
import { calculateDeckRank } from "./deck-ranking-service.js";

export class CharacterService {
  // ---------------------------------------------------------
  // CREATE CHARACTER
  // ---------------------------------------------------------
  static async createCharacter(data: CreateCharacterDTO) {
    const { firstName, lastName, age, gender, starter } =
      validateCreateCharacterDTO(data);

    // ensure starters exist
    await this.ensureStarterPokemonExist();

    // create character in DB
    const characterId = await insertCharacter(firstName, lastName, age, gender);

    // get starter pokemon
    const starterPokemon = await findPokemonByName(starter.toLowerCase());
    if (!starterPokemon) {
      throw new Error("Starter Pokemon not found in database.");
    }

    // add starter to character
    await addPokemonToCharacter(characterId, starterPokemon.id);

    const character = new Character(
      characterId,
      firstName,
      lastName,
      age,
      gender,
    );

    return {
      character: {
        id: character.id,
        firstName: character.firstName,
        lastName: character.lastName,
        age: character.age,
        gender: character.gender,
      },
      starter: starterPokemon,
    };
  }

  // ---------------------------------------------------------
  // GET ALL POKEMON A CHARACTER OWNS
  // ---------------------------------------------------------
  static async getCharacterPokemon(characterId: number) {
    const exists = await characterExists(characterId);
    if (!exists) {
      throw new Error("Character not found.");
    }

    return getCharacterPokemonRows(characterId);
  }

  // ---------------------------------------------------------
  // GET ALL CHARACTERS
  // ---------------------------------------------------------
  static async getAllCharacters() {
    return getAllCharactersRows();
  }

  // ---------------------------------------------------------
  // GET ALL CHARACTER DECKS
  // ---------------------------------------------------------
  static async getDecksForCharacter(characterId: number) {
    const exists = await characterExists(characterId);
    if (!exists) {
      throw new Error("Character not found.");
    }

    const deckRows = await getDecksForCharacterRows(characterId);

    return deckRows.map((deck: any) => {
      const pokemon = deck.pokemon || [];

      const total = pokemon.reduce(
        (sum: number, p: any) =>
          sum + Number(p.attack ?? 0) + Number(p.defence ?? 0),
        0,
      );

      const rank = calculateDeckRank(total);

      return {
        deckId: deck.deckId,
        name: deck.name,
        rank,
        pokemon,
      };
    });
  }

  // ---------------------------------------------------------
  // INTERNAL: ENSURE STARTER POKEMON EXIST
  // ---------------------------------------------------------
  private static async ensureStarterPokemonExist() {
    const starterIds = [1, 4, 7];

    for (const id of starterIds) {
      const exists = await pokemonExistsById(id);
      if (exists) continue;

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      const row = {
        id,
        name: data.name,
        types: data.types[0].type.name,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defence: data.stats[2].base_stat,
        spriteUrl: data.sprites.front_default,
        spriteOfficialUrl: data.sprites.other["official-artwork"].front_default,
      };

      await insertPokemonRow(row);
      process.stdout.write(`Inserted starter Pokémon: ${row.name}\n`);
    }
  }
}
