# Native Reset All EVs — bounded QA

## English

The private bd50 candidate passes one bounded native **Reset All EVs → Yes** case. On a synthetic fixture, the Chikorita in Party slot 1 changed from six EV values of 4 to six zeroes. The confirmation screenshot shows Yes selected, and the result screenshot shows “All six EV stats are now zero.” This is one case, not release acceptance for the editor.

The target record matches the exact expected 236-byte Party record in RAM, the native save, and a fresh same-ROM cold load. PID `0xE30363E2`, IVs `[16,3,10,31,21,2]`, and raw nature field `0x0000` are preserved; the PID-derived nature is Timid (index 10). Post-reset non-HP stats `[9,12,12,10,11]` and HP `20/20` match the pinned Gen IV formula. The synthetic fixture copied the target's tail stats unchanged, and those values happen to equal the post-reset formula output. The evidence therefore does not establish a before/after derived-stat change.

The saved DSV advances selected MAIN counter 13→14 with both MAIN CRCs valid; its backup MAIN 13 remains byte-exact to the fixture. SaveArray3 (1,952 bytes) and the expanded Bag cache (2,376 bytes) remain unchanged. Party slots 0 and 2 are byte-exact in the fixture and saved DSV. In RAM, slot 2 is byte-exact in some snapshots and passes a strict cipher/plaintext-boundary splice check in others. That check does not decode the mixed-phase record or validate its checksum.

The case uses 9 of 18 authorized runner invocations. The fixture is prepared data, not a naturally earned game state. **No** confirmation, EV caps, other species, unrelated Party/DSV changes, broad gameplay acceptance, and release readiness remain outside this result. The runner labels gameplay acceptance `NOT_ASSESSED`; the Stat Editor remains a private candidate.

Audit pins:

- ROM: `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`.
- Auditor source `night-sprint/qa/stat_editor_reset_ev_all_bd50_acceptance_v2.py`: `1fb4f98d9b2ed1e4497a3bdbe17c80bf9fb2b5baa6fe71b95820a9a786c52f60`.
- Frozen report `night-sprint/qa/runs/stat-editor-reset-ev-all-bd50-audit-v2-20261022-01/acceptance.json`: `c5a1bbc81e3cbf41dd0c213c3b9d22ba7ec2e94e2fda548992c6aae3e50336fd`.
- Independent review `night-sprint/internal/stat-editor-research/reset-ev-all-bd50-independent-review-20261022.md`: `ae78f4745cc1b0ed0a71e81903a10c0f478066e293bebe04ea10ae5ff83b0fee`.
- Synthetic fixture DSV: `b7fbc2c9be00ce3829a69eeab25283161adfdf52c6e922352e3d4d976cad174c`. Saved and cold-loaded DSV: `11bb623d82cc9032c4c00d729750fcdbaea3c278b53eacbcb8522f3e90ed3f24`.

## Español

La candidata privada bd50 supera un caso nativo acotado de **Reset All EVs → Yes**. En una fixture sintética, la Chikorita del espacio 1 del equipo pasó de seis EV con valor 4 a seis ceros. La captura de confirmación muestra Yes seleccionado y la captura final indica “All six EV stats are now zero.” Es un único caso; no acredita una release del editor.

El registro objetivo coincide con el registro Party exacto esperado de 236 bytes en RAM, el guardado nativo y una carga en frío nueva con la misma ROM. Se conservan PID `0xE30363E2`, IV `[16,3,10,31,21,2]` y campo de naturaleza bruto `0x0000`; la naturaleza derivada del PID es Timid (índice 10). Las estadísticas posteriores distintas de PS `[9,12,12,10,11]` y PS `20/20` coinciden con la fórmula Gen IV fijada. La fixture sintética copió sin cambios las estadísticas de cola del objetivo y, por coincidencia, esos valores son iguales al resultado posterior de la fórmula. Por tanto, la evidencia no demuestra un cambio de estadísticas derivadas antes/después.

La DSV guardada avanza el contador MAIN seleccionado de 13 a 14, con ambos CRC MAIN válidos; la copia MAIN 13 sigue byte a byte igual a la fixture. SaveArray3 (1.952 bytes) y la caché ampliada de Bolsa (2.376 bytes) no cambian. Los espacios 0 y 2 del equipo son byte exactos en la fixture y la DSV guardada. En RAM, el espacio 2 es byte exacto en algunas capturas y en otras pasa una guarda estricta de empalme en la frontera plaintext/cifrada. Esa guarda no decodifica el registro en fase mixta ni valida su checksum.

El caso usa 9 de las 18 invocaciones autorizadas del runner. La fixture contiene datos preparados, no un estado conseguido jugando. La confirmación **No**, los topes de EV, otras especies, cambios ajenos de Party/DSV, la aceptación amplia de juego y la preparación para release quedan fuera de este resultado. El runner indica `gameplay_acceptance: NOT_ASSESSED`; el Stat Editor sigue siendo una candidata privada.

Pins de auditoría:

- ROM: `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`.
- Fuente del auditor `night-sprint/qa/stat_editor_reset_ev_all_bd50_acceptance_v2.py`: `1fb4f98d9b2ed1e4497a3bdbe17c80bf9fb2b5baa6fe71b95820a9a786c52f60`.
- Informe congelado `night-sprint/qa/runs/stat-editor-reset-ev-all-bd50-audit-v2-20261022-01/acceptance.json`: `c5a1bbc81e3cbf41dd0c213c3b9d22ba7ec2e94e2fda548992c6aae3e50336fd`.
- Revisión independiente `night-sprint/internal/stat-editor-research/reset-ev-all-bd50-independent-review-20261022.md`: `ae78f4745cc1b0ed0a71e81903a10c0f478066e293bebe04ea10ae5ff83b0fee`.
- DSV de fixture sintética: `b7fbc2c9be00ce3829a69eeab25283161adfdf52c6e922352e3d4d976cad174c`. DSV guardada y recargada en frío: `11bb623d82cc9032c4c00d729750fcdbaea3c278b53eacbcb8522f3e90ed3f24`.
