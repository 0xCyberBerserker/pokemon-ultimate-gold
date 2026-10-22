# Ultimate Gold item acquisition index

## English

**Reference update:** Star Piece and Nugget now have 14 HGSS acquisition references in their item pages, sourced from [WikiDex: Star Piece](https://www.wikidex.net/wiki/Trozo_estrella) and [WikiDex: Nugget](https://www.wikidex.net/wiki/Pepita). All remain explicitly marked as base-game references, not verified pickups in this ROM. Root separately compared the exact clean-USA and Alpha 2 personal records: Staryu retains held-item slot 2 = Star Piece, and Grimer/Muk retain slot 2 = Nugget, with byte-identical records. This proves those data fields only, not encounters, maps or probabilities. Private comparison report SHA-256: `688579a31bd81eef67dede4478bf01029c5a16f045acaaeff289d4d43f47244a`.

### Batch 3 / Lote 3: Heart Scale, Everstone, Leftovers

These eight bilingual rows are HGSS references from WikiDex. Each JSON row is `documented_base_game`; none verifies target-ROM acquisition.

| Item / objeto | Location / ubicación | Method / método | Source / fuente |
|---|---|---|---|
| Heart Scale / Escama Corazón | Wild Luvdisc / Luvdisc salvaje | Held item; 50% HGSS reference. / Objeto equipado; referencia HGSS del 50 %. | [WikiDex](https://www.wikidex.net/wiki/Escama_Coraz%C3%B3n) |
| Heart Scale / Escama Corazón | Pokéathlon Dome Athlete Shop / Tienda de Atletas del Pokéathlon | 1,000 points on Wednesday or Sunday. / 1.000 puntos los miércoles o domingos. | [WikiDex](https://www.wikidex.net/wiki/Escama_Coraz%C3%B3n) |
| Heart Scale / Escama Corazón | Route 32, rock near bridge / Ruta 32, roca junto al puente | Hidden item; requires Surf. / Objeto oculto; requiere Surf. | [WikiDex](https://www.wikidex.net/wiki/Escama_Coraz%C3%B3n) |
| Heart Scale / Escama Corazón | Ship at Vermilion City / Barco de Ciudad Carmín | Hidden item aboard. / Objeto oculto a bordo. | [WikiDex](https://www.wikidex.net/wiki/Escama_Coraz%C3%B3n) |
| Everstone / Piedra Eterna | Wild Geodude / Graveler / Geodude / Graveler salvajes | Held item; 5% HGSS reference. / Objeto equipado; referencia HGSS del 5 %. | [WikiDex](https://www.wikidex.net/wiki/Piedra_eterna) |
| Everstone / Piedra Eterna | Professor Elm, New Bark Town / Profesor Elm, Pueblo Primavera | Gift after showing him the hatched Togepi. / Regalo al mostrarle el Togepi recién nacido. | [WikiDex](https://www.wikidex.net/wiki/Piedra_eterna) |
| Everstone / Piedra Eterna | Bill's grandfather, Route 25 (HeartGold) / Abuelo de Bill, Ruta 25 (HeartGold) | Gift for showing Jigglypuff; HeartGold only. / Regalo por mostrarle un Jigglypuff; solo HeartGold. | [WikiDex](https://www.wikidex.net/wiki/Piedra_eterna) |
| Leftovers / Restos | Wild Snorlax / Snorlax salvaje | Held item; 100% HGSS reference. / Objeto equipado; referencia HGSS del 100 %. | [WikiDex](https://www.wikidex.net/wiki/Restos) |

A separate static personal-data comparison (SHA-256 `1302578e74f718a4040574a6932e872a9e4fea93f26cdebb3716539dfce62c29`) compares clean HGSS USA (`65f02a…760105`) with Alpha 2 (`24ea9b…2725f6`), personal NARC `a/0/0/2`, held-item fields at record offsets `0x0C` and `0x0E`. Geodude 74 and Graveler 75 are `(0, 229)` in both; Snorlax 143 is `(234, 234)` in both. Luvdisc 370 differs: `(93, 0)` in the base and `(93, 93)` in Alpha 2. This is static table data only; it does not prove encounters or runtime probabilities. Do not transfer WikiDex's retail 50% Luvdisc rate to Alpha 2.

This index covers TM01–TM92, HM01–HM08, and 46 additional named items in Drayano's cached Important Item Locations guide, for the exact target SHA-256 in `item-locations.json`. Additional records include evolutionary items, key items, fossils, and other named items. Category IDs are 1 TM, 2 HM, 3 evolution item, 4 key item, 5 fossil, and 6 other item. It separates `verified_target` facts read from or tested against that ROM from `documented_upstream` notes inherited from the guide. A documented note does not prove that the exact Plus target retained the same placement.

TM/HM-to-move IDs are verified in the target ROM: the 100-entry `sTMHMMoves` sequence matches uniquely in ARM9 at file offset `0x1000CC`. The JSON records each move ID and English/Spanish name; this does not verify item acquisition locations.

The source transcription records an acquisition source for 46 TMs, plus three removal-only notices that do not give a replacement source. For the other 43 TMs, Drayano's document says “No change” but does not name the original HeartGold location; those entries explicitly direct players to a HeartGold location guide. HM locations and acquisition methods remain unverified and are omitted rather than guessed. The 46 additional items preserve every listed method from the guide; one Old Amber entry deliberately records that no exact spot was supplied. Shops are listed only when the source says an item is sold; a claim of no location change is not a claim that stock changed.

The source inventory identifies Drayano's author thread and official Drive folder, but does not include the original PDF locally. The notes are transcribed from a [secondary text mirror](https://seatgem.com/2018/09/pokemon-sacred-gold-storm-silver-important-item-locations.html), with the author thread linked in each JSON record as provenance. Do not treat this transcription as independent target-ROM verification.

### Other named items

| Item | Acquisition in the guide |
|---|---|
| Sun Stone | Olivine City: daily gift from a man during daylight. |
| Moon Stone | Olivine City: daily gift from a man at night. |
| Fire Stone | Gift from the Sprout Tower head sage; also sold in Goldenrod City. |
| Thunderstone | Gift from the Sprout Tower head sage; also sold in Goldenrod City. |
| Water Stone | Gift from the Sprout Tower head sage; also sold in Goldenrod City. |
| Leaf Stone | Sold in Goldenrod City. |
| Root Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Claw Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Helix Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Dome Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Old Amber | The guide says it must be found normally but gives no specific location. |
| Armor Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Skull Fossil | Given by a man at Goldenrod Archaeological Center; fossils can be revived in Goldenrod. |
| Shiny Stone | At the Battle Frontier entrance, accessible after the Mineral Badge; also sold in Blackthorn City. |
| Dusk Stone | Second room of Mt. Mortar; also sold in Blackthorn City. |
| Dawn Stone | Item ball on Route 35; also sold in Blackthorn City. |
| Oval Stone | Item ball on Route 34. |
| Exp. Share | Given by a Scientist at Violet City Pokémon Center. |
| King's Rock | Given by a man at Mahogany Town Pokémon Center. |
| DeepSeaTooth | Hidden on Route 47 beach near the Cliff Cave exit. |
| DeepSeaScale | Hidden on Route 47 beach near the Embedded Tower entrance. |
| Lucky Egg | Given by Mr. Pokémon for the Red Scale; also a reward for catching 21 Unown from a man in Ruins of Alph. |
| Metal Coat | Given by a man in a house in Olivine City. |
| Dragon Scale | Gift from a person at Blackthorn City Pokémon Center. |
| Light Ball | Given by a woman at the Goldenrod Magnet Train station when shown the matching Pokémon. |
| Up-Grade | Reward for catching 14 Unown in Ruins of Alph; also given by a man at Safari Zone Pokémon Center after the Rocket invasion ends. |
| Thick Club | Given by a woman at the Goldenrod Magnet Train station when Cubone or Marowak is in the party. |
| Stick | Given by a woman at the Goldenrod Magnet Train station when shown the matching Pokémon. |
| Protector | First room of Victory Road. |
| Electirizer | Route 44. |
| Magmarizer | Top floor of Ice Path. |
| Dubious Disc | Moved to Team Rocket's Hideout. |
| Reaper Cloth | Dark Cave, entering from the Blackthorn side. |
| Razor Claw | Gift from a man in a house in Cianwood City. |
| Razor Fang | Gift from a man in a house in Cianwood City. |
| Woodland Ore | Gift from the Sprout Tower head sage; item ball in Ilex Forest. |
| Serenade Orb | Gift from the Sprout Tower head sage; item ball behind the LIGHT wall in Ruins of Alph. |
| Aubade Orb | Gift from the Sprout Tower head sage; item ball on Route 42. |
| Chilled Ore | Gift from the Sprout Tower head sage; item ball in Ice Path. |
| Old Rod | Guide Gent in Cherrygrove City. |
| Good Rod | Fisherman in Olivine City diner. |
| Super Rod | Fisherman in Blackthorn City. |
| Bicycle | Your mother at the start of the game. |
| Voltaic Ore | Route 42 by the Apricorn trees; also past the whirlpool on Route 27. |
| Covenant Orb | Automatically received after completing any in-game trade. |
| GB Sounds | Your mother at the start of the game. |
| Fossils | One free fossil of each listed kind is available from the man in Goldenrod, except Aerodactyl; Old Amber must be found normally. Fossils can be revived in Goldenrod. |
| Evolution items and other items | The source mirror includes the exact methods above. It does not name the matching Pokémon for every conditional gift, so the index preserves only examples stated in the guide. |

Regenerate against the pinned target and local provenance record:

```text
python3 tools/build_item_locations.py --target /path/to/Sacred-Gold-Plus-Drayano-QoL-fix1.nds --reference-dir /path/to/night-sprint/sources/drayano-docs
```

## Español

**Actualización de referencias:** las fichas de Star Piece y Nugget incorporan 14 referencias de adquisición en HGSS de [WikiDex: Trozo Estrella](https://www.wikidex.net/wiki/Trozo_estrella) y [WikiDex: Pepita](https://www.wikidex.net/wiki/Pepita). Todas siguen marcadas como referencias del juego original, no recogidas verificadas en esta ROM. Root comparó por separado los registros personales exactos de USA limpia y Alfa 2: Staryu conserva Star Piece en su segundo campo de objeto equipado, y Grimer/Muk conservan Nugget; los registros son idénticos byte a byte. Solo demuestra esos datos, no encuentros, mapas ni probabilidades. El hash del informe privado figura arriba.

**Lote 3 — Heart Scale, Everstone y Leftovers:** la tabla bilingüe anterior incorpora ocho referencias HGSS de WikiDex y las ocho entradas JSON usan `documented_base_game`; ninguna acredita una obtención en la ROM objetivo. Una comparación estática independiente de datos personales (SHA-256 `1302578e74f718a4040574a6932e872a9e4fea93f26cdebb3716539dfce62c29`) contrasta HGSS USA limpia (`65f02a…760105`) con Alfa 2 (`24ea9b…2725f6`), NARC personal `a/0/0/2`, campos de objeto en los offsets de registro `0x0C` y `0x0E`. Geodude 74 y Graveler 75 mantienen `(0, 229)`; Snorlax 143 mantiene `(234, 234)`. Luvdisc 370 cambia de `(93, 0)` a `(93, 93)`. Es evidencia estática de tabla, no demuestra encuentros ni probabilidades runtime; no se debe atribuir a Alfa 2 el 50 % comercial de Luvdisc de WikiDex.

Este índice cubre MT01–MT92, MO01–MO08 y otros 46 objetos nombrados en la guía Important Item Locations cacheada de Drayano, para el SHA-256 exacto indicado en `item-locations.json`. Los registros adicionales incluyen objetos evolutivos, objetos clave, fósiles y otros objetos nombrados. Los IDs de categoría son 1 MT, 2 MO, 3 objeto evolutivo, 4 objeto clave, 5 fósil y 6 otro objeto. Separa los datos `verified_target`, extraídos o probados con esa ROM, de las notas `documented_upstream` heredadas de la guía. Una nota documentada no demuestra que la ROM Plus conserve esa ubicación.

La correspondencia de IDs entre MT/MO y movimientos está verificada en la ROM: la secuencia `sTMHMMoves` de 100 entradas aparece una sola vez en ARM9, en el offset de archivo `0x1000CC`. El JSON incluye cada ID y nombre en inglés y español; esto no verifica dónde se obtienen los objetos.

La transcripción registra una fuente de obtención para 46 MT y tres avisos adicionales de retirada sin fuente de reemplazo. Para las otras 43 MT, el documento de Drayano dice «No change», pero no indica la ubicación original de HeartGold; esas entradas remiten a una guía de HeartGold. Las ubicaciones y métodos de obtención de las MO siguen sin verificarse y se omiten en vez de adivinarlos. Los 46 objetos adicionales conservan todos los métodos indicados en la guía; para el Ámbar Viejo se registra expresamente que no se especifica el lugar exacto. Solo se indica una tienda cuando la fuente afirma que vende el objeto; «sin cambios» no significa que haya cambiado el inventario.

El inventario de fuentes identifica el hilo del autor y su carpeta oficial de Drive, pero el PDF original no está guardado localmente. Las notas se transcribieron de un [espejo de texto secundario](https://seatgem.com/2018/09/pokemon-sacred-gold-storm-silver-important-item-locations.html); cada registro JSON conserva además el hilo del autor como procedencia. Esta transcripción no es una verificación independiente de la ROM objetivo.

### Otros objetos nombrados

| Objeto | Obtención según la guía |
|---|---|
| Piedra Solar | Ciudad Olivo: un hombre la entrega a diario durante el día. |
| Piedra Lunar | Ciudad Olivo: un hombre la entrega a diario por la noche. |
| Piedra Fuego | La entrega el sabio principal de la Torre Bellsprout; también se vende en Ciudad Trigal. |
| Piedra Trueno | La entrega el sabio principal de la Torre Bellsprout; también se vende en Ciudad Trigal. |
| Piedra Agua | La entrega el sabio principal de la Torre Bellsprout; también se vende en Ciudad Trigal. |
| Piedra Hoja | Se vende en Ciudad Trigal. |
| Fósil Raíz | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Fósil Garra | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Fósil Hélix | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Fósil Domo | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Ámbar Viejo | La guía dice que se encuentra de forma normal, pero no especifica el lugar. |
| Fósil Coraza | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Fósil Cráneo | Lo entrega un hombre del Centro Arqueológico de Ciudad Trigal; los fósiles se pueden revivir en Ciudad Trigal. |
| Piedra Día | Entrada del Frente Batalla, accesible tras obtener la Medalla Mineral; también se vende en Ciudad Endrino. |
| Piedra Noche | Segunda sala del Monte Mortero; también se vende en Ciudad Endrino. |
| Piedra Alba | Poké Ball en la Ruta 35; también se vende en Ciudad Endrino. |
| Piedra Oval | Poké Ball en la Ruta 34. |
| Repartir Exp | Lo entrega un científico en el Centro Pokémon de Ciudad Malva. |
| Roca del Rey | La entrega un hombre en el Centro Pokémon de Pueblo Caoba. |
| Diente Marino | Oculto en la playa de la Ruta 47, cerca de la salida de la Cueva Acantilado. |
| Escama Marina | Oculta en la playa de la Ruta 47, cerca de la entrada de la Torre Oculta. |
| Huevo Suerte | Lo entrega el Sr. Pokémon a cambio de la Escama Roja; también lo da un hombre en las Ruinas Alfa por capturar 21 Unown. |
| Revest. Metálico | Lo entrega un hombre en una casa de Ciudad Olivo. |
| Escama Dragón | Regalo de una persona en el Centro Pokémon de Ciudad Endrino. |
| Bola Luminosa | Una mujer de la estación del Magnetotrén de Ciudad Trigal la entrega al enseñarle el Pokémon correspondiente. |
| Mejora | Recompensa por capturar 14 Unown en las Ruinas Alfa; también la da un hombre del Centro Pokémon de la Zona Safari tras acabar la invasión Rocket. |
| Hueso Grueso | Lo entrega una mujer de la estación del Magnetotrén de Ciudad Trigal si llevas a Cubone o Marowak en el equipo. |
| Stick | Una mujer de la estación del Magnetotrén de Ciudad Trigal lo entrega al enseñarle el Pokémon correspondiente. |
| Protector | Primera sala de Calle Victoria. |
| Electrizador | Ruta 44. |
| Magmatizador | Planta superior de la Cueva Helada. |
| Disco Extraño | Se trasladó al Escondite Rocket. |
| Tela Terrible | Cueva Oscura, al entrar por el lado de Ciudad Endrino. |
| Garra Afilada | La entrega un hombre en una casa de Ciudad Orquídea. |
| Colmillo Agudo | Lo entrega un hombre en una casa de Ciudad Orquídea. |
| Woodland Ore | Lo entrega el sabio principal de la Torre Bellsprout; Poké Ball en el Bosque Encinar. |
| Serenade Orb | Lo entrega el sabio principal de la Torre Bellsprout; Poké Ball tras el muro LIGHT de las Ruinas Alfa. |
| Aubade Orb | Lo entrega el sabio principal de la Torre Bellsprout; Poké Ball en la Ruta 42. |
| Chilled Ore | Lo entrega el sabio principal de la Torre Bellsprout; Poké Ball en la Cueva Helada. |
| Caña Vieja | Señor guía en Ciudad Malva. |
| Caña Buena | Pescador del restaurante de Ciudad Olivo. |
| Supercaña | Pescador de Ciudad Endrino. |
| Bici | Tu madre al inicio del juego. |
| Mineral Voltaico | Ruta 42 junto a los árboles de Bonguri; también al otro lado del remolino en la Ruta 27. |
| Orbe Pacto | Se recibe automáticamente al completar cualquier intercambio del juego. |
| Lector GB | Tu madre al inicio del juego. |
| Fósiles | El hombre de Ciudad Trigal entrega gratis uno de cada tipo listado, salvo el de Aerodactyl; el Ámbar Viejo debe encontrarse de forma normal. Se pueden revivir en Ciudad Trigal. |
| Objetos evolutivos y otros | El espejo de la fuente enumera los métodos concretos anteriores. No indica todos los Pokémon que activan regalos condicionales, así que el índice solo conserva los ejemplos nombrados en la guía. |

Para regenerar el índice, indica la ROM objetivo fijada y el directorio local de procedencia con el comando mostrado en la sección inglesa.
