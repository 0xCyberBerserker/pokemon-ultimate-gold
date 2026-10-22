# Battle Frontier / Frontera de Batalla

## English

**Current build: Alpha 2. Native Battle Tower entry, Single registration and the first battle were observed on the exact downloadable target. Overall Frontier acceptance remains pending.**

The [Alpha 2 entry and registration report](alpha2-frontier-qa.md) uses a disposable hub fixture followed by the native entrance warp, which loads the Tower's own NPCs. Its historical post-registration battery file was overwritten by later QA. The report therefore excludes reproducibility claims for comparisons that require that missing snapshot; preserved scripts, states and captured RAM remain separately audited. No normal-story access, wins, rewards or other facilities are accepted by this test.

The [separate Alpha 2 battle continuation](alpha2-frontier-outcome-qa.md) records the return to the lobby and subsequent save/cold-reload checks. Its evidence and limitations are independent of the missing earlier snapshot.

The [independent offline review](qa-alpha2-frontier-review.json) checks the frozen final saves, party/Bag equality and state-free cold-boot contract. It accepts no victory or reward.

![Alpha 2: the native entrance places the player inside Battle Tower.](../assets/locations/alpha2-battle-tower-entrance.png)

![Alpha 2: after the match and a state-free cold reload, the receptionist offers another challenge.](../assets/locations/alpha2-battle-tower-cold-return.png)

These location images show the upper DS screen; the original two-screen captures and their hashes remain in the linked QA records. They show a test fixture, not access through normal story progression.

### Historical Alpha 1 inspection

