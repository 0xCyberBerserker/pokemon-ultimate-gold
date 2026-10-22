# Rocket grant: expanded Key Items correction

## English

**Finding:** the `50/50` “false success” diagnosis for ROM `08e1d4e51599dc459600f1eff44e7915acbbaa111d74321be22a4800af629fcf` is invalid. That fixture fills the 50 legacy SaveArray3 slots, while this ROM has a 60-slot Key Items pocket.

The ROM’s ARM9 bytes at `0x023DBF00` match the project’s expanded-Bag `blob.bin` byte for byte (SHA-256 `e41d95a3a7f57e504697c83f754c6fbb57745291d149dcb9d94b4dcde5f3c1fb`). Its manifest declares capacities `[252,42,30,102,66,12,30,60]`. In [`core.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/core.c), pocket 7 is Key Items, `cap_count(7)=60`, and the native count is 50. `cap_has_space` and `cap_add` search the 60-slot pocket.

The frozen RAM snapshots confirm the grant itself. Before confirmation, `rocket-grant-pocket50-offer-01/system_ram.bin` (SHA `4b0843dde60451f07f7b9a0d6ba23470ed367f19704d896109f812292a113d89`) has 50 occupied cache entries and an empty slot 50. After the Rocket interaction, `rocket-grant-pocket50-no-space-01/system_ram.bin` (SHA `1e06259526f3593dea092c4cb9f605be7ee6ada660b008be6f9405892c547dfd`) has 51: `{119,1}` is in pocket slot 50, global cache slot 584, address `0x023DE034`. The cache belongs to the live SaveData and its legacy-projection pointer matches SaveArray3. SaveArray3 still has 50 slots and no 119, as expected. Root's manual visual review of `rocket-grant-08e-expanded-store-scan-key-items-01/key_page_9_stable.png` confirms the item on the ninth Key Items page. Thus command 125 did add item 119 to the expanded cache; the old audit compared only the legacy projection and mislabeled the run.

The 59/60→60/60 boundary follows from the exact compiled pocket definition and `cap_add`/`cap_has_space` implementation. The host C test `test_each_pocket_fills_last_complete_page_and_refuses_next` passed, but this review did not run native 59/60 and 60/60 fixtures.

Save routing is present in the same blob: the hook at `0x02027C18` targets `sgp_cap_save`. [`runtime.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/runtime.c) serializes the cache’s extra slots before calling the original native save; [`journal.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/journal.c) stores the 108 expanded slots (432 bytes) in its 452-byte extension record. `cap_export` copies only the first 50 Key Items into native SaveArray3. The Rocket grant run did not perform a native Save or cold reload, so persistence of item 119 remains unverified.

This note corrects the interpretation in `qa/runs/rocket-grant-savearray3-audit-02/acceptance.json`; that historical report is unchanged. It does not establish persistence, or global availability of item 119 in unrelated builds.

## Español

**Hallazgo:** el diagnóstico de «éxito falso» para el perfil `50/50` de la ROM `08e1d4e51599dc459600f1eff44e7915acbbaa111d74321be22a4800af629fcf` es incorrecto. El fixture llena los 50 slots legacy de SaveArray3; esta ROM tiene una bolsa de Objetos clave de 60 slots.

Los bytes ARM9 de la ROM en `0x023DBF00` coinciden byte a byte con el `blob.bin` de la expansión de Bolsa (SHA-256 `e41d95a3a7f57e504697c83f754c6fbb57745291d149dcb9d94b4dcde5f3c1fb`). El manifiesto declara capacidades `[252,42,30,102,66,12,30,60]`. En [`core.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/core.c), la bolsa 7 es Objetos clave, `cap_count(7)=60` y el formato nativo tiene 50. `cap_has_space` y `cap_add` recorren los 60 slots.

Los snapshots RAM congelados confirman la entrega. Antes de confirmar, `rocket-grant-pocket50-offer-01/system_ram.bin` (SHA `4b0843dde60451f07f7b9a0d6ba23470ed367f19704d896109f812292a113d89`) tiene 50 entradas en caché y el slot 50 vacío. Tras hablar con Rocket, `rocket-grant-pocket50-no-space-01/system_ram.bin` (SHA `1e06259526f3593dea092c4cb9f605be7ee6ada660b008be6f9405892c547dfd`) tiene 51: `{119,1}` está en el slot 50 de la bolsa, slot global 584 de la caché, dirección `0x023DE034`. La caché corresponde al SaveData activo y su puntero de proyección legacy coincide con SaveArray3. SaveArray3 sigue con 50 slots y sin el objeto 119, como corresponde. La revisión visual manual de Root de `rocket-grant-08e-expanded-store-scan-key-items-01/key_page_9_stable.png` confirma el objeto en la página 9 de Objetos clave. Por tanto, el comando 125 sí añadió el objeto 119 a la caché expandida; la auditoría anterior comparó sólo la proyección legacy y clasificó mal la ejecución.

El límite 59/60→60/60 se desprende de la definición compilada de la bolsa y de `cap_add`/`cap_has_space`. Pasó el test C de host `test_each_pocket_fills_last_complete_page_and_refuses_next`; esta revisión no ejecutó fixtures nativos 59/60 ni 60/60.

El mismo blob contiene el hook de guardado `0x02027C18 → sgp_cap_save`. [`runtime.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/runtime.c) serializa los slots extra antes de llamar al guardado nativo original; [`journal.c`](../../sources/sacred-gold-plus/source/features/capacita-borsa/sorgenti/journal.c) almacena los 108 slots expandidos (432 bytes) en un registro de extensión de 452 bytes. `cap_export` copia sólo los primeros 50 Objetos clave a SaveArray3. La ejecución de Rocket no hizo un guardado nativo ni una carga en frío; la persistencia del objeto 119 sigue sin verificarse.

Esta nota corrige la interpretación de `qa/runs/rocket-grant-savearray3-audit-02/acceptance.json`; el informe histórico queda intacto. No demuestra persistencia ni disponibilidad global del objeto 119 en otras builds.
