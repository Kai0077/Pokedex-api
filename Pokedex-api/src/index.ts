import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import pokemonRoutes from "./routes/pokemon-routes.js";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

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
