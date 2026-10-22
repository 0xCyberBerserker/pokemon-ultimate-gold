# Alpha2 shop purchase QA

## English

FIX6a (`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`) passed a bounded native shop check: one Moon Stone (item 81, 2,100) and one Covenant Orb (item 467, 3,500) were bought through the in-game prompts. Counts changed 4→5 and 1→2; money changed 992,299→990,199→986,699. Other pockets, the remaining inventory, party records, shop stock, and five reserved-memory canaries stayed unchanged. A native save followed by a cold boot with no emulator state retained the inventory and money; the cold RAM party records exactly match the selected CRC-valid save array.

The setup used a copied FIX5 native battery save as a fixture only. Its source and copied DSV hashes, FIX6a ROM/runner/core hashes, every run result, input script, state, and screenshot are recorded in [`qa-alpha2-shop.json`](qa-alpha2-shop.json). The FIX5 save does not carry FIX5 gameplay acceptance. This check covers these two unit purchases and one save/cold reload; it does not establish full shop coverage or story progression. Runner records retain `gameplay_acceptance: NOT_ASSESSED`.

![Evolution-item clerk at Goldenrod Department Store, 2F](../assets/locations/alpha2-evolution-shop.png)

**Location:** Goldenrod Department Store, 2F, the clerk using stock list 4 (map 192). The wiki shows only the upper DS screen for this location image; the original evidence retains both screens and the Moon Stone purchase confirmation. Detailed run artifacts remain outside the website. Root re-ran the offline auditor against all 22 runs and obtained the same report, then inspected the native purchase screenshots.

## Español

FIX6a (`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`) superó una comprobación nativa acotada de la tienda: se compraron Moon Stone (Piedra Lunar, objeto 81, 2.100) y Covenant Orb (Orbe Pacto, objeto 467, 3.500) mediante los diálogos del juego. Las cantidades cambiaron de 4→5 y de 1→2; el dinero pasó de 992.299→990.199→986.699. Los demás bolsillos, el resto del inventario, los registros del equipo, el stock de la tienda y cinco canarios de memoria reservada permanecieron iguales. Un guardado nativo seguido de un arranque en frío sin estado del emulador conservó inventario y dinero; los registros del equipo en RAM coinciden exactamente con el array seleccionado de la partida con CRC válido.

La preparación usó una copia de una partida nativa FIX5 únicamente como fixture. El informe [`qa-alpha2-shop.json`](qa-alpha2-shop.json) registra los hashes de origen y copia DSV, ROM/runner/core FIX6a, cada ejecución, script de entrada, estado y captura. La partida FIX5 no hereda aceptación de juego FIX5. Esta prueba cubre estas dos compras unitarias y un guardado/arranque en frío; no acredita todas las tiendas ni el progreso de la historia. Los resultados del runner conservan `gameplay_acceptance: NOT_ASSESSED`.

![Dependiente de objetos evolutivos en Goldenrod Department Store (Centro Comercial de Ciudad Trigal), 2F](../assets/locations/alpha2-evolution-shop.png)

**Ubicación:** Goldenrod Department Store (Centro Comercial de Ciudad Trigal), 2F, dependiente con lista de inventario 4 (mapa 192). La wiki muestra solo la pantalla superior para esta localización; la evidencia original conserva ambas pantallas y la confirmación de compra de Moon Stone. Los archivos detallados siguen fuera de la web. Root volvió a ejecutar el auditor offline contra las 22 ejecuciones y obtuvo el mismo informe; también revisó las capturas de compra nativa.
