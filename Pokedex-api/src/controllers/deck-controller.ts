import type { Context } from "hono";
import { DeckService } from "../services/deck-service.js";

export const createDeck = async (c: Context) => {
  const characterId = Number(c.req.param("id"));

  if (isNaN(characterId) || characterId < 1) {
    return c.json({ error: "Invalid character ID" }, 400);
  }

  try {
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
    if (error instanceof Error && error.message === "Character not found.") {
      return c.json({ error: error.message }, 404);
    }
    return c.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
};

export const updateDeck = async (c: Context) => {
  const deckId = Number(c.req.param("deckId"));

  if (isNaN(deckId) || deckId < 1) {
    return c.json({ error: "Invalid deck ID" }, 400);
  }

  try {
    const body = await c.req.json();
    const result = await DeckService.updateDeck(deckId, body);

    return c.json(result, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Deck not found.") {
      return c.json({ error: error.message }, 404);
    }

    return c.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
};

export const deleteDeck = async (c: Context) => {
  const deckId = Number(c.req.param("deckId"));

  if (isNaN(deckId) || deckId < 1) {
    return c.json({ error: "Invalid deck ID" }, 400);
  }
  try {
    const result = await DeckService.deleteDeck(deckId);
    return c.json(result, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Deck not found.") {
      return c.json({ error: error.message }, 404);
    }

    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400,
    );
  }
};
