# Nature Party probe: independent review

## English

**Verdict: bounded native acceptance of RAM Party-field storage on this exact candidate, based on captured run evidence.** I revalidated the existing runs offline; this was not a new smoke or authorization for a future one. It is not persistence or release acceptance.

Candidate ROM SHA-256: `c8851a108d17222015fd34b078b6539a09a7948a4d4fd62e778406ce4b65357f`. Frozen result SHA-256: `a5c9947cd4c91d68e53b36cc8f1d5a8b6c60156002a555c07f0af929dc0427a5`. The result pins core `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, runner `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8`; verifier source SHA-256 is `8349beb6e6c12b7ae411c5520295b1858e965e37887ef953166111de31f5c992`.

I invoked the verifier’s read-only `main()` from `night-sprint` with `engine/upstream/hg-engine/.venv/bin/python`. Its complete returned object matched the frozen JSON, and canonical JSON SHA-256 reproduced as `a5c9947cd4c91d68e53b36cc8f1d5a8b6c60156002a555c07f0af929dc0427a5`. This avoided the CLI’s deliberate refusal to overwrite the frozen JSON/Markdown. No files were written by the rerun and no core was launched.

The verifier accepted seven captured runs. The cold run has no state input and 5,500 frames; each later run consumes the preceding run’s output state, with ROM/core/runner identity fixed and cheats empty. Every run’s state file, input script, result and battery evidence hashes match. Each 4 MiB RAM dump retains dispatcher count 858, table pointer `0x023D5100`, entry 857 Thumb pointer `0x023D6B21`, and byte-identical table/core sections from ROM. Battery and frozen snapshots match the source DSV SHA-256 `9c8193fe37871850f999a2e66f40d9c482a828ca5d99155fb195c54cc6adf46a`; Bag bytes stay unchanged. Evidence: [`acceptance verifier`](../../qa/nature_party_probe_acceptance.py#L150), [`native result`](../../../experiments/eviv/nature-party-probe/native-acceptance.json).

Party records are decrypted and checked against exact expected bytes, including validated two-byte cipher boundaries. The target remains PID `0xE30363E2`, species 35. Field 114 transitions `0xA5C1→0xA5C3→0xA5F3`; encoded 26 and 31 return status 2 and leave `0xA5F3` unchanged; reset 0 returns `0xA5C1`. Bits outside the mask are preserved; other records and inactive slots remain unchanged; final Party records match the CRC-valid source fixture exactly. The Bag, RAM and Party checks are in [`acceptance verifier`](../../qa/nature_party_probe_acceptance.py#L182) and [`Party byte checks`](../../qa/nature_party_probe_acceptance.py#L209).

Limits remain: only RAM Party field 114 is demonstrated. No getter, effective nature display, stat recalculation, PC storage, native Save, or cold reload after mutation was tested. The unchanged DSV confirms no Save occurred; it is not persistence evidence.

## Español

**Dictamen: aceptación nativa acotada del almacenamiento en el campo 114 del equipo en RAM para esta candidata exacta, basada en ejecuciones capturadas.** Revalidé offline las ejecuciones existentes; no fue un smoke nuevo ni autoriza otro futuro. No acredita persistencia ni release.

SHA-256 de la ROM candidata: `c8851a108d17222015fd34b078b6539a09a7948a4d4fd62e778406ce4b65357f`. SHA-256 del resultado congelado: `a5c9947cd4c91d68e53b36cc8f1d5a8b6c60156002a555c07f0af929dc0427a5`. El resultado fija core `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, runner `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8` y verificador SHA-256 `8349beb6e6c12b7ae411c5520295b1858e965e37887ef953166111de31f5c992`.

Ejecuté la función de solo lectura `main()` del verificador desde `night-sprint` con `engine/upstream/hg-engine/.venv/bin/python`. El objeto completo coincidió con el JSON congelado y reprodujo su SHA-256 canónico `a5c9947cd4c91d68e53b36cc8f1d5a8b6c60156002a555c07f0af929dc0427a5`. Así evité que la CLI sobrescribiera el JSON/Markdown congelado. La repetición no escribió archivos ni lanzó el core.

El verificador aceptó siete ejecuciones capturadas. La ejecución fría usa 5.500 frames sin estado de entrada; cada una de las siguientes consume el estado de salida anterior, con ROM/core/runner fijados y cheats vacíos. Coinciden los hashes de estado, script de entrada, resultado y evidencia de batería. Cada volcado RAM de 4 MiB conserva contador dispatcher 858, tabla `0x023D5100`, entrada 857 `0x023D6B21` y secciones de tabla/core idénticas a ROM. La batería y sus snapshots coinciden con la DSV fuente `9c8193fe37871850f999a2e66f40d9c482a828ca5d99155fb195c54cc6adf46a`; la Bolsa no cambia. Evidencia: [`verificador`](../../qa/nature_party_probe_acceptance.py#L150), [`resultado nativo`](../../../experiments/eviv/nature-party-probe/native-acceptance.json).

Los registros del equipo se descifran y comparan con bytes esperados exactos, incluidas fronteras de cifrado de dos bytes. El objetivo conserva PID `0xE30363E2`, especie 35. El campo 114 cambia `0xA5C1→0xA5C3→0xA5F3`; 26 y 31 devuelven estado 2 sin alterar `0xA5F3`; reset 0 restaura `0xA5C1`. Se preservan los bits externos a la máscara; los demás registros y huecos inactivos no cambian; el equipo final coincide exactamente con la fixture fuente válida por CRC. Comprobaciones en [`verificador`](../../qa/nature_party_probe_acceptance.py#L182) y [`bytes del equipo`](../../qa/nature_party_probe_acceptance.py#L209).

Límites: solo se demuestra el campo 114 del equipo en RAM. No se probó getter, presentación de naturaleza efectiva, recálculo de estadísticas, almacenamiento en PC, guardado nativo ni recarga en frío tras la mutación. La DSV intacta confirma que no hubo guardado; no demuestra persistencia.
