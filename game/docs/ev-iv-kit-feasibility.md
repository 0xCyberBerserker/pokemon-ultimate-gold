# Rocket EV, IV, and Nature Editor — Feasibility

## English

**Status:** textfix candidate `99810da…0684a` passes independently reviewed portable HP IV +1, HP EV +4 and separate EV/IV resets, including No, exact confirmed writes and native Save/fresh cold persistence. IV +5 and Repeat are in native QA. Other statistics/steps, bounds, party↔PC, nature control and release integration remain pending. The player ROM and download are unchanged. See [current native QA and limits](stat-editor-qa.md).

## Implemented editing core

The C helper previews EV increments of **+1/+4/+10** and IV increments of **+1/+5**, clamping to the remaining individual and total capacity. Preview does not call a setter. Confirmed values use the normal `SetMonData` API followed by one `CalcMonStats`; separate resets clear all six EVs or all six IVs to zero. Cancellation, invalid slots, empty slots and eggs are rejected. The native API also reports a failed checksum as an Egg, which the host test models explicitly. PID and nature are untouched.

The helper and tests are local engineering files, `internal/stat-editor/stat_editor.c/.h` and `qa/stat_editor_host_test.py`. The host test compiles the same C helper with API stubs and the pinned game's field constants. It checks exact 255/510 EV and 31 IV boundaries, rejected overflow, step clamps, no-write previews, target selection and preservation of other party slots. These host tests do not validate native encryption, real stat/HP calculation, saving or an in-game menu. A separate single-action native probe now covers one real HP-IV setter and recalculation; its exact scope is recorded in the [native QA report](qa-stat-editor-native.json). The current array interface requires a contiguous `Pokemon` array; it must not receive a native `Party` object directly.

The native adapter resolves a real party slot through `Party_GetMonByIndex` and passes one complete 236-byte Pokémon to the core. The stat recalculation receives the same base pointer; the party-only tail at offset `0x88` is not its argument. ARM disassembly and field tables were checked. The helper occupies **840 bytes** within a separately guarded 4 KiB block at `0x023D6000–0x023D6FFF`; the existing HM/shop/Repel block is preserved. The isolated candidate passed ROM read-back, unchanged filesystem/overlays and static non-overlap checks. The QA-only runtime probe verified a native setter/recalculation call for one party slot; that probe does not add a player-facing feature.

Additional [host adapter tests](qa-stat-editor-host-adapter.json) now compile the real core and native adapter against the engine's party/Pokémon layouts. They cover selected-slot routing, unchanged other slots, read-only staged previews, EV/IV setters and zero resets, caps, cancellation, malformed party counts and empty/Egg/checksum-failure rejection. PID preservation is checked across the operations. The host stubs record API calls; they do not reproduce native encryption, the real stat/nature formulas or UI confirmation. These tests passed with compiler warnings treated as errors.

## Decision

The current-value read command has passed host tests and an ARM ABI compile, with [root source review](qa-stat-read-host-review.json). It reads the actual EV/IV field after reusing the existing target/data validation, including values already at the cap. This supplies the current → proposed display without subtracting a step from a clamped preview. The portable-menu candidate registers it as command 856 and passes [independent binary review](stat-editor-menu-static-review.md); its native current-value display remains untested.

### Integration progress

The requested final delivery remains reusable EV/IV tools supplied by the Rocket NPC, with staged increments and separate zero resets. The NPC script is an integration test for the native selector and editor bridge; an NPC-only demonstration does not complete the portable-item requirement. Nature control is a separate pending tool/operation. Item launch, Bag return, cancellation and repeat use still require their own implementation and QA.

The chosen portable interface is the existing **Cheat Kit**, upgraded to open separate EV, IV and nature controls from the Bag while retaining its kit-marker role. This avoids allocating additional item IDs with unresolved references. TM Refill and Party Healer remain separate objects. This interface is planned, not present in Alpha 2; staged increments, previews, confirmations and resets remain required.

The global-script insertion helper passed five host tests plus an in-memory check of the exact target bank: all 72 original destinations and script bodies are preserved when adding a new entry. No global-script ROM was written or executed by that check; item launch remains pending.

