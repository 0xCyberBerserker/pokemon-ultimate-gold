# Migration parity ledger

## English

Baseline: public revision `236947a596f6a264b8ed95acc615557be393fc51`. This ledger records implementation status, not acceptance.

| Area | Current preview | Remaining before integration |
| --- | --- | --- |
| Home and navigation | React entry screen, grouped navigation, expandable grouped search, hash-route parsing and EN/ES controls; the wiki data target is checked against the default patch manifest and labeled separately from game mode | Full route parity and visual/accessibility verification |
| Trainers | Team selection, documented journey ordering, battle-kind and journey filters, search, mode-dependent levels/moves and visible IV/EV | Match all legacy grouping, context, data and behavior; browser QA |
| Pokédex | Species list, filters, detail, stats, abilities, learnset, evolution families and comparison | Complete legacy detail/evidence, contextual navigation and browser QA; individual TM/HM compatibility is absent from the current dataset |
| Moves, items, machines and guides | React views, expandable FAQ and local search; source guide links and image files checked statically in both languages | Verify all legacy fields, provenance, acquisition evidence, formatting and rendered cross-links |
| Cheats and Kris progress | React gallery ordered by scene/run/frame; React catalog preserves source code, status, target gate and disabled exports | Verify full interactions, provenance, accessibility and both languages in a browser |
| Patcher | Isolated iframe and original message contract; local resources respond over HTTP | Exercise real behavior and security checks; verify release output and CSP |
| Build and delivery | Vite output in `dist/`; opt-in generator and actual generated artifact checked locally; manually triggered Pages workflow updated locally | Verify parity and browser behavior; verify the workflow on GitHub before any authorized deployment |
| Accessibility and responsive | Semantic controls, focus styles and reduced-motion CSS | Keyboard, screen-reader, contrast and mobile/desktop browser checks |

The frontend is not a release candidate. No publication, commit, push or PR has been performed.

Two links in the source guides do not resolve in this public snapshot: `qa-alpha2-frontier-outcome-qa.html` and `../data/acceptance.json`. Dev and Scrum confirmed the first refers to the existing public `alpha2-frontier-outcome-qa` guide; the React view links there. The second points to a report absent from the public export, so the view retains its label and says that detailed evidence is not published. Source data remains unchanged. The integrity test records the two source gaps while checking other local guide links.

Integration constraint: build Vite first, then the opt-in generator regenerates data and installs only the wiki entry point and hashed assets. It preflights the existing index, asset collisions and entry-point CSP; redirects, patcher, shared `web/assets`, data and licenses remain owned by the existing generator. The locally updated Pages workflow retains manual dispatch and visibility/default-branch deployment checks; it has not run on GitHub.

The optional integration was exercised in a disposable copy: an offline locked install, frontend build, site regeneration, frontend tests against regenerated data and HTTP checks against the generated artifact all passed. The patcher, generated wiki data, patch catalog and a legacy redirect retained identical hashes. Independent static review found and prompted fixes for update handling, CSP validation and checking the actual Pages artifact; focused re-review passed. Browser execution and actual Pages deployment remain unverified.

On the isolated baseline copy, `python3 tools/build_site.py` completed successfully. The resulting `wiki-data.json` SHA-256 is `b28d9c3fa2214e57ffc3183ae39fd9284a99d891c032b08b3115fd054cc8bd13`, and the patch catalog SHA-256 is `c21f35b6f9c25978307e6721a0d00560dc689bc6afce9cd82b7b7ac9f3a90152`; both match the files consumed by this preview. This verifies this snapshot only, not a live deployment.

An exhaustive dataset check resolves species, abilities, learnsets, evolutions, trainer items/moves and machines against this snapshot, and checks both mode adapters for every trainer member. It checks data relationships, not rendered or playable behavior.

An independent static review of this uncommitted preview identified an incorrect acceptance of a non-default manifest. The frontend now checks only `catalog.default`; a second independent check passed the focused mismatch and external-path tests (2/2). This review does not establish browser behavior, visual quality or complete parity.

An authorized local Chromium headless smoke test passed at desktop and mobile sizes: search, language, theme, trainer details and focus, Pokédex evolution, cheats, Kris gallery and patcher iframe loading. It exposed an incorrect iframe query parameter, now corrected to the original patcher contract. The patcher language synchronized; no ROM was selected or patched. Two screenshots were visually inspected; full accessibility, route parity and patch execution remain unverified.

The browser smoke test also opened moves, items, machines, abilities, evolutions, guides, FAQ, mechanics and the player guide at both sizes, checking for visible headings and horizontal page overflow. These checks do not validate every entry or interaction.

The same test exercises a species filter, persists the selected trainer and mode across reload, follows a species link, and compares the four displayed levels of trainer 1 with the dataset in Normal and Plus at both viewport sizes.

The browser smoke also checks Ctrl+K, Enter navigation, Escape focus restoration and HTTP error responses for local resources requested during its covered routes. It does not load every image or test all assistive technologies.

