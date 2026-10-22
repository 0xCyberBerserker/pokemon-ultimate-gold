# Independent review — bd50 Nature Reset

## English

Nature can influence some of a Pokémon's stats. This page records two bounded checks on a private test build: resetting Nature and changing a test Chikorita's Nature to Adamant. The Adamant case was saved, loaded again without restoring an emulator save state, and shown as Adamant in Summary. The editor is not included in downloadable Alpha 2, which keeps its current features. These tests do not show how players could obtain the editor in normal gameplay or verify battle and PC effects.

**Result: bounded native Reset, Save, and state-free cold reload pass.** I reproduced the pinned offline auditor without opening an emulator or changing its original files. The source DSV is 8c3ae167…b20fe356 at counter 11 / CRC 15391; the saved DSV is e574dd71…6ca44e6 at counter 12 / CRC 59927, with both MAIN records valid. The fresh cold run has no state input and loads a DSV byte-identical to the saved copy.

Clefairy slot 0 retains PID E30363E2, EVs [0,0,0,0,0,0], and IVs [15,3,10,31,21,2]. Reset clears only the encoded nature override (0x0004 → 0x0000); PID-derived nature index 10 is Timid. Stats change from [22,22,9,9,10,12,11] to [22,22,8,10,11,12,11]; current and maximum HP remain 22. The saved active Party array equals the exact expected single-slot transformation, with peer records preserved.

The expanded Bag cache is 2,376 bytes at 0x023DD714; raw RAM slices have the same SHA-256 (17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1) at the seed, accepted Reset, cold reload, and Summary. Cache identity pointers, item 118×1, item 119×1, and six occupied Key Item entries also match. The 1,952-byte SaveArray3 projection remains byte-identical to the seed.

**Auditor note:** it reports the expanded-Bag hash but does not assert that hash equals the seed. The captured bytes are equal, so this does not overturn this evidence; it is a low, non-blocking guard gap for future runs. Cold slot 2 is sampled at an exact two-byte cipher boundary with invalid transient checksum; the review does not interpret it as corruption. The saved DSV and accepted Reset snapshot contain complete valid records. Scope remains one Reset Nature path on bd50; gameplay_acceptance is NOT_ASSESSED.

### Follow-up: Adamant Set, Save, and cold Summary

A separate bd50 case passes one confirmed Adamant application to Chikorita #152 in Party slot 1, native Save, and a state-free cold reload whose Summary displays Adamant. It uses 12 of 20 allowed invocations. The canonical Nature index is 3; menu encoding is 4 and plain field 114 becomes `0x0008`. PID, IVs, EVs, and the recalculated stats are checked against the exact target record. Peer Party records at mixed cipher phases are compared only with the strict two-byte boundary relation; no checksum validity is inferred. The case does not establish battle/PC consumers or global editor acceptance.

Adamant-case pins: auditor SHA-256 `20c7272cf5e97acba2f9d59230b8694a82d642f42d97e03addee8a328691ab6c`; acceptance JSON SHA-256 `c9acfba59d3da552cbc5043148825c065bb3858ddd9f3b8cd06542755e540226`; independent review SHA-256 `0b132f93eaac9280d3cb0660a67e548c8442394362cce0fa319edff2e35915f8`.

## Español

La naturaleza puede influir en algunas estadísticas de un Pokémon. Esta página reúne dos comprobaciones acotadas sobre una versión privada de prueba: reiniciar la naturaleza y cambiar la naturaleza de una Chikorita de prueba a Adamant. El caso Adamant se guardó, se volvió a cargar sin restaurar un estado de emulador y mostró Adamant en el Resumen (Summary). El editor de naturaleza no está incluido en Alpha 2 descargable, que conserva sus funciones actuales. Estas pruebas no muestran cómo obtendría un jugador el editor durante la partida ni verifican efectos en combate o en el PC.

**Resultado: pasan Reset nativo, guardado y recarga fría sin estado dentro del alcance probado.** Reproduje el auditor fijado sin abrir el emulador ni modificar sus archivos originales. El DSV fuente es 8c3ae167…b20fe356, contador 11 / CRC 15391; el DSV guardado es e574dd71…6ca44e6, contador 12 / CRC 59927, con ambos registros MAIN válidos. La recarga fría no usa estado y carga un DSV idéntico byte a byte al guardado.

La Clefairy del slot 0 conserva el PID E30363E2, los EV [0,0,0,0,0,0] y los IV [15,3,10,31,21,2]. Reset borra solo la anulación codificada de naturaleza (0x0004 → 0x0000); el índice de naturaleza derivado del PID, 10, corresponde a Timid. Las estadísticas pasan de [22,22,9,9,10,12,11] a [22,22,8,10,11,12,11]; los PS actuales y máximos siguen en 22. El equipo activo guardado coincide con la transformación exacta del registro del slot 0 y conserva los demás registros.

La Bolsa expandida ocupa 2.376 bytes en 0x023DD714; los cortes de RAM tienen el mismo SHA-256 (17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1) en la semilla, Reset aceptado, recarga fría y Summary. También coinciden los punteros de identidad de la caché, el objeto 118×1, el 119×1 y seis entradas ocupadas de Objetos clave. La proyección SaveArray3 de 1.952 bytes permanece idéntica a la semilla.

**Nota del auditor:** emite el hash de la Bolsa expandida, pero no exige que coincida con la semilla. Los bytes capturados sí coinciden, por lo que esto no invalida esta evidencia; queda una brecha menor no bloqueante para ejecuciones futuras. El slot 2 frío se muestrea en una frontera exacta de cifrado de dos bytes con checksum transitorio inválido; no se interpreta como corrupción. El DSV guardado y la captura tras Reset contienen registros completos válidos. El alcance sigue limitado a un flujo Reset Nature en bd50; gameplay_acceptance permanece en NOT_ASSESSED.

### Caso adicional: aplicar Adamant, guardar y abrir Summary en frío

Un caso bd50 separado supera la aplicación confirmada de Adamant a Chikorita #152 en el slot 1 del equipo, el guardado nativo y la carga en frío sin estado; el Summary muestra Adamant. Usa 12 de las 20 invocaciones permitidas. El índice canónico de Nature es 3; el valor codificado del menú es 4 y el campo 114 descifrado queda en `0x0008`. PID, IV, EV y estadísticas recalculadas se verifican frente al registro objetivo exacto. Los registros ajenos del equipo capturados en fases mixtas de cifrado se comparan solo mediante la relación estricta de frontera de dos bytes; no se infiere validez de checksum. El caso no demuestra consumidores de batalla/PC ni aceptación global del editor.

Pins del caso Adamant: auditor SHA-256 `20c7272cf5e97acba2f9d59230b8694a82d642f42d97e03addee8a328691ab6c`; JSON de aceptación SHA-256 `c9acfba59d3da552cbc5043148825c065bb3858ddd9f3b8cd06542755e540226`; revisión independiente SHA-256 `0b132f93eaac9280d3cb0660a67e548c8442394362cce0fa319edff2e35915f8`.

Pins: auditor SHA-256 83cf6f0562eefb2e99444e24fffc8f5bca0fd5e66cab2f699cca8d17e7afc838; acceptance original SHA-256 e385c4b3d53ce995d0a078039d4c996954e8ef874fe6190d19183eb6f9c6c8f2.
