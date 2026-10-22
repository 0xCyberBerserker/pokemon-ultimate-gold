# FIX5 HM event-bank audit

## English

**Static result: the source-decomp Cut and Rock Smash positions do not match the exact FIX5 event records.** The Strength rock does match. This is ROM-data inspection only; no emulator run or HM acceptance is claimed.

The audited ROM is `@HOME@/Games/Sacred-Gold/experiments/owned-hm/qa-kit-shop-owned-hm-paged-fix5.nds`, SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Its `a/0/3/2` EVENT NARC SHA-256 is `a72688a68f2683bba77e6ba1582247c5d3a8ef4c958c817d919601824c639606`.

Map IDs came from the exact ROM’s `fielddata/maptable/mapname.bin`; each `eventsBank` came from that map’s 24-byte MapHeader at ARM9 offset `0xF6BE0` plus `0x10`. The resulting pairs are R29 `33→30`, R32 `36→33`, and D42R0102 `176→169`.

| Map / bank SHA-256 | Exact object record: ID / model / script / local tile XZ | Decomp reference position | Static result |
|---|---|---|---|
| R29 / `853cef01…30205e39` | Cut trees: `4/86/10000/(6666,6666)` and `5/86/10000/(6666,6666)` | `(629,401)`, `(619,405)` | Rows exist, but neither carries the source placement. A positioned same-map event exists at `10/326/4/(629,405)` (decomp label `obj_R29_gswoman2_2`). |
| R32 / `f5470083…94c9e53` | Cut tree: `2/86/10000/(0,0)`; Rock Smash: `15/85/10001/(0,0)` | `(462,320)`, `(471,439)` | Both rows exist at coordinates different from the source reference. A positioned same-map event exists at `17/87/7063/(475,439)` (decomp label `obj_R32_monstarball_4`). |
| D42R0102 / `e00b8cfd…e66a901` | Strength rock: `0/84/10002/(28,20)` | `(28,20)` | Exact coordinates match. A same-map Rock Smash event is `1/85/10001/(17,17)`. |

### Exact-ROM candidate scan

The extractor mapped all 540 exact-ROM MapHeaders to their `eventsBank` and scanned all 491 referenced EVENT NARC members once. It kept model IDs 84, 85, and 86, excluding only coordinate pairs `(0,0)` and `(6666,6666)`. It found 38, 101, and 24 valid-position records respectively (after excluding 0, 2, and 24 placeholders). The table lists up to two deterministic candidates per model; Strength `(28,20)` is kept first because it is the already source-checked target above.

| Model / mapID / map token / bank | Object / script / eventFlag / exact local XZ | EVENT bank SHA-256 |
|---|---|---|
| 84 / 176 / D42R0102 / 169 | `0 / 10002 / 0 / (28,20)` | `e00b8cfd…e66a901` |
| 84 / 124 / D43R0101 / 121 | `3 / 10002 / 0 / (43,52)` | `af94ac51…b49d1d47` |
| 85 / 7 / D18R0101 / 5 | `8 / 10001 / 16 / (5,22)` | `e4c65b11…0057771bc` |
| 85 / 7 / D18R0101 / 5 | `9 / 10001 / 17 / (6,23)` | `e4c65b11…0057771bc` |
| 86 / 16 / R08 / 13 | `8 / 10000 / 16 / (1375,246)` | `f1f62bdc…941d61dac5` |
| 86 / 16 / R08 / 13 | `9 / 10000 / 17 / (1384,242)` | `f1f62bdc…941d61dac5` |

These are mechanically selected static candidates, not gameplay-tested targets. Local source `MapObject_CreateFromObjectEventWithId` checks `FieldSystem_FlagCheck(eventFlag)` and creates the object only when the flag is false; a set flag can suppress creation. The exact eventFlag is shown above, but current save flag state and visibility were not assessed. The JSON contains full bank hashes, each chosen MapHeader hash, all 540 `mapID→eventsBank` mappings, per-model counts, and the source hash.

The first three values in each record are exact ROM `object_id/model_id/script_id`; the parenthesized position is the exact binary X/Z. Decomp object names and script labels in parentheses are references only: those names are not stored in the event records. The full per-bank hashes and record evidence are in [the JSON report](qa-hm-events.json).

The local-to-runtime map-tile conversion is identity: the event `ObjectEvent.x/z` values initialize the runtime map-object tile coordinates directly. The renderer centers a tile at `(16*x+8, 16*z+8)` units before fixed-point conversion. No cross-map origin was inferred, so these are map-local field coordinates, not a fabricated Johto-wide coordinate system. Source references and hashes for the struct and conversion path are recorded in the JSON.

## Español

**Resultado estático: las posiciones de Corte y Golpe Roca del decomp no coinciden con los registros de eventos de FIX5. La roca de Fuerza sí coincide.** Es una inspección de datos de la ROM; no hubo emulación ni se afirma aceptación de ninguna MO.

