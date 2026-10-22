# Sources inventory / Inventario de fuentes

## English

Paths under `project/docs/` are relative links delivered by this repo. `documentation/` and `night-sprint/` are external source trees beside the repo, so they are identified by path, URL/pin and hash rather than as repo-relative links. Archives in local evidence/patch trees were inspected for documentation and spreadsheet-like files; no additional usable spreadsheet was found in the inspected local sources. This records “not found in local sources”, not global absence. Hashes are SHA-256.

| Source | Size | SHA-256 | Status / use |
| --- | ---: | --- | --- |
| `documentation/Manual/Evolution Changes.pdf` | 87,217 | `ec7e4b621de769639eee2363f09919e14e8ceec31b5f172d52e49008c878a5bf` | Tier C, extracted/read |
| `documentation/Manual/Pokemon Changes.pdf` | 309,462 | `ca556989399a76f4cd99896d79ea5142a13a34cf862f9898a7e7787a04e25dfb` | Tier C, extracted/read |
| `documentation/Manual/Pokemon Locations.pdf` | 1,510,542 | `61fe3cc6cd975454855ccc9bb33fc23484919fbc1bc7a41c9200a595cfd0d477` | Tier C, extracted/read |
| `documentation/Manual/Important Item Locations.pdf` | 154,315 | `85597de371b2b41e0071d7a9db38c9274298a04c40f87dae8e156e0e7f89056a` | Tier C, extracted/read |
| `documentation/Manual/Special Event Guide.pdf` | 674,044 | `b672fb8d46a4bdc92bf3fe89b6d08f4a45ba6f370b8a8bb3cd095695c8ca58fd` | Tier C, extracted/read |
| `documentation/Manual/Game Guide.txt` | 10,463 | `3f3d046acf84a2d7792961a8b569dc7c197c4a2f246c41d091d4e8b86ba0ff9a` | Tier C, Plus context |
| `documentation/Manual/SS_SG Trainer Pokemon by @JD48096761.txt` | 98,420 | `bc6bef8b1009bfb93a565e0e95ee5296925efd883bee2a110fe588ebdef70d05` | Tier C, trainer context |
| `documentation/WHATS-NEW-1.2.3.txt` | 4,739 | `f4ea03c51e802bbab8463e3ebcde4f1ae2d2b39a3859bb5a52f8b12181f990ab` | Tier C, release context |
| `night-sprint/data/DEX_COVERAGE-candidate.json` | 530,871 | `2cff68e26733c56b66e5628de55b12a16e5a16637e6938c9b93c76371d73db2f` | Tier B, 493/gates |
| `night-sprint/data/FAIRY_LEVELUP.json` | 4,150 | `ed207def943062014a09af0c370a40ecf013ccf53f960c3b5d7248c98096ee7b` | Tier B, derived moves |
| `night-sprint/engine/DRAYANO_ENCOUNTER_IMPORT.json` | 1,560 | `1195913b1f1d230baa174288f7a8bebddd197e22c3349499ca8499bce7353bee` | Tier B, 142 records |
| `night-sprint/engine/DRAYANO_TRAINER_IMPORT.json` | 513 | `4511e59ce94ba019d378c6f6a7a5c98afd91246f2fc64ad02c23db84df0e3d37` | Tier B, 738 records |
| `night-sprint/internal/TYPECHART_AUDIT.json` | 1,151 | `a6a1d975e974fe1dc15a448de4e8b3ad4f4ba4bef6015a77ac5c623d923c2563` | Tier B, 324 pairs |

Pinned Plus source: external tree `night-sprint/sources/sacred-gold-plus`, commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`, upstream URL `https://github.com/Umberto-DEV/sacred-gold-plus/tree/5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. Root reports used are external files `SPRINT_REPORT.md`, `QA_MATRIX.md`, `KNOWN_ISSUES.md`, `SOURCES_AND_CREDITS.md` and `DEX_COVERAGE.json`.

Compressed-source check: `evidence/drayano-speedup/Drayano-1.05-xdelta.zip` and `SpeedUpPatches-Complete.zip` contain no documentation or spreadsheet entries; `experiments/fairy-speedup/mikelan98-fairy-2sg2ss411.zip` contains duplicate historical PDFs; `patches/Sacred-Gold-Plus-1.2.3-US.zip` contains the same manual set already inventoried. No `.xlsx` or `.xls` was found in these inspected archives. Result: no additional usable spreadsheet found in local sources.

### Drayano online cross-check

