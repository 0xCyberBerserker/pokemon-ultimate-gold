# Initial technical import / Importación técnica inicial

## English

### Local candidate snapshot 12

The [snapshot 12 manifest](2026-10-23-source-manifest-12.json), SHA-256 `1c8f2ece31519ec9b1413f4f71dfd34d7111daee279d53d81f58f35877ea2b07`, describes 1,654 game files. Its byte-identical [delivery receipt](2026-10-23-delivery-validation-12.md) has SHA-256 `1ae2849254624ffc043933fff92afd27aac084c862c414c92778dfa99c027d78`. This is a local candidate only; published/deployed content remains snapshot08 at `269f9690ca1037425698e21c87ed9ab97c0e6936`. Versus local snapshot11, exactly four existing files change: Kris feasibility, provenance JSON and its generated copy, and wiki JSON. No game files are added or removed.

The new evidence maps female battle-portrait selection in pinned upstream source, preserving ordinary/link backpic differences. Trainer Card selection, target-ROM/runtime mapping and Kris asset rights remain unresolved. No sprite, asset, code, patch, default or release change is included. Receiver checks verify frozen inventory, scoped JSON changes and links; source builds/idempotence are attributed to the receipt. No rebuild, emulator or UI was repeated. Earlier local candidates and deployed history remain immutable; a local commit does not authorise publication.

### Historical local candidate snapshot 11

The [snapshot 11 manifest](2026-10-23-source-manifest-11.json), SHA-256 `b388dc033ab6203eea4871849cf0fa66c82223a5ac22254a93968ac00adf2f76`, describes 1,654 game files. The byte-identical [delivery receipt](2026-10-23-delivery-validation-11.md) has SHA-256 `e06cd540153075b871634fdf8ee2c9aa780b044f8b29c6a532058ddacaeb927d`. This is a local candidate, not a publication: the deployed baseline remains snapshot 08 at `269f9690ca1037425698e21c87ed9ab97c0e6936`. Relative to local snapshot 10, two files are added (the post-Use Save guide and its HTML entry) and two change (editor status and generated wiki data). Code, patches, defaults and artwork remain unchanged.

The new independently reviewed bd50 case records Save after opening/leaving the Stat Editor, identical 1,460 stored Party bytes with three valid stored checksums, and item 119 ×1 observed in a cold process without input savestate or cheats. Runtime slot 2 remains checksum-inconclusive; runner `NOT_ASSESSED`/`NOT_TESTED` statuses are retained. This is not global editor, Alpha 2, human or complete-game acceptance. Source build/idempotence results are attributed to the receipt; receiver checks cover frozen inventory, scope and links, without new builds, cores or UI. All prior records remain immutable. Integration into a local branch does not authorise push, release or deployment.

### Historical local candidate snapshot 10

The [snapshot 10 manifest](2026-10-23-source-manifest-10.json), SHA-256 `88dbb967c4be4060f862c19afa3b14b69311c05ef3ec16e1f21d14219151bc24`, describes all 1,652 game files. Its byte-identical [delivery receipt](2026-10-23-delivery-validation-10.md) has SHA-256 `abfb66bf0335f5d6b9a58bc238fc44033284764672dc2028a55990c1a0619b68`. Against base `269f9690ca1037425698e21c87ed9ab97c0e6936`, only project status, current editor status and four generated wiki EN/ES body leaves change. No game files are added or removed. The stored-Party follow-up closes the grant-save comparison before Use; two later RAM checksums and post-Use Save/cold remain unaccepted. Alpha 2 downloads, code, patches, defaults and artwork are unchanged. Receiver checks verified inventory and documentation scope; source build/idempotence/test results are attributed to the receipt. No rendered or full-game acceptance follows. Earlier snapshots remain immutable historical records.

### Historical snapshot 08

The [snapshot 08 manifest](2026-10-23-source-manifest-08.json), SHA-256 `5ec6ff0fdfcd8bf56f84fd651953f45d0cbc4eb11eeac62115eeae278e23e2ba`, describes all 1,652 current game files, including the cache-reference change previously recorded below. Its byte-identical [delivery receipt](2026-10-23-delivery-validation-08.md) has SHA-256 `07827a27118cd5c2b5cd3e30685fe87665dbabf0dca6654ebda8d9edb8d1976c`. Against public main `02638754b4b3254244a6761dc6a6dffc1fc06800`, only four game files change: editor status, Nature QA, game roadmap and generated wiki data. No files are added or removed; root management documents are preserved.