The isolated native selector now passes cancellation and slot-0 selection, including visible field return after both messages. Independent review verified seven runs and twenty captures, unchanged battery/Bag data, strict native cipher-boundary party matches and feature-reserve guards. No stat setter is called. See the [native QA guide and captures](stat-editor-qa.md). Earlier failed candidates are retained locally; the accepted sequence removes the duplicate window close and unrelated tutor points-box command.

The new command bridge uses a separate explicit table reservation below the editor helper, because the original table cannot grow in place. Native selector/preview QA preserves all three reserved blocks byte for byte. The proposed write/reset dispatch additionally passes static review, but has not been invoked natively. Zero-filled ROM space is not treated as available memory. This work is not included in Alpha 2.

EV and IV editing are technically straightforward through the game’s normal Pokémon data API, with explicit bounds and a stat recalculation. Nature editing is feasible only after integrating a per-Pokémon override throughout the target’s nature consumers. Directly changing personality is not a safe substitute. Treat the three controls as independent operations in the Rocket NPC menu.

The preview-only command bridge has native QA for one HP-IV +1 preview (15 → 16) and cancellation, without writing Pokémon data. A combined candidate now also passes native selection → preview → clean field return in seven runs. Root reproduced its strict party/Bag/battery/reserve audit and two rejection controls. Host tests additionally cover operand order, helper errors and invalid/overlapping outputs. Confirmed editing and the portable tool remain pending. See [native preview evidence](stat-editor-qa.md).

The Sacred Gold Plus source already contains a read-only Summary EV/IV viewer at `source/native-eviv/eviv.c`; it reads the current Pokémon and displays stored values, but does not edit them. The pinned decomp exposes the normal party selector (`ScrCmd_PartySelectUI` / `ScrCmd_GetPartySelection`), `SetMonData`, and `CalcMonStats`. This gives a plausible native interaction path without persistent raw-RAM codes: choose an independent EV, IV, or Nature branch; choose a party Pokémon; choose a stat/value; preview and confirm; then update the Pokémon through its normal data fields. Cancel returns without mutation; eggs must be rejected explicitly. The selector covers the party, not the PC. `field_use_item.c` also dispatches native item callbacks through an item-function table, which could support staged increment/reset objects. That callback table does not itself provide a multi-step stat picker, legality checks, or confirmation UI; an NPC flow still needs an editor menu.

## EV control

Generation IV stores six EV values. The source defines a maximum of **255 per stat** and **510 total**. The usual competitive convention uses 252 effective EVs per stat, but that is not the game’s storage cap. Enforce both game limits on every increment; do not silently impose the competitive convention on an editor.

Offer small, separately selectable stages. A reasonable initial table to evaluate is **+1** for precision, **+4** for the level-100 stat formula’s granularity, and **+10** to match the native vitamin effect. Keep the increments data-driven. Clamp each action to both remaining limits and show the resulting six-value total before confirmation. Any preset is a separate optional action and must pass the same caps; the familiar 252/252/4 spread totals 508, not 510. “Reset EVs” should mean set all six fields to zero; a single-stat clear may be a separate action. It should not imply that previous values can be restored.

The normal vitamin routine is a reference for the existing item flow, but its own per-stat ceiling is 100, so it cannot implement the editor’s full 255 range. After writes, call `CalcMonStats` once. The retail implementation recomputes stats from EVs and IVs; it keeps a fainted Pokémon at 0 HP and otherwise adjusts or clamps current HP against the new maximum.

## IV control

Each of the six IV fields is stored from **0–31**. Edit one stat at a time, with explicit values or bounded steps, and provide a separate **Reset IVs to 0** action. There is no stored “original IV” value to restore. Do not label zeroing as restoration. IV edits affect calculated stats and Hidden Power’s type/power; these derived values should be included in acceptance checks. Recalculate stats after the complete edit, not after each field.

`SetMonData` updates the normal Pokémon structure and handles the engine’s encryption/checksum path. The API does not enforce every editor policy for you: validate bounds and aggregate EV totals before calling it. Verify both party and PC persistence through an ordinary save/reload before claiming support for stored Pokémon.

