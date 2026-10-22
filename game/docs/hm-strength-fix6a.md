# Native Strength QA / Pruebas nativas de Fuerza

## English

**Outcome: Strength activation and one native boulder push verified on FIX6a.** The game displayed “CLEFAIRY used Strength!” and then “CLEFAIRY’s Strength made it possible to move boulders around!” With no active codes and no recognized HM move in the party, one later RIGHT input moved the real event object from `(28, 8, 20)` to `(29, 8, 20)`. Player object ID255 remained at `(27, 8, 20)`, facing east.

The target was not fabricated: native save object ID0, model84, script10002 was preserved byte-for-byte from map176. The DSV fixture changed `LocalFieldData.currentPosition`, player ID255’s saved coordinates and facing, and the selected save-slot CRC. The older slot stayed unchanged. The player object’s internal `mapId=1` also stayed unchanged; the upstream avatar creation path uses that value.

The earlier position-only fixture was invalid because the game restores actor coordinates and map objects from `SavedMapObjects`; changing `currentPosition` alone left the avatar and object table stale. The corrected fixture starts from an in-game map176 save. Map176 itself was reached through a synthetic fixture and native warp, so normal story access remains unassessed.

The cold-boot script repeated A to reach Continue. At frame 4300 the Strength message was already visible, so activation is inferred to have happened during that A cadence after the field loaded. The scheduled A at frame 5500 advanced the message. The checkpoint file named `strength_target_pre_action.png` is therefore post-activation, not a pre-action capture; the exact activation frame was not captured.

The boulder move was checked in a same-ROM savestate continuation. Saving and cold-reloading after the push remains pending. This report covers Strength only.

Evidence and exact hashes are in the [Strength QA report](qa-hm-strength-fix6a.json). RAM dumps and emulator states remain local evidence, outside the published site; the report records their paths and hashes.

![Native Strength message in Dark Cave](../assets/locations/hm-fix6a-strength.png)

## Español

**Resultado: activación nativa de Strength y un empuje de roca verificados en FIX6a.** El juego mostró «CLEFAIRY used Strength!» y después «CLEFAIRY’s Strength made it possible to move boulders around!». No había códigos activos ni movimientos de MO conocidos en el equipo. Una pulsación posterior de RIGHT movió el objeto real del evento de `(28, 8, 20)` a `(29, 8, 20)`. El objeto de jugador ID255 permaneció en `(27, 8, 20)`, mirando al este.

El objetivo no se inventó: el objeto ID0, modelo84, script10002 procede del guardado nativo del mapa176 y se conservó byte a byte. La batería DSV solo cambió `LocalFieldData.currentPosition`, las coordenadas y orientación guardadas del jugador ID255 y el CRC del slot seleccionado. El slot anterior quedó intacto. También se conservó el `mapId=1` interno del objeto del jugador; la ruta de creación del avatar en el código upstream usa ese valor.

La partida anterior que solo cambiaba la posición era inválida: el juego restaura las coordenadas del actor y los objetos del mapa desde `SavedMapObjects`; cambiar únicamente `currentPosition` dejó datos antiguos. La partida corregida parte de un guardado nativo dentro del mapa176. Se llegó allí mediante una preparación sintética y un warp nativo, así que el acceso normal por historia sigue sin evaluarse.

El arranque en frío repitió A para llegar a Continue. En el checkpoint del frame 4300 ya aparecía el mensaje de Strength; por ello se infiere que la acción se activó durante esa secuencia de A, después de cargar el campo. La A programada en el frame 5500 avanzó el diálogo. Por tanto, `strength_target_pre_action.png` se capturó después de la activación y no sirve como imagen previa; no se registró el frame exacto de activación.

El empuje se comprobó en una continuación de estado con la misma ROM. Guardar y volver a cargar en frío después del empuje queda pendiente. Este informe solo cubre Strength.

Los hashes exactos están en el [informe de Fuerza](qa-hm-strength-fix6a.json). Los volcados de RAM y los estados del emulador quedan como evidencia local, fuera de la web publicada; el informe registra sus rutas y hashes.

![Mensaje nativo de Strength (Fuerza) en Dark Cave (Cueva Oscura)](../assets/locations/hm-fix6a-strength.png)
