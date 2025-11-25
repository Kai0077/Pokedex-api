import { Hono } from "hono";
import { PokemonController } from "../controllers/pokemon-controller.js";
import {
  createCharacter,
  getAllCharacterDecks,
  getAllCharacters,
  getCharacterPokemon,
} from "../controllers/character-controller.js";

const characterRoutes = new Hono();
const pokemonController = new PokemonController();

characterRoutes.post("/", createCharacter);

characterRoutes.post("/:id/pokemon", (characterId) =>
  pokemonController.seedDatabase(characterId),
);

characterRoutes.get("/:id", (characterId) => getCharacterPokemon(characterId));

characterRoutes.get("/", getAllCharacters);

characterRoutes.get("/:id/decks", getAllCharacterDecks);

export default characterRoutes;
