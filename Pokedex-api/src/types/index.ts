export interface PokemonData {
  id: number;
  name: string;
  types: string;
  hp: number;
  attack: number;
  defence: number;
  spriteUrl: string;
  spriteOfficialUrl: string;
}

export interface PokeApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name:
        | "hp"
        | "attack"
        | "defense"
        | "special-attack"
        | "special-defense"
        | "speed";
    };
  }>;
}
