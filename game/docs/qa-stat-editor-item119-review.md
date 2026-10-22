# Item 119 no-REGISTER smoke v2 independent review

## English

**Verdict: PASS for the bounded no-write smoke evidence and its reproducibility.** This does not establish EV/IV editing, save persistence, NPC acquisition, whole-gameplay, or release acceptance.

The frozen v2 auditor hash is `68c67f02cb7359f887fcb8ea48038ab6ecfa34a52f73c93c5a13c281baa6c2a3`; report 02 hash is `d0493145d8a7192c8450745d82aeb22060fe4fdbc0c3a164a9715423bbf3d6ee`. v1 and report 01 remain unchanged at `8dfd60744f99c60f903b54e016143692146ecf8dfa30c84618b0e72259a6c3a0` and `d80db5680971b71a7717e76774afb51834f778775517e348d1a70ec5e2975dd7` respectively.

The v1 double-base error is fixed. `verify_save()` returns an absolute MainRAM base plus array offsets relative to that base (`internal/hm-qol/qa_fixtures.py:55-84`); on both captured endpoints the values are base `0x0226F20C`, Party `(1460, 0xD080)`, and SaveArray3 `(1952, 0xD634)`. v2 now uses `base + offset` for both RAM slices and reported addresses (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:323-355`). This gives Party `[0x0227C28C, 0x0227C840)` and SaveArray3 `[0x0227C840, 0x0227CFE0)`: adjacent, with the exact descriptor layout pinned by the helper. SaveArray3 is also checked against the fixture DSV and MainRAM bounds.

The new Party/Bag guard checks both ranges against the 4 MiB captured MainRAM extent, then checks intersection (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:59-68, 342-346, 376-387`). The invalid `double_ram_base` address is rejected as out of bounds, and `party_overlaps_bag` is rejected as overlapping. The explicit negative overlap case is Party versus canonical Bag; Party versus SaveArray3 is established by the pinned descriptor sizes and offsets above, not by a separate negative test.

I imported v2 with the project venv, redirected `REPORT_DIR` to a fresh temporary directory, ran `main()`, and compared the generated JSON byte-for-byte with report 02: PASS, SHA-256 `d0493145d8a7192c8450745d82aeb22060fe4fdbc0c3a164a9715423bbf3d6ee`. The auditor reads pinned prior results and has no subprocess/core invocation (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:174-254, 257-310`); this replay did not run a core or overwrite report 02.

The Party limit is preserved: raw cold/Exit Party arrays differ by 154 bytes in ranges `[488,619)` and `[694,715)`, inside slot 2. The cold endpoint remains `LIMITED_TRANSIENT_BOUNDARY`; Exit provides cipher-boundary evidence only and slot 2 has an invalid checksum. No checksum or decoded-field claim is made for slot 2. Bag bytes and SaveArray3 remain identical; recorded DSV changes are zero. No EV/IV value, save, or cold persistence was tested (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:394-440, 489-526`).

## Español

**Dictamen: PASS para la evidencia del humo acotado sin escritura y su reproducibilidad.** No demuestra edición EV/IV, persistencia del guardado, adquisición por NPC, aceptación de juego completo ni aceptación de release.

Hash congelado del auditor v2: `68c67f02cb7359f887fcb8ea48038ab6ecfa34a52f73c93c5a13c281baa6c2a3`; hash del informe 02: `d0493145d8a7192c8450745d82aeb22060fe4fdbc0c3a164a9715423bbf3d6ee`. v1 y el informe 01 siguen intactos: `8dfd60744f99c60f903b54e016143692146ecf8dfa30c84618b0e72259a6c3a0` y `d80db5680971b71a7717e76774afb51834f778775517e348d1a70ec5e2975dd7`.

La suma doble de v1 está corregida. `verify_save()` devuelve una base absoluta de MainRAM y offsets de arrays relativos a ella (`internal/hm-qol/qa_fixtures.py:55-84`); en ambas capturas, base `0x0226F20C`, Party `(1460, 0xD080)` y SaveArray3 `(1952, 0xD634)`. v2 usa `base + offset` al leer y registrar ambas direcciones (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:323-355`). Resultan Party `[0x0227C28C, 0x0227C840)` y SaveArray3 `[0x0227C840, 0x0227CFE0)`: contiguos y sin solape, con el layout exacto fijado por el helper. También verifica SaveArray3 contra el DSV de prueba y dentro de los límites de MainRAM.

La guarda nueva Party/bolsa valida ambos rangos dentro de los 4 MiB de MainRAM y después comprueba intersección (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:59-68, 342-346, 376-387`). Rechaza `double_ram_base` por quedar fuera de rango y `party_overlaps_bag` por solape. El negativo explícito de solape es Party contra la bolsa canónica; la separación Party/SaveArray3 queda probada por los tamaños y offsets exactos fijados arriba, no por otro test negativo.

Importé v2 con el venv del proyecto, redirigí `REPORT_DIR` a un directorio temporal nuevo, ejecuté `main()` y comparé el JSON generado byte a byte con el informe 02: PASS, SHA-256 `d0493145d8a7192c8450745d82aeb22060fe4fdbc0c3a164a9715423bbf3d6ee`. El auditor lee resultados previos fijados y no invoca procesos ni el core (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:174-254, 257-310`); esta reproducción no ejecutó el core ni sobrescribió el informe 02.

Se conserva el límite de Party: los arrays crudos de inicio frío y Exit difieren en 154 bytes, rangos `[488,619)` y `[694,715)`, dentro del slot 2. El extremo frío sigue como `LIMITED_TRANSIENT_BOUNDARY`; Exit aporta sólo evidencia de límites de cifrado y el checksum del slot 2 es inválido. No se afirma checksum válido ni contenido decodificado del slot 2. La bolsa y SaveArray3 permanecen idénticos; el DSV registrado no cambia. No se probó mutación EV/IV, guardado ni persistencia tras inicio frío (`qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:394-440, 489-526`).

Referencias: `qa/portable_stat_editor_separate_item_noregister_smoke_acceptance.py:330-369` (v1); `qa/portable_stat_editor_separate_item_noregister_smoke_acceptance_v2.py:59-68, 323-387, 394-440, 489-526`; `internal/hm-qol/qa_fixtures.py:48-84`; informe congelado `qa/runs/portable-stat-editor-separate-item-noregister-smoke-report-02/acceptance.json`.