The new text records one independently reviewed Chikorita/Adamant apply, native Save and state-free cold Summary case, with beginner summaries in both languages. The pins remain in the guide; the 12/20-invocation case does not establish battle/PC consumers, every Nature or complete editor/game acceptance. Alpha 2, all downloadable patches, scripts and approved artwork are unchanged. Export review verified all hashes, sizes and modes and scanned the sanitized content. The receipt attributes 15 passed web unit tests and one skip to Dev's validation copy; receiver CI and deployed rendering are separate checks. Earlier snapshots and overlays remain immutable historical provenance.

### Historical snapshot 07 with cache-reference overlay

The [snapshot 07 manifest](2026-10-22-source-manifest-07.json), SHA-256 `2fa5d3c8a87c445f9d15718c7fb1e59c7d40f7e5a7d9165df40e8663b4084c6d`, describes all 1,652 files under `game/`. Its byte-identical [delivery receipt](2026-10-22-delivery-validation-07.md), SHA-256 `84fda1c00968a218aa341189d7bfb4ba8beb899e3d4ec45aedc768db7866f267`, records four additions, ten modifications and no removals or mode changes relative to public main `4ce39ffa00676af5f4be15803999cd5c1cfe5471`. The prior loading fix and all 1,648 tracked game files are preserved; the root README remains unchanged.

This update includes the approved homepage header and wiki/patcher favicon, bilingual branding provenance, and bounded Frontier/Nature QA documentation. Approved artwork hashes are pinned in the receipt; the PNG retains C2PA. Alpha 2 and downloadable patches are unchanged. Frontier reaches the next battle menu without proving turns, victory, rewards or a new cold boot; Nature covers Back and unchanged Party, Bag and battery bytes, without accepting nature application or persistence. Motion and editorial proposals are excluded.

After PR #18, the published subtree matched snapshot 07 except for the two HTML files documented in the [cache-reference overlay](2026-10-22-cache-reference-overlay.md), SHA-256 `d1f4af103db195ec3561546d53089b5b134f03659940ab6f70122c702ba560d6`. That overlay changed only three asset-version references in each file; the other 1,650 game files remained byte-identical to snapshot 07. The immutable manifest is unchanged. Independent delivery validation passed 63 unit tests discovered (54 executed, nine expected skips), plus 13 wiki, seven Features and four delayed-load browser checks in a separate copy. Integration-head and deployed-site checks are recorded separately; none establish full playable-release acceptance. Earlier manifests and the publication overlay remain historical provenance.

### Historical snapshot 06

The [snapshot 06 manifest](2026-10-22-source-manifest-06.json), SHA-256 `d9d9cee1f4147d811b851da5868c339fc469ab7db28d6e03ed213b485ad12376`, now describes all 1,647 files under `game/`. Its [delivery receipt copy](2026-10-22-delivery-validation-06.md) records 9 additions, 20 modifications and no removals relative to the privacy-reviewed public baseline. The original receipt SHA-256 is `f0ca55214651dc858d13b98be7d47b46b0e22385407917b42da986a7d165177c`; this copy only converts eight Markdown hard-break lines to list items to pass whitespace checks.

This update adds the segmented Features guide, one combined Rebalanced viability filter (98 of 493 species), and bounded EV-cap/Kris research documentation. Experimental editor/Kris features remain outside the downloadable build; the header and icon awaiting human review are excluded. Integration checks passed: site build, 63 discovered unit tests with 9 ROM-dependent skips, and wiki JavaScript syntax. Independent delivery validation also passed 13 wiki and 7 Features browser checks. These checks do not accept a complete playable release.

Snapshot 06 describes the earlier delivery; PR #15 subsequently added the loading regression and navigation guard before snapshot 07. The records below preserve snapshot 04 and its publication privacy overlay; historical hashes are not the current game-file inventory.

### Historical baseline 04

