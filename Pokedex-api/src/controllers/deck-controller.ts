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

export const updateDeck = async (c: Context) => {
  try {
    const deckId = Number(c.req.param("deckId"));
    const body = await c.req.json();

    const result = await DeckService.updateDeck(deckId, body);

    return c.json(result, 200);
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
};

export const deleteDeck = async (c: Context) => {
  try {
    const deckId = Number(c.req.param("deckId"));

    const result = await DeckService.deleteDeck(deckId);

    return c.json(result, 200);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400,
    );
  }
};
