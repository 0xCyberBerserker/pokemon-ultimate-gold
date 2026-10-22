# Changelog

All notable changes are documented here. The format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

- Prevented wiki rendering before its dataset loads, preserving early language, game-mode and route changes. Added a delayed-load browser regression and awaited initial content and sprite decoding in browser checks.
- Corrected portable EV/IV menu setup, field return and numeric placeholders. The textfixed candidate independently passes bounded HP IV 15 → 16, HP EV 0 → 4 and separate all-EV/all-IV resets, including No/Yes, exact Party/Bag/reserve checks and native Save/fresh cold persistence. Larger-step and Repeat QA continues; earlier failed captures are retained. No editor was added to Alpha 2.
- Verified confirmed HP-IV editing and separate EV/IV resets through native Save and fresh-process recovery, with independent review and negative provenance/integrity checks. Published exact scopes in the bilingual wiki; Alpha 2 remains unchanged.
- Verified two native Bag launches of the isolated Cheat Kit probe, seeded from an actual Alpha 2 gift/save/cold chain. The complete-menu candidate passed static review but failed visual return after cancellation; preserved the failed evidence and stopped further editing QA.
- Corrected the portable candidate's two inverted fade operands; a regression test fails before and passes after the change. A new cold smoke shows cancellation text and visible field return. Re-entry reaches only the Bag; editor operations and semantic RAM integrity remain untested in this corrected candidate.
- Verified the combined native selector → HP-IV preview route and cancellation on one exact candidate in seven runs. Root reproduced the integrity audit, checked field-return captures and rejected injected cold-state/cheat provenance faults; published bilingual evidence. No editing feature was added to Alpha 2.
- Independently reviewed the proposed EV/IV write/reset handlers and expanded Reset rejection coverage; handler/core/adapter host suites pass. Published the host review in the bilingual editor QA guide. Native dispatch, confirmation UI and saved-edit acceptance remain pending.
- Verified one native HP-IV preview and cancellation through the new command bridge, with read-only RAM sampling and independent integrity review. The fixed-slot probe does not edit Pokémon or complete selector/tool integration.
- Verified isolated native party selection, cancellation and clean field return with an independent seven-run audit; published bilingual QA evidence and menu/location captures. Removed a duplicate window close and an unrelated tutor points-box command from the probe. No stat editor was added to Alpha 2.
- Preserve both DS screens for QA menu images while retaining upper-screen crops for location captures; verified the renderer and real browser CSS. Added a host-tested global-script append helper that preserves all 72 existing target-bank destinations and bodies in memory; portable item launch remains pending.
- Added exact Alpha 2 Battle Tower entry, first-match return and native save/cold-reload evidence, frozen final battery snapshots and cropped location images. Explicitly limited historical comparisons whose earlier snapshot was lost; hardened the auditor against savestate-based or incomplete cold runs with four contract tests. Other facilities, wins and rewards remain untested.
- Verified Moon Stone and Covenant Orb purchases on exact Alpha 2, including native save and state-free cold recovery; root reproduced the 22-run audit and published a cropped shop-location capture. Added a source-backed nature-consumer map without changing nature or PID.
- Made experimental Alpha 2 the default, retaining Alpha 1 selection and verified browser downloads. Preserved all 90 journey stages, 639 ordered trainers and 150 historical acquisition notes; re-extracted 208 exact shop/location rows. Locked build/source controls during patching and rejected stale QA-report hashes during site generation.
- Verified a QA-only native HP-IV edit, stat recalculation, native save and same-ROM cold recovery. Production editing menus and other operations remain pending; no editor is included in Alpha 2.
- Verified fix6a Rock Climb from a walking-state fixture, including native prompt, ascent and strict party/Bag/reserve checks. Excluded the earlier Surf-state attempt; added reviewed bilingual evidence and captures.
- Verified native Waterfall ascent on fix6a without learned HMs or directional inputs, preserving party, Bag and reserve; independently reviewed evidence and wiki captures.
- Verified native Whirlpool crossing on fix6a without learned HMs, preserving party, Bag and reserve; independently reviewed save/state chain and cropped wiki captures.
- Added a host-tested EV/IV editing core with staged previews, caps and zero resets; cross-compiled an isolated ARM9 probe with a separate guarded reserve. Native menu and runtime validation remain pending; the download does not include the editor.
- Verified native Cut and removal of a real Route 8 tree on fix6a without learned HMs; independently reviewed party, Bag and reserve preservation, with a bilingual wiki capture.
- Integrated the patcher into the wiki shell, cartridge-dump/input-ROM guidance, onboarding and FAQ; added full evolution families, real custom-item icons and acquisition screenshots.
- Tested money and all-medicine Action Replay effects against both canonical inventory and legacy projections; documented code-off state reload and untested battery/gameplay limits.
- Corrected trainer-reference gender and level notation parsing: 639 of 737 trainers now have documented adventure order; all 626 previous assignments are preserved and omitted reference levels never replace ROM data.
- Added owned-HM evidence: eight fix4 menu fixtures and separate fix5 layout, native Fly/Surf, shore return and native save/cold checks. Fix5 fixes the clipped Strength label.
- Verified native Strength and one boulder push on fix6a without learned HMs, with independent review and a bilingual wiki capture. Post-push save/cold persistence remains pending.
- Verified native Rock Smash, real rock removal and a team with no learned HMs on fix6a. Exact DSV and native cipher-boundary checks preserve every party byte, Bag and feature reserve; independently reviewed evidence and a wiki capture are included.
- Corrected reusable Repels in experimental fix6a: all three native durations, marker-absent consumption, native save/cold recovery and reuse after accelerated expiry passed bounded QA. Alpha 2 exposes this target as an experimental selection.
- Verified Rare Candy and Oran Berry effects and retained quantities on fix6a, with canonical inventory, non-target Pokémon and feature reserve intact; independently reviewed the bounded evidence.
- Added Battle Frontier inspection/runtime evidence and a source-backed future PWT feasibility study; no tournament implementation is included.
- Added a lazy searchable 2,110-code Action Replay catalog, trainer capture, complete copyable blocks and disabled individual RetroArch profiles. Exact-alpha1 static checks distinguish six unmatched guards from untested effects.
- Extracted exact shop locations/prices; the isolated evolution-shop/kit candidate passed 89 purchase/cold-reload checks for Moon Stone and Covenant Orb. Other purchases and normal story access remain pending.
- Corrected Rocket-kit QA to read Plus's canonical 60-slot key pocket instead of the 50-slot legacy projection.
- Renamed the project UI and delivery to Ultimate Gold; retained upstream credits.
- Added native reusable TM Refill with verified NPC delivery, HM exclusion and battery-save restart.
- Added categorized web wiki, selected EN/ES language, trainer portraits and route groups, local type icons, filters and TM/HM acquisition notes.
- Updated the responsive browser patcher and independently reviewed its frontend. The additional Rocket kit remains a separate candidate until runtime acceptance.

