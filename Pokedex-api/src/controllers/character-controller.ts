import type { Context } from "hono";
import { CharacterService } from "../services/character-service.js";

export const createCharacter = async (character: Context) => {
  try {
    const body = await character.req.json();
    const result = await CharacterService.createCharacter(body);
    return character.json(result, 201);
  } catch (error: any) {
    return character.json({ error: error.message }, 400);
  }
};

export const getCharacterPokemon = async (c: Context) => {
  const characterId = Number(c.req.param("id"));

  if (isNaN(characterId) || characterId < 1) {
    return c.json({ error: "Invalid character ID" }, 400);
  }

  try {
    const pokemon = await CharacterService.getCharacterPokemon(characterId);
    return c.json(pokemon, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Character not found.") {
      return c.json({ error: error.message }, 404);
    }
    throw error;
  }
};

export const getAllCharacters = async (c: Context) => {
  try {
    const characters = await CharacterService.getAllCharacters();
    return c.json(characters, 200);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
};

export const getAllCharacterDecks = async (c: Context) => {
  const characterId = Number(c.req.param("id"));

  if (isNaN(characterId) || characterId < 1) {
    return c.json({ error: "Invalid character ID" }, 400);
  }

  try {
    const decks = await CharacterService.getDecksForCharacter(characterId);
    return c.json(decks, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Character not found.") {
      return c.json({ error: error.message }, 404);
    }

    throw error;
  }
};
