import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../db/connection.js";
import { Character } from "../models/Character.js";
import type { CreateCharacterDTO } from "../types/character.js";

export class CharacterService {
  // ---------------------------------------------------------
  // CREATE CHARACTER
  // ---------------------------------------------------------
  static async createCharacter(data: CreateCharacterDTO) {
    const { firstName, lastName, age, gender, starter } = data;

    await this.ensureStarterPokemonExist();

    const validStarterPokemons = ["Bulbasaur", "Charmander", "Squirtle"];
    const validGenders = ["male", "female", "other"];

    if (!validGenders.includes(gender)) {
      throw new Error("Invalid gender");
    }

    if (!validStarterPokemons.includes(starter)) {
      throw new Error("Invalid starter Pokemon");
    }

    // Create character
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO `character` (firstname, lastname, age, gender) VALUES (?, ?, ?, ?)",
      [firstName, lastName, age, gender],
    );

    const characterId = result.insertId;

    // Get starter pokémon
    const [starterRows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM pokemon WHERE name = ? LIMIT 1",
      [starter.toLowerCase()],
    );

    if (starterRows.length === 0) {
      throw new Error("Starter Pokemon not found in database.");
    }

    const starterPokemon = starterRows[0];

    // Give starter to character
    await db.execute(
      "INSERT INTO character_pokemon (characterId, pokemonId) VALUES (?, ?)",
      [characterId, starterPokemon.id],
    );

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
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT p.*
      FROM pokemon p
      JOIN character_pokemon cp ON cp.pokemonId = p.id
      WHERE cp.characterId = ?`,
      [characterId],
    );

    return rows;
  }

  // ---------------------------------------------------------
  // GET ALL CHARACTERS
  // ---------------------------------------------------------
  static async getAllCharacters() {
    const [rows] = await db.execute<RowDataPacket[]>(
      `
      SELECT
        c.id,
        c.firstname,
        c.lastname,
        c.age,
        c.gender,
        COUNT(d.id) AS deckCount
      FROM \`character\` c
      LEFT JOIN deck d ON d.characterId = c.id
      GROUP BY c.id
    `,
    );

    return rows;
  }

  // ---------------------------------------------------------
  // INTERNAL: ENSURE STARTER POKEMON EXIST
  // ---------------------------------------------------------
  private static async ensureStarterPokemonExist() {
    const starterIds = [1, 4, 7];

    for (const id of starterIds) {
      const [existing] = await db.execute<RowDataPacket[]>(
        "SELECT id FROM pokemon WHERE id = ? LIMIT 1",
        [id],
      );

      if (existing.length > 0) continue; // Already in DB

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      const name = data.name;
      const type = data.types[0].type.name;
      const hp = data.stats[0].base_stat;
      const attack = data.stats[1].base_stat;
      const defence = data.stats[2].base_stat;
      const spriteUrl = data.sprites.front_default;
      const spriteOfficialUrl =
        data.sprites.other["official-artwork"].front_default;

      await db.execute(
        `INSERT INTO pokemon (id, name, types, hp, attack, defence, spriteUrl, spriteOfficialUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, type, hp, attack, defence, spriteUrl, spriteOfficialUrl],
      );

      console.log(`Inserted starter Pokémon: ${name}`);
    }
  }
}
