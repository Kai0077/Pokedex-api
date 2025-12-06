import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";

import characterRoutes from "./routes/character-routes.js";
import pokemonRoutes from "./routes/pokemon-routes.js";
import deckRoutes from "./routes/deck-routes.js";
import { cors } from "hono/cors";

import { verifySeedData } from "./db/verify-seed-data.js";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

const allowedOrigin = process.env.FRONTEND_BASE_URL ?? "*";

app.use(
  "/*",
  cors({
    origin: allowedOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/character", characterRoutes);
app.route("/api/pokemon", pokemonRoutes);
app.route("/api/deck", deckRoutes);

await verifySeedData();

serve({ fetch: app.fetch, port }, (info) =>
  process.stdout.write(`Server is running on: http://localhost:${info.port}`),
);
