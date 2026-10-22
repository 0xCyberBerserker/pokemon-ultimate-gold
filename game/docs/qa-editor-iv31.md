# Stat Editor: IV 31 ceiling

## English

**Verified bounded case on the private bd50 candidate.** Chikorita in party slot 1 increases Defense IV through native +5/Repeat operations: **10 → 15 → 20 → 25 → 30 → 31**. The last step proposes 31 rather than 35. Repeating at 31 shows “No increase is available. No change was made.”, with no new confirmation or 31→31 preview.

The frozen audit covers 22 runs and 11 captures. It verifies state ancestry, RAM hashes, the selected record and derived stats, preservation of PID/EVs/Nature and unrelated party data, the full 2,376-byte expanded Bag cache and its separate 1,952-byte native projection. Native Save advances MAIN 12→13; a fresh same-ROM cold load without a state or cheats retains Defense IV 31. Saved and cold batteries are byte-identical: SHA-256 `79cc4442274c00e9fe70223fd0ca8a1140694ea915699d2877df8f570c3e7988`.

Root reproduced the complete report exactly, and independent review passes. Auditor SHA-256: `c99d23b97f0e0d5f0e0edd6bc3de9b4e80423d53018bac18080600d9932b37f4`. Report SHA-256: `3a313013eec490eea9b043131f6851ce9330f75682a5e1eb8a92e8e75a9a3789`. Independent review SHA-256: `07679f5c44bd90d1b3e1cd3f4df13c11a4cb6dc8f3af2942b2dbc52cb49a57b0`.

This accepts one selected stat/species boundary case in an emulator, not every species, hardware, EV limit or other editor path. The reviewed image is at frame 3400 and the terminal RAM dump at 3700; they are separately attested, not simultaneous snapshots. No intermediate RAM dump is claimed. The private editor is still outside the downloadable patches.

## Español

**Caso acotado verificado en la candidata privada bd50.** Chikorita, en la posición 1 del equipo, aumenta su IV de Defensa con +5/Repeat nativo: **10 → 15 → 20 → 25 → 30 → 31**. El último paso propone 31 en lugar de 35. Otro Repeat en 31 muestra que no hay más aumento disponible y no cambia el valor; no solicita confirmación ni muestra una propuesta 31→31.

El auditor congelado cubre 22 ejecuciones y 11 capturas. Verifica la cadena de estados, hashes RAM, registro seleccionado y estadísticas derivadas, conservación de PID/EV/naturaleza y datos ajenos del equipo, la Bolsa ampliada de 2.376 bytes y su proyección nativa separada de 1.952 bytes. El guardado avanza MAIN 12→13; el arranque en frío con la misma ROM, sin estado ni códigos, conserva el IV de Defensa 31. Las baterías guardada y cargada en frío son idénticas byte a byte.

Root reprodujo exactamente el informe completo y también pasa la revisión independiente. Los hashes completos figuran arriba.

Se acepta un caso de límite para una estadística y especie en emulador, no todas las especies, hardware, límites de EV ni demás caminos del editor. La imagen revisada corresponde al frame 3400 y el volcado RAM final al 3700: se verifican por separado, no como capturas simultáneas. No se afirma tener RAM intermedia. El editor privado sigue fuera de los parches descargables.
