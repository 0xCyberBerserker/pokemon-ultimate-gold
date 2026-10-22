# On-foot Rock Climb QA / Pruebas de Treparrocas a pie

## English

![CLEFAIRY uses Rock Climb on Route 47](../assets/locations/hm-fix6a-rock-climb.png)

![The walking avatar on the upper platform after climbing](../assets/locations/hm-fix6a-rock-climb-top.png)

The exact FIX6a ROM completed one native Rock Climb use from an on-foot `PLAYER_STATE_WALKING` state. The approach was visible in RAM at R47 map 151, `(89,396)`, facing north, with saved-object Y `8` and `vecY` `262144`. After confirming the prompt and pressing A once to advance the move message, the same on-foot avatar reached `(89,392)`, Y `14`, `vecY` `458752`. No D-pad input was present in the interaction scripts.

The run began with a cold core launch from a copied native-save DSV. The DSV's matching native-save RAM capture reported avatar state 0 before fixture preparation. The position fixture changed only `currentPosition`, player facing/XYZ/vecY, the target map's weather/camera and the selected slot CRC; its fallback slot and the Bag bytes were preserved. Each navigation stage was seeded with the same fixture DSV and remained on the pinned ROM, core and runner.

Party records were compared against the selected CRC-valid DSV array, checking every record header and byte at valid two-byte cipher boundaries before normalization. The normalized 1460-byte party array matches the saved reference and contains no HM move. The full SaveArray3 Bag hash and reserved 4-KiB region stayed constant through the action.

**Scope:** this confirms the bounded on-foot action from a synthetic R47 position copied from a native Walking-state save. Normal story access, post-climb save/cold persistence and broader route acceptance remain pending. The earlier Surf-state attempt is excluded from this on-foot result.

The [machine report](./qa-hm-rock-climb-walk-fix6a.json) contains hashes, RAM evidence and local paths for the full navigation chain. The two action captures above are published; states and other captures remain local.

## Español

![CLEFAIRY usa Rock Climb (Treparrocas) en Route 47 (Ruta 47)](../assets/locations/hm-fix6a-rock-climb.png)

![El personaje a pie en la plataforma superior después de subir](../assets/locations/hm-fix6a-rock-climb-top.png)

La ROM FIX6a exacta completó un uso nativo de Rock Climb desde el estado a pie `PLAYER_STATE_WALKING`. La RAM situó al jugador visible en R47, mapa 151, `(89,396)`, mirando al norte, con Y del objeto guardado `8` y `vecY` `262144`. Tras confirmar el mensaje y pulsar A una vez para avanzar, el mismo avatar a pie llegó a `(89,392)`, Y `14`, `vecY` `458752`. Los scripts de interacción no contienen entradas de cruceta.

La prueba empezó con un arranque frío del core y una copia de un DSV guardado nativamente. La captura de RAM del mismo guardado confirmó el estado 0 del avatar antes de preparar la fixture. La fixture solo cambió `currentPosition`, facing/XYZ/vecY del jugador, clima/cámara del mapa objetivo y CRC del slot activo; preservó el slot alternativo y los bytes de la Bolsa. Cada etapa de navegación recibió la misma DSV de fixture y usó la ROM, el core y el runner fijados.

Los registros del equipo se compararon con el array de la DSV cuyo CRC es válido. Se verificaron cabeceras y todos los bytes de cada registro, admitiendo únicamente fronteras de cifrado alineadas a dos bytes antes de normalizar. El array normalizado completo de 1460 bytes coincide con el guardado y no contiene movimientos MO. El hash completo de SaveArray3 (Bolsa) y el de la reserva de 4 KiB no cambiaron durante la acción.

**Alcance:** queda confirmada esta acción a pie acotada desde una posición sintética de R47 derivada de un guardado nativo en estado Walking. El acceso normal por historia, el guardado/recarga fría después de escalar y la aceptación de rutas más amplias siguen pendientes. El intento anterior con estado Surfing queda excluido de este resultado a pie.

El [informe de máquina](./qa-hm-rock-climb-walk-fix6a.json) contiene hashes, evidencia de RAM y rutas locales de toda la navegación. Las dos capturas anteriores se publican; los estados y las demás capturas permanecen locales.
