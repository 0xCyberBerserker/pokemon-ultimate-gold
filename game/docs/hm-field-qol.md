# HM field actions / Acciones de MO en campo

## English

### Status

**Available in selectable Alpha 2 — experimental:** all eight HM actions have representative native evidence on exact fix6a. Alpha 1 does not include this feature. Own the HM and its badge, then use an eligible non-Egg party member without teaching the move. Normal context and story gates remain. The engineering history and case-by-case limits below do not imply full-game acceptance.

A native-code prototype is in runtime testing. It is not included in the Alpha 1 download. Earlier revisions exposed a field-heap allocation bug and a separate standard-script actor lookup bug; they are not accepted builds. From fix4 onward, ownership and badge gates also apply when a party member already knows the HM. Fix5 corrected the menu layout and passed separate native Fly/Surf and save/cold checks. The experimental fix6a combines that helper with the [Repel correction](repel-reuse.md); full gameplay acceptance remains pending.

- Input: `qa-kit-shop.nds`, SHA-256 `231a0a2fe3f873d0d369f6adbde6e6f69abe74e6d4bf9642fe1b1df8c8a7e514`.
- Historical fix4 baseline: `qa-kit-shop-owned-hm-paged-fix4.nds`, SHA-256 `c64dc998bf97c621027bd3e9f16e7526309db3fc69b99c8198d28b1614b75304`.
- Engineering source: `build_candidate.py`; frozen fix4 helper: `owned_hm_menu_fix4.c`. These local development files are outside the published wiki.

**Layout revision fix5:** SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Independent ROM read-back and cold-start menu checks passed: Strength and Cancel are fully readable, and Next/Back/Cancel/B navigation works. The helper occupies 2,792 of 2,800 bytes. The [menu report](qa-menu-fix5.json) covers UI acceptance; the separate native-action evidence below covers the tested gameplay. Fix5 remains outside the download.

[View the native menu capture](../assets/locations/hm-fix5-menu.png). Both DS screens are retained here because the tested menu appears on the lower screen.

Subsequent [fix5 native-action checks](qa-owned-hm-actions-fix5.json) exercised Fly, Surf, shore return and native saving, followed by two fresh-process reloads with no codes or input emulator state. Canonical inventory, all party records, badges and saved position matched. Cold RAM samples were compared against the exact saved records while accounting for the native segment-encryption loop; original captures are retained. That report covers only Fly/Surf and does not certify other HM actions, map/story gates or normal learning.

**Strength on fix6a:** Clefairy activated the native action without knowing any HM, and a real Dark Cave boulder moved one tile. Independent review confirmed the ROM, save/state chain, object coordinates, unchanged inventory and 4 KiB reserve. The setup positioned the player synthetically beside a native saved object. Post-push save/cold persistence and normal story access remain untested. See [Strength evidence and capture](hm-strength-fix6a.md).

**Rock Smash on fix6a:** the native prompt, CLEFAIRY's move-use message and removal of the real rock passed separate review. The exact DSV confirmed no learned HMs; every party byte, the Bag and reserve were preserved after accounting for the native encryption phase. See [Rock Smash evidence and capture](rock-smash-fix6a.md).

**Cut on fix6a:** native entry into Route 8, the Cut prompt, CLEFAIRY's move-use message and removal of the real tree passed independent review. No party member knew an HM; the party, Bag and reserve were preserved. Adjacent positioning used an edited copy of a native save. Post-action save/cold persistence remains untested. See [Cut evidence and capture](hm-cut-fix6a.md).

**Whirlpool on fix6a:** the native prompt and CLEFAIRY's move-use message led to a complete crossing of the Route 41 whirlpool. No party member knew an HM; party, Bag and reserve stayed unchanged. Independent review confirmed the save/state chain and the effect without directional inputs. See [Whirlpool evidence and captures](hm-whirlpool-fix6a.md).

**Waterfall on fix6a:** CLEFAIRY climbed the Tohjo Falls waterfall through the native prompt without knowing the HM or receiving directional inputs. The selected actor's coordinates and height changed as expected; party, Bag and reserve were preserved. Independent review passed; post-action save/cold persistence remains untested. See [Waterfall evidence and captures](hm-waterfall-fix6a.md).

**Rock Climb on fix6a:** a walking avatar climbed the Route 47 wall after CLEFAIRY's native move message, with no learned HM or directional inputs. Independent review confirmed state 0 before/after, the position/height change and unchanged party, Bag and reserve. The earlier Surf-state fixture is excluded. See [on-foot Rock Climb evidence and captures](hm-rock-climb-walk-fix6a.md). Post-action save/cold persistence remains untested.

