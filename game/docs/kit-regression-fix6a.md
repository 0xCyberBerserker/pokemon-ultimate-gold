# FIX6a kit item regression QA / QA de regresión de objetos del kit FIX6a

## English

**Result: both native item-use regressions passed on the exact FIX6a ROM.** The actions used isolated copies of the FIX6a battery save and the existing FIX6a Bag-open state; no codes were active.

- Rare Candy (item 50): Clefairy advanced from level 5 to 6; quantity remained 20.
- Oran Berry (item 155): Machop HP increased from 8 to 18/22; quantity remained 1.

For both branches, all 594 canonical Bag slots and the full 4 KiB feature reserve remained byte-identical to the input state. Non-target Pokémon records also remained byte-identical. Screenshots show the selected items, party target, and native effect messages.

The runs used ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, the pinned DeSmuME core, and `headless_runner_fix6a.py`. Both runner results record `cheats: []` and `gameplay_acceptance: NOT_ASSESSED`; this is bounded emulated native-use evidence. No Repel, save, or cold-load case was repeated.

The earlier FIX5 contract is recorded in [qa-combined-kit-shop.json](qa-combined-kit-shop.json). The current FIX6a evidence is in [qa-kit-regression-fix6a.json](qa-kit-regression-fix6a.json), with run artifacts under `night-sprint/qa/runs/fix6a-kit-regression-*`.

## Español

**Resultado: las dos regresiones de uso nativo pasaron en la ROM FIX6a exacta.** Las acciones usaron copias aisladas de la batería FIX6a y el estado existente de la Bolsa abierta en FIX6a; no hubo códigos activos.

- Rare Candy (objeto 50): Clefairy subió del nivel 5 al 6; la cantidad siguió en 20.
- Oran Berry (objeto 155): los PS de Machop subieron de 8 a 18/22; la cantidad siguió en 1.

En ambas ramas, los 594 espacios canónicos de la Bolsa y toda la reserva de funciones de 4 KiB quedaron idénticos byte a byte al estado de entrada. Los registros de los Pokémon no objetivo también permanecieron idénticos. Las capturas muestran los objetos seleccionados, el Pokémon objetivo y los mensajes nativos del efecto.

Las pruebas usaron la ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, el core DeSmuME fijado y `headless_runner_fix6a.py`. Ambos resultados del runner registran `cheats: []` y `gameplay_acceptance: NOT_ASSESSED`; es evidencia acotada de uso nativo emulado. No se repitieron pruebas de repelentes, guardado ni carga en frío.

El contrato anterior de FIX5 consta en [qa-combined-kit-shop.json](qa-combined-kit-shop.json). La evidencia actual FIX6a está en [qa-kit-regression-fix6a.json](qa-kit-regression-fix6a.json), con los artefactos de ejecución en `night-sprint/qa/runs/fix6a-kit-regression-*`.

Made with 🖤 in Barcelona City 🇪🇸