Export 2026-10-22-04 stages 1,638 files under `game/`: browser patcher, generated wiki, versioned patches and authored guides. The root management scaffold is preserved. The full experimental native editor/Kris engine and unresolved artwork remain outside this import.

- [Source/export manifest](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Its `exported_files` paths are relative to `game/`.
- [Delivery validation](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. This is the technical lead's receipt; PR validation separately records checks performed on the integration branch.

Every technical file was checked against its exported hash, byte length and mode during the initial import. A later publication privacy overlay replaces a personal review assignment in the contributor guide with a generic role. The [publication overlay](publication-overlay.json) records the baseline and replacement hashes: 1,637 game files remain identical to snapshot 04 and one documentation file differs. The immutable baseline manifest and delivery receipt describe the original snapshot, not an assertion that the redacted guide is byte-identical. Source hashes and transformations remain in the manifest. Sanitized reports are derivatives, not byte-identical original runtime evidence. See [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

Snapshot 04 finalizes both generated JSON outputs after building; its manifest records two idempotent builds. Rebuilding the publication subtree must retain the original generated hashes and the documented overlay. Earlier export 03 was rejected because rebuilding changed generated guide hash references and provenance formatting.

The full initial-import whitespace check flags generated CSV CRLF and 19 existing trailing-space lines in three pinned RomPatcher.js vendor files. Their bytes are preserved. The check passes for authored content when CRLF is recognized and only the unchanged `game/web/vendor/rompatcher/` subtree is excluded; repository-wide whitespace rules are not changed.

ROMs, saves, states, raw memory dumps, archives, symlinks and Pages workflows are excluded. No release or automatic publication is configured. Privacy and redistribution rights are separate gates; a private review PR does not establish full-game or hardware acceptance.

## Español

### Instantánea candidata local 12

El [manifiesto 12](2026-10-23-source-manifest-12.json) describe 1.654 archivos; su hash y el del [recibo idéntico](2026-10-23-delivery-validation-12.md) constan arriba. Sólo candidata local: la publicación/despliegue continúa en snapshot08, `269f9690ca1037425698e21c87ed9ab97c0e6936`. Frente a la candidata local11 cambian exactamente cuatro archivos existentes: viabilidad de Kris, procedencia JSON y su copia generada, y JSON wiki. Sin altas ni bajas de juego.

Se mapea la selección de retratos femeninos de combate en fuentes upstream fijadas, separando reversos ordinarios/de enlace. Trainer Card, mapeo de ROM objetivo/runtime y derechos de Kris siguen pendientes. No se incluyen sprites, recursos, código, parches, valores predeterminados ni release nuevos. El receptor comprueba inventario congelado, JSON acotado y enlaces; build/idempotencia del origen se atribuyen al recibo. Sin repetir build, emulación ni interfaz. Candidatas previas e histórico desplegado permanecen inmutables; el commit local no autoriza publicar.

### Instantánea candidata local histórica 11

El [manifiesto 11](2026-10-23-source-manifest-11.json) describe 1.654 archivos de juego; su hash y el del [recibo idéntico](2026-10-23-delivery-validation-11.md) constan arriba. Es una candidata local, sin publicar: la base desplegada sigue siendo la instantánea 08 en `269f9690ca1037425698e21c87ed9ab97c0e6936`. Frente a la candidata local 10 se añaden la guía de guardado tras Use y su entrada HTML, y cambian el estado del editor y el JSON wiki. Código, parches, valores predeterminados y arte siguen iguales.

El caso bd50 revisado acredita Save tras abrir/salir del Stat Editor, 1.460 bytes guardados idénticos con tres checksums válidos y objeto 119 ×1 observado tras arranque frío sin estado de entrada ni trucos. El slot 2 en RAM sigue inconcluso; se conservan los estados `NOT_ASSESSED`/`NOT_TESTED` del runner. No acepta editor global, Alfa 2, experiencia humana ni juego completo. Build/idempotencia del origen se atribuyen al recibo; el receptor comprueba inventario congelado, alcance y enlaces, sin nuevos builds, cores ni interfaz. Los registros previos permanecen inmutables. Integrar en una rama local no autoriza push, release ni despliegue.

### Instantánea candidata local histórica 10

El [manifiesto 10](2026-10-23-source-manifest-10.json) describe los 1.652 archivos de juego; manifiesto y [recibo idéntico](2026-10-23-delivery-validation-10.md) tienen los hashes indicados arriba. Frente a la base `269f9690ca1037425698e21c87ed9ab97c0e6936` sólo cambian estado del proyecto, estado del editor y cuatro cuerpos EN/ES del JSON wiki, sin altas ni bajas de juego. El seguimiento del equipo guardado cierra la comparación anterior a Use; quedan pendientes dos checksums RAM posteriores y otro Save/frío tras Use. Alfa 2 descargable, código, parches, valores predeterminados y arte no cambian. El receptor comprobó inventario y alcance documental; build, idempotencia y pruebas del origen se atribuyen al recibo. Sin aceptación de renderizado ni del juego completo. Los snapshots anteriores conservan su valor histórico inmutable.

### Instantánea histórica 08

El [manifiesto de la instantánea 08](2026-10-23-source-manifest-08.json), SHA-256 `5ec6ff0fdfcd8bf56f84fd651953f45d0cbc4eb11eeac62115eeae278e23e2ba`, describe los 1.652 archivos actuales de juego, incluido el cambio de caché registrado más abajo. Su [recibo de entrega](2026-10-23-delivery-validation-08.md), copiado byte a byte, tiene SHA-256 `07827a27118cd5c2b5cd3e30685fe87665dbabf0dca6654ebda8d9edb8d1976c`. Frente al main público `02638754b4b3254244a6761dc6a6dffc1fc06800`, solo cambian cuatro archivos: estado del editor, QA de naturaleza, roadmap del juego y datos generados de la wiki. No hay altas ni bajas; se conserva la gestión raíz.

El texto registra un caso Chikorita/Adamant revisado independientemente: aplicación, guardado nativo y Resumen tras carga fría sin estado, con resúmenes para principiantes en ambos idiomas. Los pins constan en la guía; el caso de 12/20 invocaciones no demuestra consumidores de combate/PC, todas las naturalezas ni aceptación completa del editor o juego. Alfa 2, parches descargables, scripts y arte aprobado no cambian. La revisión del export comprobó hashes, tamaños y permisos y analizó el contenido saneado. El recibo atribuye a la copia de validación de Dev 15 pruebas web correctas y una omitida; CI del receptor y renderizado publicado se comprueban aparte. Los snapshots y ajustes anteriores permanecen como procedencia histórica inmutable.

### Instantánea histórica 07 con ajuste de referencias de caché

El [manifiesto de la instantánea 07](2026-10-22-source-manifest-07.json), SHA-256 `2fa5d3c8a87c445f9d15718c7fb1e59c7d40f7e5a7d9165df40e8663b4084c6d`, describe los 1.652 archivos de `game/`. El [recibo de entrega](2026-10-22-delivery-validation-07.md), copiado byte a byte y con SHA-256 `84fda1c00968a218aa341189d7bfb4ba8beb899e3d4ec45aedc768db7866f267`, registra cuatro altas, diez modificaciones y ninguna baja ni cambio de permisos frente al main público `4ce39ffa00676af5f4be15803999cd5c1cfe5471`. Se conservan la corrección de carga y los 1.648 archivos de juego ya versionados; el README raíz no cambia.

Se incorporan la cabecera aprobada de portada y el favicon de wiki/parcheador, procedencia bilingüe y documentación acotada de Frontier/Nature. Los hashes del arte aprobado constan en el recibo; el PNG conserva C2PA. Alfa 2 y sus parches descargables no cambian. Frontier llega al siguiente menú de combate sin acreditar turnos, victoria, premios ni nuevo arranque en frío; Nature comprueba Back y bytes intactos de equipo, Bolsa y partida, sin aceptar aplicación ni persistencia de naturaleza. Las propuestas de animaciones y revisión editorial quedan fuera.

Tras la PR #18, el subárbol publicado coincidía con la instantánea 07 salvo los dos HTML documentados en el [ajuste de referencias de caché](2026-10-22-cache-reference-overlay.md), SHA-256 `d1f4af103db195ec3561546d53089b5b134f03659940ab6f70122c702ba560d6`. Solo cambiaron tres versiones de recursos en cada archivo; los otros 1.650 archivos de juego conservaban exactamente sus bytes. El manifiesto inmutable no cambia. La validación independiente en otra copia pasó 63 unitarias descubiertas (54 ejecutadas y nueve omisiones previstas), además de 13 comprobaciones de wiki, siete de Features y cuatro de carga retrasada. El head de integración y la web desplegada se verifican aparte; estas pruebas no aceptan una release jugable completa. Los manifiestos anteriores y el saneamiento de publicación conservan su valor histórico.

### Instantánea histórica 06

El [manifiesto de la instantánea 06](2026-10-22-source-manifest-06.json), SHA-256 `d9d9cee1f4147d811b851da5868c339fc469ab7db28d6e03ed213b485ad12376`, describe ahora los 1.647 archivos de `game/`. La [copia del recibo de entrega](2026-10-22-delivery-validation-06.md) registra 9 altas, 20 modificaciones y ninguna baja frente a la base pública revisada de privacidad. El SHA-256 del recibo original es `f0ca55214651dc858d13b98be7d47b46b0e22385407917b42da986a7d165177c`; esta copia solo convierte ocho líneas con saltos Markdown en elementos de lista para pasar la comprobación de espacios finales.

La actualización añade la guía Features segmentada, un filtro conjunto de Viabilidad rebalanceada (98 de 493 especies) y documentación de pruebas acotadas de límites EV e investigación de Kris. El editor/Kris experimental sigue fuera del build descargable; se excluyen el header y el icono pendientes de revisión humana. En integración pasan el build, 63 pruebas unitarias descubiertas con 9 omisiones que requieren ROM y la sintaxis JavaScript de la wiki. La validación independiente de entrega también pasó 13 comprobaciones de navegador wiki y 7 de Features. Estos resultados no aceptan una release jugable completa.

La instantánea 06 describe la entrega anterior; después, la PR #15 añadió la regresión de carga y la protección de navegación antes de la instantánea 07. Los registros siguientes conservan el snapshot 04 y su saneamiento de privacidad; los hashes históricos no describen el inventario actual del juego.

### Base histórica 04

La exportación 2026-10-22-04 prepara 1.638 archivos bajo `game/`: patcher de navegador, wiki generada, parches por versión y guías propias. Se conserva la gestión en raíz. El motor nativo experimental completo del editor/Kris y el arte sin derechos resueltos quedan fuera.

- [Manifiesto de origen/exportación](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Las rutas de `exported_files` son relativas a `game/`.
- [Validación de entrega](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. Es el recibo del responsable técnico; la validación de la PR distingue las comprobaciones ejecutadas en la rama de integración.

Durante la importación inicial se comprobó cada archivo técnico contra su hash exportado, tamaño y modo. Un saneamiento posterior para publicación sustituye una asignación personal de revisión por un rol genérico en la guía de colaboración. El [registro de saneamiento](publication-overlay.json) conserva los hashes anterior y posterior: 1.637 archivos del juego siguen idénticos al snapshot 04 y cambia un archivo documental. El manifiesto y recibo originales describen el snapshot inmutable; no afirman que la guía saneada conserve sus bytes. Se mantienen hashes de origen y transformaciones. Los informes saneados son derivados, no evidencia runtime original byte a byte. Consulta [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

El snapshot 04 finaliza los dos JSON generados después del build; su manifiesto registra dos builds idempotentes. Recompilar el subárbol para publicación debe conservar los hashes generados originales y el saneamiento documentado. La exportación 03 se rechazó porque el build cambiaba referencias de hash de guías generadas y el formato de procedencia.

La comprobación completa del diff inicial señala CRLF en CSV generados y 19 líneas con espacios finales en tres archivos fijados de RomPatcher.js. Se conservan sus bytes. La comprobación pasa para contenido propio al reconocer CRLF y excluir únicamente el subárbol sin cambios `game/web/vendor/rompatcher/`; no se modifican las reglas globales de whitespace.

Se excluyen ROMs, partidas, estados, volcados de memoria, archivos comprimidos, enlaces simbólicos y workflows de Pages. No hay release ni publicación automática. Privacidad y derechos de redistribución son criterios separados; una PR privada no acepta todo el juego ni hardware físico.
