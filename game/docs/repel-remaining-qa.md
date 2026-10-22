# Reusable Repels: remaining native QA / QA nativo restante: repelentes reutilizables

## English

**Result: bounded native QA passed for the remaining cases on the exact fix6a candidate.** This experimental feature remains outside the downloadable Alpha 1 patch.

With marker 118 present and no codes active during native item actions:

- Super Repel (item 76) remained at quantity 1; its normal duration was 200 steps.
- Repel (item 79) remained at quantity 1; its normal duration was 100 steps.
- Max Repel expired after an accelerated one-step fixture, displayed the native “Repel’s effect wore off…” message, and was reused. Quantity remained 1 and the counter returned to 250.

The inventory seed and accelerated counter are separate one-frame AR setup runs. The seed adds items 76 and 79 to empty item slots in the canonical and legacy Bag arrays, then closes and reopens the Bag to refresh its view. For expiry, a byte write sets the SaveArray21 counter to 1; the subsequent land-tile walk and reuse use no codes. This does not represent 250 walked steps.

The acceptance script checks the exact ROM, core, runner, source battery fixture, state chain, code windows, marker, counter, inventory arrays, 4 KiB reserve, and screenshot hashes. Runner outputs retain `gameplay_acceptance: NOT_ASSESSED`: this report records bounded emulated native actions and captured UI evidence, not external gameplay acceptance.

Local QA evidence (not included in GitHub Pages): `night-sprint/qa/runs/repel-remaining-fixture/prepared.state` SHA-256 `e70f7dbffabee855b372aa7e96a5f8d9a89f27e7133f04fb68b3bf44dae7ebda` → `night-sprint/qa/runs/repel-remaining-refresh-corrected/reopened.state` SHA-256 `5eaa9086d0ffd899cf2f4d9e17a7dd24ab12f9e53d01be9d711bdf4bfeed582c` → `night-sprint/qa/runs/repel-remaining-refresh-final/bag.state` SHA-256 `ffc406528072ab3ea9f422b4e512d852bf47198866d848df5c5b2f595695cb7a`. The auditor asserts each state file hash and adjacent input/output hash link.

The fixed AR byte-write address `0x02282B01` is scoped to the cold expiry fixture (`SaveData=0x0227C1E8`). The open-Bag snapshot resolves `SaveData=0x0227C234`, a `+0x4C` shift; the auditor reads the current SaveData pointer and derives the counter address dynamically for every RAM dump.

Machine report: [qa-repel-remaining.json](qa-repel-remaining.json). Local evidence and assertions, not included in GitHub Pages: `night-sprint/qa/repel_remaining_acceptance.py`; captures and state files are under `night-sprint/qa/runs/repel-remaining-*`.

## Español

**Resultado: QA nativo acotado satisfactorio para los casos restantes en la candidata fix6a exacta.** Esta función experimental sigue fuera del parche descargable Alfa 1.

Con el marcador 118 presente y sin códigos activos durante las acciones nativas de uso:

- Super Repel (objeto 76) conservó la cantidad 1 y su duración normal de 200 pasos.
- Repel (objeto 79) conservó la cantidad 1 y su duración normal de 100 pasos.
- Max Repel caducó tras una preparación acelerada de un paso, mostró el mensaje nativo «Repel’s effect wore off…» y se reutilizó. La cantidad siguió en 1 y el contador volvió a 250.

La preparación del inventario y la aceleración del contador son ejecuciones AR separadas de un fotograma. La preparación añade los objetos 76 y 79 a espacios vacíos de los arrays canónico y legado de la Bolsa; después se cierra y reabre la Bolsa para actualizar su vista. Para la caducidad, una escritura de byte fija el contador de SaveArray21 en 1; el paso terrestre posterior y la reutilización se hacen sin códigos. No equivale a caminar los 250 pasos.

El script de aceptación comprueba la ROM, el core, el runner, la copia fuente de batería, la cadena de estados, las ventanas de códigos, el marcador, el contador, los arrays de inventario, la reserva de 4 KiB y los hashes de las capturas. Los resultados del runner mantienen `gameplay_acceptance: NOT_ASSESSED`: este informe registra acciones nativas emuladas y evidencia visual acotada, no aceptación de juego fuera del emulador.

Evidencia local de QA (no incluida en GitHub Pages): `night-sprint/qa/runs/repel-remaining-fixture/prepared.state`, SHA-256 `e70f7dbffabee855b372aa7e96a5f8d9a89f27e7133f04fb68b3bf44dae7ebda` → `night-sprint/qa/runs/repel-remaining-refresh-corrected/reopened.state`, SHA-256 `5eaa9086d0ffd899cf2f4d9e17a7dd24ab12f9e53d01be9d711bdf4bfeed582c` → `night-sprint/qa/runs/repel-remaining-refresh-final/bag.state`, SHA-256 `ffc406528072ab3ea9f422b4e512d852bf47198866d848df5c5b2f595695cb7a`. El auditor afirma el hash de cada estado y el enlace de entrada/salida entre pasos.

La dirección fija de escritura AR de byte `0x02282B01` sólo corresponde al fixture frío de caducidad (`SaveData=0x0227C1E8`). La instantánea con la Bolsa abierta resuelve `SaveData=0x0227C234`, un desplazamiento de `+0x4C`; el auditor lee dinámicamente el puntero SaveData y deriva la dirección del contador en cada volcado de RAM.

Informe máquina: [qa-repel-remaining.json](qa-repel-remaining.json). Evidencia local y aserciones, no incluidas en GitHub Pages: `night-sprint/qa/repel_remaining_acceptance.py`; las capturas y estados están en `night-sprint/qa/runs/repel-remaining-*`.

Made with 🖤 in Barcelona City 🇪🇸