The supplied [GBAtemp author thread](https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/) identifies Drayano and v1.05. The supplied [official Drive folder](https://drive.google.com/drive/folders/0B-zmEVN0Mas6VlhJNHc0YWx3UUk?resourcekey=0-RYApzpdEIcGIkiTfKxyKqw) exposes patch ZIPs and a `Documentation` folder; its [documentation listing](https://drive.google.com/drive/folders/1oSurQpYjTCMBxC3G6g3vcxsqBjI04ILT) contains PDFs/TXT only. No official `.xls/.xlsx` was found in those online listings. The external audit record is `night-sprint/sources/drayano-docs/SOURCE_STATUS.md`; the derived comparison is [drayano-crosscheck](drayano-crosscheck.md) with [493 CSV](drayano-derived-493.csv) and [JSON](drayano-derived-493.json).

### Other mod cross-check

The primary Plus source is [the upstream repository](https://github.com/Umberto-DEV/sacred-gold-plus), release [v1.2.3](https://github.com/Umberto-DEV/sacred-gold-plus/releases/tag/v1.2.3), pinned locally to `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. Speed-Up provenance is the author thread and [author Drive](https://drive.google.com/drive/folders/0B-zmEVN0Mas6VlhJNHc0YWx3UUk?resourcekey=0-RYApzpdEIcGIkiTfKxyKqw). No author-linked official Plus/Speed-Up spreadsheet was found in the bounded search. Project-owned TM refill and type-chart fix are evidenced by local reports, not attributed to external mods. Details: [mods-crosscheck](mods-crosscheck.md), [CSV](mod-derived-crosscheck.csv), [JSON](mod-derived-summary.json); external provenance records are under `night-sprint/sources/{plus-docs,speedup-docs,owned-tm-refill-docs,typechart-fix1-docs}/`.

The public [Dynamic-Calc](https://github.com/hzla/Dynamic-Calc) and [DRAYANO companion](https://github.com/alex4woodcc/DRAYANO) were inspected for the pChal trainer sheets; neither publishes an author-verifiable Sacred Gold XLS/XLSX. The public discussion points to commissioned Discord pins, which were not accessed. Status: `night-sprint/sources/pchal-docs/SOURCE_STATUS.md`. ROM-derived tables: [moves-final.csv](moves-final.csv), [trainers-final.csv](trainers-final.csv), generated by `generate_mod_tables.py` with target/control hash guards.

The full ROM-derived export is [trainers-all-final.csv](trainers-all-final.csv) and [JSON](trainers-all-final.json): 2,086 members, retaining explicit move IDs and marking implicit learnsets. The bilingual public-source page is [pchal-resources](pchal-resources.md).

## Additional local cross-checks

Additional local sources cross-checked / Fuentes locales adicionales contrastadas:

| External source identifier | SHA-256 | Result |
| --- | --- | --- |
| Plus package `HOW-TO-INSTALL.txt` | `552c757418e5ac6eeefad78a5553314ba698ca0370e80dd902a1539b65f45d84` | 1.2.3 installation/save migration; exact-hash patcher takes precedence for this custom target |
| Plus package `README.txt` | `35c93808561f558c268dd1a63d4db73b5c4b4f2627bdca7c203bbb6c018ec816` | Release scope and links |
| Plus package `LICENSE.txt` | `8ceb4b9ee5adedde47b31e975c1d90c73ad27b6b165a1dcd80c7c545eb65b903` | GPL-3.0 text; rights remain component-specific |
| Plus package `Cheats/ABOUT-CHEATS.txt` | `119c05971479d71d679764d8b1f0b01033e4ebd80304b3caca2b857e6f731071` | 1.2.3 code catalogue; author coverage does not substitute local exact-build tests |
| Plus package `Manual/ABOUT-THESE-GUIDES.txt` | `719af3157c0842a7192527d95d2e7feef2f5c9ef041d3de0e679c093f09fe9b1` | Historical manuals are not authoritative for every current move/type |
| Plus package `Manual/How-to-install-EN.pdf` | `00a2cba3e89b7357119f7d66dae6f298d0e10856787a92b0af594354018b66de` | Earlier 1.2 installation context, superseded by 1.2.3 and this exact manifest |
| Plus package `Manual/Whats-New-1.2-EN.pdf` | `78b524185c6aa5951b80839ae5fe3fa0083d5b207abd75ff44bd2572f85a032d` | Earlier options/camera/network presentation; no network acceptance inferred |
| Local archived `PLUS-SETUP.md` | `c0ac3509a88efa3c0dbb47badda92e4fad35ec7879c750e0ac3556a6abb8a14a` | Superseded launcher description; not the current default |
| Local archived `CLASSIC-SETUP.md` | `0e7da8fcf3c5c2eeb916f4e713edc50c30b63e38fd200cb5333bf35939d154c2` | Classic variant retained; historical default description is superseded |

The additional installation/release guides were text-extracted and inspected. No original prose/manual is copied into this repository. The main user guide describes the custom patch manifest, while historical statements about the selected default are explicitly superseded.

## Español

La tabla adicional incluye los nueve documentos locales que completan la revisión de instalación, licencia, catálogo de códigos y guías históricas. Los PDFs se extrajeron a texto; no se copian sus manuales ni su prosa al repo. Las antiguas guías PLUS/CLASSIC describen un acceso principal anterior y quedan superadas por el manifiesto y las guías actuales. La cobertura declarada por el autor de los códigos no sustituye nuestras pruebas del hash exacto.

Las rutas de `project/docs/` son enlaces relativos entregados por este repositorio. `documentation/` y `night-sprint/` están fuera del repo; se identifican por ruta externa, URL/pin y hash. También se inspeccionaron archivos comprimidos locales de evidencias/parches en busca de documentación y hojas de cálculo; no se encontró otra hoja utilizable en las fuentes locales inspeccionadas. Esto significa «no encontrado en fuentes locales», no inexistencia global. Los hashes son SHA-256.

La tabla anterior inventaría el mismo conjunto de fuentes para ambos idiomas: cinco PDFs históricos, dos TXT de contexto, la nota 1.2.3 y los JSON de cobertura/importación/auditoría. También se leyeron `README.md`, `CHANGELOG.md` y `LICENSE` existentes en el checkout Plus fijado, además de `SOURCES_AND_CREDITS.md` del proyecto local. Sólo se atribuyen fuentes que existen y fueron abiertas. Los PDFs fueron inspeccionados con `pdftotext`; no se redistribuye su prosa.

Fuente Plus fijada: árbol externo `night-sprint/sources/sacred-gold-plus`, commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`, URL `https://github.com/Umberto-DEV/sacred-gold-plus/tree/5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. Informes raíz consultados: `SPRINT_REPORT.md`, `QA_MATRIX.md`, `KNOWN_ISSUES.md`, `SOURCES_AND_CREDITS.md` y `DEX_COVERAGE.json`.

Comprobación de comprimidos: `evidence/drayano-speedup/Drayano-1.05-xdelta.zip` y `SpeedUpPatches-Complete.zip` no contienen documentación ni hojas de cálculo; `experiments/fairy-speedup/mikelan98-fairy-2sg2ss411.zip` contiene PDFs históricos duplicados; `patches/Sacred-Gold-Plus-1.2.3-US.zip` contiene el mismo conjunto de manuales ya inventariado. No apareció `.xlsx` ni `.xls` en esos archivos inspeccionados. Resultado: no se encontró otra hoja utilizable en las fuentes locales.

### Cruce online de Drayano

El [hilo del autor en GBAtemp](https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/) identifica a Drayano y la v1.05. La [carpeta Drive oficial indicada](https://drive.google.com/drive/folders/0B-zmEVN0Mas6VlhJNHc0YWx3UUk?resourcekey=0-RYApzpdEIcGIkiTfKxyKqw) muestra ZIP de parches y `Documentation`; su [listado de documentación](https://drive.google.com/drive/folders/1oSurQpYjTCMBxC3G6g3vcxsqBjI04ILT) sólo contiene PDFs/TXT. No apareció `.xls/.xlsx` oficial en esos listados online. El registro externo es `night-sprint/sources/drayano-docs/SOURCE_STATUS.md`; el cruce derivado está en [drayano-crosscheck](drayano-crosscheck.md), con [CSV 493](drayano-derived-493.csv) y [JSON](drayano-derived-493.json).

### Cruce de otros mods

La fuente primaria de Plus es [el repositorio upstream](https://github.com/Umberto-DEV/sacred-gold-plus), release [v1.2.3](https://github.com/Umberto-DEV/sacred-gold-plus/releases/tag/v1.2.3), fijada localmente al commit indicado. Speed-Up se atribuye al hilo y Drive del autor. La búsqueda acotada no confirmó Excel oficial con autor enlazado. La reposición de MT y la corrección del gráfico de tipos son componentes propios y se evidencian en informes locales. Véanse [mods-crosscheck](mods-crosscheck.md), [CSV](mod-derived-crosscheck.csv) y [JSON](mod-derived-summary.json).

También se revisaron [Dynamic-Calc](https://github.com/hzla/Dynamic-Calc) y el [companion DRAYANO](https://github.com/alex4woodcc/DRAYANO) como posibles orígenes de las hojas de pChal; ninguno publica un XLS/XLSX verificable. El estado queda en `night-sprint/sources/pchal-docs/SOURCE_STATUS.md`; las tablas ROM están en [moves-final.csv](moves-final.csv) y [trainers-final.csv](trainers-final.csv).

La exportación completa está en [trainers-all-final.csv](trainers-all-final.csv) y [JSON](trainers-all-final.json), con 2086 miembros y marcas para learnsets implícitos. La página bilingüe de fuentes públicas es [pchal-resources](pchal-resources.md).
