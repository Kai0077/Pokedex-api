import type { CreateCharacterDTO } from "../types/character.js";
import type { TGender } from "../models/Character.js";

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 45;
const MIN_AGE = 13;
const MAX_AGE = 110;

const VALID_GENDERS: TGender[] = ["male", "female", "other"];
const VALID_STARTERS = ["Bulbasaur", "Charmander", "Squirtle"] as const;
export type TStarter = (typeof VALID_STARTERS)[number];

export function validateFirstName(firstName: string): string {
  if (!firstName || firstName.trim().length === 0) {
    throw new Error("First name must not be empty");
  }

  const trimmed = firstName.trim();
  const len = trimmed.length;

  if (len < MIN_NAME_LENGTH) {
    throw new Error("First name must be at least 3 characters");
  }
  if (len > MAX_NAME_LENGTH) {
    throw new Error("First name must be at most 45 characters");
  }

  return trimmed;
}

export function validateLastName(lastName: string): string {
  if (!lastName || lastName.trim().length === 0) {
    throw new Error("Last name must not be empty");
  }

  const trimmed = lastName.trim();
  const len = trimmed.length;

  if (len < MIN_NAME_LENGTH) {
    throw new Error("Last name must be at least 3 characters");
  }
  if (len > MAX_NAME_LENGTH) {
    throw new Error("Last name must be at most 45 characters");
  }

  return trimmed;
}

export function validateAge(age: unknown): number {
  if (age === null || age === undefined) {
    throw new Error("Age is required");
  }

  const numericAge = Number(age);
  if (Number.isNaN(numericAge)) {
    throw new Error("Age must be a number");
  }

  if (numericAge < MIN_AGE || numericAge > MAX_AGE) {
    throw new Error(`Age must be between ${MIN_AGE} and ${MAX_AGE}`);
  }

  return numericAge;
}

export function validateGender(gender: string): TGender {
  if (!gender) {
    throw new Error("Gender is required");
  }

  const normalised = gender.toLowerCase() as TGender;

  if (!VALID_GENDERS.includes(normalised)) {
    throw new Error("Invalid gender");
  }

  return normalised;
}

export function validateStarter(starter: string): TStarter {
  if (!starter) {
    throw new Error("Starter Pokemon is required");
  }

  if (!VALID_STARTERS.includes(starter as TStarter)) {
    throw new Error("Invalid starter Pokemon");
  }

  return starter as TStarter;
}

/**
 * Create Character DTO validation
 */
export function validateCreateCharacterDTO(data: CreateCharacterDTO): {
  firstName: string;
  lastName: string;
  age: number;
  gender: TGender;
  starter: TStarter;
} {
  const firstName = validateFirstName(data.firstName);
  const lastName = validateLastName(data.lastName);
  const age = validateAge(data.age);
  const gender = validateGender(data.gender);
  const starter = validateStarter(data.starter);

  return { firstName, lastName, age, gender, starter };
}