## Nature control

In this generation, nature is `personality % 25`; the pinned decomp has no `MON_DATA_NATURE` setter. Its `SetMonData` personality case writes the field, while `SetMonPersonality` is the routine that also reorders encrypted substructures and recomputes the checksum. Neither makes PID rewriting semantically safe: PID bits also determine gender, ability slot, shininess, Unown form, Spinda’s spots, and Wurmple’s evolution branch. A new PID can therefore alter traits unrelated to the requested nature. Restoring the previous nature after a PID change also requires retaining the original PID.

Prefer a **mint-style override** stored with the Pokémon while leaving PID untouched. Define “Reset nature” as clearing the override and returning to the PID-derived nature; no backup is then needed. The HG Engine checkout offers a useful pattern: it stores a nature-plus-one value in reserved per-Pokémon bits and has a helper to read the override. That is a design lead, not a drop-in implementation. At pinned commit `fafdb1830a74e82862e89d0ea931bbb97ae1598d`, the checked source calls that getter from Summary display code; the retail `CalcMonStats` path still uses `GetMonNature`, and the helper that applies the override to stats has no other source call sites in that checkout. The bitfield is also shared there with ability-slot and IV-override flags. Before reuse, audit the exact Plus target’s reserved data, every stat/battle/Summary/flavour/Pokéathlon/evolution consumer, encryption/checksum behavior, and save/PC round trips. Do not claim that `SetMonData(MON_DATA_NATURE)` works.

## UI, storage, and memory constraints

Use the native party-selection flow, reject the cancel sentinel and eggs, and confirm destructive reset actions. The editor should change normal Pokémon save data through APIs, not leave cheat codes or raw RAM edits active. Fainted Pokémon may remain fainted after stat changes. A first version can be party-only; boxed Pokémon require a separate PC workflow.

The [reserve register](native-reserve.json) records allocations for each exact candidate. The HM and shop blocks are assigned. The interval `0x023D7D00..0x023D7F00` (512 bytes) is free in fix5 but assigned to Repel reuse in fix6a. The isolated stat-editor probe allocates a separate measured 4 KiB below that reserve. A temporary QA-only replacement for Party Healer item 114 changed one Pokémon's HP IV from 15 to 31, recalculated HP/max HP from 22 to 23, then passed ordinary save and cold reload on the same candidate hash. This does not verify an editor menu, runtime preview/reset/bounds, EV edits, PC storage or Alpha2. The probe is not downloadable; see the [QA report](qa-stat-editor-native.json). Reuse existing menus and text facilities where possible; never overwrite the Repel block.

## Next implementation gate

1. Audit the exact target’s Pokémon reserved fields and nature consumers before choosing an override representation.
2. Connect the tested EV/IV core to native party selection, preview and confirmation. Preserve the tested stages and zero-reset semantics; validate fainted Pokémon in-game.
3. Build the menu and setter path only after a measured reserve assignment; verify the actual target and source/hash provenance.
4. Test displayed EV/IV/nature, recalculated stats and HP behavior, PID-correlated traits, ordinary save/restart, and party↔PC storage. Preserve a failed case as evidence; static source inspection is not runtime acceptance.

## Evidence and pinned sources

