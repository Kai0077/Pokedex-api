-- ==========================================================
-- 24 POKEMON
-- ==========================================================
INSERT INTO pokemon (id, name, types, hp, attack, defence, spriteUrl, spriteOfficialUrl) VALUES
 (1,'bulbasaur','grass',45,49,49,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'),
 (2,'ivysaur','grass',60,62,63,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png'),
 (3,'venusaur','grass',80,82,83,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png'),
 (4,'charmander','fire',39,52,43,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'),
 (5,'charmeleon','fire',58,64,58,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png'),
 (6,'charizard','fire',78,84,78,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'),
 (7,'squirtle','water',44,48,65,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'),
 (8,'wartortle','water',59,63,80,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png'),
 (9,'blastoise','water',79,83,100,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png'),
 (10,'caterpie','bug',45,30,35,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png'),
 (11,'metapod','bug',50,20,55,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png'),
 (12,'butterfree','bug',60,45,50,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png'),
 (13,'weedle','bug',40,35,30,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png'),
 (14,'kakuna','bug',45,25,50,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png'),
 (15,'beedrill','bug',65,90,40,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png'),
 (16,'pidgey','flying',40,45,40,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png'),
 (17,'pidgeotto','flying',63,60,55,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png'),
 (18,'pidgeot','flying',83,80,75,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png'),
 (19,'rattata','normal',30,56,35,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png'),
 (20,'raticate','normal',55,81,60,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png'),
 (133,'eevee','normal',55,55,50,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'),
 (134,'vaporeon','water',130,65,60,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png'),
 (135,'jolteon','electric',65,65,60,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png'),
 (136,'flareon','fire',65,130,60,'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png');



-- ==========================================================
-- 5 CHARACTERS
-- ==========================================================
INSERT INTO `character` (firstname, lastname, age, gender) VALUES
 ('Kai','Larsen',21,'male'),
 ('Mia','Andersen',19,'female'),
 ('Lucas','Nielsen',23,'male'),
 ('Emma','Poulsen',20,'female'),
 ('Oliver','Hansen',24,'male');



-- ==========================================================
-- 15 DECKS
-- ==========================================================
INSERT INTO deck (id, name, characterId) VALUES
 (1,'Starter Squad',1),
 (2,'Forest Edge',1),
 (3,'Flame Team',1),
 (4,'Ocean Drive',2),
 (5,'Bug Catchers',2),
 (6,'Sky Riders',2),
 (7,'Thunder Crew',3),
 (8,'Stone Guard',3),
 (9,'Mystic Path',3),
 (10,'Leaf Dancers',4),
 (11,'Shadow Wing',4),
 (12,'Bright Sparks',4),
 (13,'Aqua Force',5),
 (14,'Iron Wall',5),
 (15,'Firestorm',5);



-- ==========================================================
-- CHARACTER_POKEMON
-- ==========================================================
INSERT INTO character_pokemon (characterId, pokemonId) VALUES
 (1,7),(1,2),(1,20),(1,3),(1,12),(1,8),(1,11),(1,10),(1,6),(1,19),(1,5),
 (2,4),(2,12),(2,14),(2,8),(2,6),(2,9),(2,16),(2,17),(2,15),(2,18),
 (3,1),(3,12),(3,2),(3,9),(3,7),(3,20),(3,13),(3,10),(3,19),(3,16),(3,8),
 (4,4),(4,17),(4,9),(4,14),(4,5),(4,8),(4,10),(4,11),(4,3),(4,19),
 (5,7),(5,20),(5,18),(5,16),(5,11),(5,1),(5,17),(5,12),(5,10),(5,14),(5,4);



-- ==========================================================
-- POKEMON_DECK
-- ==========================================================
INSERT INTO pokemon_deck (deckId, pokemonId) VALUES
 (1,19),(1,2),(1,8),(1,12),(1,20),
 (2,19),(2,7),(2,20),(2,11),(2,3),
 (3,5),(3,12),(3,2),(3,11),(3,7),

 (4,12),(4,18),(4,4),(4,6),(4,17),
 (5,8),(5,17),(5,6),(5,12),(5,14),
 (6,15),(6,9),(6,14),(6,16),(6,12),

 (7,2),(7,7),(7,20),(7,16),(7,1),
 (8,12),(8,13),(8,19),(8,20),(8,16),
 (9,12),(9,19),(9,20),(9,10),(9,2),

 (10,11),(10,14),(10,5),(10,4),(10,17),
 (11,19),(11,4),(11,10),(11,3),(11,18),
 (12,10),(12,9),(12,14),(12,11),(12,17),

 (13,11),(13,7),(13,20),(13,17),(13,4),
 (14,20),(14,12),(14,11),(14,1),(14,17),
 (15,7),(15,10),(15,12),(15,1),(15,17);