**Fly/Surf on the combined fix6a build:** native flight, entry into water, return to land and normal save/fresh-process reload passed. All eight HM action cases now cover this exact build. Bag and badges were preserved; the only party changes were two native walking-friendship increments, corroborated by the 128-step counter. Every runtime record matched an exact PRE/POST cipher boundary. ROM code and guards were unchanged; menu state changed only inside its twelve declared mutable symbols. See [combined Fly/Surf QA](hm-fly-surf-fix6a.md).

### Player behavior

In the field party menu, an HM action is available when its HM item is in the Bag and its matching badge is earned. The selected Pokémon does not need to know the move or be species-compatible. The menu still requires a selected, non-Egg actor; Surf and Waterfall routing uses a non-Egg party member, preferring one that knows the move and otherwise choosing the first non-Egg member.

The standard Summary, Switch, Item/Mail, and Quit entries stay in place. Up to four field actions appear directly. When the list would exceed the native eight-button limit, Fly is kept directly visible when available, and the remaining actions appear under **Field moves** in pages of up to six, with **Next**, **Back**, and the native **Cancel** behavior. Known non-HM field actions are retained in that overflow list. An HM action never bypasses the game's native map, tile, story, badge, follower, or costume checks.

The eight HM item and badge pairs are:

| HM | Bag item | Badge | Native QA |
| --- | ---: | --- | --- |
| Cut | 420 | Hive | Passed on fix6a |
| Fly | 421 | Storm | Passed on fix6a |
| Surf | 422 | Fog | Passed on fix6a |
| Strength | 423 | Plain | Passed on fix6a |
| Whirlpool | 424 | Glacier | Passed on fix6a |
| Rock Smash | 425 | Zephyr | Passed on fix6a |
| Waterfall | 426 | Rising | Passed on fix6a |
| Rock Climb | 427 | Earth | Passed on fix6a |

### Static evidence: HM patch scope

The following build details describe the historical fix4 HM patch. Fix5 changes its menu helper as described above. Fix6a additionally changes the Bag overlay for reusable Repels; its [separate evidence](repel-reuse.md) must be read alongside the HM reports.

The builder installs the party-menu hook at ARM9 `0x0207B07E` only when its native four-byte preimage matches `02 f0 31 f8`. The replacement helper starts at `0x023D7100`; fix4 uses 2,796 bytes within the registered 2,800-byte usable block. It uses the native list allocation, action callbacks, context-menu cursor, and deletion paths. The menu is composed before the cursor copies its items, and each generated list remains at or below eight entries. HM ownership scans the canonical TM/HM pocket without heap allocation. Script command 141 uses the same validated actor selection; its native learned-move fallback remains available only for non-HMs such as Headbutt.

Surf and Waterfall keep their native field checks. Overlay 1 changes only the mapped party-slot lookup and the call that supplies its result: Surf at `0x021E753E` / `0x021E7544`, Waterfall at `0x021E6BB8` / `0x021E6BBE`. The route helper checks HM ownership and badge, then returns a valid non-Egg actor or `0xFF` when none exists. The ordinary field-move checks continue to enforce map, tile, story, and movement restrictions.

Read-back confirms the registered 4 KiB autoload section and canaries, the five prior autoload sections, all 129 ARM9 overlays, all 513 filesystem entries, ARM7, ARM9 post-data, and unrelated code-settings bytes. Only filesystem file ID 1 (field-control overlay 1) changes. The evolution-shop pointer at `0x0210FA4C` and its 70-byte, 34-item stock remain byte-identical.

The full static build/read-back report is retained locally as `build-report-fix4.json`; published runtime evidence is linked below. The QA fixture generator requires an exact candidate hash and fresh RAM, validates both canonical and legacy inventory views, then produces one-frame Action Replay setup fixtures. Earlier fix2 menu tests checked Surf/Waterfall ownership and badge visibility; a field-first Egg fixture corrected a stale party-screen test. Those results belong to their recorded ROM hashes and do not certify fix4. Temporary setup codes are disabled before native action acceptance.

### Runtime acceptance still required

Eight fix4 menu fixtures passed, including ownership/badge visibility and the Egg-only case; see the [menu matrix](qa-owned-hm-matrix-fix4.json). Fix5 corrected the clipped Strength label, repeated Fly/Surf and native save/cold checks, and passed the bounded [combined kit/shop regression](combined-kit-shop-qa.md). Fix6a action evidence appears above; the per-HM table tracks accepted actions. Map/story gates, normal HM learning and complete combined-build acceptance remain pending. Results apply only to their recorded ROM hashes.

