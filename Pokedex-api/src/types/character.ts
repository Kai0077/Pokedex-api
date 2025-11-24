export type CreateCharacterDTO = {
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | "other";
  starter: "Bulbasaur" | "Charmander" | "Squirtle";
};
