import type { Context } from "hono";
import { DeckService } from "../services/deck-service.js";

export const createDeck = async (c: Context) => {
  try {
    const characterId = Number(c.req.param("id"));
    if (isNaN(characterId)) {
      return c.json({ error: "Invalid character ID" }, 400);
    }

    const body = await c.req.json();

    const deck = await DeckService.createDeck(characterId, body);

    return c.json(
      {
        message: "Deck created successfully",
        deck,
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
};