The inspected external ROM is the accepted Alpha 1 candidate `tm-refill-npc-candidate.nds`, SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`. Its Frontier script, event, and message NARCs contain the expected HGSS entries. A disposable synthetic-save copy loaded map 265 directly; the game then used the native receptionist, Single registration, and Tower Battle Room flow. The ROM and source save were not changed. No cheats were used. The initial boot had no savestate input; later interaction steps were chained from saved emulator states, so this is not a cold save/reload test.

### What the files show

The upstream map constants identify the main Frontier lobby as map 272 (`D32`), the Route 40 gateway as map 366, its access maps as 273 and 411, the Battle Tower as map 265 (`D31R0201`), and the four other facilities as maps 275–278. Map 274 is explicitly an unused duplicate Tower map; it is not the Tower entrance used by the hub. The hub event data links to the Tower and all four facilities. The Route 40 and access event entries link the gateway to the hub.

| Area | Map | Alpha 1 script entry | Alpha 1 event entry |
|---|---:|---:|---:|
| Route 40 gateway and access | 366, 273, 411 | NARC `a/0/1/2`: 80–81 | NARC `a/0/3/2`: 91, 323, 367 |
| Battle Tower | 265 | `a/0/1/2`: 69 | `a/0/3/2`: 240 |
| Frontier lobby | 272 | `a/0/1/2`: 76 | `a/0/3/2`: 243 |
| Battle Factory | 275 | `a/0/1/2`: 84 | Connected by lobby entry 243 |
| Battle Hall | 276 | `a/0/1/2`: 85 | Connected by lobby entry 243 |
| Battle Castle | 277 | `a/0/1/2`: 86 | Connected by lobby entry 243 |
| Battle Arcade | 278 | `a/0/1/2`: 87 | Connected by lobby entry 243 |

The Tower script offers Single or Double challenges and calls the Frontier party validator. In the checked source, Single requires three Pokémon, Double four, and Multi/Link modes two. The validator excludes Eggs and banned species/forms; its Tower call also requires a valid unique subset with no duplicate species or non-empty held items. The upstream text associated with message bank 103 describes the Level 50 rule as temporary downscaling for Pokémon above level 50, while lower-level Pokémon stay below 50. Alpha 1 contains target message entry 103 with the fingerprint below; runtime scaling was not exercised.

The Route 40 warps and inspected gateway scripts contain no explicit Hall-of-Fame or badge check. Some event flags and variables remain unnamed, so this inspection does not prove when the story makes the area reachable in a normal playthrough. Nor does it verify each facility's current challenge flow, battle, reward, or save/resume behavior.

### Bounded runtime QA

The fixture changes the saved location and avatar/follower coordinates in a disposable battery-save copy so the game loads map 265 directly. It does not establish access through normal story progression. The clean boot reached the native Battle Tower receptionist at map 265, position `(15,6)`, facing north. The screenshot shows the event dialogue, “Welcome to the Battle Tower!”

![Battle Tower receptionist shows “Welcome to the Battle Tower!” in the Alpha 1 synthetic-entry test.](../assets/locations/battle-tower-reception.png)

The receptionist offered Single and Double. The QA profile registered three distinct Pokémon for Single (Clefairy, Chikorita, and Machop), accepted the save/overwrite prompts, and continued to the first challenge. The state-chained continuation showed “You are challenged by Tuber Manford!” and an active battle against Remoraid, with Clefairy at 22/22 HP. At that checkpoint, the cached saved position still contains map 266 (Battle Tower Elevator); it does not identify the current field map. The battle screenshot proves the first battle starts in this synthetic fixture; its result and rewards were not tested. The other four facilities, normal-story access, further streak progression, rewards, and cold battery-save reload remain untested. See the machine-checked [Battle Frontier QA record](qa-battle-frontier.json) for ROM/core/runner, input, state, save, RAM, and screenshot hashes.

### Exact target fingerprints

| Target archive | Members | SHA-256 |
|---|---:|---|
| `a/0/1/2` (field scripts) | 965 | `997d62c5733f671b1dd6d93d6e45a8f7ebbe2d4a90597f193f2d9bc2eb4c70c5` |
| `a/0/3/2` (zone events) | 491 | `4870a40ad2a4237a8e0096d32a8b188a4ff8ab6a56bf72b46e0b4215c7195225` |
| `a/0/2/7` (message banks) | 829 | `b33db4c457d42ede17c8d7227dafe85b7a1e371071403328ec4093cedd633f51` |

The directly checked target entries are scripts 69, 76, 80, 81, and 84–87; events 91, 240, 243, 323, and 367; and message banks 96, 103, and 104 in `a/0/2/7`. For example, target script entry 69 hashes to `cae4f19bc11361a970c683a678e9301642f3154b6d2ab1036c4d5710aa796dc8`, event entry 243 to `0f4ee968ed42f2d4d1af31822523bbb691c272c9666fd49ddad2d92c96bceaaf`, and message entry 103 to `5e9460288f72776fe6f4f4362f6f5af793076bea2bc0396ee7c89579053da95e`.

### Sources

- Pinned local upstream source: [`pret/pokeheartgold` commit `6988158691eb6178cff697cda0428045ddcba5fb`](https://github.com/pret/pokeheartgold/tree/6988158691eb6178cff697cda0428045ddcba5fb). Relevant files: `include/constants/maps.h`, `src/unk_0204A3F4.c`, `src/scrcmd_9.c`, `files/fielddata/script/scr_seq/`, `files/fielddata/eventdata/zone_event/`, and `files/msgdata/msg/`.
- The source repository labels itself work in progress and warns that changing function or data layout can crash the game; use it as static source evidence, not proof that the current ROM was rebuilt from this checkout. See its [README](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/README.md).

## Español

**Versión actual: Alpha 2. Se observaron la entrada nativa de Battle Tower (Torre Batalla), el registro Individual y el primer combate en la versión exacta descargable. La aceptación global de la Frontera sigue pendiente.**

El [informe de entrada y registro de Alpha 2](alpha2-frontier-qa.md) utiliza una copia desechable situada en el vestíbulo y después la entrada nativa, que carga los NPC de la Torre. Una prueba posterior sobrescribió la partida de batería histórica posterior al registro. Por ello, el informe excluye las comparaciones reproducibles que dependían de esa copia perdida; los scripts, estados y volcados RAM conservados se auditan por separado. Esta prueba no valida el acceso por la historia normal, victorias, premios ni otras instalaciones.

La [continuación independiente del combate de Alpha 2](alpha2-frontier-outcome-qa.md) documenta la vuelta al vestíbulo y las comprobaciones posteriores de guardado y recarga en frío. Su evidencia y sus límites son independientes de la copia anterior perdida.

La [revisión independiente sin emulación](qa-alpha2-frontier-review.json) comprueba las partidas finales congeladas, la igualdad del equipo y la Bolsa y el contrato de arranque en frío sin estado de emulador. No acepta victorias ni premios.

![Alpha 2: la entrada nativa sitúa al jugador dentro de Battle Tower (Torre Batalla).](../assets/locations/alpha2-battle-tower-entrance.png)

![Alpha 2: tras el combate y una recarga en frío sin estado de emulador, la recepcionista ofrece otro desafío.](../assets/locations/alpha2-battle-tower-cold-return.png)

Estas imágenes de ubicación muestran la pantalla superior de DS; los informes enlazados conservan las capturas originales de ambas pantallas y sus hashes. Proceden de una partida de prueba y no demuestran el acceso mediante la historia normal.

### Inspección histórica de Alpha 1

La ROM externa inspeccionada es la candidata Alpha 1 aceptada `tm-refill-npc-candidate.nds`, SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`. Sus NARC de scripts, eventos y mensajes contienen las entradas HGSS esperadas. Una copia desechable de una partida sintética cargó directamente el mapa 265; el juego usó después el recepcionista nativo, el registro Individual y el flujo hacia la sala de combate de la Torre. No se modificaron la ROM ni la partida fuente. No se usaron trucos. El arranque inicial no usó un estado de emulador; los pasos posteriores se enlazaron mediante estados guardados, así que esto no prueba una recarga en frío.

