# Native Waterfall QA / Pruebas nativas de Cascada

## English

![CLEFAIRY uses Waterfall in Tohjo Falls](../assets/locations/hm-fix6a-waterfall.png)

![The avatar above the waterfall after ascending](../assets/locations/hm-fix6a-waterfall-climbed.png)

**Result:** one native Waterfall use and ascent passed on the exact FIX6a ROM. The game showed “It's a large waterfall. Would you like to use Waterfall?” and “CLEFAIRY used Waterfall.” After dismissing the message, the avatar climbed from map 126 `(25,14)` to `(25,12)`, crossing target tile `(25,13)` with no directional input after confirmation. Party, Bag, and reserved RAM remained unchanged; no cheat code was active.

The position copy came from the same-run native Surf save. Static PER/BDHC preflight fixes map 126 (`D45R0101`), matrix 151/model 619, the sea approach `(25,14)` facing north, the Waterfall tile `(25,13)`, and a shared 0.5-tile height. `currentY=1` and `vecY_fx32=32768` were geometry-derived and matched the pre-action runtime actor. The copy synchronized weather/camera to the exact map header (0/0), preserved player `mapId=1`, both CRC-valid slots, and the fallback slot. The runtime confirmed Surf state 2, owned HM07 item 426, and Rising Badge bit 7. No HM move was present in the three-member party.

Runner output says `COMPLETED` while gameplay is `NOT_ASSESSED`; acceptance is based on the visible prompt/text and RAM position/height transition. A first invocation used a ROM path resolved from the wrong directory and failed before emulation; it is recorded as excluded setup evidence. The corrected chain used the exact ROM, runner and core hashes in the report, a copied DSV, and `cheats=[]`. No post-action save or cold reload was performed.

Machine evidence: [qa-hm-waterfall-fix6a.json](qa-hm-waterfall-fix6a.json) (SHA-256 `ef6933e83cbc0b44ba8633d73c1219157b30d983efe67769344e5a07471fc75e`). The two captures above are published; other captures and state files remain local with paths and hashes in the JSON. ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`; runner SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`.

## Español

![CLEFAIRY usa Waterfall (Cascada) en Tohjo Falls (Cataratas Tohjo)](../assets/locations/hm-fix6a-waterfall.png)

![El personaje en la parte superior después de subir](../assets/locations/hm-fix6a-waterfall-climbed.png)

**Resultado:** una activación nativa de Cascada y la subida pasan en la ROM FIX6a exacta. El juego mostró “It's a large waterfall. Would you like to use Waterfall?” y “CLEFAIRY used Waterfall.” Al cerrar el mensaje, el avatar subió desde el mapa 126 `(25,14)` hasta `(25,12)`, cruzando el tile objetivo `(25,13)` sin input direccional después de confirmar. Party, Bolsa y reserva RAM no cambiaron; no hubo códigos activos.

La copia de posición parte del guardado nativo Surf del mismo run. El preflight estático PER/BDHC fija el mapa 126 (`D45R0101`), matriz 151/modelo 619, la aproximación de agua `(25,14)` mirando al norte, el tile Cascada `(25,13)` y una altura compartida de 0,5 tiles. `currentY=1` y `vecY_fx32=32768` se derivaron de geometría y coincidieron con el actor runtime antes de actuar. La copia sincronizó weather/cámara con la cabecera exacta del mapa (0/0), conservó `mapId=1` del jugador, ambos CRC válidos y el slot de respaldo. Runtime confirmó estado Surf 2, HM07 item 426 y medalla Rising bit 7. Los tres Pokémon de la party no tenían movimientos MO.

El runner informa `COMPLETED` y gameplay `NOT_ASSESSED`; la aceptación se basa en el prompt/texto visible y el cambio de posición/altura en RAM. La primera invocación resolvió la ruta ROM desde el directorio equivocado y falló antes de emular; queda registrada como preparación excluida. La cadena corregida usó los hashes exactos de ROM, runner y core del informe, una copia DSV y `cheats=[]`. No se guardó después ni se hizo una recarga fría.

Evidencia máquina: [qa-hm-waterfall-fix6a.json](qa-hm-waterfall-fix6a.json) (SHA-256 `ef6933e83cbc0b44ba8633d73c1219157b30d983efe67769344e5a07471fc75e`). Las dos capturas anteriores se publican; las demás capturas y estados siguen locales, con rutas y hashes en el JSON. ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`; runner SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`.
