import { Hono } from "hono";
import { PokemonController } from "../controllers/pokemon-controller.js";

const pokemonRoutes = new Hono();
const pokemonController = new PokemonController();

// Define the route: GET /seed
pokemonRoutes.get("/seed", pokemonController.seedDatabase);

export default pokemonRoutes;