### Qué muestran los archivos

Los mapas upstream identifican el vestíbulo principal de Battle Frontier (Frontera de Batalla) como mapa 272 (`D32`), la entrada de Route 40 (Ruta 40) como mapa 366, sus mapas de acceso como 273 y 411, Battle Tower (Torre Batalla) como mapa 265 (`D31R0201`) y las otras cuatro instalaciones como mapas 275–278. El mapa 274 está marcado expresamente como una copia no usada de la Torre; no es la entrada que usa el vestíbulo. Los eventos del vestíbulo enlazan con la Torre y las cuatro instalaciones. Los eventos de Ruta 40 y de acceso conectan la entrada con el vestíbulo.

| Zona | Mapa | Script en Alpha 1 | Evento en Alpha 1 |
|---|---:|---:|---:|
| Route 40 gateway and access (entrada de Ruta 40 y acceso) | 366, 273, 411 | NARC `a/0/1/2`: 80–81 | NARC `a/0/3/2`: 91, 323, 367 |
| Battle Tower (Torre Batalla) | 265 | `a/0/1/2`: 69 | `a/0/3/2`: 240 |
| Frontier lobby (vestíbulo de la Frontera) | 272 | `a/0/1/2`: 76 | `a/0/3/2`: 243 |
| Battle Factory (Fábrica Batalla) | 275 | `a/0/1/2`: 84 | Conectada por el evento 243 del vestíbulo |
| Battle Hall (Sala Batalla) | 276 | `a/0/1/2`: 85 | Conectada por el evento 243 del vestíbulo |
| Battle Castle (Castillo Batalla) | 277 | `a/0/1/2`: 86 | Conectado por el evento 243 del vestíbulo |
| Battle Arcade (Arcade Batalla) | 278 | `a/0/1/2`: 87 | Conectado por el evento 243 del vestíbulo |

El script de la Torre ofrece desafíos Individuales o Dobles y llama al validador de equipo de la Frontera. En el código revisado, Individual requiere tres Pokémon, Dobles cuatro y Multi/Enlace dos. El validador excluye Huevos y especies/formas prohibidas; la llamada de la Torre también requiere un subconjunto válido sin especies ni objetos equipados no vacíos repetidos. El texto upstream asociado al banco de mensajes 103 describe la regla de nivel 50 como una reducción temporal de los Pokémon por encima del nivel 50; los de menor nivel siguen por debajo. Alpha 1 contiene la entrada objetivo 103 con la huella indicada abajo; no se probó runtime el ajuste.