- Sacred Gold Plus source snapshot: commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`; [read-only EV/IV viewer](https://github.com/Umberto-DEV/sacred-gold-plus/blob/5b90a788ac3c7d1e4733b4d175a97811cc6745a3/source/native-eviv/eviv.c), plus local contracts in `source/docs/contracts.md`.
- Pokémon data and limits: [pinned PokeHeartGold Pokémon constants](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/include/constants/pokemon.h), [Pokémon setters and stat calculation](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/pokemon.c), and [native item EV logic](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/use_item_on_mon.c).
- Native selection flow: [script Pokémon selection](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/scrcmd_c.c) and [party menu](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/party_menu.c).
- Mint-style comparison: HG Engine local source snapshot at commit `fafdb1830a74e82862e89d0ea931bbb97ae1598d`, particularly `include/pokemon.h`, `src/pokemon.c`, `src/summary.c`, and `src/individual/PartyMenu_HandleUseItemOnMon.c`. The public repository is [BluRosie/hg-engine](https://github.com/BluRosie/hg-engine); the pinned local checkout is the evidence for the commit-specific call-site findings above.
- Gen IV EV conventions: [Smogon DP stat mechanics](https://www.smogon.com/dp/articles/stats) and [EVs/IVs across generations](https://www.smogon.com/smog/issue28/evs_ivs).

---

## Español

# Editor de EV, IV y Naturaleza del NPC Rocket — Viabilidad

**Estado:** la candidata de texto `99810da…0684a` supera revisión independiente de IV de PS +1, EV de PS +4 y reinicios EV/IV separados, incluidos No, escrituras confirmadas exactas y persistencia tras guardado nativo/arranque en frío. IV +5 y Repeat están en QA nativa. Faltan otras estadísticas/pasos, límites, equipo↔PC, naturalezas e integración en la descarga. La ROM del jugador y la descarga siguen intactas. Véanse el [QA nativo actual y sus límites](stat-editor-qa.md).

## Núcleo de edición implementado

El helper C previsualiza incrementos EV de **+1/+4/+10** e IV de **+1/+5**, limitándolos a la capacidad individual y total restante. La previsualización no llama a ningún setter. Los valores confirmados usan `SetMonData` y después un único `CalcMonStats`; los reinicios separados ponen a cero los seis EV o los seis IV. Rechaza cancelación, posiciones inválidas, huecos vacíos y huevos. La API nativa también presenta un checksum fallido como huevo; la prueba host reproduce ese comportamiento. PID y naturaleza permanecen intactos.

El helper y las pruebas son archivos locales de ingeniería: `internal/stat-editor/stat_editor.c/.h` y `qa/stat_editor_host_test.py`. La prueba host compila el mismo helper con APIs simuladas y constantes del juego fijado. Comprueba los límites exactos de 255/510 EV y 31 IV, desbordamientos rechazados, incrementos limitados, previsualización sin escrituras, selección del objetivo y conservación del resto del equipo. Estas pruebas host no validan el cifrado nativo, el cálculo real de estadísticas/PS, el guardado ni un menú del juego. Una sonda nativa separada cubre un solo setter y recálculo real de un IV de PS; su alcance exacto figura en el [informe QA nativo](qa-stat-editor-native.json). La interfaz actual exige un array contiguo de `Pokemon`; no debe recibir directamente un objeto nativo `Party`.

El adaptador nativo resuelve una posición real mediante `Party_GetMonByIndex` y pasa al núcleo un Pokémon completo de 236 bytes. El recálculo recibe ese mismo puntero base; su argumento no es el bloque parcial en `0x88`. Se revisaron desensamblado ARM y tablas de campos. El helper ocupa **840 bytes** dentro de un bloque separado de 4 KiB con guardas en `0x023D6000–0x023D6FFF`; se conserva el bloque MO/tienda/repelentes. La candidata aislada superó lectura posterior de ROM, conservación de archivos/overlays y ausencia estática de solapes. La sonda de QA verificó una llamada nativa al setter y al recálculo en una posición del equipo; no añade una función para jugadores.

Las [pruebas host adicionales del adaptador](qa-stat-editor-host-adapter.json) compilan ahora el núcleo y el adaptador reales con las estructuras del equipo y Pokémon del motor. Cubren la selección correcta, otros miembros intactos, vista previa por etapas sin escrituras, setters EV/IV y reinicios a cero, límites, cancelación, contadores de equipo inválidos y rechazo de huecos vacíos, huevos o fallo de checksum. Comprueban el PID intacto en esas operaciones. Los stubs registran llamadas a la API; no reproducen el cifrado nativo, las fórmulas reales de estadísticas/naturaleza ni la confirmación de la UI. Pasaron con los avisos del compilador tratados como errores.

## Decisión

El comando para leer el valor actual supera pruebas host y compilación con ABI ARM, con [revisión de fuente de root](qa-stat-read-host-review.json). Lee el campo EV/IV real tras reutilizar la validación existente del objetivo y sus datos, incluidos valores en el límite. Permite mostrar actual → propuesto sin restar un paso a una propuesta limitada. La candidata portátil lo registra como comando 856 y supera la [revisión binaria independiente](stat-editor-menu-static-review.md); falta probar nativamente su visualización del valor actual.

### Progreso de integración

La entrega final solicitada sigue siendo disponer de herramientas reutilizables de EV/IV entregadas por el NPC Rocket, con incrementos por etapas y reinicios a cero separados. El script del NPC es una prueba de integración del selector y el editor; una demostración que solo funcione hablando con él no completa el requisito de objetos portátiles. La naturaleza es otra herramienta/operación pendiente. Abrir desde la Bolsa, volver a ella, cancelar y reutilizar siguen necesitando implementación y QA propios.

La interfaz portátil elegida es el **Cheat Kit (Kit de trucos)** existente: abrirá controles separados de EV, IV y naturaleza desde la Bolsa y conservará su función de marcador del kit. Así no se asignan nuevos IDs con referencias pendientes de aclarar. TM Refill (Recarga MT) y Party Healer (Curador del equipo) siguen siendo objetos separados. Esta interfaz está planificada y no está en Alpha 2; se mantienen como requisitos los incrementos por etapas, vista previa, confirmación y reinicios.

El helper de inserción del script global pasó cinco pruebas host y una comprobación en memoria del banco exacto: conserva los 72 destinos y cuerpos originales al añadir una entrada. Esa comprobación no escribió una ROM ni ejecutó el script global; sigue pendiente abrirlo desde un objeto.

El selector nativo aislado ya supera cancelación y elección de la posición 0, con vuelta visible al mapa tras ambos mensajes. La revisión independiente verificó siete ejecuciones y veinte capturas, batería y Bolsa intactas, equipo coincidente mediante fronteras nativas de cifrado estrictas y guardas de reserva correctas. No se llama a ningún setter. Consulta la [guía QA con capturas](stat-editor-qa.md). Se conservan localmente las candidatas fallidas; la secuencia aceptada elimina el cierre duplicado y el comando ajeno del cuadro de puntos del tutor.

El puente nuevo usa una reserva explícita para la tabla por debajo del helper del editor, porque la tabla original no admite ampliación en su ubicación. El QA nativo de selector/previsualización conserva los tres bloques reservados byte por byte. El dispatch propuesto para modificar/reiniciar también supera la revisión estática, pero aún no se ha invocado dentro del juego. Los ceros de la ROM no se consideran memoria disponible por sí solos. Este trabajo no está incluido en Alpha 2.

Editar EV e IV es técnicamente directo mediante la API normal de datos Pokémon, con límites explícitos y recálculo de estadísticas. Editar la naturaleza sólo es viable tras integrar un override por Pokémon en todos los consumidores de naturaleza del objetivo. Cambiar la personalidad directamente no es una alternativa segura. Los tres controles deben ser operaciones independientes en el menú del NPC Rocket.

El puente de solo previsualización tiene QA nativo para un incremento de IV de PS +1 (15 → 16) y cancelación, sin escribir datos del Pokémon. Una candidata combinada ya supera también selección nativa → propuesta → vuelta limpia al campo en siete ejecuciones. Root reprodujo su auditoría estricta de equipo/Bolsa/batería/reservas y dos controles de rechazo. Las pruebas host cubren además orden de operandos, errores del núcleo y salidas inválidas o solapadas. Faltan la edición confirmada y la herramienta portátil. Consulta la [evidencia nativa](stat-editor-qa.md).

Sacred Gold Plus ya incluye un visor de EV/IV de solo lectura en el resumen, en `source/native-eviv/eviv.c`; lee el Pokémon actual y muestra sus valores, pero no los modifica. El decomp fijado expone el selector nativo del equipo (`ScrCmd_PartySelectUI` / `ScrCmd_GetPartySelection`), `SetMonData` y `CalcMonStats`. Esto permite una ruta de interacción nativa plausible sin códigos persistentes de RAM: elegir una rama independiente para EV, IV o Naturaleza; elegir Pokémon del equipo; elegir estadística/valor; mostrar una vista previa y confirmar; después, actualizar los campos normales del Pokémon. Cancelar no modifica datos y hay que rechazar los huevos explícitamente. El selector cubre el equipo, no el PC. `field_use_item.c` también despacha callbacks nativos mediante una tabla de funciones por objeto, que podría servir para objetos de incremento escalonado o reinicio. La tabla no incluye por sí sola selector multi-paso de estadística, límites legales ni confirmación; el flujo NPC aún necesita un menú editor.

## Control de EV

La cuarta generación almacena seis valores EV. El código define un máximo de **255 por estadística** y **510 en total**. La convención competitiva suele usar 252 EV efectivos por estadística, pero ese no es el límite de almacenamiento del juego. El editor debe respetar ambos límites del juego en cada incremento, sin imponer silenciosamente la convención competitiva.

Ofrece incrementos pequeños y seleccionables. Una tabla inicial razonable para evaluar sería **+1** para precisión, **+4** por la granularidad de la fórmula de estadísticas a nivel 100 y **+10** para coincidir con el efecto de las vitaminas nativas. Mantén los incrementos configurables. Limita cada acción según el espacio restante por estadística y el total, y muestra los seis valores resultantes antes de confirmar. Los presets son opcionales y deben pasar los mismos límites; la distribución habitual 252/252/4 suma 508, no 510. «Reiniciar EV» debe significar poner los seis campos a cero; se puede ofrecer además borrar una sola estadística. No debe prometer recuperar valores anteriores.

La rutina nativa de vitaminas sirve como referencia para el flujo de objetos, pero su propio límite por estadística es 100, así que no permite cubrir el rango completo de 255. Después de escribir, llama una vez a `CalcMonStats`. La implementación retail recalcula las estadísticas desde EV e IV; conserva a 0 PS a un Pokémon debilitado y, si está vivo, ajusta o limita los PS actuales al nuevo máximo.

## Control de IV

Cada uno de los seis campos IV admite **0–31**. Edita una estadística cada vez, con valores explícitos o pasos limitados, y ofrece aparte **Reiniciar IV a 0**. No existe un valor «IV original» almacenado que pueda restaurarse. No presentes el cero como restauración. Los IV modifican las estadísticas calculadas y el tipo/potencia de Poder Oculto; esas derivaciones deben incluirse en las pruebas de aceptación. Recalcula tras completar la edición, no después de cada campo.

`SetMonData` actualiza la estructura normal del Pokémon y recorre la ruta de cifrado/suma de comprobación del motor. La API no aplica por sí sola todas las políticas del editor: valida límites y suma total de EV antes de llamarla. Antes de declarar compatibilidad con Pokémon almacenados, verifica la persistencia del equipo y del PC mediante guardar y volver a cargar normalmente.

## Control de naturaleza

En esta generación la naturaleza es `personalidad % 25`; el decomp fijado no tiene un setter `MON_DATA_NATURE`. El caso de personalidad de `SetMonData` escribe el campo, mientras que `SetMonPersonality` es la rutina que también reordena los subbloques cifrados y recalcula la suma de comprobación. Ninguna opción vuelve semánticamente segura la reescritura del PID: sus bits determinan también sexo, habilidad, variocolor, forma de Unown, manchas de Spinda y rama evolutiva de Wurmple. Por tanto, un PID nuevo puede cambiar rasgos ajenos a la naturaleza solicitada. Para recuperar la naturaleza previa después de cambiar PID también habría que conservar el PID original.

Se recomienda un **override tipo Menta** guardado con el Pokémon y sin alterar el PID. «Reiniciar naturaleza» significaría borrar el override y recuperar la naturaleza derivada del PID; así no hace falta una copia de respaldo. El checkout de HG Engine ofrece un patrón útil: guarda un valor naturaleza+1 en bits reservados por Pokémon y tiene una función para leer el override. Es una referencia de diseño, no una implementación lista para copiar. En el commit fijado `fafdb1830a74e82862e89d0ea931bbb97ae1598d`, el código revisado llama a esa función desde el resumen; `CalcMonStats` retail sigue usando `GetMonNature`, y la función auxiliar que aplica el override a estadísticas no tiene otras llamadas fuente en ese checkout. Además, ese campo comparte bits con flags de ranura de habilidad y override de IV. Antes de reutilizarlo hay que auditar los datos reservados del objetivo Plus exacto, todos los consumidores de estadísticas/combate/resumen/sabores/Pokéathlon/evolución, el cifrado/suma de comprobación y los ciclos de guardado/PC. No afirmes que funciona `SetMonData(MON_DATA_NATURE)`.

## Interfaz, persistencia y reserva

Usa el selector nativo del equipo, rechaza el valor de cancelación y los huevos, y pide confirmación para reinicios destructivos. El editor debe modificar los datos normales de guardado mediante APIs, sin dejar códigos activos ni escrituras persistentes de RAM. Un Pokémon debilitado puede seguir a 0 PS tras cambiar sus estadísticas. La primera versión puede limitarse al equipo; editar Pokémon del PC requiere otro flujo.

El [registro de reserva](native-reserve.json) recoge las asignaciones de cada candidata exacta. Los bloques de MO y tiendas están asignados. El intervalo `0x023D7D00..0x023D7F00` (512 bytes) está libre en fix5, pero asignado a los repelentes reutilizables en fix6a. El prototipo aislado del editor asigna otros 4 KiB medidos por debajo de esa reserva. Una sustitución temporal de QA del callback del Party Healer 114 cambió un IV de PS de 15 a 31, recalculó PS/PS máx. de 22 a 23 y superó el guardado y la recarga en frío con el mismo hash de candidata. No valida el menú, la previsualización, reinicios o límites en runtime, edición EV, almacenamiento del PC ni Alpha2. La sonda no es descargable; consulta el [informe QA](qa-stat-editor-native.json). Conviene reutilizar menús y texto existentes; nunca sobrescribir el bloque de repelentes.

## Próxima puerta de implementación

1. Auditar los campos reservados y consumidores de naturaleza del objetivo exacto antes de escoger el almacenamiento del override.
2. Conectar el núcleo EV/IV probado al selector nativo, previsualización y confirmación. Conservar los incrementos y reinicios a cero probados; validar Pokémon debilitados dentro del juego.
3. Construir menú y setter solo después de asignar una reserva medida; verificar objetivo real y procedencia de hashes.
4. Probar valores mostrados de EV/IV/naturaleza, recálculo y PS, rasgos correlacionados con PID, guardado/reinicio y equipo↔PC. Conservar los fallos como evidencia; el análisis estático no equivale a aceptación en runtime.

## Evidencia y fuentes fijadas

- Snapshot de Sacred Gold Plus: commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`; [visor EV/IV de solo lectura](https://github.com/Umberto-DEV/sacred-gold-plus/blob/5b90a788ac3c7d1e4733b4d175a97811cc6745a3/source/native-eviv/eviv.c), además del contrato local en `source/docs/contracts.md`.
- Datos y límites Pokémon: [constantes PokeHeartGold fijadas](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/include/constants/pokemon.h), [setters y recálculo de estadísticas](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/pokemon.c) y [lógica nativa de EV en objetos](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/use_item_on_mon.c).
- Selector nativo: [selección de Pokémon desde scripts](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/scrcmd_c.c) y [menú del equipo](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/src/party_menu.c).
- Comparación tipo Menta: snapshot local HG Engine, commit `fafdb1830a74e82862e89d0ea931bbb97ae1598d`, en particular `include/pokemon.h`, `src/pokemon.c`, `src/summary.c` y `src/individual/PartyMenu_HandleUseItemOnMon.c`. El repositorio público es [BluRosie/hg-engine](https://github.com/BluRosie/hg-engine); el checkout local fijado respalda los hallazgos sobre llamadas de ese commit.
- Convenciones EV de cuarta generación: [mecánica de estadísticas DP de Smogon](https://www.smogon.com/dp/articles/stats) y [EV/IV por generación](https://www.smogon.com/smog/issue28/evs_ivs).

---

Made with 🖤 in Barcelona City 🇪🇸 · Hecho con 🖤 en Barcelona City 🇪🇸
