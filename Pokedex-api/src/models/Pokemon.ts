export type TType =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "stellar"
  | "unknown";

export class Pokemon {
  #id: number;
  #name: string;
  #types: TType;
  #hp: number;
  #attack: number;
  #defence: number;
  #spriteUrl: string;
  #spriteOfficialUrl: string;

  constructor(
    id: number,
    name: string,
    types: TType,
    hp: number,
    attack: number,
    defence: number,
    spriteUrl: string,
    spriteOfficialUrl: string,
  ) {
    this.#id = id;
    this.#name = name;
    this.#types = types;
    this.#hp = hp;
    this.#attack = attack;
    this.#defence = defence;
    this.#spriteUrl = spriteUrl;
    this.#spriteOfficialUrl = spriteOfficialUrl;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get types(): TType {
    return this.#types;
  }

  get hp(): number {
    return this.#hp;
  }

  get attack(): number {
    return this.#attack;
  }

  get defence(): number {
    return this.#defence;
  }

  get spriteUrl(): string {
    return this.#spriteUrl;
  }

  get spriteOfficialUrl(): string {
    return this.#spriteOfficialUrl;
  }

  set name(value: string) {
    if (value.length === 0) {
      throw new Error("Pokemon name cannot be empty");
    }
    this.#name = value;
  }

  set types(value: TType) {
    this.#types = value;
  }

  set hp(value: number) {
    if (value <= 0) {
      throw new Error("HP cannot be below 1");
    }
    this.#hp = value;
  }

  set attack(value: number) {
    if (value <= 0) {
      throw new Error("attack cannot be below 1");
    }
    this.#attack = value;
  }

  set defence(value: number) {
    if (value <= 0) {
      throw new Error("defence cannot be below 1");
    }
    this.#defence = value;
  }

  set spriteUrl(value: string) {
    if (!Pokemon.isValidUrl(value)) {
      throw new Error("Invalid sprite URL");
    }
    this.#spriteUrl = value;
  }

  set spriteOfficialUrl(value: string) {
    if (!Pokemon.isValidUrl(value)) {
      throw new Error("Invalid official sprite URL");
    }
    this.#spriteOfficialUrl = value;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
