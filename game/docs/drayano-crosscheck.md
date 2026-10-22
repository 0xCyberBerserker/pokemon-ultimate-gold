# Drayano cross-check / Cruce Drayano

## English

The supplied official online sources were checked for the requested original spreadsheet. GBAtemp identifies Drayano and v1.05 and links the release materials; the official Drive listing exposes historical PDFs/TXT and patch ZIPs, but no `.xls` or `.xlsx`. See the detailed record in external `night-sprint/sources/drayano-docs/SOURCE_STATUS.md`. The online source therefore does not provide a spreadsheet to download or hash.

The delivered derived files compare our exact target export (`species-493.json`, candidate SHA-256 `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`) with the local original v1.05 ROM-derived export (`DRAYANO_PERSONAL-export.json`, original SHA-256 `49f29848878406990ea288f26872d4355c92c4a2677f56973750bbf2566c13c1`). The comparison is factual for base stats, type IDs and ability IDs across all 493 National IDs.

`drayano-derived-493.csv` has one row per ID and change flags. `drayano-derived-493.json` records source hashes, counts and exact differing fields. Moves and trainers are marked unavailable for a row-level cross-check: the official online material exposes prose/PDF/TXT references, while the two machine exports do not carry a common normalized moveset/trainer schema. They are not silently inferred.

## Español

Las fuentes online oficiales indicadas se revisaron buscando la hoja original. GBAtemp identifica a Drayano y la v1.05 y enlaza los materiales de release; Drive muestra PDFs/TXT históricos y ZIP de parches, pero ningún `.xls` o `.xlsx`. El detalle está en `night-sprint/sources/drayano-docs/SOURCE_STATUS.md`, fuera de este repo. Por tanto no hay Excel online que descargar o hashear.

Los derivados comparan nuestro target exacto (`species-493.json`, SHA-256 `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`) con el export derivado de la ROM original v1.05 local (`DRAYANO_PERSONAL-export.json`, SHA de la ROM original `49f29848878406990ea288f26872d4355c92c4a2677f56973750bbf2566c13c1`). El cruce es factual para estadísticas base, IDs de tipo e IDs de habilidades en las 493 IDs Nacionales.

`drayano-derived-493.csv` contiene una fila por ID y flags de cambio. `drayano-derived-493.json` conserva hashes, recuentos y campos distintos. Movimientos y entrenadores quedan como no disponibles para cruce fila a fila: las fuentes online aportan prosa/PDF/TXT y los exports de máquina no comparten un esquema normalizado. No se infieren silenciosamente.
