# Documentation export 12 / Exportación documental 12

## English

Immutable local delivery of the reviewed Kris battle-source map, tracked under existing issue #4. No Kris graphics, ROM changes, runtime acceptance or publication is included.

- Manifest SHA-256: `1c8f2ece31519ec9b1413f4f71dfd34d7111daee279d53d81f58f35877ea2b07`.
- Stable source snapshot: `4dcb7fe0868da870d72c4fe384ef09854cc04cb30366abc6c7e7c032a7469691`, identical at start/end.
- Existing V4 exporter: `d02e9c790c92ffa2314ea486534946ad76b19e43d694d38681219b3af26132c4`; 1,654 exported files, five exclusions and 137 hash rewrites.
- Two copied builds are idempotent; final inventory SHA-256 `ac4a7abadeaac9fc13c4497c4e12384ccff571cf869e11a22a5bad2a0a078485`.
- Root independently checked every frozen file hash, size, mode and exact inventory; no symlinks, additions or removals.

### Exact delta from export 11

| Modified game path | Final SHA-256 |
| --- | --- |
| `docs/kris-feasibility.md` | `8cfd83f0315cf386debe474ff62c8f22e1237b43a2b0b3e60f328bea0787dff8` |
| `docs/kris-asset-provenance.json` | `4045a18bc1536130b68baae1ea2507ada39e222ccfb1b63094b7972604d974cc` |
| `web/data/kris-asset-provenance.json` | `4045a18bc1536130b68baae1ea2507ada39e222ccfb1b63094b7972604d974cc` |
| `web/data/wiki-data.json` | `e1e1cfb6d4584a080ac18cf4355f75140a152ced70294ad6fead3a127e74deae` |

There are no other changed game files. The provenance JSON adds only `battle_source_map`; existing art provenance and acceptance limits remain unchanged. English/Spanish guide text preserves the source-only scope.

Pinned original source `pret/pokeheartgold@6988158691eb6178cff697cda0428045ddcba5fb` maps female/Lyra class 1 to front archive 58/member 5. Back archive 6 uses ordinary backpic 1/member 5, but the `isLink == TRUE` branch uses backpic 16/member 80. Associated NCLR/NCER/NANR/NCBR offsets are +1/+2/+3/+4. Root caught the omitted link branch in the initial draft before delivery; independent review confirmed the corrected conditions and arithmetic. Trainer Card female selection remains unresolved. This is not target-ROM validation, asset compatibility, licensing permission or runtime acceptance.

Engineering report SHA-256: `6bca940803b250b2a46f9b1291105e806d3c86054f2539cc985e01a01df2f8ef`. Independent review SHA-256: `6b84f878d6ea84b1ccd1525dc094d0f36740e293eeca20439730fe8937fd4a16`.

Source build, one targeted metadata test, scoped whitespace checks and generated EN/ES guide checks passed. A verification lookup initially used the filename as the guide ID; it was corrected to the existing `kris` alias, with no product change. No code edit, Argot initialization, new engine source, asset, emulation or browser action occurred. Receivers should verify the frozen files without rebuilding inside the export. All prior snapshots and local commits remain preserved; the deployed baseline remains snapshot 08 at `269f9690ca1037425698e21c87ed9ab97c0e6936`.

## Español

Entrega documental local e inmutable del mapa de combate revisado de #4. No incluye gráficos de Kris, cambios en la ROM, aceptación en ejecución ni publicación.

La tabla y los hashes anteriores son comunes a ambos idiomas. El delta frente a la exportación 11 modifica exactamente cuatro archivos: guía, procedencia, copia web de procedencia y datos wiki. No añade ni elimina archivos. El JSON solo incorpora `battle_source_map`; la procedencia del arte y los límites anteriores siguen intactos.

La fuente original fijada asigna la clase femenina Lyra 1 al frontal archivo 58/miembro 5. El reverso del archivo 6 usa backpic ordinario 1/miembro 5, o backpic 16/miembro 80 en la rama `isLink == TRUE`, con recursos asociados en +1/+2/+3/+4. Root detectó la rama link omitida en el borrador y la revisión independiente confirmó la corrección. La selección femenina de Trainer Card sigue sin resolverse. No se demuestra compatibilidad con la ROM objetivo, permisos del arte ni comportamiento en ejecución.

Se verificaron los 1.654 archivos congelados y dos compilaciones idempotentes, sin enlaces simbólicos ni otros cambios. Pasaron compilación de origen, una prueba específica de metadatos, espacios y contenido EN/ES. La comprobación del ID de guía se corrigió al alias existente `kris`, sin modificar el producto. No hubo código, nuevas fuentes, assets, emulación, navegador ni inicialización de Argot.

Comprobar la entrega sin recompilar dentro de ella. Se conservan las instantáneas y commits anteriores; la base desplegada sigue siendo la 08. #4 continúa abierta y sin aceptación global o permiso de integración.
