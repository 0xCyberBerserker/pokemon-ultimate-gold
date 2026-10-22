# Rocket capacity-60 BD50 — independent review

## English

**Verdict: bounded pass for full-Bag rejection, recovery after rejection, and duplicate re-entry in the recorded emulator interaction.** I reviewed the frozen auditor and JSON without rerunning the emulator or opening a core. Auditor SHA-256: `f97bac22b632eca65fb09b18098719669a82848e5bd7923a545b3ee6a67e91f0`; acceptance JSON SHA-256: `acb761b09c0522d01b96dba10b9b06dcd8c8310d8f3bb68a9baf0e9e337239a8`.

The nine-run record pins the same bd50 ROM, core, capacity runner, helpers, and recipes. The AA0C seed DSV and isolated profile are byte-identical (`aa0c3b947fe1a679da6d17c5be42863a905ba89f793425714ba7be90df4a6087`); both DSV save-slot checksums are valid. Static checks matched the referenced run, RAM, state, battery-sidecar, recipe, and screenshot hashes. All runner records say `gameplay_acceptance: NOT_ASSESSED` and `battery_save_load: NOT_TESTED`.

The full-60 Bag was prepared with the pinned recipe in a setup-only run. The next interaction run had no cheat file or active codes: the Bag remained byte-identical, and the screenshot reads “Bag is full. Make room.” The accepted recovery path begins from that post-rejection state, then branches into a separate slot-59 preparation. A different release-59 preparation branched before the rejection and is explicitly excluded from the recovery claim. Both Action Replay recipes are confined to setup runs; the rejection, acknowledgement, retry offer, acceptance, and re-entry runs contain no cheats.

The retry adds exactly one Stat Editor to canonical Key Item slot 59 (`119 ×1`). I independently compared the raw Bag slices: rejection changes no Bag bytes; release preparation changes only relative offsets 2372–2374; retry acceptance changes only offsets 2372 and 2374. Grant acknowledgement and later re-entry preserve the accepted Bag byte-for-byte. The checked screenshots show “You got the Stat Editor!” and, on re-entry, “You already have it.”

All sampled Party records strictly match the AA0C seed at the permitted encrypted/plain cipher boundaries. The recovery-acknowledgement and grant-acknowledgement samples have invalid decoded checksums; this is recorded as a boundary diagnostic and is not interpreted as Party corruption.

**Limit:** no native Save or fresh cold reload followed the grant, the DSV remained unchanged, and item use or EV/IV editing was not tested. This is bounded emulator interaction evidence for this exact build, not general gameplay or release acceptance.

## Español

**Dictamen: aceptación acotada del rechazo con la Bolsa llena, la recuperación posterior al rechazo y la reentrada sin duplicado en la interacción registrada del emulador.** Revisé el auditor congelado y su JSON sin repetir el emulador ni abrir un core. SHA-256 del auditor: `f97bac22b632eca65fb09b18098719669a82848e5bd7923a545b3ee6a67e91f0`; SHA-256 del JSON: `acb761b09c0522d01b96dba10b9b06dcd8c8310d8f3bb68a9baf0e9e337239a8`.

El registro de nueve ejecuciones fija la misma ROM bd50, core, runner de capacidad, helpers y recetas. La DSV semilla AA0C y el perfil aislado son idénticos byte a byte (`aa0c3b947fe1a679da6d17c5be42863a905ba89f793425714ba7be90df4a6087`); los checksums de sus dos ranuras son válidos. Las referencias de hashes de ejecuciones, RAM, estados, sidecars de batería, recetas y capturas coinciden. Todos los registros del runner llevan `gameplay_acceptance: NOT_ASSESSED` y `battery_save_load: NOT_TESTED`.

La Bolsa llena de 60 espacios se preparó con la receta fijada en una ejecución solo de preparación. La siguiente interacción no tuvo archivo de trucos ni códigos activos: la Bolsa no cambió y la captura muestra «Bag is full. Make room.». La ruta de recuperación aceptada parte de ese estado posterior al rechazo y después crea una preparación separada para liberar el slot 59. Otra preparación de liberación del slot 59 partía de antes del rechazo y está excluida expresamente de la afirmación de recuperación. Las dos recetas Action Replay se limitan a ejecuciones de preparación; rechazo, confirmación, nueva oferta, aceptación y reentrada se ejecutaron sin trucos.

El reintento añade exactamente un Editor a la ranura canónica 59 de objetos clave (`119 ×1`). Comparé de forma independiente las porciones RAM crudas de la Bolsa: el rechazo no cambia bytes; la preparación de liberación cambia solo los offsets relativos 2372–2374; aceptar el reintento cambia solo los offsets 2372 y 2374. La confirmación de concesión y la reentrada posterior conservan la Bolsa aceptada byte a byte. Las capturas revisadas muestran «You got the Stat Editor!» y, al volver, «You already have it.».

Todos los registros Party muestreados coinciden estrictamente con la semilla AA0C en los límites permitidos de cifrado/descifrado. Las muestras de confirmación de recuperación y de concesión tienen checksum decodificado inválido; se registra como diagnóstico del límite observado y no se interpreta como corrupción de Party.

**Límite:** no hubo guardado nativo ni nuevo arranque en frío tras la concesión; la DSV permaneció intacta y no se probaron uso del objeto ni edición EV/IV. Es evidencia acotada de interacción emulada para esta compilación exacta, no aceptación del juego completo ni de release.
