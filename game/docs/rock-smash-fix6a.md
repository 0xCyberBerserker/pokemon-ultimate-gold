# Native Rock Smash QA / Pruebas nativas de Golpe Roca

## English

**Status: `NATIVE_ACTION_CONFIRMED`.** On the exact FIX6a ROM, the native prompt offered Rock Smash, the reviewed result capture reads “CLEFAIRY used Rock Smash!”, and event object 8 became inactive after the result message was dismissed. The move user was CLEFAIRY (species ID 35). Strict comparison against the native-save reference verified every party header/record byte; the staged Continue dump stopped at a valid native encryption boundary in SaveArray2 (dynamic offset `0xD080`).

The target was map 7 `D18R0101`, event bank 5, object 8/model 85/script 10001/event flag 16 at `(5,22)`. Before action, the cold-loaded actor was state 0 at `(5,21)`, facing south and adjacent; object 8 was active at `(5,22)`. After the final native A, its manager slot was all zero. Flag 16 remained clear; the result does not depend on that flag being set.

All action runs used FIX6a ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, runner `fix5` SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`, and `cheats: []`. The initial native map entry and save used `fix6a` runner SHA-256 `0f2ca19bbfb6505baa4c35ee497b2c0cba15881bd7379def6a382ad44413cc26`; runner source comparison shows only its one-frame cheat whitelist adds the FIX6a ROM hash, so no-code execution is identical. The report includes every run, result, input-script, state, RAM, and DSV hash.

Bag bytes and reserved RAM `0x023D7000..0x023D7FFF` matched before and after. The staged Continue party bytes matched the native-save records at one exact encryption boundary per record segment; normalized SaveArray2 matched byte-for-byte. Action and post-action party arrays also matched the native-save reference exactly. This lot did not test battery-save/cold persistence. An earlier mismatched-map fixture, an empty-save-directory cold attempt, and a repeated-A run with ambiguous action timing are retained but explicitly excluded from the acceptance evidence.

Machine-readable evidence: [qa-rock-smash-fix6a.json](qa-rock-smash-fix6a.json). State files, RAM dumps and copied DSVs stay local, outside the website. Their local paths and hashes are recorded in the JSON. The capture below preserves the native pixels and shows the upper DS screen.

![CLEFAIRY using Rock Smash in Burned Tower](../assets/locations/hm-fix6a-rock-smash.png)

## Español

**Estado: `NATIVE_ACTION_CONFIRMED`.** En la ROM FIX6a exacta, el diálogo nativo ofreció Rock Smash, la captura revisada del resultado dice «CLEFAIRY used Rock Smash!» y el objeto de evento 8 quedó inactivo al cerrar el mensaje. El usuario del movimiento era CLEFAIRY (especie ID 35). La comparación estricta con la referencia de guardado nativo verificó cada byte de las cabeceras y registros del equipo; la captura staged de Continue se detuvo en una frontera válida del ciclo nativo de cifrado de SaveArray2 (offset dinámico `0xD080`).

El objetivo era el mapa 7 `D18R0101`, banco de eventos 5, objeto 8/modelo 85/script 10001/bandera de evento 16 en `(5,22)`. Antes de actuar, el actor cargado en frío estaba en estado 0 en `(5,21)`, orientado al sur y adyacente; el objeto 8 estaba activo en `(5,22)`. Tras el último A nativo, su ranura del gestor quedó completamente a cero. La bandera 16 siguió desactivada; el resultado no exige que esa bandera se active.

Todas las ejecuciones de acción usaron ROM FIX6a SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, runner `fix5` SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8` y `cheats: []`. La entrada nativa inicial y el guardado usaron runner `fix6a` SHA-256 `0f2ca19bbfb6505baa4c35ee497b2c0cba15881bd7379def6a382ad44413cc26`; la comparación del código fuente muestra que sólo añade el hash de FIX6a a la lista permitida para códigos de un fotograma, por lo que la ejecución sin códigos es idéntica. El informe incluye hashes de cada ejecución, resultado, script de entrada, estado, RAM y DSV.

Los bytes de la Bolsa y la reserva RAM `0x023D7000..0x023D7FFF` coinciden antes y después. Los bytes del equipo en Continue coinciden con los registros guardados nativos en una frontera exacta de cifrado por segmento; tras normalizar, SaveArray2 coincide byte a byte. Las matrices del equipo durante y después de la acción también coinciden exactamente con la referencia nativa. Este lote no probó persistencia mediante guardado en batería y carga en frío. Se conservan, pero se excluyen explícitamente de la evidencia de aceptación, un fixture con mapa incoherente, un intento de carga en frío con directorio de guardado vacío y una ejecución con A repetido cuyo momento de acción era ambiguo.

Evidencia legible por máquina: [qa-rock-smash-fix6a.json](qa-rock-smash-fix6a.json). Los estados, volcados RAM y copias DSV quedan locales, fuera de la web. Sus rutas locales y hashes constan en el JSON. La captura conserva los píxeles nativos y muestra la pantalla superior de DS.

![CLEFAIRY usando Rock Smash (Golpe Roca) en Burned Tower (Torre Quemada)](../assets/locations/hm-fix6a-rock-smash.png)
