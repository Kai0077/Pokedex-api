import { Hono } from "hono";
import {
  createDeck,
  deleteDeck,
  updateDeck,
} from "../controllers/deck-controller.js";

const deckRoutes = new Hono();

deckRoutes.post("/:id", createDeck);

deckRoutes.put("/:deckId", updateDeck);

deckRoutes.delete("/:deckId", deleteDeck);

export default deckRoutes;
