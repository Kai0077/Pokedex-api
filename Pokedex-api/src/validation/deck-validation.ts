import type { CreateDeckDTO } from "../types/deck.js";

const REQUIRED_CARD_COUNT = 5;
const MIN_NAME_LENGTH = 5;
const MAX_NAME_LENGTH = 45;

export function validateDeckName(name: unknown): string {
  if (typeof name !== "string") {
    throw new Error("Deck name is required.");
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    throw new Error("Deck name cannot be empty or null");
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    throw new Error("Deck name is too short");
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new Error("Deck name is too long");
  }

  return trimmed;
}

export function validatePokemonIds(pokemonIds: unknown): number[] {
  if (!Array.isArray(pokemonIds)) {
    throw new Error("A deck must contain exactly 5 Pokemon.");
  }

  const normalized = pokemonIds.map((id) => Number(id));

  if (normalized.length !== REQUIRED_CARD_COUNT) {
    throw new Error("A deck must contain exactly 5 Pokemon.");
  }

  if (normalized.some((n) => Number.isNaN(n))) {
    throw new Error("Pokemon IDs must be numbers.");
  }

  const uniqueCount = new Set(normalized).size;
  if (uniqueCount !== normalized.length) {
    throw new Error("Deck cannot contain duplicate Pokemon.");
  }

  return normalized;
}

export function validateCreateDeckDTO(data: CreateDeckDTO): {
  name: string;
  pokemonIds: number[];
} {
  const name = validateDeckName((data as any).name);
  const pokemonIds = validatePokemonIds((data as any).pokemonIds);
  return { name, pokemonIds };
}

export function validateUpdateDeckDTO(data: {
  name: unknown;
  pokemonIds: unknown;
}): { name: string; pokemonIds: number[] } {
  const name = validateDeckName(data.name);
  const pokemonIds = validatePokemonIds(data.pokemonIds);
  return { name, pokemonIds };
}
