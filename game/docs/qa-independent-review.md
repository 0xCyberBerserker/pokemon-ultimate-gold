# Independent QA Review: Ultimate Gold

## English

**Status: PARTIAL.** The reviewed HM, Battle Frontier, and combined-build kit evidence is hash-consistent and carefully scoped. The Battle Frontier location label was corrected. Three kit actions pass their declared memory/UI checks; shop acceptance remains pending. One low-severity DSV provenance clarification is recommended.

### Review scope

Reviewed `qa-owned-hm-actions.json`, `qa-owned-hm-matrix-fix4.json`, `qa-battle-frontier.json`, `battle-frontier.md`, `qa-combined-kit-shop.json`, its offline audit script, the pinned `maps.h`, exact artifact hashes, selected state lineage, and original screenshots. The initial HM/Battle Frontier review did not use an emulator; FIX5 was later tested with one leased core and the core was released. The combined-kit review was read-only and did not rerun suites. Screenshot originals were left untouched.

### Finding

**BF-01 — Medium — Map identity was mislabelled. RESOLVED.** The original audit read the five-integer saved-position tuple from `SaveData + 0x1244` and recorded `[266, -1, 3, 6, 1]` as `tower_battle_room_position`; the guide called map 266 the Battle Room. The pinned upstream `include/constants/maps.h` defines map 266 as `MAP_BATTLE_TOWER_ELEVATOR` and 267 as `MAP_BATTLE_TOWER_UNUSED_1`. The audit, English/Spanish guide, and regenerated QA record now label this as cached saved position map 266 (Elevator), set `current_field_map_verified` to false, and make no claim that the tuple identifies the Battle Room. The first-battle screenshot remains separate evidence for battle start. The report was regenerated offline; no emulator/core was reopened.

Evidence: `night-sprint/qa/frontier_acceptance.py:231–260`; `night-sprint/engine/upstream/pokeheartgold/include/constants/maps.h:269–271`; `docs/battle-frontier.md:33,80`; `docs/qa-battle-frontier.json` at `runtime.position_checkpoints.cached_elevator_at_battle_start` and check `cached_elevator_position_at_battle_start`. The original active-battle screenshot is `night-sprint/qa/runs/frontier-counter-step-27/frontier_battle_load_wait_270.png` (SHA-256 `ab130e5e9989484ea2f4d809da76bf0659e62ba33058169e756c2454320d6b9b`). It shows the battle UI, but does not identify a field map.

### Evidence verified

### Combined kit/shop sibling review

**KIT-01 — Low — Seed and runtime DSV provenance need clearer labels.** `qa-combined-kit-shop.json` names `fc9dcfa…` as `kit.source_battery_sha256`, while its action-run records show copied DSV hash `e2366b6…`. The separate HM report records the same test profile at `fc9…` before its native save and `e236…` after native save/reload, so the difference is consistent with a derived saved profile; the combined report does not make that link explicit. The action-run battery hashes are recorded individually, and this ambiguity does not invalidate the reported live-memory checks. Recommend naming `fc9…` as the original Golden seed and calling out `e236…` as the DSV used in the kit action runs.

The 61/61 figure is an assertion count, not 61 independent trials. The offline audit decodes checksum-valid party records from 4 MiB emulator-RAM snapshots, compares all 594 Bag slots byte-for-byte, selected reserve canaries, and unaffected full party records. It checks same-ROM identities on the selected runs and state hashes for their recorded inputs/outputs. The healer, Rare Candy, and Oran Berry UI/action evidence is scoped to FIX4 SHA-256 `c64dc998…`; setup runs use a one-frame fixture code where reported, while action runs report no active codes. This supports the stated transient kit effects; it does not establish persistence of those effects to a cold battery reload.

The sibling report correctly leaves the evolution shop pending: the native interaction attempt ended at the main menu without confirming the vendor or buy list, and purchases/save/reload on FIX4 remain untested. The older isolated shop report is not transferred to FIX4.


