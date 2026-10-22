# Stat Editor: reset all IVs

## English

The private bd50 candidate has a native **Reset all IVs** operation. It resets the selected Pokémon's six IVs together; EVs and Nature have separate controls. The recorded test selects Chikorita in party slot 1, confirms Yes and changes `[16,3,10,31,21,2]` to `[0,0,0,0,0,0]`.

The frozen auditor verifies 20 runs, each RAM dump's hash and size, state ancestry and frozen battery snapshots. PID, EVs, Nature override and the other two party records are preserved. The full 2,376-byte expanded Bag cache, its identity links and the separate 1,952-byte native projection remain unchanged. Seven negative guards pass.

Native Save advances the MAIN counter 12→13. The saved battery, SHA-256 `7e7ed9434a140e6a2b08ec2ca8e8b6c9b0b701d7f5ede06e105c6eb7bcd66b8b`, retains the six zeros after a fresh same-ROM cold boot without a state or cheats. Root reproduced the computation's JSON exactly without rerunning the emulator or writing over the evidence. Independent review passes within this scope, checking all 20 captured runs and seven negative guards. Review SHA-256: `195c5bfcb8cd899f5cd80d2813ef378b74db64c0b99afe083642fd688a0824e4`.

Auditor SHA-256: `714287efa06e603c8154ceb86681cc563965bfadebc9c4856138c891433755f7`. Report SHA-256: `10b4a7d032a521c28c3238c69460325d52a59e23d0960329fbea158e08d22d63`.

The initial cold attempt used a misnamed temporary profile and is excluded; its corrected attempt loads the pinned source battery. The runner reports gameplay acceptance as NOT_ASSESSED. This result covers one selected level-5 Chikorita and its persistence, not all species, battles, PC transfers or IV 31 progression. The wrapper file is pinned, but the run results attest the inner runner rather than proving wrapper invocation. No downloadable patch changes.

## Español

La candidata privada bd50 ofrece **Reset all IVs** de forma nativa. Reinicia juntos los seis IV del Pokémon elegido; los EV y la naturaleza tienen controles separados. La prueba selecciona a Chikorita en la posición 1 del equipo, confirma Yes y pasa de `[16,3,10,31,21,2]` a `[0,0,0,0,0,0]`.

El auditor congelado verifica 20 ejecuciones, hash y tamaño de cada captura RAM, ascendencia de estados y copias congeladas de partida. Conserva PID, EV, naturaleza y los otros dos registros del equipo. No cambian la caché ampliada de Bolsa de 2.376 bytes, sus enlaces de identidad ni la proyección nativa separada de 1.952 bytes. Pasan siete guardas negativas.

El guardado nativo avanza el contador MAIN de 12 a 13. La batería guardada conserva los seis ceros tras arrancar en frío con la misma ROM, sin estado ni códigos. Root reprodujo exactamente el JSON del cálculo sin repetir la emulación ni sobrescribir la evidencia. También pasa la revisión independiente dentro de este alcance, con comprobación de las 20 ejecuciones y las siete guardas negativas. Los hashes completos figuran arriba.

Se excluye el primer intento de arranque, que usó un perfil temporal mal nombrado; el intento corregido carga la batería de origen fijada. El runner mantiene la aceptación general de juego en NOT_ASSESSED. El resultado cubre un Chikorita de nivel 5 y su persistencia, no todas las especies, combates, transferencias al PC ni la progresión hasta IV 31. El archivo del wrapper está fijado, pero los resultados acreditan el runner interno y no demuestran la invocación del wrapper. Las descargas no cambian.
