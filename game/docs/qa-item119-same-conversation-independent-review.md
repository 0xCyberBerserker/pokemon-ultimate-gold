# Rocket kit recipient BD50 — independent review

## English

**Verdict: bounded pass for the same-conversation grant and duplicate check.** I reviewed the frozen audit and acceptance JSON without rerunning the emulator. The audit SHA-256 is `86e636165be7ddaeb11d36614b41b4a1d505cec6c5dca49e842c8c9d8e569072`; the acceptance JSON SHA-256 is `cc265d56035e82d16c5d0f57ea822177739338fd38b21363e6eebd70ac1d4d9c`.

The JSON records 11 chained runs from a cold start with no imported state, all pinned to ROM `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`, the same core and runner, no cheats, and the AA0C profile DSV (`aa0c3b947fe1a679da6d17c5be42863a905ba89f793425714ba7be90df4a6087`). I checked the referenced result, RAM, state, and screenshot hashes (42 files), plus each run's ROM/core/runner, battery identity, cheats, frame count, and `NOT_ASSESSED` label.

The run chain places the editor offer directly after acknowledgement of the original kit-marker message, with no intervening field re-entry. I visually checked the pinned screenshots: the prompt reads “Take the Stat Editor?” with Yes/No, acceptance shows “You got the Stat Editor!”, and later re-entry shows “You already have it.” The cold-to-offer inventory delta contains the nine expected gifts exactly once: items 50, 77, 78, 113, 114, 118, 154, 155, and 157, each with quantity one. Item 119 is absent at offer time. Acceptance changes only key-pocket slot 5 (global Bag index 539), from empty to item 119 ×1; the only changed Bag byte offsets are 2156 and 2158. The re-entry and acknowledgement Bag snapshots are byte-identical to the post-grant snapshot.

The auditor checks the live BPAC identity and SaveArray3 projection against RAM pointers. Sampled Party records strictly match the AA0C source at permitted two-byte cipher boundaries. The decoded checksum is invalid in the cold and final re-entry-ack samples; these transitional observations are retained as limits, not called corruption.

**Scope limit:** all 11 runner entries explicitly say `gameplay_acceptance: NOT_ASSESSED`. No native Save, post-grant cold reload, item use, or EV/IV edit was performed; the DSV remained byte-identical and its two stored slot checksums are valid. This review supports the bounded interaction evidence only.

## Español

**Dictamen: aceptación acotada de la concesión en la misma conversación y de la comprobación de duplicados.** Revisé el auditor congelado y el JSON de aceptación sin volver a ejecutar el emulador. SHA-256 del auditor: `86e636165be7ddaeb11d36614b41b4a1d505cec6c5dca49e842c8c9d8e569072`; SHA-256 del JSON: `cc265d56035e82d16c5d0f57ea822177739338fd38b21363e6eebd70ac1d4d9c`.

El JSON registra 11 ejecuciones encadenadas desde un arranque en frío sin estado importado. Todas usan la ROM fijada `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`, el mismo core y runner, ningún truco y el perfil DSV AA0C (`aa0c3b947fe1a679da6d17c5be42863a905ba89f793425714ba7be90df4a6087`). Comprobé los hashes referenciados de resultados, RAM, estados y capturas (42 archivos), además de ROM/core/runner, identidad de batería, trucos, número de frames y etiqueta `NOT_ASSESSED` en cada ejecución.

La cadena sitúa la oferta del editor justo después de confirmar el mensaje marcador del kit original, sin reentrada al campo entre ambos. Revisé visualmente las capturas fijadas: la oferta dice «Take the Stat Editor?» con Sí/No, la aceptación muestra «You got the Stat Editor!» y la reentrada posterior muestra «You already have it.». El cambio de inventario entre frío y oferta contiene exactamente una vez los nueve regalos esperados: objetos 50, 77, 78, 113, 114, 118, 154, 155 y 157, cada uno con cantidad uno. El objeto 119 aún no está en la oferta. Aceptar cambia solo la ranura 5 del bolsillo de objetos clave (índice global 539), de vacía a objeto 119 ×1; los únicos bytes modificados de Bolsa son los offsets 2156 y 2158. Las capturas de Bolsa de la reentrada y su confirmación son idénticas byte a byte a la captura posterior a la concesión.

El auditor comprueba la identidad BPAC viva y la proyección de SaveArray3 contra punteros de RAM. Los registros Party muestreados coinciden estrictamente con la fuente AA0C en límites de cifrado permitidos de dos bytes. El checksum decodificado no es válido en las muestras de arranque en frío y de confirmación final de reentrada; se conservan como límite y no se califican como corrupción.

**Límite:** las 11 ejecuciones del runner indican explícitamente `gameplay_acceptance: NOT_ASSESSED`. No se hizo guardado nativo, cold reload posterior a la concesión, uso del objeto ni edición EV/IV; la DSV conservó exactamente sus bytes y los checksums de sus dos ranuras son válidos. Esta revisión respalda solo la evidencia acotada de interacción.