Los eventos de acceso desde Ruta 40 y los scripts de entrada revisados no contienen una comprobación explícita de Salón de la Fama ni de medallas. Algunas banderas y variables siguen sin nombre, por lo que esta revisión no demuestra en qué punto de la historia se puede llegar a la zona en una partida normal. Tampoco comprueba el flujo actual de cada instalación, sus combates, premios ni guardado/reanudación.

### QA runtime acotado

El fixture cambia la ubicación guardada y las coordenadas del avatar/seguidor en una copia desechable de la partida para cargar directamente el mapa 265. No demuestra acceso mediante la historia normal. El arranque limpio llegó al recepcionista nativo de Battle Tower (Torre Batalla), en el mapa 265, posición `(15,6)`, mirando al norte. La captura muestra el diálogo del evento: “Welcome to the Battle Tower!”

![El recepcionista de Battle Tower muestra “Welcome to the Battle Tower!” en la prueba de entrada sintética de Alpha 1.](../assets/locations/battle-tower-reception.png)

El recepcionista ofreció Single y Double. El perfil de QA registró tres Pokémon distintos para Single (Clefairy, Chikorita y Machop), aceptó los avisos de guardado/sobrescritura y continuó hasta el primer desafío. La continuación por estados mostró “You are challenged by Tuber Manford!” y el combate activo contra Remoraid, con Clefairy a 22/22 PS. En ese punto la posición guardada en caché aún indica el mapa 266, Battle Tower Elevator (ascensor de la Torre), y no identifica el mapa de campo actual. La captura demuestra el inicio del primer combate con el fixture sintético; no se probaron su resultado ni premios. Faltan las otras cuatro instalaciones, acceso normal por historia, continuación de la racha, premios y recarga en frío. Consulta el [informe QA de Battle Frontier](qa-battle-frontier.json) para los hashes de ROM, núcleo, runner, entradas, estados, partida, RAM y capturas.

### Huellas del objetivo exacto

| Archivo del objetivo | Miembros | SHA-256 |
|---|---:|---|
| `a/0/1/2` (scripts de campo) | 965 | `997d62c5733f671b1dd6d93d6e45a8f7ebbe2d4a90597f193f2d9bc2eb4c70c5` |
| `a/0/3/2` (eventos de zona) | 491 | `4870a40ad2a4237a8e0096d32a8b188a4ff8ab6a56bf72b46e0b4215c7195225` |
| `a/0/2/7` (bancos de mensajes) | 829 | `b33db4c457d42ede17c8d7227dafe85b7a1e371071403328ec4093cedd633f51` |

Se comprobaron directamente las entradas de script 69, 76, 80, 81 y 84–87; eventos 91, 240, 243, 323 y 367; y bancos de mensajes 96, 103 y 104 de `a/0/2/7`. Por ejemplo, la entrada de script 69 del objetivo tiene hash `cae4f19bc11361a970c683a678e9301642f3154b6d2ab1036c4d5710aa796dc8`, el evento 243 `0f4ee968ed42f2d4d1af31822523bbb691c272c9666fd49ddad2d92c96bceaaf` y el mensaje 103 `5e9460288f72776fe6f4f4362f6f5af793076bea2bc0396ee7c89579053da95e`.

### Fuentes

- Fuente upstream local fijada: [`pret/pokeheartgold`, commit `6988158691eb6178cff697cda0428045ddcba5fb`](https://github.com/pret/pokeheartgold/tree/6988158691eb6178cff697cda0428045ddcba5fb). Archivos relevantes: `include/constants/maps.h`, `src/unk_0204A3F4.c`, `src/scrcmd_9.c`, `files/fielddata/script/scr_seq/`, `files/fielddata/eventdata/zone_event/` y `files/msgdata/msg/`.
- El repositorio se declara en desarrollo y advierte que cambiar el tamaño o distribución de funciones o estructuras puede provocar fallos. Se usa aquí como evidencia estática de la fuente, no como prueba de que la ROM actual se compilara desde esta copia. Consulta su [README](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/README.md).
