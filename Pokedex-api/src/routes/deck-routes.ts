import { Hono } from "hono";
import { createDeck } from "../controllers/deck-controller.js";

const deckRoutes = new Hono();

deckRoutes.post("/:id", createDeck);

export default deckRoutes;
