import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterService } from "../../../../src/services/character-service.js";
import * as repo from "../../../../src/repositories/character-repository.js";

vi.mock("../../../../src/repositories/character-repository.js");

// ============================
// CONSTANTS
// ============================

const CHARACTER_ID = 5;

const DECK_1_ID = 1;
const DECK_1_NAME = "Team Alpha";

const DECK_2_ID = 2;
const DECK_2_NAME = "Fire Squad";

const BULBA_ID = 1;
const BULBA_NAME = "bulbasaur";
const BULBA_TYPE = "grass";
const BULBA_HP = 45;
const BULBA_ATTACK = 49;
const BULBA_DEFENCE = 49;
const BULBA_SPRITE_URL = "https://example.com/bulbasaur.png";
const BULBA_SPRITE_OFFICIAL_URL = "https://example.com/bulbasaur-official.png";

const CHARMANDER_ID = 4;
const CHARMANDER_NAME = "charmander";
const CHARMANDER_TYPE = "fire";
const CHARMANDER_HP = 39;
const CHARMANDER_ATTACK = 52;
const CHARMANDER_DEFENCE = 43;
const CHARMANDER_SPRITE_URL = "https://example.com/charmander.png";
const CHARMANDER_SPRITE_OFFICIAL_URL =
  "https://example.com/charmander-official.png";

// rows coming from repository (no rank here)
const MOCK_DECK_ROWS = [
  {
    deckId: DECK_1_ID,
    name: DECK_1_NAME,
    pokemon: [
      {
        id: BULBA_ID,
        name: BULBA_NAME,
        types: BULBA_TYPE,
        hp: BULBA_HP,
        attack: BULBA_ATTACK,
        defence: BULBA_DEFENCE,
        spriteUrl: BULBA_SPRITE_URL,
        spriteOfficialUrl: BULBA_SPRITE_OFFICIAL_URL,
      },
    ],
  },
  {
    deckId: DECK_2_ID,
    name: DECK_2_NAME,
    pokemon: [
      {
        id: CHARMANDER_ID,
        name: CHARMANDER_NAME,
        types: CHARMANDER_TYPE,
        hp: CHARMANDER_HP,
        attack: CHARMANDER_ATTACK,
        defence: CHARMANDER_DEFENCE,
        spriteUrl: CHARMANDER_SPRITE_URL,
        spriteOfficialUrl: CHARMANDER_SPRITE_OFFICIAL_URL,
      },
    ],
  },
];

// For our single-pokémon decks, totals are small -> rank "D"
const EXPECTED_DECKS = [
  {
    deckId: DECK_1_ID,
    name: DECK_1_NAME,
    rank: "D",
    pokemon: MOCK_DECK_ROWS[0].pokemon,
  },
  {
    deckId: DECK_2_ID,
    name: DECK_2_NAME,
    rank: "D",
    pokemon: MOCK_DECK_ROWS[1].pokemon,
  },
];

const ERROR_CHARACTER_NOT_FOUND = /character not found/i;

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================
// TESTS
// ============================

describe("CharacterService.getDecksForCharacter", () => {
  it("throws if character does not exist", async () => {
    vi.spyOn(repo, "characterExists").mockResolvedValue(false);

    const getDecksSpy = vi.spyOn(repo, "getDecksForCharacterRows");

    await expect(
      CharacterService.getDecksForCharacter(CHARACTER_ID),
    ).rejects.toThrow(ERROR_CHARACTER_NOT_FOUND);

    expect(repo.characterExists).toHaveBeenCalledWith(CHARACTER_ID);
    expect(getDecksSpy).not.toHaveBeenCalled();
  });

  it("returns decks for character when character exists (with rank)", async () => {
    vi.spyOn(repo, "characterExists").mockResolvedValue(true);

    const getDecksSpy = vi
      .spyOn(repo, "getDecksForCharacterRows")
      .mockResolvedValue(MOCK_DECK_ROWS as any);

    const result = await CharacterService.getDecksForCharacter(CHARACTER_ID);

    expect(repo.characterExists).toHaveBeenCalledWith(CHARACTER_ID);
    expect(getDecksSpy).toHaveBeenCalledWith(CHARACTER_ID);

    // Now service adds 'rank', so we compare with EXPECTED_DECKS
    expect(result).toEqual(EXPECTED_DECKS);
  });
});
