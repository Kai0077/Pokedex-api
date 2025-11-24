import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createCharacter } from "./controllers/character-controller.js";
import "dotenv/config";
import pokemonRoutes from "./routes/pokemon-routes.js";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/character", createCharacter);
// Mount the pokemon routes under /api/pokemon
// Any route defined in pokemonRoutes will inherit this prefix
app.route("/api/pokemon", pokemonRoutes);

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(
      `To seed DB, visit: http://localhost:${info.port}/api/pokemon/seed`,
    );
  },
);
