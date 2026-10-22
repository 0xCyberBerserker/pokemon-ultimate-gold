# Native Whirlpool QA / Pruebas nativas de Torbellino

## English

![CLEFAIRY uses Whirlpool on Route 41](../assets/locations/hm-fix6a-whirlpool.png)

![The avatar after crossing to the east side](../assets/locations/hm-fix6a-whirlpool-crossed.png)

**Result:** one native Whirlpool use and crossing of its exact 3×3 tile footprint passed on the pinned FIX6a ROM. The prompt was visible, the game displayed “CLEFAIRY used Whirlpool.”, and runtime position advanced from `(213, 333)` to `(217, 333)`, crossing target columns `214–216`. Party, Bag, and the reserved RAM range remained unchanged. No HM was taught and no cheat code was active.

The case used a native Surf state and a copy of that run’s valid battery save. Static PER and BDHC evidence establishes map 95 (`W41`), model 64, the west approach tile `(213,333)` with behavior `0x15`, the Whirlpool footprint `(214–216,331–333)` with behavior `0x11`, and a unique shared height plane at `0.5`. Candidate `currentY=1` and `vecY_fx32=32768` are derived from native anchors; they are not claimed as independently observed terrain values. The party guard includes all eight HMs, including Rock Climb `431`; its verifier regression detects `431` and accepts a non-HM moveset.

The first action run inherited `weather=11` from map 176 while map 95’s header requires `weather=0`; the resulting Dark Cave mask obscured the scene. A title savestate also carried the old loaded battery state, so a new SaveDir did not make a true cold boundary. Those runs are preserved and excluded. The corrected position copy synchronized `LocalFieldData.weather=0` and `camera=0` to map 95’s header. A fresh cold Continue then showed the whirlpool and avatar clearly before interaction.

The runner labels its execution `COMPLETED` and gameplay `NOT_ASSESSED`; acceptance here comes from the captured prompt, party-member text, visible scene, and runtime coordinate crossing. No post-action save, cold reload, wider progression, or alternate site was tested. The reserved range `0x023D7000–0x023D7FFF` remained unchanged.

Machine evidence: [qa-hm-whirlpool-fix6a.json](qa-hm-whirlpool-fix6a.json) (SHA-256 `8426e8afeceb028cfdf5096b36dd3b7e552b3846e49d5e5fffd2173368eea57b`). The two captures above are published; other captures and state files remain local under `qa/runs/hm-whirlpool-fix6a-*`. The report records their paths and hashes. Emulator runner: `qa/headless_runner_fix5.py` SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`; ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`.

## Español

![CLEFAIRY usa Whirlpool (Torbellino) en Route 41 (Ruta 41)](../assets/locations/hm-fix6a-whirlpool.png)

![El personaje después de cruzar al lado este](../assets/locations/hm-fix6a-whirlpool-crossed.png)

**Resultado:** una activación nativa de Whirlpool y el cruce de toda su huella exacta de 3×3 tiles pasan en la ROM FIX6a fijada. El prompt quedó visible, el juego mostró “CLEFAIRY used Whirlpool.” y la posición en RAM avanzó de `(213, 333)` a `(217, 333)`, cruzando las columnas objetivo `214–216`. La party, la Bolsa y la reserva RAM permanecieron intactas. No se enseñó ninguna MO ni hubo códigos activos.

El caso parte de un estado Surf nativo y una copia de la batería válida del mismo run. La evidencia estática PER y BDHC fija el mapa 95 (`W41`), modelo 64, la aproximación oeste `(213,333)` con comportamiento `0x15`, la huella Whirlpool `(214–216,331–333)` con comportamiento `0x11` y un plano de altura único compartido de `0,5`. `currentY=1` y `vecY_fx32=32768` se derivan de anclas nativas; no se presentan como observaciones independientes de la altura en runtime. El guard de la party incluye las ocho MO, incluida Treparrocas `431`; la regresión del verificador detecta `431` y acepta un conjunto sin MO.

El primer intento heredó `weather=11` del mapa 176, mientras que la cabecera del mapa 95 exige `weather=0`; la máscara de Dark Cave ocultó la escena. Además, un savestate de título conservaba el estado de batería anterior, así que cambiar el SaveDir no creó un límite frío real. Esos runs se conservan como evidencia excluida. La copia corregida sincronizó `LocalFieldData.weather=0` y `camera=0` con la cabecera del mapa 95. Un Continue frío nuevo mostró claramente el remolino y al avatar antes de interactuar.

El runner etiqueta la ejecución como `COMPLETED` y el gameplay como `NOT_ASSESSED`; la aceptación se basa aquí en el prompt capturado, el texto del miembro de party, la escena visible y el cruce de coordenadas en runtime. No se hizo un guardado posterior, un nuevo arranque frío, una prueba más amplia de progresión ni otra ubicación. La reserva `0x023D7000–0x023D7FFF` no cambió.

Evidencia máquina: [qa-hm-whirlpool-fix6a.json](qa-hm-whirlpool-fix6a.json) (SHA-256 `8426e8afeceb028cfdf5096b36dd3b7e552b3846e49d5e5fffd2173368eea57b`). Las dos capturas anteriores se publican; las demás capturas y estados permanecen locales en `qa/runs/hm-whirlpool-fix6a-*`. El informe conserva sus rutas y hashes. Runner: `qa/headless_runner_fix5.py`, SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`; ROM, SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`.
