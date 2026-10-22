# Native Fly and Surf QA / Pruebas nativas de Vuelo y Surf

## English

![Native Fly arrival in New Bark Town](../assets/locations/hm-fix6a-fly-arrival.png)

![CLEFAIRY uses Surf without knowing the move](../assets/locations/hm-fix6a-surf.png)

**Status:** `PASS_NATIVE_FLY_SURF_SAVE_COLD_WALKING_FRIENDSHIP`. Native Fly, Surf, return to land, save, and fresh cold reload are observed on the exact FIX6a ROM. Bag and badges match across the action and reload. Review the [machine report](qa-hm-fly-surf-fix6a.json) before using this result for promotion.

The native Fly prompt selected New Bark Town, and the avatar arrived outside Elm's lab on map 60 at `(695,397)`. Surf showed the native prompt and `CLEFAIRY used Surf!`; the avatar moved over water to `(701,399)` with Surf state 2, then returned to land at `(699,399)` with state 0. No codes were active during these actions. A native save was loaded by a fresh process without a savestate; it restored map 60 at `(699,399)` with Surf state 0.

The strict party comparison found only two persisted decoded changes: Chikorita friendship 71→72 and Machop 70→71; Clefairy and every other decoded party field remain unchanged. The pre-action copy has valid DSV counters 8/7 and SHA-256 `8019cbac958d0120b5654c2500848d2e32bc3d00e31b1b71b6f735c7bf1f6ede`. The native save produced a valid counter-9 DSV with SHA-256 `e8226f157c117c5f8a531eebca98cef7fdbe2104afcfcd99018264a8995ef204`. RAM records match every byte of a checksum-valid pre-save or post-save DSV record at an exact cipher boundary; frames with invalid checksums are reported as such, not ignored. Source traces `VAR_FRIENDSHIP_STEPS` at 122 before Fly, 122 after Fly, then 1 after seven land steps to the Surf approach: that crosses the 128-step threshold once. The source applies a walking friendship event at that threshold, with a 50% random skip; the two +1 changes are consistent with the observed native event. This acceptance covers only this FIX6a action sequence.

The 4 KiB reserved image was checked against the exact ROM and compiled helper by `qa/runs/hm-fly-surf-fix6a-reserve-audit.json` (SHA-256 `8c86f43bf1e04e074d12aa67d09c9cd903c1bed109f3b109ce536692599fb976`). Its audit finds all changed runtime bytes inside twelve named mutable `.owned_hm.state` symbols; immutable bytes, code, guards, and padding match the ROM across all six checkpoints.

The two captures above are published. Other evidence remains local under `qa/runs/hm-fly-surf-fix6a-*`: input scripts, state hashes, RAM dumps and DSV copies. The cold-reload field capture is `hm-fly-surf-fix6a-cold-reload-continue/field_before_action.png`.

## Español

![Llegada nativa de Fly (Vuelo) a New Bark Town (Pueblo Primavera)](../assets/locations/hm-fix6a-fly-arrival.png)

![CLEFAIRY usa Surf sin conocer el movimiento](../assets/locations/hm-fix6a-surf.png)

**Estado:** `PASS_NATIVE_FLY_SURF_SAVE_COLD_WALKING_FRIENDSHIP`. Fly, Surf, retorno a tierra, guardado y recarga fría en un proceso nuevo se observaron en la ROM FIX6a exacta. Bolsa y medallas coinciden antes y después. Consulta el [informe de máquina](qa-hm-fly-surf-fix6a.json) antes de usar este resultado para promoción.

El prompt nativo de Fly seleccionó New Bark Town y el avatar llegó fuera del laboratorio del Profesor Elm, en el mapa 60 y posición `(695,397)`. Surf mostró su prompt nativo y el texto `CLEFAIRY used Surf!`; el avatar avanzó sobre el agua hasta `(701,399)` en estado Surf 2 y volvió a tierra en `(699,399)` con estado 0. No hubo códigos activos durante estas acciones. Un guardado nativo se cargó en un proceso nuevo, sin savestate, y restauró el mapa 60 en `(699,399)` con estado Surf 0.

La comparación estricta del equipo encontró solo dos cambios persistidos: amistad de Chikorita 71→72 y de Machop 70→71; Clefairy y los demás campos descifrados no cambiaron. La copia previa a la acción tiene contadores DSV válidos 8/7 y SHA-256 `8019cbac958d0120b5654c2500848d2e32bc3d00e31b1b71b6f735c7bf1f6ede`. El guardado nativo produjo un DSV válido con contador 9 y SHA-256 `e8226f157c117c5f8a531eebca98cef7fdbe2104afcfcd99018264a8995ef204`. Los registros RAM coinciden byte a byte con un registro DSV pre-guardado o post-guardado, en una frontera exacta de cifrado; los frames con checksum inválido se informan como tales, sin ignorarlos. La fuente y la RAM muestran `VAR_FRIENDSHIP_STEPS` en 122 antes de Fly y después de Fly, y en 1 tras siete pasos en tierra hasta el acceso al agua: se cruzó una vez el umbral de 128 pasos. La fuente aplica ahí el evento de amistad por caminar, con una omisión aleatoria del 50 %; los dos aumentos de +1 concuerdan con el evento nativo observado. Esta aceptación cubre solo esta secuencia FIX6a.

La imagen reservada de 4 KiB se verificó contra la ROM exacta y el helper compilado en `qa/runs/hm-fly-surf-fix6a-reserve-audit.json` (SHA-256 `8c86f43bf1e04e074d12aa67d09c9cd903c1bed109f3b109ce536692599fb976`). Su auditor clasifica todos los cambios de runtime dentro de doce símbolos mutables `.owned_hm.state`; bytes inmutables, código, guardas y padding coinciden con la ROM en los seis checkpoints.

Las dos capturas anteriores se publican. La demás evidencia sigue local en `qa/runs/hm-fly-surf-fix6a-*`: scripts de entrada, hashes de estados, volcados RAM y copias DSV. La captura del campo tras recargar es `hm-fly-surf-fix6a-cold-reload-continue/field_before_action.png`.
