# Stat Editor: second party slot

## English

The private `bd50…` candidate passes one native HP-IV increment on Chikorita in party slot 1: **15 → 16**. The operation uses the portable editor's party selector, preview and confirmation. This is separate from the downloadable Alpha 2 patch.

**Current audit v2:** root reproduced the stricter report exactly. All 21 RAM dumps match their runner hashes and sizes; all full 2,376-byte BPAC caches match the seed, with valid identity links. Six negative guards pass, including rejection of a mutation at byte 2,372 (global slot 593), beyond the native projection. Report SHA-256: `3cb590f0581f604f081f5bd404d076bbc303eeefcea5d981e99fc05adce9e47b`; auditor SHA-256: `348f463fbf14c3717c1c08620787cd1ef5348846523ae09d810d77650894cc9c`. Independent v2 review passes: it separately verifies all 21 captures and reproduces the six pure negative guards. Review SHA-256: `bc30249e748736b0d05773d81fe36a9dad29007c3e130e9e517942f21cad66ae`. Both v1 guard gaps are closed for this recorded case. The following v1 notes are retained as history.

- Party slots 0 and 2 remain byte-identical to the source; slot 0 keeps its Lonely override. Chikorita's PID, EVs and other IVs remain unchanged. The 1,952-byte native Bag projection is preserved. The independent review found that v1 did not assert preservation of the full 2,376-byte expanded Bag cache; v2 adds that check.
- Native Save advances the MAIN counter from 11 to 12. A new process loading the same ROM without a state retains IV 16; the saved MAIN CRC is valid. The frozen source battery remains unchanged.
- At level 5, base HP 45 and zero HP EVs, both IV values yield 20 maximum HP after integer rounding. Unchanged HP is expected; this test does not establish battle behavior, caps, repeated increments, resets or PC transfer.

Root reproduced the frozen auditor output exactly, without rerunning the emulator. Report SHA-256: `23c1d7b3117eed53f5f25905fbc96280aecfd9e53a547c10850d103987bf3840`. Auditor SHA-256: `33e103789089be2e2363b86292a7519617bf17f81245add5c5bb3d17e9b14387`. Saved battery SHA-256: `076bbc034939fe1b761d84267ccdac15148cd493aa22c161afb00fbb801a2b18`.

The independent reviewer separately checked all 21 captured RAM dumps: the expanded Bag bytes and identity links are preserved. The review also found that v1 does not assert each RAM dump's hash against its runner result. Root and the reviewer independently verified those hashes: all 21 match. These were two auditor guard gaps, rather than observed evidence corruption. V2 adds both guards using those dumps, without an emulator rerun. Frozen v1 independent review SHA-256: `eed46c4403add9e6dbcf72fdde2508a60aa858d6924e159c121b4b80a9d22f02`.

The engineering evidence remains private, outside this site. This result does not promote the editor into a downloadable release. See [current verification status](qa-editor-current-status.md).

## Español

La candidata privada `bd50…` supera un incremento nativo del IV de PS de Chikorita en la posición 1 del equipo: **15 → 16**. Se usan el selector de Pokémon, la vista previa y la confirmación del editor portátil. Es una candidata separada del parche Alfa 2 descargable.

**Auditoría actual v2:** root reprodujo exactamente el informe estricto. Las 21 capturas RAM coinciden con los hashes y tamaños del runner; todas las cachés BPAC completas de 2.376 bytes coinciden con el origen y mantienen enlaces válidos. Pasan seis guardas negativas, incluida una alteración en el byte 2.372 (posición global 593), fuera de la proyección nativa. También pasa la revisión independiente de v2: comprueba por separado las 21 capturas y reproduce las seis guardas negativas puras. Quedan cerradas ambas carencias de v1 para este caso registrado. Los hashes completos figuran arriba. Las notas siguientes de v1 se conservan como historial.

- Las posiciones 0 y 2 quedan idénticas byte a byte; la posición 0 conserva Lonely. El PID, los EV y los demás IV de Chikorita no cambian. Se conserva la proyección nativa de Bolsa de 1.952 bytes. La revisión independiente detectó que v1 no exigía conservar los 2.376 bytes de la caché de Bolsa ampliada; v2 añade esa comprobación.
- El guardado nativo avanza el contador MAIN de 11 a 12. Un proceso nuevo con la misma ROM, sin cargar estado, conserva el IV 16 y un CRC MAIN válido. La batería de origen congelada permanece intacta.
- Con nivel 5, PS base 45 y cero EV de PS, ambos IV producen 20 PS máximos por el redondeo entero. Es el resultado esperado; esta prueba no acredita combates, límites, incrementos repetidos, reinicios ni transferencias al PC.

El revisor independiente comprobó por separado las 21 capturas de RAM: se conservan los bytes y enlaces de identidad de la Bolsa ampliada. También detectó que v1 no exige que el hash de cada captura coincida con el resultado del runner. Root y el revisor verificaron esos hashes de forma independiente: coinciden los 21. Eran dos carencias de comprobación del auditor; no se ha observado corrupción de evidencia. V2 añade ambas guardas a partir de esas capturas, sin repetir la emulación. El hash del informe independiente congelado de v1 figura arriba.

Root reprodujo exactamente el informe congelado, sin repetir la emulación. Los hashes completos figuran arriba. La evidencia de ingeniería permanece privada, fuera de esta web. Este resultado no incorpora el editor a las descargas. Consulta el [estado actual de verificación](qa-editor-current-status.md).