- Added a serverless browser patcher and generated project wiki for GitHub Pages, with English and Spanish.
- Cross-checked the 493-species baseline, 15 changed moves and 2,086 trainer members; identified 14 affected members.
- Verified a Fairy attack, capture, normal save/restart, and TM teaching/refill in an isolated emulator profile.
- Recorded evolution-item shop coverage as a scoped TODO.
- Added the local xdelta patcher, manifest, integrity checks, and negative/positive tests.
- Added the matching runtime TM99 cheat profile.
- Marked the candidate `TESTED_PARTIAL`; gameplay acceptance is pending.

## Español

Este registro sigue Keep a Changelog y SemVer.

### [Sin publicar]

- Evitado el renderizado de la wiki antes de cargar sus datos, conservando los cambios tempranos de idioma, modo y sección. Añadida una prueba de navegador con carga retrasada y esperas de contenido y decodificación de sprites en las comprobaciones.
- Corregidos inicio del editor portátil, vuelta al campo y argumentos numéricos. La candidata corregida supera revisión independiente de IV de PS 15 → 16, EV de PS 0 → 4 y reinicios separados de todos los EV/IV, incluidos No/Sí, comprobaciones exactas de equipo/Bolsa/reservas y persistencia tras guardado nativo/arranque en frío. Sigue el QA de pasos mayores y Repeat; se conservan las capturas fallidas anteriores. Alpha 2 sigue sin incluir el editor.
- Verificados incremento confirmado de IV de PS y reinicios EV/IV separados mediante guardado nativo y recuperación en procesos nuevos, con revisión independiente y pruebas negativas de origen/integridad. Publicados los alcances exactos en la wiki bilingüe; Alpha 2 sigue igual.
- Verificadas dos aperturas nativas desde la Bolsa de la sonda Cheat Kit, con partida procedente de regalo/guardado/recarga real de Alpha 2. La candidata con menú completo superó revisión estática, pero falló el retorno visual tras cancelar; conservada la evidencia y detenidas las pruebas de edición posteriores.
- Corregidos los dos operandos de fundido invertidos de la candidata portátil; una prueba de regresión falla antes y pasa después. Otra prueba fría muestra el mensaje de cancelación y regreso visible al mapa. La reentrada solo alcanza la Bolsa; quedan sin probar operaciones del editor e integridad semántica de RAM en esta candidata corregida.
- Verificados selector nativo → propuesta de IV de PS y cancelación en una misma candidata mediante siete ejecuciones. Root reprodujo la auditoría de integridad, revisó capturas de vuelta al campo y rechazó fallos inyectados de estado frío/cheats; publicada la evidencia bilingüe. No se añadió edición a Alpha 2.
- Revisados de forma independiente los handlers propuestos para modificar/reiniciar EV/IV y ampliados los rechazos de Reset; pasan las suites host de handlers, núcleo y adaptador. Publicada la revisión en la guía bilingüe de QA del editor. Faltan dispatch nativo, menú de confirmación y aceptación de cambios guardados.
- Verificadas una previsualización nativa de IV de PS y cancelación mediante el nuevo comando, con muestreo RAM de solo lectura y revisión independiente de integridad. La sonda de posición fija no edita Pokémon ni completa la integración del selector/objeto.
- Verificados selección nativa, cancelación y retorno limpio al mapa en una sonda aislada, con auditoría independiente de siete ejecuciones; publicadas evidencia bilingüe y capturas de menú/ubicación. Eliminados un cierre de ventana duplicado y un comando ajeno del cuadro de puntos del tutor. Alpha 2 no incorpora el editor.
- Conservadas ambas pantallas de DS en imágenes de menús QA, manteniendo el recorte superior para ubicaciones; verificados el renderer y el CSS en navegador. Añadido un helper probado en host para anexar scripts globales que conserva en memoria los 72 destinos y cuerpos del banco original; sigue pendiente abrirlos desde objetos portátiles.
- Añadida evidencia de entrada a Battle Tower (Torre Batalla), vuelta tras el primer combate y guardado/recarga en frío en Alpha 2, con partidas finales congeladas e imágenes de ubicación recortadas. Limitadas las comparaciones históricas cuya copia se perdió; el auditor rechaza recargas con estado de emulador o ejecuciones incompletas mediante cuatro pruebas de contrato. Faltan otras instalaciones, victorias y premios.
- Verificadas las compras de Moon Stone (Piedra Lunar) y Covenant Orb (Orbe Pacto) en alfa 2 exacta, con guardado y recarga en frío sin estado; root reprodujo la auditoría de 22 ejecuciones e incorporó una captura recortada de localización. Añadido un mapa de consumidores de naturaleza con fuentes, sin cambiar naturaleza ni PID.
- Activada alfa 2 experimental por defecto, conservando alfa 1 seleccionable y descargas verificadas. Conservadas las 90 etapas, 639 entrenadores ordenados y 150 notas históricas de adquisición; reextraídas 208 filas exactas de tienda/localización. Bloqueados los selectores de versión/ROM durante el parcheo y rechazados hashes de informes QA desactualizados al generar la web.
- Verificada una edición nativa de IV de PS exclusiva de QA, recálculo, guardado y recarga en frío con la misma ROM. Faltan menú final y demás operaciones; alfa 2 no incluye editor.
- Integrados parcheador, orientación sobre ROM/dump de cartucho, primeros pasos y FAQ en la wiki; añadidas familias evolutivas completas, iconos reales y capturas de adquisición.
- Probados los códigos de dinero y medicinas contra inventario canónico y proyección antigua; documentadas recarga de estado sin código y limitaciones de batería/juego sin probar.
- Corregido el parser de género y notación de niveles: 639 de 737 entrenadores tienen orden documentado; se conservan las 626 asignaciones anteriores y los niveles omitidos en la referencia nunca sustituyen los de la ROM.
- Añadidas evidencias de MO: ocho casos de menú de fix4 y pruebas separadas de maquetación, Fly/Surf nativos, vuelta a tierra y guardado/recarga en fix5. Fix5 corrige Strength recortado.
- Verificadas Fuerza nativa y una roca desplazada en fix6a sin MO aprendida, con revisión independiente y captura bilingüe en la wiki. Falta la persistencia del empuje tras guardar/recargar.
- Verificados Golpe Roca nativo, eliminación de la roca real y equipo sin MO aprendidas en fix6a. El DSV exacto y las fronteras de cifrado nativo confirman equipo, Bolsa y reserva intactos; se incluyen revisión independiente y captura en la wiki.
- Verificados Cut (Corte) nativo y eliminación de un árbol real de Route 8 (Ruta 8) en fix6a sin MO aprendidas; equipo, Bolsa y reserva revisados de forma independiente, con captura bilingüe en la wiki.
- Añadido un núcleo EV/IV con pruebas host de previsualización por etapas, límites y reinicios a cero; compilado un prototipo ARM9 aislado con reserva separada y guardas. Faltan menú nativo y validación dentro del juego; la descarga aún no incluye el editor.
- Verificado el cruce nativo de Whirlpool (Torbellino) en fix6a sin MO aprendidas, conservando equipo, Bolsa y reserva; cadena de guardados/estados revisada de forma independiente y capturas recortadas en la wiki.
- Verificado el ascenso nativo con Waterfall (Cascada) en fix6a sin MO aprendidas ni entradas direccionales, conservando equipo, Bolsa y reserva; evidencia revisada de forma independiente y capturas en la wiki.
- Verificado Rock Climb (Treparrocas) en fix6a desde una copia en estado a pie: diálogo, ascenso y comprobaciones estrictas de equipo/Bolsa/reserva. Se excluye el intento anterior con estado Surf; evidencia bilingüe y capturas revisadas en la wiki.
- Corregidos los repelentes reutilizables en fix6a experimental: pasan las tres duraciones nativas, consumo sin marcador, guardado/recarga en frío y reutilización tras caducidad acelerada. Alfa 2 ofrece ese objetivo como selección experimental.
- Verificados en fix6a los efectos y cantidades conservadas de Rare Candy y Oran Berry, con inventario canónico, Pokémon no objetivo y reserva intactos; evidencia acotada revisada de forma independiente.
- Añadidas revisión/pruebas de Battle Frontier y viabilidad futura del PWT con fuentes; no se incluye una implementación del torneo.
- Añadido catálogo Action Replay de 2.110 códigos con carga diferida, búsqueda, captura de entrenadores, bloques completos y perfiles RetroArch individuales desactivados. La comprobación estática de alpha1 identifica seis condiciones incompatibles sin atribuir efectos probados.
- Extraídas ubicaciones/precios de tiendas; el candidato aislado de tiendas/kit superó 89 controles de compra/recarga en frío de Moon Stone (Piedra Lunar) y Covenant Orb (Orbe Pacto). Faltan otras compras y el acceso normal por historia.
- Corregida la QA del kit Rocket para leer los 60 espacios canónicos de Plus en lugar de la proyección antigua de 50.
- Renombrados interfaz y entrega a Ultimate Gold, conservando créditos de los autores.
- Añadida Recarga MT nativa reutilizable: entrega, exclusión de MO y reinicio desde guardado normal verificados.
- Añadida wiki web por categorías, idioma EN/ES seleccionado, retratos y agrupación por ubicación, iconos locales de tipos, filtros y procedencia de MT/MO.
- Actualizado y revisado por otro agente el patcher web adaptable. El kit Rocket adicional sigue como candidata hasta superar sus pruebas.

- Añadidos patcher serverless y wiki generada para GitHub Pages con English/Español.
- Contrastadas las 493 especies, 15 movimientos modificados y 2.086 miembros de equipos; identificados 14 afectados.
- Verificados ataque Hada, captura, guardado/reinicio normal y enseñanza/reposición de MT en un perfil aislado.
- Registrada como TODO la cobertura de compra de objetos evolutivos.
- Añadidos patcher xdelta local, manifiesto, comprobaciones de integridad y pruebas negativas/positivas.
- Añadido el perfil de runtime TM99 coincidente.
- Candidata marcada como `TESTED_PARTIAL`; la aceptación en juego sigue pendiente.
