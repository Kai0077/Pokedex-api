CREATE DATABASE IF NOT EXISTS pokedex
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pokedex;

-- ==========================================================
--  POKEMON
-- ==========================================================
CREATE TABLE IF NOT EXISTS pokemon (
  id                 INT UNSIGNED NOT NULL,
  name               VARCHAR(100)  NOT NULL,
  types              ENUM(
                        'normal', 'fighting', 'flying', 'poison', 'ground',
                        'rock', 'bug', 'ghost', 'steel', 'fire', 'water',
                        'grass', 'electric', 'psychic', 'ice', 'dragon',
                        'dark', 'fairy', 'stellar', 'unknown'
                      ) NOT NULL,
  hp                 SMALLINT UNSIGNED NOT NULL,
  attack             SMALLINT UNSIGNED NOT NULL,
  defence            SMALLINT UNSIGNED NOT NULL,
  spriteUrl          VARCHAR(255)  NOT NULL,
  spriteOfficialUrl  VARCHAR(255)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pokemon_name (name)
) ENGINE=InnoDB;

-- ==========================================================
--  CHARACTER
-- ==========================================================
CREATE TABLE IF NOT EXISTS `character` (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  firstname     VARCHAR(45) NOT NULL,
  lastname      VARCHAR(45) NOT NULL,
  age           TINYINT UNSIGNED NOT NULL,
  gender        ENUM('male', 'female', 'other') NOT NULL,
  lastGatherAt  DATETIME NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ==========================================================
--  DECK
-- ==========================================================
CREATE TABLE IF NOT EXISTS deck (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(45) NOT NULL,
  characterId INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_deck_character (characterId),
  CONSTRAINT fk_deck_character
    FOREIGN KEY (characterId)
    REFERENCES `character`(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
--  CHARACTER_POKEMON
-- ==========================================================
CREATE TABLE IF NOT EXISTS character_pokemon (
  characterId INT UNSIGNED NOT NULL,
  pokemonId   INT UNSIGNED NOT NULL,
  PRIMARY KEY (characterId, pokemonId),
  KEY idx_cp_pokemon (pokemonId),
  CONSTRAINT fk_cp_character
    FOREIGN KEY (characterId)
    REFERENCES `character`(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_cp_pokemon
    FOREIGN KEY (pokemonId)
    REFERENCES pokemon(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
--  POKEMON_DECK
-- ==========================================================
CREATE TABLE IF NOT EXISTS pokemon_deck (
  deckId    INT UNSIGNED NOT NULL,
  pokemonId INT UNSIGNED NOT NULL,
  PRIMARY KEY (deckId, pokemonId),
  KEY idx_pd_pokemon (pokemonId),
  CONSTRAINT fk_pd_deck
    FOREIGN KEY (deckId)
    REFERENCES deck(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_pd_pokemon
    FOREIGN KEY (pokemonId)
    REFERENCES pokemon(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;