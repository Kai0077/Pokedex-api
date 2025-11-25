import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";

import characterRoutes from "./routes/character-routes.js";
import pokemonRoutes from "./routes/pokemon-routes.js";
import deckRoutes from "./routes/deck-routes.js";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/character", characterRoutes);
app.route("/api/pokemon", pokemonRoutes);
app.route("/api/deck", deckRoutes);

serve({ fetch: app.fetch, port }, (info) =>
  console.log(`Server running: http://localhost:${info.port}`),
);
