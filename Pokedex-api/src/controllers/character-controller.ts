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
