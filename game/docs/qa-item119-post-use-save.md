# Stat Editor: Save after Use / Guardar después de Use

## English

**Bounded result:** the private bd50 candidate saved after opening and leaving the Stat Editor. The saved Party is intact, and a state-free cold run found exactly one Stat Editor. **Whole runtime-Party integrity remains inconclusive:** slot 2 fails checksum decoding in the cold RAM snapshot.

This tests the existing synthetic three-Pokémon fixture without editing stats. It does not accept Alpha 2, a new-story acquisition route, hardware, every save workflow or a downloadable editor.

### What was checked

- **Native Save:** the isolated DSV changed from `66888b…` to `21dfe1…`; MAIN counter advanced 10→11, with both MAIN CRCs valid. The active record moved to `0x40000`, CRC 51970.
- **Stored Party:** all 1,460 bytes are identical before/after, including the header and unused records. The three occupied slots (species 35/152/66) decode with valid checksums and preserve PID/flags, fields and tails.
- **Cold continuation:** a separate 5,500-frame process had no input savestate or cheats. Its live Bag contained item 119×1 in Key Items slot 5; the 2,376-byte Bag cache retained its expected SaveData/1,952-byte projection links and original hash.
- **Runtime limit:** slots 0/1 decode and match the saved records exactly. Slot 2 matches its header and the known plain/cipher boundary (40-byte box prefix), but its checksum does not decode validly. This is not a whole-Party PASS. The runner itself reports `NOT_ASSESSED` gameplay acceptance and `NOT_TESTED` for its generic battery-load check; the bounded findings above come from separate DSV/RAM analysis.

### Execution accounting and evidence

Four core invocations total: one 900-frame attempt started from a misleadingly named family-menu checkpoint and did not save; the single correction used an actual field checkpoint, combined Save-open/accept (1,800 frames), completed Save (900), then cold-loaded (5,500). No extra core calls were made during the review after restart. Originals and the historical failed-attempt record were preserved.

| Evidence | SHA-256 |
| --- | --- |
| Private bd50 ROM | `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164` |
| Source DSV | `66888b02527628bffa9f04901c68b9c46649a21a381902221e9c50efc460405f` |
| Post-Use saved DSV | `21dfe1ce8f6c953a622fdd2c85f82420ec37134f7ca0ff34857c1b05608d5867` |
| Stored Party (before and after) | `7afb542090a571ab3d35faf7423d6931f52228e166b1ffb2e31ceef5b5726f70` |
| Cold result JSON | `33e83879db4ee6b33950c1a5d8e6f75eb1d0c30871f6f931ec14ad972b30cf97` |
| Cold RAM | `6d60363eb5ba3425f1f7626810d2f4dfdb7d3c690f92e16a29c8ebb5f111de8a` |
| Cold live Bag | `17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1` |
| Capacity runner | `907a8ef3da22b71577289cc9454f764f27de8c4a248bfe6f913f6cc6c537814b` |
| Core | `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89` |

Review reused the existing DSV CRC selector, checksum-validating Party decoder, Bag parser and strict cipher-boundary comparison. No Party normalization or new emulation was used. Historical runs from the earlier persistence case used a different runner and retain their own provenance. See [current editor status](qa-editor-current-status.md).

## Español

**Resultado acotado:** la candidata privada bd50 guardó después de abrir y salir del Stat Editor. El equipo guardado permanece intacto y un arranque en frío sin estado encontró una sola copia del editor. **La integridad de todo el equipo en RAM sigue inconclusa:** el checksum de la posición 2 no se valida en la captura fría.

Se utilizó la partida sintética existente con tres Pokémon, sin editar estadísticas. Esto no acepta Alfa 2, la adquisición desde una partida nueva, hardware, todos los flujos de guardado ni un editor descargable.

### Qué se comprobó

- **Guardado nativo:** el DSV aislado pasó de `66888b…` a `21dfe1…`; MAIN avanzó 10→11 y ambos registros conservan CRC válido. El activo está en `0x40000`, CRC 51970.
- **Equipo guardado:** coinciden exactamente los 1.460 bytes, incluidos cabecera y huecos sin ocupar. Los tres registros (especies 35/152/66) tienen checksums válidos y conservan PID/flags, campos y colas.
- **Continuación en frío:** otro proceso de 5.500 fotogramas, sin savestate de entrada ni trucos, encontró el objeto 119×1 en Key Items, posición 5. La caché de Bolsa de 2.376 bytes mantiene el hash original y sus enlaces esperados a SaveData y a la proyección de 1.952 bytes.
- **Límite en ejecución:** las posiciones 0/1 se decodifican y coinciden exactamente con el guardado. La posición 2 coincide con su cabecera y la frontera conocida de cifrado (prefijo de 40 bytes), pero no valida el checksum. No es un PASS global del equipo. El runner declara `NOT_ASSESSED` para aceptación jugable y `NOT_TESTED` para su prueba genérica de carga de batería; las conclusiones acotadas anteriores proceden del análisis separado del DSV y la RAM.

### Ejecuciones y evidencia

Se consumieron cuatro invocaciones en total: un intento de 900 fotogramas partió de un checkpoint mal etiquetado, todavía en el menú de familias, y no guardó. La única corrección partió del campo real: apertura/aceptación agrupadas (1.800), finalización del guardado (900) y arranque en frío (5.500). La revisión tras el reinicio no añadió emulación. Se conservaron los originales y el registro histórico del intento fallido.

La tabla inglesa contiene los hashes completos comunes a ambos idiomas. La revisión reutilizó el selector de CRC del DSV, el decodificador de equipo con validación de checksum, el parser de Bolsa y la comparación estricta de fronteras de cifrado. No se normalizó el equipo. Las pruebas históricas anteriores conservan su runner y procedencia distintos. Consulta el [estado actual del editor](qa-editor-current-status.md).
