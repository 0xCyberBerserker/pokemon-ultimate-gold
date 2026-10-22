# Independent review — bd50 Nature Reset

## English

**Result: bounded native Reset, Save, and state-free cold reload pass.** I reproduced the pinned offline auditor without opening an emulator or changing its original files. The source DSV is 8c3ae167…b20fe356 at counter 11 / CRC 15391; the saved DSV is e574dd71…6ca44e6 at counter 12 / CRC 59927, with both MAIN records valid. The fresh cold run has no state input and loads a DSV byte-identical to the saved copy.

Clefairy slot 0 retains PID E30363E2, EVs [0,0,0,0,0,0], and IVs [15,3,10,31,21,2]. Reset clears only the encoded nature override (0x0004 → 0x0000); PID-derived nature index 10 is Timid. Stats change from [22,22,9,9,10,12,11] to [22,22,8,10,11,12,11]; current and maximum HP remain 22. The saved active Party array equals the exact expected single-slot transformation, with peer records preserved.

The expanded Bag cache is 2,376 bytes at 0x023DD714; raw RAM slices have the same SHA-256 (17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1) at the seed, accepted Reset, cold reload, and Summary. Cache identity pointers, item 118×1, item 119×1, and six occupied Key Item entries also match. The 1,952-byte SaveArray3 projection remains byte-identical to the seed.

**Auditor note:** it reports the expanded-Bag hash but does not assert that hash equals the seed. The captured bytes are equal, so this does not overturn this evidence; it is a low, non-blocking guard gap for future runs. Cold slot 2 is sampled at an exact two-byte cipher boundary with invalid transient checksum; the review does not interpret it as corruption. The saved DSV and accepted Reset snapshot contain complete valid records. Scope remains one Reset Nature path on bd50; gameplay_acceptance is NOT_ASSESSED.

## Español

**Resultado: pasan Reset nativo, guardado y recarga fría sin estado dentro del alcance probado.** Reproduje el auditor fijado sin abrir el emulador ni modificar sus archivos originales. El DSV fuente es 8c3ae167…b20fe356, contador 11 / CRC 15391; el DSV guardado es e574dd71…6ca44e6, contador 12 / CRC 59927, con ambos registros MAIN válidos. La recarga fría no usa estado y carga un DSV idéntico byte a byte al guardado.

La Clefairy del slot 0 conserva el PID E30363E2, los EV [0,0,0,0,0,0] y los IV [15,3,10,31,21,2]. Reset borra solo la anulación codificada de naturaleza (0x0004 → 0x0000); el índice de naturaleza derivado del PID, 10, corresponde a Timid. Las estadísticas pasan de [22,22,9,9,10,12,11] a [22,22,8,10,11,12,11]; los PS actuales y máximos siguen en 22. El equipo activo guardado coincide con la transformación exacta del registro del slot 0 y conserva los demás registros.

La Bolsa expandida ocupa 2.376 bytes en 0x023DD714; los cortes de RAM tienen el mismo SHA-256 (17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1) en la semilla, Reset aceptado, recarga fría y Summary. También coinciden los punteros de identidad de la caché, el objeto 118×1, el 119×1 y seis entradas ocupadas de Objetos clave. La proyección SaveArray3 de 1.952 bytes permanece idéntica a la semilla.

**Nota del auditor:** emite el hash de la Bolsa expandida, pero no exige que coincida con la semilla. Los bytes capturados sí coinciden, por lo que esto no invalida esta evidencia; queda una brecha menor no bloqueante para ejecuciones futuras. El slot 2 frío se muestrea en una frontera exacta de cifrado de dos bytes con checksum transitorio inválido; no se interpreta como corrupción. El DSV guardado y la captura tras Reset contienen registros completos válidos. El alcance sigue limitado a un flujo Reset Nature en bd50; gameplay_acceptance permanece en NOT_ASSESSED.

Pins: auditor SHA-256 83cf6f0562eefb2e99444e24fffc8f5bca0fd5e66cab2f699cca8d17e7afc838; acceptance original SHA-256 e385c4b3d53ce995d0a078039d4c996954e8ef874fe6190d19183eb6f9c6c8f2.
