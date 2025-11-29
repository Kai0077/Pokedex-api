export type TGender = "male" | "female" | "other";

export class Character {
  #id: number;
  #firstName!: string;
  #lastName!: string;
  #age!: number;
  #gender!: TGender;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    age: number,
    gender: TGender,
  ) {
    this.#id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
  }

  get id(): number {
    return this.#id;
  }

  get firstName(): string {
    return this.#firstName;
  }

  get lastName(): string {
    return this.#lastName;
  }

  get age(): number {
    return this.#age;
  }

  get gender(): TGender {
    return this.#gender;
  }

  set firstName(value: string) {
    if (value.length < 3 || value.length > 45) {
      throw new Error("First name must be 3–45 characters");
    }
    this.#firstName = value;
  }

  set lastName(value: string) {
    if (value.length < 3 || value.length > 45) {
      throw new Error("Last name must be 3–45 characters");
    }
    this.#lastName = value;
  }

  set age(value: number) {
    const isValidAge = value >= 13 && value <= 110;
    if (!isValidAge) {
      throw new Error("You must be between 13 and 110");
    }
    this.#age = value;
  }

  set gender(value: TGender) {
    this.#gender = value;
  }
}
