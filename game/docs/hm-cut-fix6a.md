# Native Cut QA / Pruebas nativas de Corte

## English

**Result: native Cut action confirmed.** On the exact FIX6a ROM, the game presented its native Cut prompt, accepted the selected party member, displayed “CLEFAIRY used Cut!”, and deactivated the target runtime object after the dialogue. The party, Bag, and reserved RAM region matched the saved fixture before and after the action.

Machine-readable evidence: [qa-hm-cut-fix6a.json](qa-hm-cut-fix6a.json).

![CLEFAIRY uses Cut on Route 8](../assets/locations/hm-fix6a-cut.png)

The tested ROM was `qa-kit-shop-owned-hm-paged-fix6a.nds` (SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`). The native map-entry action used runner `headless_runner_fix5.py` (SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`) with no active codes. The route used a copy of the approved native Strength save, entered Route 8 through its exact native warp, and made a native save before creating the adjacent actor-position copy. The final action chain used DSV SHA-256 `a0a76ca3a429d2ceb056644129a5c247f6296af163383105c3f2716bdd9844ba`.

The target was exact map 16 event object 8: model 86, flag 16, script 10000, global coordinates `(1375,246)`. At the cold baseline, the avatar was visible at `(1374,4,246)` facing east, and the live object was active at `(1375,4,246)`. The interaction showed “This tree looks like it can be cut down! Would you like to cut it?” with YES selected. After confirming, the screenshot showed “CLEFAIRY used Cut!”; one native dialogue advance then left the object slot zeroed and the tree absent from the field image.

The party comparison used all bytes of SaveArray2 against the highest-counter CRC-valid slot in the copied DSV, accepting only exact encryption-boundary phases per record. The party normalized byte-for-byte to that source; member 0 is species 35, and no party move is a Gen IV HM. Bag SHA-256 remained `22038e1466d16e5067cdbf7ef1bfbae0cb9ef3965ede76535c09da2c2dba4f32`; the `0x023D7000` 4096-byte reserve remained `e7a0ead44df4b1d48081d1208adba7ed267b86f172a39b1674e96ef71f732960`.

The adjacent position used the native tree's saved height `Y=4` as a local anchor. Both adjacent tiles share map model 154 and PER bytes `0004`; BDHC geometry was not independently interpreted. No post-action battery save or cold reload was performed, so this confirms the native field action and object deactivation, not persistence after reload or broader story progression.

Local evidence includes `qa/hm_cut_fix6a_acceptance.py`, the fixture helper `qa/hm_cut_fix6a_adjacent_prepare.py`, and the run folders `qa/runs/hm-cut-fix6a-*`. The capture above is published; RAM dumps, state files and DSV copies remain local QA artifacts.

## Español

**Resultado: acción nativa de Corte confirmada.** En la ROM FIX6a exacta, el juego mostró el prompt nativo de Corte, aceptó el miembro del equipo seleccionado, mostró «CLEFAIRY used Cut!» y desactivó el objeto runtime objetivo al terminar el diálogo. El equipo, la Bolsa y la región RAM reservada coinciden con la partida de referencia antes y después de la acción.

Evidencia legible por máquina: [qa-hm-cut-fix6a.json](qa-hm-cut-fix6a.json).

![CLEFAIRY usa Cut (Corte) en Route 8 (Ruta 8)](../assets/locations/hm-fix6a-cut.png)

La ROM probada fue `qa-kit-shop-owned-hm-paged-fix6a.nds` (SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`). La entrada nativa al mapa usó `headless_runner_fix5.py` (SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`), sin códigos activos. La ruta usó una copia de la partida nativa aprobada de Fuerza, entró en Ruta 8 mediante su warp nativo exacto y guardó de forma nativa antes de crear la copia con el actor adyacente. La secuencia final usó el DSV con SHA-256 `a0a76ca3a429d2ceb056644129a5c247f6296af163383105c3f2716bdd9844ba`.

El objetivo fue el objeto 8 del mapa 16: modelo 86, flag 16, script 10000, coordenadas globales `(1375,246)`. En la línea base fría, el avatar era visible en `(1374,4,246)` mirando al este y el objeto seguía activo en `(1375,4,246)`. La interacción mostró «This tree looks like it can be cut down! Would you like to cut it?» con YES seleccionado. Tras confirmar, la captura mostró «CLEFAIRY used Cut!»; un avance nativo del diálogo dejó el slot del objeto a cero y el árbol ya no aparecía en la imagen del campo.

La comparación del equipo usó todos los bytes de SaveArray2 contra el slot CRC válido con el contador más alto del DSV copiado, aceptando únicamente fases exactas de cifrado por registro. El equipo normalizado coincide byte a byte con la fuente; el miembro 0 es de especie 35 y ningún movimiento del equipo es una MO de Gen IV. El SHA-256 de la Bolsa permaneció en `22038e1466d16e5067cdbf7ef1bfbae0cb9ef3965ede76535c09da2c2dba4f32`; la reserva de 4096 bytes en `0x023D7000` permaneció en `e7a0ead44df4b1d48081d1208adba7ed267b86f172a39b1674e96ef71f732960`.

La posición adyacente usó como referencia local la altura guardada del árbol nativo, `Y=4`. Las dos baldosas comparten el modelo de mapa 154 y los bytes PER `0004`; la geometría BDHC no se interpretó por separado. No se hizo guardado en batería ni recarga en frío después de la acción: se confirma la acción de campo nativa y la desactivación del objeto, no su persistencia tras recargar ni el avance general de la historia.

La evidencia local incluye `qa/hm_cut_fix6a_acceptance.py`, el preparador `qa/hm_cut_fix6a_adjacent_prepare.py` y las carpetas `qa/runs/hm-cut-fix6a-*`. La captura anterior se publica; los volcados RAM, estados y copias DSV siguen siendo artefactos QA locales.
