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

  if (isNaN(characterId)) {
    return c.json({ error: "Invalid character ID" }, 400);
  }

  const pokemon = await CharacterService.getCharacterPokemon(characterId);

  return c.json(pokemon, 200);
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
  try {
    const characterId = Number(c.req.param("id"));
    const decks = await CharacterService.getDecksForCharacter(characterId);
    return c.json(decks, 200);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400,
    );
  }
};
