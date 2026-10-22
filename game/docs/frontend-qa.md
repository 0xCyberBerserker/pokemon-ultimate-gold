# Frontend verification / Verificación de interfaz

## English

### Current check — 22 October 2026

The Star Piece/Nugget follow-up adds 14 HGSS references with explicit “unverified here” badges in both languages. A focused Chromium check confirms the row counts and labels; the full wiki browser regression also passes. Nine base-game-reference tests pass. The generated index now inherits cache key `lists6` from its template, so rebuilding preserves the current script version.

Follow-up Chromium check: `tests/wiki-browser.cjs` passes against the current list interface, including keyboard expansion of a machine row, type filters and all 100 type icons. The machine-kind filter now displays TM/HM in English and MT/MO in Spanish; both translations are asserted. The test opens acquisition evidence before checking its text. Desktop 1280 × 900, mobile 390 × 844 and browser-error checks pass. JavaScript syntax and 14 web unit tests pass; one environment-dependent test is skipped. No packages were installed and no user window was activated.

The site entry `/web/` opens the wiki. The home page says “Open the patcher” / “Accede al parcheador”; choosing a release happens inside the patcher. Its three first-step actions retain their native link roles and point to the integrated patcher, player guide and FAQ. This was checked in the in-app browser, with no console warnings/errors or horizontal page overflow in the reviewed views. Desktop and 375-pixel mobile checks were performed; this is not acceptance of every screen size or browser.

Items and machines now use single-column lists with native details/summary disclosures. Each expanded description/acquisition panel uses the full row width; machine rows retain neutral backgrounds and type accents. Counts remain 516 items and 100 machines. Real-browser checks at 1440 × 900 and 375 × 900 cover Enter-to-expand, focus visibility, full-entry navigation, EN/ES labels and no horizontal overflow or nested interactive controls in summaries. Combined HM + Water filtering returns three rows and Surf returns one; Leaf Stone plus General items returns one and plus Medicine returns zero. The [first base-game comparison batch](qa-item-basegame-compare-batch1.json) still covers only three TM events and four wild held-item records; list layout does not establish pickups, encounters or probabilities.

The real clean USA ROM reached “Patch complete” in the integrated Alpha 2 patcher. The in-app browser download event timed out, so a newly downloaded Alpha 2 file has **not** been accepted by this browser check. The separate real-ROM VCDIFF/output-hash and altered-source rejection test passed. The combined wiki, acquisition and web-build suite passed 41 tests; the 14 web-build tests passed again after the final navigation markup change, and JavaScript syntax checking passed.

Screenshots remain outside Git under `@TMP@/ug-*.jpg` and `@TMP@/ug-home-navigation-verified.png`. The repository has no Argot scorer configuration, so no statistical voice check was run. Native game acceptance is documented separately in the gameplay QA guides.

### Historical evidence

An earlier Alpha 1 Playwright/Chromium check accepted a downloaded output matching its manifest, desktop 1280 × 900 and mobile 390 × 844, selected-language guides, sprites, portraits and filters. That result belongs to Alpha 1 and does not establish Alpha 2 download acceptance. Full gameplay, Firefox/WebKit, physical controls and audio remain outside this frontend check.

## Español

### Comprobación actual — 22 de octubre de 2026

La actualización de Star Piece/Nugget añade 14 referencias de HGSS con etiquetas explícitas «por comprobar» en ambos idiomas. Una prueba específica en Chromium confirma los recuentos y textos; también pasa la regresión completa de la wiki en navegador. Pasan nueve pruebas de referencias del juego original. El índice generado hereda ahora la clave de caché `lists6` de su plantilla, por lo que reconstruir conserva la versión actual del script.

Comprobación posterior en Chromium: `tests/wiki-browser.cjs` pasa con la interfaz actual de listas, incluida la apertura de una MT con teclado, los filtros por tipo y los 100 iconos de tipo. El filtro de clase muestra TM/HM en inglés y MT/MO en español; se verifican ambas traducciones. La prueba abre la evidencia de adquisición antes de comprobar su texto. Pasan las vistas de escritorio 1280 × 900 y móvil 390 × 844 y la ausencia de errores del navegador. Pasan la sintaxis JavaScript y las 14 pruebas unitarias web; se omite una prueba dependiente del entorno. No se instalaron paquetes ni se activó ninguna ventana del usuario.

La entrada `/web/` abre la wiki. El inicio dice «Accede al parcheador» / «Open the patcher»; la versión se elige dentro del parcheador. Los tres accesos de primeros pasos conservan su función nativa de enlace y llevan al parcheador integrado, la guía del jugador y las preguntas frecuentes. Se comprobó en el navegador integrado, sin avisos ni errores de consola ni desbordamiento horizontal en las vistas revisadas. Se hicieron comprobaciones de escritorio y móvil de 375 píxeles; no supone aceptar todos los tamaños ni navegadores.

Objetos y máquinas usan ahora listas de una columna con desplegables nativos details/summary. La descripción y las adquisiciones abiertas ocupan todo el ancho de la fila; las MT mantienen fondo neutro y acentos del tipo. Se conservan 516 objetos y 100 máquinas. La comprobación real en navegador a 1440 × 900 y 375 × 900 cubre apertura con Enter, foco visible, navegación a la ficha, textos EN/ES y ausencia de desbordamiento horizontal o controles interactivos anidados en summary. MO + Agua devuelve tres filas y Surf una; Leaf Stone más Objetos generales devuelve una y más Medicinas cero. El [primer lote de comparación con el juego original](qa-item-basegame-compare-batch1.json) sigue cubriendo solo tres eventos de MT y cuatro registros de objetos equipados salvajes; el diseño de lista no demuestra recogidas, encuentros ni probabilidades.

La ROM limpia USA real llegó a «Parche completado» en el parcheador integrado de alfa 2. El evento de descarga del navegador integrado agotó su espera: esta comprobación **no** acepta un archivo alfa 2 recién descargado. Sí pasó la prueba independiente de VCDIFF real, hash de salida y rechazo de la fuente alterada. Pasaron las 41 pruebas combinadas de wiki, adquisiciones y construcción web; las 14 de construcción web pasaron de nuevo tras el último cambio del marcado de navegación, y también pasó la comprobación de sintaxis JavaScript.

Las capturas quedan fuera de Git, en `@TMP@/ug-*.jpg` y `@TMP@/ug-home-navigation-verified.png`. El repositorio no tiene configuración del modelo de Argot, por lo que no se ejecutó su comprobación estadística de estilo. La aceptación nativa del juego se documenta por separado en las guías de QA.

### Evidencia histórica

Una comprobación anterior de alfa 1 con Playwright/Chromium aceptó una descarga con el hash de su manifiesto, escritorio 1280 × 900 y móvil 390 × 844, guías en el idioma elegido, sprites, retratos y filtros. Ese resultado corresponde a alfa 1 y no demuestra la descarga de alfa 2. Historia completa, Firefox/WebKit, controles físicos y audio quedan fuera de esta comprobación de interfaz.
