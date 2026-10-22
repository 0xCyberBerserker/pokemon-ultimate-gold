# Initial technical import / Importación técnica inicial

## English

### Current snapshot 06

The [snapshot 06 manifest](2026-10-22-source-manifest-06.json), SHA-256 `d9d9cee1f4147d811b851da5868c339fc469ab7db28d6e03ed213b485ad12376`, now describes all 1,647 files under `game/`. Its [delivery receipt copy](2026-10-22-delivery-validation-06.md) records 9 additions, 20 modifications and no removals relative to the privacy-reviewed public baseline. The original receipt SHA-256 is `f0ca55214651dc858d13b98be7d47b46b0e22385407917b42da986a7d165177c`; this copy only converts eight Markdown hard-break lines to list items to pass whitespace checks.

This update adds the segmented Features guide, one combined Rebalanced viability filter (98 of 493 species), and bounded EV-cap/Kris research documentation. Experimental editor/Kris features remain outside the downloadable build; the header and icon awaiting human review are excluded. Integration checks passed: site build, 63 discovered unit tests with 9 ROM-dependent skips, and wiki JavaScript syntax. Independent delivery validation also passed 13 wiki and 7 Features browser checks. These checks do not accept a complete playable release.

The current subtree must match snapshot 06. The records below preserve the historical snapshot 04 and its publication privacy overlay; their old hashes are provenance, not the current game-file inventory.

### Historical baseline 04

Export 2026-10-22-04 stages 1,638 files under `game/`: browser patcher, generated wiki, versioned patches and authored guides. The root management scaffold is preserved. The full experimental native editor/Kris engine and unresolved artwork remain outside this import.

- [Source/export manifest](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Its `exported_files` paths are relative to `game/`.
- [Delivery validation](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. This is the technical lead's receipt; PR validation separately records checks performed on the integration branch.

Every technical file was checked against its exported hash, byte length and mode during the initial import. A later publication privacy overlay replaces a personal review assignment in the contributor guide with a generic role. The [publication overlay](publication-overlay.json) records the baseline and replacement hashes: 1,637 game files remain identical to snapshot 04 and one documentation file differs. The immutable baseline manifest and delivery receipt describe the original snapshot, not an assertion that the redacted guide is byte-identical. Source hashes and transformations remain in the manifest. Sanitized reports are derivatives, not byte-identical original runtime evidence. See [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

Snapshot 04 finalizes both generated JSON outputs after building; its manifest records two idempotent builds. Rebuilding the publication subtree must retain the original generated hashes and the documented overlay. Earlier export 03 was rejected because rebuilding changed generated guide hash references and provenance formatting.

The full initial-import whitespace check flags generated CSV CRLF and 19 existing trailing-space lines in three pinned RomPatcher.js vendor files. Their bytes are preserved. The check passes for authored content when CRLF is recognized and only the unchanged `game/web/vendor/rompatcher/` subtree is excluded; repository-wide whitespace rules are not changed.

ROMs, saves, states, raw memory dumps, archives, symlinks and Pages workflows are excluded. No release or automatic publication is configured. Privacy and redistribution rights are separate gates; a private review PR does not establish full-game or hardware acceptance.

## Español

### Instantánea actual 06

El [manifiesto de la instantánea 06](2026-10-22-source-manifest-06.json), SHA-256 `d9d9cee1f4147d811b851da5868c339fc469ab7db28d6e03ed213b485ad12376`, describe ahora los 1.647 archivos de `game/`. La [copia del recibo de entrega](2026-10-22-delivery-validation-06.md) registra 9 altas, 20 modificaciones y ninguna baja frente a la base pública revisada de privacidad. El SHA-256 del recibo original es `f0ca55214651dc858d13b98be7d47b46b0e22385407917b42da986a7d165177c`; esta copia solo convierte ocho líneas con saltos Markdown en elementos de lista para pasar la comprobación de espacios finales.

La actualización añade la guía Features segmentada, un filtro conjunto de Viabilidad rebalanceada (98 de 493 especies) y documentación de pruebas acotadas de límites EV e investigación de Kris. El editor/Kris experimental sigue fuera del build descargable; se excluyen el header y el icono pendientes de revisión humana. En integración pasan el build, 63 pruebas unitarias descubiertas con 9 omisiones que requieren ROM y la sintaxis JavaScript de la wiki. La validación independiente de entrega también pasó 13 comprobaciones de navegador wiki y 7 de Features. Estos resultados no aceptan una release jugable completa.

El subárbol actual debe coincidir con la instantánea 06. Los registros siguientes conservan el snapshot 04 histórico y su saneamiento de privacidad para publicación; sus hashes antiguos acreditan procedencia, no el inventario actual del juego.

### Base histórica 04

La exportación 2026-10-22-04 prepara 1.638 archivos bajo `game/`: patcher de navegador, wiki generada, parches por versión y guías propias. Se conserva la gestión en raíz. El motor nativo experimental completo del editor/Kris y el arte sin derechos resueltos quedan fuera.

- [Manifiesto de origen/exportación](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Las rutas de `exported_files` son relativas a `game/`.
- [Validación de entrega](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. Es el recibo del responsable técnico; la validación de la PR distingue las comprobaciones ejecutadas en la rama de integración.

Durante la importación inicial se comprobó cada archivo técnico contra su hash exportado, tamaño y modo. Un saneamiento posterior para publicación sustituye una asignación personal de revisión por un rol genérico en la guía de colaboración. El [registro de saneamiento](publication-overlay.json) conserva los hashes anterior y posterior: 1.637 archivos del juego siguen idénticos al snapshot 04 y cambia un archivo documental. El manifiesto y recibo originales describen el snapshot inmutable; no afirman que la guía saneada conserve sus bytes. Se mantienen hashes de origen y transformaciones. Los informes saneados son derivados, no evidencia runtime original byte a byte. Consulta [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

El snapshot 04 finaliza los dos JSON generados después del build; su manifiesto registra dos builds idempotentes. Recompilar el subárbol para publicación debe conservar los hashes generados originales y el saneamiento documentado. La exportación 03 se rechazó porque el build cambiaba referencias de hash de guías generadas y el formato de procedencia.

La comprobación completa del diff inicial señala CRLF en CSV generados y 19 líneas con espacios finales en tres archivos fijados de RomPatcher.js. Se conservan sus bytes. La comprobación pasa para contenido propio al reconocer CRLF y excluir únicamente el subárbol sin cambios `game/web/vendor/rompatcher/`; no se modifican las reglas globales de whitespace.

Se excluyen ROMs, partidas, estados, volcados de memoria, archivos comprimidos, enlaces simbólicos y workflows de Pages. No hay release ni publicación automática. Privacidad y derechos de redistribución son criterios separados; una PR privada no acepta todo el juego ni hardware físico.