A basic DOM check found labels or text for visible controls and links, and `alt` attributes for visible images on the covered routes at both viewport sizes. This heuristic is not a complete accessible-name, contrast, screen-reader or WCAG audit.

For cheat `00-006`, the browser test searches by ID, compares the complete displayed block with the catalog and checks that the downloaded RetroArch profile contains the same code and is disabled. This does not test the code in an emulator.

Chromium opened all 87 guide routes in English and Spanish and found the source text present in each rendered page, accounting for the documented unavailable-evidence annotation. This does not verify the truth of each claim or review every layout.

All 2,329 images in the Kris gallery manifest exist and match their recorded SHA-256; this integrity check is included in the frontend test suite. Hash matching does not identify which image shows a particular early mockup.

The frontend suite also checks that all 999 distinct referenced Pokémon, trainer and item sprites exist locally and have a PNG signature. This does not establish their visual correctness or image provenance.

Local Chromium also patched a hash-matched user-provided HeartGold source through the React iframe for both versions. Downloaded outputs matched the manifests: Alpha 1 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`; Alpha 2 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`. Temporary outputs were deleted and the source hash remained unchanged. This verifies the local patching flow, not gameplay or deployment.

The browser smoke test also rejects a short synthetic file and a correctly sized synthetic file with a wrong hash; neither produces a download or requests a delta.

After the latest frontend changes, the generator was run in a disposable copy and the browser smoke and both patcher roundtrips passed against its actual `web/` output. The protected checkout was not regenerated.

The migration uses the accepted public snapshot. Local historical material was preserved separately and must be reconciled through the project's provenance and publication review before claiming full local-content parity.

## Español

Base: revisión pública `236947a596f6a264b8ed95acc615557be393fc51`. Esta tabla registra implementación, no aceptación.

| Área | Vista previa actual | Pendiente antes de integrar |
| --- | --- | --- |
| Inicio y navegación | Pantalla React, navegación agrupada, buscador agrupado ampliable, rutas hash y controles EN/ES; se comprueba el hash de los datos frente al manifiesto predeterminado y se muestra su versión por separado del modo de juego | Equivalencia completa de rutas y comprobación visual/accesible |
| Entrenadores | Selección de equipo, orden documentado del recorrido, filtros por tipo de encuentro y tramo, búsqueda, niveles/movimientos por modo e IV/EV visibles | Igualar agrupación, contexto, datos y comportamiento anteriores; QA en navegador |
| Pokédex | Lista, filtros, ficha, estadísticas, habilidades, aprendizaje, familias evolutivas y comparación | Completar ficha, evidencias y navegación contextual; QA en navegador. Los datos actuales no incluyen compatibilidad individual MT/MO |
| Movimientos, objetos, máquinas y guías | Vistas React, preguntas frecuentes desplegables y búsqueda local; enlaces y archivos de imagen de las guías de origen comprobados estáticamente en ambos idiomas | Verificar campos, procedencia, evidencias de obtención, formato y enlaces renderizados |
| Trucos y progreso de Kris | Galería React ordenada por escena/ejecución/fotograma; catálogo React conserva código fuente, estado, control de hash y exportaciones desactivadas | Verificar interacción, procedencia completa, accesibilidad y ambos idiomas en navegador |
| Parcheador | Iframe aislado y contrato de mensajes original; recursos locales responden por HTTP | Probar funcionamiento y seguridad reales; verificar salida de release y CSP |
| Build y entrega | Salida Vite en `dist/`; generador optativo y artefacto generado real comprobados localmente; workflow manual de Pages actualizado en local | Verificar equivalencia y navegador; comprobar el workflow en GitHub antes de cualquier despliegue autorizado |
| Accesibilidad y responsive | Controles semánticos, foco visible y CSS para movimiento reducido | Comprobar teclado, lector de pantalla, contraste y navegador móvil/escritorio |

El frontend no es candidato a release. No se ha publicado ni creado commit, push o PR.

Dos enlaces de las guías de origen no resuelven en esta revisión pública: `qa-alpha2-frontier-outcome-qa.html` y `../data/acceptance.json`. Dev y Scrum confirmaron que el primero apunta a la guía pública `alpha2-frontier-outcome-qa`, a la que enlaza la vista React. El segundo señala un informe ausente del export público, por lo que la vista conserva su etiqueta e indica que la evidencia detallada no está publicada. Los datos de origen no se modifican. La prueba de integridad registra las dos incidencias de origen y comprueba los demás enlaces locales de las guías.

Restricción de integración: primero se compila Vite y después el generador optativo regenera los datos e instala únicamente la entrada de la wiki y sus recursos versionados. Antes comprueba el índice existente, colisiones de recursos y la CSP de entrada; las redirecciones, el parcheador, `web/assets` compartido, los datos y las licencias siguen siendo responsabilidad del generador existente. El workflow de Pages actualizado localmente conserva el disparador manual y las comprobaciones de visibilidad y rama predeterminada; no se ha ejecutado en GitHub.