The menu model follows the owned-HM-plus-badge usability precedent in [pokeemerald-modern](https://github.com/davidgfnet/pokeemerald-modern), while retaining Sacred Gold's Nintendo DS callbacks and native field checks; no GBA binary patch is used.

### Runtime evidence (prototype)

**Historical fix4 captures — not included in Alpha 1.** Fly reached its native destination; a separate no-code run entered water with Surf, moved Clefairy across it, and returned to shore with the walking sprite and follower restored. Native saving/cold recovery also passed; see the [fix4 QA report](qa-owned-hm-actions.json). The newer fix5 evidence and remaining acceptance limits are listed above.

![Clefairy selected as the Surf actor from the native party field menu](../assets/locations/hm-fix4-surf-actor.png) ![Clefairy surfing across water after using Surf](../assets/locations/hm-fix4-surf-moved.png)

## Español

### Estado

**Disponible en alfa 2 seleccionable — experimental:** las ocho acciones de MO tienen evidencia nativa representativa en fix6a exacta. Alfa 1 no incluye esta función. Conserva la MO y su medalla y selecciona un Pokémon apto que no sea huevo, sin enseñarle el movimiento. Siguen aplicándose los requisitos normales de contexto e historia. El historial de ingeniería y los límites por caso descritos abajo no aceptan el juego completo.

El prototipo nativo está en pruebas runtime y no forma parte de la descarga Alfa 1. Revisiones anteriores detectaron un fallo de asignación de memoria en campo y otro de selección del actor en los scripts estándar; no son versiones aceptadas. Desde fix4 se conservan los requisitos de objeto y medalla si algún miembro ya conoce la MO. Fix5 corrigió la maquetación y superó pruebas separadas de Fly/Surf nativos y guardado/recarga en frío. La fix6a experimental combina ese helper con la [corrección de repelentes](repel-reuse.md); falta la aceptación completa de juego.

- Entrada: `qa-kit-shop.nds`, SHA-256 `231a0a2fe3f873d0d369f6adbde6e6f69abe74e6d4bf9642fe1b1df8c8a7e514`.
- Base histórica fix4: `qa-kit-shop-owned-hm-paged-fix4.nds`, SHA-256 `c64dc998bf97c621027bd3e9f16e7526309db3fc69b99c8198d28b1614b75304`.
- Código de desarrollo: `build_candidate.py`; helper fix4 congelado: `owned_hm_menu_fix4.c`. Estos archivos locales de desarrollo quedan fuera de la wiki publicada.

**Revisión de maquetación fix5:** SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Superó la lectura independiente de ROM y las pruebas de menú desde un arranque en frío: Strength y Cancel se leen completos y funciona la navegación Next/Back/Cancel/B. El helper ocupa 2.792 de 2.800 bytes. El [informe de menú](qa-menu-fix5.json) cubre la UI; las evidencias separadas de acciones nativas que aparecen debajo cubren el juego probado. Fix5 sigue fuera de la descarga.

[Ver la captura del menú nativo](../assets/locations/hm-fix5-menu.png). Aquí se conservan ambas pantallas de DS porque el menú probado aparece en la inferior.

Las [pruebas posteriores de acciones nativas en fix5](qa-owned-hm-actions-fix5.json) ejercitaron Fly (Vuelo), Surf, regreso a tierra y guardado nativo, seguidos de dos recargas en procesos nuevos sin códigos ni estado del emulador de entrada. Coincidieron inventario canónico, todos los registros del equipo, medallas y posición guardada. Las muestras de RAM en frío se compararon con los registros guardados exactos, contemplando el bucle nativo de cifrado por segmentos; se conservan las capturas originales. Ese informe solo cubre Fly/Surf y no certifica otras acciones de MO, límites de mapa/historia ni aprendizaje normal.

**Strength (Fuerza) en fix6a:** Clefairy activó la acción nativa sin conocer ninguna MO y una roca real de Dark Cave (Cueva Oscura) se desplazó una casilla. La revisión independiente confirmó ROM, cadena de guardado/estados, coordenadas del objeto, inventario intacto y reserva de 4 KiB. La preparación colocó al jugador de forma sintética junto a un objeto guardado nativamente. No se probaron la persistencia del empuje tras guardar/recargar ni el acceso normal por historia. Consulta [evidencia y captura de Fuerza](hm-strength-fix6a.md).

**Rock Smash (Golpe Roca) en fix6a:** pasaron la revisión separada el diálogo nativo, el mensaje de uso de CLEFAIRY y la eliminación de la roca real. El DSV exacto confirmó que nadie conocía MO; cada byte del equipo, la Bolsa y la reserva se conservaron, contemplando la fase nativa de cifrado. Consulta [evidencia y captura de Golpe Roca](rock-smash-fix6a.md).

**Cut (Corte) en fix6a:** pasaron la revisión independiente la entrada nativa en Route 8 (Ruta 8), el diálogo de Corte, el mensaje de uso de CLEFAIRY y la eliminación del árbol real. Nadie conocía MO y se conservaron equipo, Bolsa y reserva. La posición adyacente se preparó en una copia editada de un guardado nativo. Falta guardar/recargar después de la acción. Consulta [evidencia y captura de Corte](hm-cut-fix6a.md).

**Whirlpool (Torbellino) en fix6a:** el diálogo nativo y el mensaje de uso de CLEFAIRY produjeron el cruce completo del remolino de Route 41 (Ruta 41). Nadie conocía MO y se conservaron equipo, Bolsa y reserva. La revisión independiente confirmó la cadena de guardados/estados y el efecto sin entradas direccionales. Consulta [evidencia y capturas de Torbellino](hm-whirlpool-fix6a.md).

**Waterfall (Cascada) en fix6a:** CLEFAIRY subió la cascada de Tohjo Falls (Cataratas Tohjo) mediante el diálogo nativo, sin conocer la MO ni recibir entradas direccionales. Cambiaron las coordenadas y la altura del actor como se esperaba; se conservaron equipo, Bolsa y reserva. Pasó la revisión independiente; falta guardar/recargar después. Consulta [evidencia y capturas de Cascada](hm-waterfall-fix6a.md).

**Rock Climb (Treparrocas) en fix6a:** un personaje a pie subió la pared de Route 47 (Ruta 47) tras el mensaje nativo de CLEFAIRY, sin MO aprendida ni entradas direccionales. La revisión independiente confirmó estado 0 antes/después, cambio de posición/altura y equipo, Bolsa y reserva intactos. Se excluye el intento anterior con estado Surf. Consulta [evidencia y capturas de Treparrocas a pie](hm-rock-climb-walk-fix6a.md). Falta guardar/recargar después de la acción.

**Fly/Surf (Vuelo/Surf) en el combinado fix6a:** superó vuelo nativo, entrada al agua, regreso a tierra y guardado/recarga en un proceso nuevo. Los ocho casos de acciones de MO ya cubren este build exacto. Bolsa y medallas se conservaron; los únicos cambios del equipo fueron dos incrementos nativos de amistad por caminar, corroborados con el contador de 128 pasos. Cada registro RAM coincidió con una frontera exacta de cifrado PRE/POST. Código y guardas quedaron intactos; el menú solo cambió sus doce símbolos mutables declarados. Consulta [QA de Vuelo/Surf del combinado](hm-fly-surf-fix6a.md).

### Comportamiento para el jugador

En el menú del equipo durante la aventura, una acción de MO aparece si la MO está en la Bolsa y se obtuvo su medalla. El Pokémon elegido no necesita conocer el movimiento ni ser compatible por especie. El menú exige un actor seleccionado que no sea un huevo; Surf y Cascada usan un Pokémon válido del equipo, prefieren uno que conozca el movimiento y, si no lo hay, eligen el primer Pokémon que no sea huevo.

Se conservan en su sitio **Datos**, **Cambiar**, **Objeto/Carta** y **Salir**. Hasta cuatro acciones de campo aparecen directamente. Si se supera el límite nativo de ocho botones, Vuelo permanece visible directamente cuando está disponible; las demás acciones quedan en **Movimientos de campo**, en páginas de hasta seis, con **Siguiente**, **Atrás** y la cancelación nativa. También se conservan allí las acciones de campo conocidas que no son MO. Ninguna acción salta las comprobaciones nativas de mapa, casilla, historia, medalla, acompañante o disfraz.

| MO | Objeto de la Bolsa | Medalla | QA nativo |
| --- | ---: | --- | --- |
| Cut (Corte) | 420 | Hive (Colmena) | Superado en fix6a |
| Fly (Vuelo) | 421 | Storm (Tormenta) | Superado en fix6a |
| Surf | 422 | Fog (Niebla) | Superado en fix6a |
| Strength (Fuerza) | 423 | Plain (Planicie) | Superado en fix6a |
| Whirlpool (Torbellino) | 424 | Glacier (Glaciar) | Superado en fix6a |
| Rock Smash (Golpe Roca) | 425 | Zephyr (Céfiro) | Superado en fix6a |
| Waterfall (Cascada) | 426 | Rising (Dragón) | Superado en fix6a |
| Rock Climb (Treparrocas) | 427 | Earth (Tierra) | Superado en fix6a |

### Evidencia estática: alcance del parche de MO

Los detalles siguientes describen el parche histórico de MO fix4. Fix5 modifica su helper de menú como se indica arriba. Fix6a también modifica el overlay de la Bolsa para los repelentes reutilizables; sus [evidencias separadas](repel-reuse.md) complementan los informes de MO.

El constructor instala el hook del menú en ARM9 `0x0207B07E` sólo si coinciden sus cuatro bytes nativos `02 f0 31 f8`. El helper empieza en `0x023D7100`; fix4 ocupa 2.796 de los 2.800 bytes utilizables registrados. Reutiliza las listas, callbacks, cursor y cancelación nativos, con ocho botones como máximo. La consulta de MO usa la bolsa canónica sin asignar memoria. El comando de script 141 selecciona también un actor válido; solo recurre a movimientos aprendidos para acciones que no sean MO, como Headbutt (Golpe Cabeza).

Surf y Cascada mantienen sus comprobaciones nativas. En el overlay 1 sólo cambian la consulta de slot del equipo y la llamada que recibe el resultado: Surf en `0x021E753E` / `0x021E7544`, Cascada en `0x021E6BB8` / `0x021E6BBE`. El helper comprueba MO y medalla, y devuelve un actor válido que no sea huevo o `0xFF` si no existe. Las comprobaciones normales siguen controlando mapa, casilla, historia y movimiento.

La lectura de vuelta confirma la sección autoload de 4 KiB y sus canarios, las cinco secciones anteriores, los 129 overlays ARM9, las 513 entradas del sistema de archivos, ARM7, los datos finales ARM9 y los campos no relacionados de configuración. Sólo cambia el archivo 1 (overlay 1 de control de campo). El puntero de la tienda evolutiva en `0x0210FA4C` y sus 70 bytes con 34 objetos permanecen idénticos.

El informe estático se conserva localmente como `build-report-fix4.json`; las evidencias públicas de runtime están enlazadas más abajo. El generador exige el hash exacto y RAM reciente, valida el inventario canónico y su proyección antigua y crea códigos de preparación de un solo frame. Las pruebas de menú de fix2 comprobaron visibilidad según objeto y medalla para Surf y Waterfall (Cascada); una prueba de huevo preparada antes de abrir el equipo corrigió una captura obsoleta. Esos resultados pertenecen a sus hashes y no certifican fix4. Los códigos de preparación se desactivan antes de aceptar una acción nativa.

### Aceptación runtime pendiente

Pasaron ocho casos de menú de fix4, incluidos objeto/medalla y el equipo de solo huevo; consulta [la matriz](qa-owned-hm-matrix-fix4.json). Fix5 corrigió el recorte de Strength, repitió Fly/Surf y guardado/recarga nativa y superó la [regresión acotada del kit y las tiendas](combined-kit-shop-qa.md). La evidencia de acciones fix6a aparece arriba; la tabla por MO recoge las acciones aceptadas. Faltan límites de mapa/historia, aprendizaje normal y aceptación completa del combinado. Cada resultado corresponde únicamente al hash de ROM registrado.

El modelo de menú toma como referencia de usabilidad el acceso con MO poseída y medalla de [pokeemerald-modern](https://github.com/davidgfnet/pokeemerald-modern), adaptado a los callbacks de Nintendo DS y a las comprobaciones nativas de Sacred Gold. No se utiliza un parche binario de GBA.

### Evidencia runtime (prototipo)

**Capturas históricas de fix4; no está incluido en Alfa 1.** Fly (Vuelo) llegó a su destino nativo; en otra ejecución sin códigos, Surf entró en el agua, desplazó a Clefairy y volvió a la orilla con el sprite caminando y el acompañante restaurados. También pasó el guardado/arranque en frío; consulta el [informe de QA de fix4](qa-owned-hm-actions.json). Las evidencias posteriores de fix5 y los límites de aceptación pendientes aparecen arriba.

![Clefairy elegido como actor de Surf en el menú nativo del equipo](../assets/locations/hm-fix4-surf-actor.png) ![Clefairy surfeando por el agua tras usar Surf](../assets/locations/hm-fix4-surf-moved.png)