La ROM auditada es `@HOME@/Games/Sacred-Gold/experiments/owned-hm/qa-kit-shop-owned-hm-paged-fix5.nds`, SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. El SHA-256 de su EVENT NARC `a/0/3/2` es `a72688a68f2683bba77e6ba1582247c5d3a8ef4c958c817d919601824c639606`.

Los mapID se obtuvieron de `fielddata/maptable/mapname.bin` de esa ROM. Para cada mapa, `eventsBank` se leyó del MapHeader de 24 bytes en ARM9, offset `0xF6BE0 + 0x10`. Los pares resultantes son R29 `33→30`, R32 `36→33` y D42R0102 `176→169`.

| Mapa / SHA-256 del banco | Registro exacto: ID / modelo / script / XZ local | Posición de referencia del decomp | Resultado estático |
|---|---|---|---|
| R29 / `853cef01…30205e39` | Árboles de Corte: `4/86/10000/(6666,6666)` y `5/86/10000/(6666,6666)` | `(629,401)`, `(619,405)` | Existen las filas, pero ninguna conserva la posición de referencia. Hay un evento colocado en el mismo mapa: `10/326/4/(629,405)` (etiqueta de decomp `obj_R29_gswoman2_2`). |
| R32 / `f5470083…94c9e53` | Árbol de Corte: `2/86/10000/(0,0)`; roca de Golpe Roca: `15/85/10001/(0,0)` | `(462,320)`, `(471,439)` | Ambas filas tienen coordenadas distintas de la referencia. Hay un evento colocado en el mismo mapa: `17/87/7063/(475,439)` (etiqueta de decomp `obj_R32_monstarball_4`). |
| D42R0102 / `e00b8cfd…e66a901` | Roca de Fuerza: `0/84/10002/(28,20)` | `(28,20)` | Las coordenadas exactas coinciden. También hay una roca de Golpe Roca en `1/85/10001/(17,17)`. |

### Barrido de candidatos en la ROM exacta

El extractor relacionó los 540 MapHeader de la ROM con su `eventsBank` y recorrió una vez los 491 miembros referenciados del EVENT NARC. Conservó los modelos 84, 85 y 86 y excluyó únicamente los pares de coordenadas `(0,0)` y `(6666,6666)`. Encontró 38, 101 y 24 registros con posición válida, respectivamente (tras excluir 0, 2 y 24 placeholders). La tabla muestra hasta dos candidatos deterministas por modelo; Fuerza `(28,20)` aparece primero porque ya se contrastó con la fuente arriba.

| Modelo / mapID / token / banco | Objeto / script / eventFlag / XZ local exacto | SHA-256 del banco EVENT |
|---|---|---|
| 84 / 176 / D42R0102 / 169 | `0 / 10002 / 0 / (28,20)` | `e00b8cfd…e66a901` |
| 84 / 124 / D43R0101 / 121 | `3 / 10002 / 0 / (43,52)` | `af94ac51…b49d1d47` |
| 85 / 7 / D18R0101 / 5 | `8 / 10001 / 16 / (5,22)` | `e4c65b11…0057771bc` |
| 85 / 7 / D18R0101 / 5 | `9 / 10001 / 17 / (6,23)` | `e4c65b11…0057771bc` |
| 86 / 16 / R08 / 13 | `8 / 10000 / 16 / (1375,246)` | `f1f62bdc…941d61dac5` |
| 86 / 16 / R08 / 13 | `9 / 10000 / 17 / (1384,242)` | `f1f62bdc…941d61dac5` |

Son candidatos estáticos seleccionados mecánicamente; no se probaron en el juego. La fuente local `MapObject_CreateFromObjectEventWithId` consulta `FieldSystem_FlagCheck(eventFlag)` y crea el objeto sólo si el flag es falso; un flag activo puede suprimir su creación. La tabla muestra el `eventFlag` exacto, pero no se inspeccionó el estado actual de flags de ningún guardado ni la visibilidad. El JSON incluye hashes completos de bancos y MapHeader, los 540 mapeos `mapID→eventsBank`, los conteos por modelo y el hash de la fuente.

Los tres primeros valores de cada registro son `object_id/model_id/script_id` exactos de la ROM; la posición entre paréntesis es el X/Z binario exacto. Los nombres de objetos y scripts del decomp son sólo referencias: esos nombres no están almacenados en los registros de eventos. El [informe JSON](qa-hm-events.json) conserva los hashes completos y la evidencia por registro.

La conversión de casillas locales del evento a casillas runtime del mapa es identidad: `ObjectEvent.x/z` inicializan directamente las coordenadas de casilla del objeto. El motor centra la casilla en `(16*x+8, 16*z+8)` unidades antes de convertir a punto fijo. No inferí un origen entre mapas; son coordenadas de campo por mapa, no un sistema Johto global inventado. El JSON registra fuentes y hashes del struct y de esta conversión.