La integración optativa se ejecutó en una copia desechable: pasaron la instalación offline con lockfile, la compilación del frontend, la regeneración del sitio, las pruebas del frontend con los datos regenerados y la comprobación HTTP del artefacto generado. El parcheador, los datos generados, el catálogo de parches y una redirección anterior conservaron sus hashes. Una revisión estática independiente detectó problemas de actualización, validación de CSP y comprobación del artefacto real de Pages; se corrigieron y superaron la revisión focalizada. Siguen sin verificar la ejecución en navegador y el despliegue real en Pages.

En la copia aislada de la revisión base, `python3 tools/build_site.py` terminó correctamente. El SHA-256 resultante de `wiki-data.json` es `b28d9c3fa2214e57ffc3183ae39fd9284a99d891c032b08b3115fd054cc8bd13` y el del catálogo de parches es `c21f35b6f9c25978307e6721a0d00560dc689bc6afce9cd82b7b7ac9f3a90152`; ambos coinciden con los archivos que consume esta vista. Esto verifica solo esta revisión, no un despliegue real.

Una prueba exhaustiva del dataset comprueba referencias de especies, habilidades, aprendizaje, evoluciones, objetos y movimientos de entrenadores y máquinas en esta revisión, además de contrastar ambos adaptadores de modo para cada integrante. Comprueba relaciones de datos, no el renderizado ni el comportamiento jugable.

Una revisión estática independiente de esta vista sin commit detectó la aceptación incorrecta de un manifiesto no predeterminado. El frontend comprueba ahora solo `catalog.default`; una segunda revisión independiente pasó las pruebas focalizadas de discrepancia y ruta externa (2/2). Esta revisión no demuestra comportamiento en navegador, calidad visual ni equivalencia completa.

Una prueba local autorizada con Chromium headless pasó en tamaños de escritorio y móvil: búsqueda, idioma, tema, detalle y foco de entrenadores, evolución en la Pokédex, trucos, galería de Kris y carga del iframe del parcheador. Detectó un parámetro incorrecto del iframe, corregido según el contrato del parcheador original. El idioma del parcheador se sincronizó; no se seleccionó ni parcheó ninguna ROM. Se revisaron visualmente dos capturas; quedan sin verificar la accesibilidad completa, la equivalencia de rutas y la ejecución del parche.

La prueba en navegador también abrió movimientos, objetos, máquinas, habilidades, evoluciones, guías, FAQ, mecánicas y guía del jugador en ambos tamaños, comprobando títulos visibles y desbordamiento horizontal de página. Esto no valida cada entrada ni interacción.

La misma prueba usa el filtro por especie, conserva entrenador y modo al recargar, sigue un enlace de especie y compara los cuatro niveles visibles del entrenador 1 con los datos en Normal y Plus en ambos tamaños.

La prueba comprueba además Ctrl+K, navegación con Intro, devolución del foco con Escape y respuestas HTTP erróneas de los recursos locales solicitados durante las rutas cubiertas. No carga todas las imágenes ni prueba todas las tecnologías de asistencia.

Una comprobación básica del DOM encontró etiquetas o texto en controles y enlaces visibles, y atributos `alt` en las imágenes visibles de las rutas cubiertas para ambos tamaños. Esta heurística no es una auditoría completa de nombre accesible, contraste, lector de pantalla ni WCAG.

Para el truco `00-006`, la prueba busca por ID, compara el bloque completo mostrado con el catálogo y comprueba que el perfil RetroArch descargado contiene el mismo código y está desactivado. No prueba el código en un emulador.

Chromium abrió las 87 rutas de guía en inglés y español y comprobó que el texto de origen está presente en cada página renderizada, teniendo en cuenta la nota documentada sobre evidencia no publicada. Esto no verifica cada afirmación ni revisa visualmente todas las páginas.

Las 2.329 imágenes del manifiesto de la galería de Kris existen y coinciden con su SHA-256 registrado; esta comprobación de integridad forma parte de las pruebas del frontend. La coincidencia de hashes no identifica qué imagen muestra un mockup temprano concreto.

Las pruebas del frontend comprueban además que los 999 sprites distintos referenciados de Pokémon, entrenadores y objetos existen localmente y tienen firma PNG. Esto no demuestra su corrección visual ni su procedencia.

Chromium local también parcheó, mediante el iframe de React, un HeartGold aportado por el usuario cuyo hash coincide con el manifiesto, para ambas versiones. Las descargas coincidieron con los manifiestos: Alfa 1 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`; Alfa 2 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`. Se eliminaron las salidas temporales y el hash del original no cambió. Esto verifica el flujo local de parcheo, no la jugabilidad ni el despliegue.

La prueba en navegador también rechaza un archivo sintético corto y otro del tamaño correcto con hash incorrecto; ninguno produce una descarga ni solicita un delta.

Tras los últimos cambios del frontend se ejecutó el generador en una copia desechable. La prueba de navegador y los dos parcheos pasaron sobre la salida real de `web/`. No se regeneró el checkout protegido.

La migración usa la instantánea pública aceptada. El material histórico local se ha conservado por separado y debe reconciliarse mediante la revisión de procedencia y publicación del proyecto antes de afirmar que existe equivalencia con todo el contenido local.
