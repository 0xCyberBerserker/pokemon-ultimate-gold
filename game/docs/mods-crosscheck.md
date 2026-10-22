# Mod cross-check / Cruce de mods

## English

This is our derived guide for the exact candidate `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`. It records what was cross-checked against the inherited Drayano 1.05 baseline and what remains unresolved. It does not certify a stable release.

| Component | Primary provenance | Matches the candidate | Difference or limit | Status |
| --- | --- | --- | --- | --- |
| Drayano Sacred Gold/Storm Silver 1.05 | [GBAtemp author thread](https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/); author Drive folder recorded in `night-sprint/sources/drayano-docs/SOURCE_STATUS.md` | Original 493 scope, trainer archives and documented classic baseline | Fifteen story/resource files remain unported in the current hybrid; full story semantics are not claimed | inherited / partial |
| Sacred Gold Plus 1.2.3 | [upstream repository](https://github.com/Umberto-DEV/sacred-gold-plus), [release](https://github.com/Umberto-DEV/sacred-gold-plus/releases/tag/v1.2.3), commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3` | 493 original species, Fairy support, Plus save/camera/QoL surfaces and 129 preserved overlays | Candidate adds the isolated chart fix; trainer archives and Speed-Up hooks require their own checks | source-pinned / static verified |
| Official Drayano Speed-Up | [author thread](https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/), [author Drive](https://drive.google.com/drive/folders/0B-zmEVN0Mas6VlhJNHc0YWx3UUk?resourcekey=0-RYApzpdEIcGIkiTfKxyKqw) | 18 guarded ARM9 bytes match the delivered builds | Music tempo and perceived pacing were not measured; no official Excel was found | static verified / runtime pending |
| Owned TM refill | project evidence in `SPRINT_REPORT.md` and `QA_MATRIX.md` | Obtained IDs 328–419 refill to 99 while HMs and empty slots survive fixtures | Teaching UI and full player progression remain pending | fixture verified |
| Owned typechart-fix1 | candidate SHA above; `night-sprint/internal/TYPECHART_AUDIT.json` | 324/324 static pairs; two Ghost interactions corrected | Live interaction battles are pending; this is not a second external mod | static verified / runtime pending |

### Moves and trainers

The sprint reports 15 reused Plus move records and 14 explicit trainer references. Wiki v2 now
resolves 467 move names from the target message bank, including seven canonical Spanish aliases,
while combat fields remain ROM-derived. The legacy `moves-final.csv/.json` comparison intentionally
retains eight unresolved names; that limitation does not describe the wiki v2 name table. Alternate
form learnsets remain a separate pending join.

`generate_mod_tables.py` is a self-contained stdlib generator. It requires `--target` and
`--drayano-external`, verifies both SHA-256 values, parses NARC/FNT/FAT itself and writes the
legacy `moves-final.csv/.json` plus trainer tables. That move table contains exactly the 15 changed
active records with raw bytes before/after; its eight unresolved names remain intentionally marked.
These are static references; runtime legality remains pending.

It also writes `trainers-all-final.csv/.json`: 2,086 decoded members from the two preserved trainer NARCs. Explicit four-move records are retained verbatim as IDs; records without those fields are tagged `implicit_learnset`. The generator compares every move record and refuses to proceed unless the changed set is exactly the documented 15 IDs. See [pChal public resources](pchal-resources.md) for the community-source boundary.

The public [Dynamic-Calc repository](https://github.com/hzla/Dynamic-Calc) and [DRAYANO companion](https://github.com/alex4woodcc/DRAYANO) were inspected as possible sheet origins. Neither publishes an author-verifiable Sacred Gold XLS/XLSX. A public [pChal discussion](https://www.reddit.com/r/pchaltv/comments/1kuezj3/where_do_i_get-the-fancy-docs-pchal-uses/) points to commissioned Discord pins; that inaccessible material is recorded as pending and is not attributed.

HG Engine and HeartGold Generations were not incorporated. Any mention is a discarded reference only; their binaries, patches and tables are outside this build.

No author-linked official Plus or Speed-Up XLS/XLSX or Google Sheet was found in the bounded search. This is recorded as “not found in local/official sources inspected”, not as global non-existence. See `mod-derived-crosscheck.csv` and `mod-derived-summary.json` for machine-readable provenance.

## Español

Esta guía cruza nuestra candidata exacta con Drayano 1.05 y los componentes realmente integrados. No certifica una versión estable. Plus 1.2.3, Speed-Up, reposición propia de MT y la corrección propia del gráfico de tipos coinciden en las superficies indicadas; los límites de historia, interfaz, ritmo y combates siguen abiertos según la tabla inglesa.

Hay 15 registros de movimientos reutilizados y 14 referencias explícitas de entrenadores. No se anuncia cobertura completa porque los manuales heredados no forman un esquema único verificable contra cada archivo. HG Engine y HeartGold Generations quedan fuera del build. No se encontró un Excel/Google Sheet oficial con autor enlazado en la búsqueda acotada.

Las tablas `moves-final` y `trainers-final` proceden de una comparación reproducible de NARC reales: 15 registros de movimientos y 14 miembros afectados, con bytes/IDs antes y después. El generador exige y verifica los hashes de ambas ROM externas y no importa analizadores fuera del repo. Dynamic-Calc, el companion DRAYANO y la discusión pública de pChal se registran como referencias posibles, no como origen atribuido de la hoja.

También genera `trainers-all-final.csv/.json` con los 2.086 miembros decodificados. Los ataques
explícitos se conservan como IDs; los demás quedan marcados `implicit_learnset`. Es una exportación
legacy: sus ocho nombres sin resolver no deben confundirse con los 467 nombres de wiki v2. Compara
todos los registros y aborta si no coinciden exactamente los 15 IDs documentados. Véase [recursos públicos de pChal](pchal-resources.md).
