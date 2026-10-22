# Trainer journey and battle panels / Recorrido y fichas de combate

## English

Open **Trainers** for a recommended adventure route. The default view shows first visits; rematches have a separate filter so a late-game phone team does not interrupt an early route. Search by trainer, Pokémon or move, choose an area, then open a trainer to inspect the full team. The team panels load when opened.

Choose **Normal** or **Plus** in the site header to match the mode enabled in your game. The choice persists on this browser and keeps your filters and expanded teams. In this build, Plus changes trainer levels; the native hook does not change their IV/EV spreads. The wiki reads the exact level table and preserves level gaps within each team. For example, the Azalea rival’s Kadabra changes from level 19 to 21. Default moves are resolved at the selected level; explicitly assigned moves stay assigned. Selecting a wiki mode does not change your ROM or save.

The credited v1.05 reference supplies area and encounter order. We match its names and rosters against our ROM: **639 of 737 trainer records** have a documented sequence across 90 sections. The remaining 98 stay accessible under **Order unconfirmed** or **All battles**, rather than receiving an invented encounter order. Optional routes and Kanto allow different paths; this is a recommended reading order, not a unique forced itinerary. The importer preserves gender symbols and accepts the reference's varied level punctuation. Three matched rows omit a level; their complete species rosters identify a unique team, while displayed levels still come from the ROM. One reference row has a different roster and remains unresolved.

Every member shows its target level, held item, types, resolved moves and six IV/EV bars. The ordinary trainer format has an IV scale byte: each IV is `floor(scale × 31 / 255)`. It has no custom EV spread; standard native Pokémon creation starts those EVs at zero. These are baseline values, not an assertion about every challenge setting, cheat, special battle facility or dynamically changed level. Zero EVs are not EV yield.

Explicit trainer moves come from the target party record. Default moves are calculated from this build’s level-up learnset; alternative forms without a verified resolution remain labeled. A discrepancy in the historical reference never overwrites a ROM level: for example, the Azalea rival’s Kadabra remains level 19 even though the reference says 18.

Sources: `a/0/5/5` and `a/0/5/6` from target SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`; native generator `pret/pokeheartgold/src/trainer_data.c`; credited **SS/SG Trainer Pokémon v1.05 by JD48096761**, SHA-256 `bc6bef8b1009bfb93a565e0e95ee5296925efd883bee2a110fe588ebdef70d05`. Our [journey register](trainer-journey.json) records matching strength and unresolved rows. Original guides are kept outside the repository.

Navigation and information hierarchy were reviewed against [WikiDex](https://www.wikidex.net/wiki/Pok%C3%A9mon_Oro_HeartGold_y_Plata_SoulSilver) and [Pokémon Database](https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour). Their vanilla teams are not used as hack data.

## Español

Abre **Entrenadores** para recorrer una ruta recomendada de la aventura. La vista inicial muestra primeras visitas; los rematches tienen filtro propio para que un equipo avanzado del teléfono no interrumpa una ruta inicial. Busca entrenador, Pokémon o movimiento, elige una zona y abre la ficha para consultar su equipo completo. Los detalles se cargan al abrirlos.

Selecciona **Normal** o **Plus** en la cabecera según el modo activado en tu partida. La elección persiste en este navegador y conserva filtros y equipos abiertos. En esta versión, Plus cambia los niveles de los entrenadores; su función nativa no modifica los repartos de IV/EV. La wiki consulta la tabla exacta de niveles y conserva las diferencias dentro de cada equipo. Por ejemplo, el Kadabra del rival en Azalea pasa del nivel 19 al 21. Los movimientos predeterminados se resuelven al nivel seleccionado; los asignados explícitamente se conservan. Elegir modo en la wiki no modifica tu ROM ni tu partida.

La referencia acreditada de v1.05 aporta el orden de zonas y encuentros. Cruzamos nombres y equipos con nuestra ROM: **639 de 737 registros** tienen secuencia documentada en 90 tramos. Los otros 98 siguen disponibles en **Orden por confirmar** o **Todos los combates**, sin inventarles una posición. Las rutas opcionales y Kanto permiten elegir camino; se propone un orden de consulta, no un itinerario único obligatorio. El importador conserva los símbolos de género y admite las variantes de puntuación de los niveles. Tres filas omiten un nivel; sus listas completas de especies identifican un equipo único y los niveles mostrados siguen procediendo de la ROM. Una fila de la referencia tiene otro equipo y permanece sin resolver.

Cada miembro muestra nivel, objeto equipado, tipos, movimientos resueltos y seis barras de IV/EV. El formato normal de entrenadores usa un byte de escala: cada IV es `floor(escala × 31 / 255)`. No contiene reparto personalizado de EV; la creación nativa estándar empieza con esos EV a cero. Son valores de base, no una afirmación sobre todos los desafíos, códigos, instalaciones especiales o niveles modificados dinámicamente. Los EV a cero no representan los EV que entrega al derrotarlo.

Los movimientos explícitos proceden del equipo de la ROM. Los predeterminados se calculan con el aprendizaje por nivel de este build; las formas alternativas sin resolución verificada conservan su etiqueta. Una diferencia en la referencia histórica nunca modifica el nivel extraído: el Kadabra del rival en Azalea sigue al 19 aunque la referencia diga 18.

Fuentes: `a/0/5/5` y `a/0/5/6` del objetivo SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`; generador nativo `pret/pokeheartgold/src/trainer_data.c`; **SS/SG Trainer Pokémon v1.05 de JD48096761**, SHA-256 `bc6bef8b1009bfb93a565e0e95ee5296925efd883bee2a110fe588ebdef70d05`. El [registro propio](trainer-journey.json) conserva la fuerza de cada cruce y las filas pendientes. Las guías originales permanecen fuera del repo.

Se revisaron navegación y jerarquía de información con [WikiDex](https://www.wikidex.net/wiki/Pok%C3%A9mon_Oro_HeartGold_y_Plata_SoulSilver) y [Pokémon Database](https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour). Sus equipos originales no se usan como datos del hack.
