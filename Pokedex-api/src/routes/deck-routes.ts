import { Hono } from "hono";
import { createDeck, updateDeck } from "../controllers/deck-controller.js";

const deckRoutes = new Hono();

deckRoutes.post("/:id", createDeck);

deckRoutes.put("/:deckId", updateDeck);

export default deckRoutes;