- **HM target and protected files:** target ROM SHA-256 `c64dc998bf97c621027bd3e9f16e7526309db3fc69b99c8198d28b1614b75304`; original player ROM `3e405d796cae0ab7d6f67d89a8d9097220f58497a849a09ea0a56651910412c1`; Golden DSV `fc9dcfa683e6236272b395b4267e23aad8abd5068d1b4237f0e505463faa9384`. Current hashes match those recorded in the evidence.
- **HM menu matrix:** all eight cases match the target ROM hash and their listed screenshot hashes. Selected images show Surf and Waterfall in the corresponding owned-and-badged cases, omit them in the missing-item/badge cases, and omit an HM action for the Egg-only fixture. This is fixture/menu evidence, not action acceptance.
- **HM actions and save:** the report limits native action evidence to Fly and Surf and records temporary inventory/badge setup. The Fly setup code is enabled only for frame 0; Surf and shore-return runs report no codes. The native-save and fresh-process reload use distinct runner PIDs (3032420 and 3036147), no state input on reload, and the same saved DSV hash `e2366b6eb035a67c2d8987d6f7ce9bb73f5e847234789ac1e2055e09c24db0f6`. The protected Golden DSV remains at its recorded hash. The persistent fingerprint covers bag pockets, every current party record after checksum-validated whole-record re-encryption when RAM catches a transient plaintext interval, and badges; location is compared separately. This supports the report’s stated fields, not a claim that all RAM or every save-array byte was identical.
- **HM UI limit:** the original first-page screenshot shows `Strength` clipped by the lower message window. The QA JSON correctly leaves this as a release defect.
- **Battle Frontier identity and scope:** current target ROM `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`, core `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, and runner `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8` match. The published reception screenshot is byte-identical to the captured original. The message archive is correctly identified as `a/0/2/7`. All 267 recorded checks are marked passed; this is an assertion count, not a statistical confidence measure. The evidence is one clean boot plus 27 state-linked continuations on a synthetic direct-entry save. The documents correctly leave normal-story access, the other four facilities, battle result/rewards, and cold battery reload pending.

### Pending reviews and acceptance

The combined kit/shop sibling report is now reviewed: its three kit action groups pass their recorded checks, while native shop interaction and purchase persistence remain **PENDING**. The HM-remaining sibling review is still pending. HM map gates, the other six HM actions, teaching HMs, and full combined kit/shop acceptance are not established. This review does not accept the complete HM feature, Battle Frontier, game, or release.

## Español

**Estado: PARCIAL.** La evidencia revisada de MO, Battle Frontier y kit del build combinado mantiene hashes coherentes y un alcance acotado. Se corrigió la etiqueta de ubicación de Battle Frontier. Tres acciones del kit superan sus comprobaciones declaradas de memoria/UI; la aceptación de la tienda sigue pendiente. Se recomienda aclarar la procedencia de los DSV, con severidad baja.

### Alcance de la revisión

Revisé `qa-owned-hm-actions.json`, `qa-owned-hm-matrix-fix4.json`, `qa-battle-frontier.json`, `battle-frontier.md`, `qa-combined-kit-shop.json`, su script offline de auditoría, el `maps.h` fijado, hashes exactos, cadena de estados seleccionada y capturas originales. La revisión inicial de MO/Battle Frontier no usó emulador; después se probó FIX5 con un núcleo cedido y se liberó. La revisión del kit combinado fue de solo lectura y no repitió suites. No modifiqué capturas originales.

### Hallazgo

**BF-01 — Medio — La identidad del mapa estaba mal etiquetada. RESUELTO.** La auditoría original leía la tupla de cinco enteros de posición guardada desde `SaveData + 0x1244` y registraba `[266, -1, 3, 6, 1]` como `tower_battle_room_position`; la guía llamaba Sala de Combate al mapa 266. El `include/constants/maps.h` upstream fijado define el mapa 266 como `MAP_BATTLE_TOWER_ELEVATOR` y el 267 como `MAP_BATTLE_TOWER_UNUSED_1`. La auditoría, la guía en inglés/español y el informe QA regenerado ahora etiquetan el dato como posición guardada en caché del mapa 266 (ascensor), fijan `current_field_map_verified` en `false` y no afirman que la tupla identifique la Sala de Combate. La captura del primer combate sigue siendo evidencia independiente de que el combate empezó. El informe se regeneró offline; no se volvió a abrir el emulador/núcleo.

Evidencia: `night-sprint/qa/frontier_acceptance.py:231–260`; `night-sprint/engine/upstream/pokeheartgold/include/constants/maps.h:269–271`; `docs/battle-frontier.md:33,80`; `docs/qa-battle-frontier.json`, en `runtime.position_checkpoints.cached_elevator_at_battle_start` y el check `cached_elevator_position_at_battle_start`. La captura original del combate activo es `night-sprint/qa/runs/frontier-counter-step-27/frontier_battle_load_wait_270.png` (SHA-256 `ab130e5e9989484ea2f4d809da76bf0659e62ba33058169e756c2454320d6b9b`). Muestra la interfaz de combate, pero no identifica un mapa de campo.

### Evidencia verificada

### Revisión del informe hermano de kit/tienda

**KIT-01 — Bajo — Conviene distinguir mejor el DSV semilla del DSV usado en runtime.** `qa-combined-kit-shop.json` identifica `fc9dcfa…` como `kit.source_battery_sha256`, mientras que las ejecuciones de acción registran copias DSV con hash `e2366b6…`. El informe separado de MO registra el mismo perfil de prueba en `fc9…` antes del guardado nativo y en `e236…` después del guardado/recarga, por lo que la diferencia concuerda con un perfil guardado derivado; el informe combinado no explica el vínculo. Los hashes DSV de cada ejecución sí están registrados y esta ambigüedad no invalida las comprobaciones de RAM publicadas. Se recomienda llamar a `fc9…` semilla Golden original e indicar que las acciones del kit usaron el DSV `e236…`.

La cifra 61/61 cuenta aserciones; no son 61 ensayos independientes. La auditoría offline decodifica registros de equipo con checksum válido desde capturas de 4 MiB de RAM del emulador, compara byte por byte los 594 espacios de la Bolsa, canarios de reserva seleccionados y registros de Pokémon que no debían cambiar. También verifica las identidades ROM de las ejecuciones seleccionadas y los hashes de los estados registrados. La evidencia de UI/acción de Party Healer, Caramelo Raro y Baya Aranja corresponde a FIX4 SHA-256 `c64dc998…`; los preparativos declaran un código de fixture durante un frame donde corresponde y las ejecuciones de acción no informan códigos activos. Esto respalda los efectos transitorios indicados, no su persistencia tras una recarga en frío desde batería.

El informe hermano deja correctamente pendiente la tienda de evoluciones: el intento de interacción nativa terminó en el menú principal sin confirmar al dependiente ni la lista de compra; las compras, el guardado y la recarga en FIX4 no se probaron. El informe aislado anterior de tienda no se transfiere a FIX4.


- **Objetivo HM y archivos protegidos:** SHA-256 de la ROM objetivo `c64dc998bf97c621027bd3e9f16e7526309db3fc69b99c8198d28b1614b75304`; ROM original del jugador `3e405d796cae0ab7d6f67d89a8d9097220f58497a849a09ea0a56651910412c1`; DSV Golden `fc9dcfa683e6236272b395b4267e23aad8abd5068d1b4237f0e505463faa9384`. Los hashes actuales coinciden con los registrados.
- **Matriz de menús HM:** los ocho casos coinciden con el hash de la ROM objetivo y con los hashes de capturas declarados. Las imágenes seleccionadas muestran Surf y Waterfall en los casos con HM y medalla, los omiten cuando falta el objeto o la medalla, y no ofrecen una acción HM para el fixture cuyo único miembro es un Huevo. Es evidencia de fixture y menú, no aceptación de acciones.
- **Acciones HM y guardado:** el informe limita la evidencia de acciones nativas a Fly y Surf, y registra que la preparación usa inventario/medallas temporales. El código de preparación de Fly solo está activo durante el frame 0; los recorridos de Surf y regreso a la orilla registran que no usaron códigos. El guardado nativo y la recarga en proceso nuevo usan PID de runner distintos (3032420 y 3036147), sin estado de entrada en la recarga y con el mismo hash DSV `e2366b6eb035a67c2d8987d6f7ce9bb73f5e847234789ac1e2055e09c24db0f6`. El DSV Golden protegido conserva su hash. La huella persistente incluye bolsillos, todos los bytes de cada registro actual del equipo tras re-cifrar el registro completo si la RAM captura un intervalo transitorio en texto claro con checksum válido, y medallas; compara la ubicación por separado. Esto respalda los campos declarados, no que toda la RAM o todos los bytes de cada array de guardado fueran idénticos.
- **Límite visual HM:** la captura original de la primera página muestra `Strength` recortado por la ventana de texto inferior. El JSON de QA lo mantiene correctamente como defecto pendiente para release.
- **Identidad y alcance de Battle Frontier:** los hashes actuales de ROM objetivo `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`, núcleo `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89` y runner `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8` coinciden. La captura publicada del recepcionista es idéntica byte a byte a la original. El archivo de mensajes se identifica correctamente como `a/0/2/7`. Los 267 checks registrados aparecen como superados; es un recuento de aserciones, no una medida estadística de confianza. La evidencia consta de un arranque limpio y 27 continuaciones enlazadas por estados con un guardado de entrada directa sintética. Los documentos dejan correctamente pendientes el acceso por historia normal, las otras cuatro instalaciones, el resultado/premios del combate y la recarga en frío de la partida.

### Revisiones y aceptación pendientes

El informe hermano de kit/tienda ya está revisado: sus tres grupos de acciones del kit superan las comprobaciones registradas, mientras que la interacción nativa y la persistencia de compras en tienda siguen **PENDIENTES**. La revisión hermana de MO-remaining aún está pendiente. No quedan establecidos los límites de mapa HM, las otras seis acciones, enseñar MO ni la aceptación completa de kit/tienda. Esta revisión no acepta la función HM completa, Battle Frontier, el juego ni la release.

Made with 🖤 in Barcelona City 🇪🇸
