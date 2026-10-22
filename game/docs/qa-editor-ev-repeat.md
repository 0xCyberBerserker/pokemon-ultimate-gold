# EV Defense Repeat QA / QA de Repeat para EV de Defensa

## English

**Result: bounded PASS on private bd50.** The native menu applied two confirmed +4 operations, including Repeat, to Chikorita (species 152) in Party slot 1: Defense EV `0 → 4 → 8`. Native Save advanced MAIN counter `12 → 13`; a fresh same-ROM cold Continue retained EV 8. The saved and cold DSVs are byte-identical at SHA-256 `6c4c3ed8e4f00f1b8d4c836eef185b8c4ce1f93238432350a2c48a9ddc0e28ce`; both MAIN CRCs validate.

The current frozen evidence pins are:

- ROM `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`.
- Auditor `qa/stat_editor_ev_defense_repeat_bd50_acceptance.py`, SHA-256 `f8714e3ab96437caa31854ca91ef0e6cfb3c93285ef9ceb96b555094974433c9`.
- Acceptance `qa/runs/stat-editor-ev-defense-repeat-bd50-audit/acceptance.json`, SHA-256 `969058068174db0f7e16f031d3f1ca3bcfca491f0f95f98c6877b6f2a3aab77f`.
- Supersedence note `qa/runs/stat-editor-ev-defense-repeat-bd50-audit/acceptance-supersedence.json`, SHA-256 `75138dfe339cd26a6da6f7b74b40a7e76e333fea219da64025b366c341560747`.
- Independent review `internal/stat-editor-research/ev-defense-repeat-bd50-independent-review-20261022.md`, SHA-256 `c89c8417912ab30ff3e6b06a79da8ae521c47c9dbaa76af98cfe82152e3133e5`.

The current JSON was reproduced exactly from `build_report()` without writing a report or opening a core. It covers 13 runs against a 22-run ceiling. The source DSV has MAIN counter 12; the Save and cold DSV have counter 13. Chikorita keeps PID `0xE30363E2`, IVs `[16, 3, 10, 31, 21, 2]`, raw field114 `0x0000`, and every non-Defense EV. The decoded target record differs only at the Defense EV byte. Saved Party slots 0 and 2, the Party header, and inactive bytes are exact to the seed.

Every 1,952-byte SaveArray3 projection matches its run's DSV. All 2,376-byte BPAC caches match the cold runtime baseline, with SaveData and SaveArray3 pointers checked. In four runtime RAM captures, Party slot 2 is accepted only as an exact plain/encrypted splice at an even-byte boundary with an exact record header. Those mixed-phase bytes are not decoded or checksum-validated; no semantic claim is made for them. Slots 0 and 1 are byte-exact in all runtime captures.

The report's six negative guards are synthetic structural checks, not in-game Bag-capacity tests. EV caps, Reset EV, battle recalculation, other stats or Party members, and release-wide acceptance remain unassessed. Runner gameplay acceptance is `NOT_ASSESSED`; this case does not complete the editor.

The first declared auditor/report hashes (`08c494…` / `b18752…`) are unavailable for comparison. The author reports the regeneration corrected wording about Party slot 2. The current pair reproduces exactly, but the review cannot verify that the historical change was text-only.

## Español

**Resultado: PASS acotado en la bd50 privada.** El menú nativo aplicó dos incrementos confirmados de +4, incluido Repeat, al Chikorita (especie 152) del slot 1 del equipo: Defensa EV `0 → 4 → 8`. Save nativo avanzó el contador MAIN `12 → 13`; Continue en frío con la misma ROM conservó EV 8. Las DSV guardada y fría son idénticas, SHA-256 `6c4c3ed8e4f00f1b8d4c836eef185b8c4ce1f93238432350a2c48a9ddc0e28ce`; ambos CRC MAIN son válidos.

Los pins congelados actuales son:

- ROM `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`.
- Auditor `qa/stat_editor_ev_defense_repeat_bd50_acceptance.py`, SHA-256 `f8714e3ab96437caa31854ca91ef0e6cfb3c93285ef9ceb96b555094974433c9`.
- Aceptación `qa/runs/stat-editor-ev-defense-repeat-bd50-audit/acceptance.json`, SHA-256 `969058068174db0f7e16f031d3f1ca3bcfca491f0f95f98c6877b6f2a3aab77f`.
- Nota de supersedencia `qa/runs/stat-editor-ev-defense-repeat-bd50-audit/acceptance-supersedence.json`, SHA-256 `75138dfe339cd26a6da6f7b74b40a7e76e333fea219da64025b366c341560747`.
- Revisión independiente `internal/stat-editor-research/ev-defense-repeat-bd50-independent-review-20261022.md`, SHA-256 `c89c8417912ab30ff3e6b06a79da8ae521c47c9dbaa76af98cfe82152e3133e5`.

El JSON actual se reprodujo exactamente desde `build_report()`, sin escribir un informe ni abrir un core. Cubre 13 ejecuciones dentro del límite de 22. La DSV fuente tiene contador MAIN 12; la DSV guardada y la fría, 13. Chikorita conserva PID `0xE30363E2`, IV `[16, 3, 10, 31, 21, 2]`, field114 bruto `0x0000` y todos los EV excepto Defensa. En el registro objetivo decodificado solo cambia el byte de Defensa EV. Los slots 0 y 2 guardados, la cabecera del equipo y los bytes inactivos son exactos respecto a la semilla.

Cada proyección SaveArray3 de 1.952 bytes coincide con la DSV de su ejecución. Todas las cachés BPAC de 2.376 bytes coinciden con la base runtime fría; se comprueban los punteros SaveData y SaveArray3. En cuatro capturas de RAM, Party slot 2 solo se acepta como empalme exacto de datos claros/cifrados en una frontera de byte par y con cabecera de registro idéntica. Esos bytes de fase mixta no se decodifican ni se valida su checksum; no se afirma validez semántica. Los slots 0 y 1 son byte-exactos en todas las capturas runtime.

Las seis guardas negativas del informe son comprobaciones estructurales sintéticas, no pruebas de límite de Bolsa dentro del juego. Siguen sin evaluarse límites EV, Reset EV, recálculo en combate, otras estadísticas o integrantes y aceptación general de release. La aceptación de juego del runner es `NOT_ASSESSED`; este caso no completa el editor.

Los primeros hashes declarados del auditor/informe (`08c494…` / `b18752…`) no están disponibles para comparar. El autor indica que la regeneración corrigió el texto sobre Party slot 2. La pareja actual se reproduce exactamente, pero la revisión no puede verificar que el cambio histórico fuera solo textual.
