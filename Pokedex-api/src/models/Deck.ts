export class Deck {
  #id: number;
  #name!: string;
  #characterId: number;

  constructor(id: number, name: string, characterId: number) {
    this.#id = id;
    this.#characterId = characterId;
    this.name = name;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get characterId(): number {
    return this.#characterId;
  }

  set name(value: string) {
    if (value.length === 0) {
      throw new Error("Deck name cannot be empty");
    }
    this.#name = value;
  }
}
