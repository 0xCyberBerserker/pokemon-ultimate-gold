# Initial technical import / Importación técnica inicial

## English

Export 2026-10-22-04 stages 1,638 files under `game/`: browser patcher, generated wiki, versioned patches and authored guides. The root management scaffold is preserved. The full experimental native editor/Kris engine and unresolved artwork remain outside this import.

- [Source/export manifest](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Its `exported_files` paths are relative to `game/`.
- [Delivery validation](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. This is the technical lead's receipt; PR validation separately records checks performed on the integration branch.

Every technical file was checked against its exported hash, byte length and mode during the initial import. A later publication privacy overlay replaces a personal review assignment in the contributor guide with a generic role. The [publication overlay](publication-overlay.json) records the baseline and replacement hashes: 1,637 game files remain identical to snapshot 04 and one documentation file differs. The immutable baseline manifest and delivery receipt describe the original snapshot, not an assertion that the redacted guide is byte-identical. Source hashes and transformations remain in the manifest. Sanitized reports are derivatives, not byte-identical original runtime evidence. See [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

Snapshot 04 finalizes both generated JSON outputs after building; its manifest records two idempotent builds. Rebuilding the publication subtree must retain the original generated hashes and the documented overlay. Earlier export 03 was rejected because rebuilding changed generated guide hash references and provenance formatting.

The full initial-import whitespace check flags generated CSV CRLF and 19 existing trailing-space lines in three pinned RomPatcher.js vendor files. Their bytes are preserved. The check passes for authored content when CRLF is recognized and only the unchanged `game/web/vendor/rompatcher/` subtree is excluded; repository-wide whitespace rules are not changed.

ROMs, saves, states, raw memory dumps, archives, symlinks and Pages workflows are excluded. No release or automatic publication is configured. Privacy and redistribution rights are separate gates; a private review PR does not establish full-game or hardware acceptance.

## Español

La exportación 2026-10-22-04 prepara 1.638 archivos bajo `game/`: patcher de navegador, wiki generada, parches por versión y guías propias. Se conserva la gestión en raíz. El motor nativo experimental completo del editor/Kris y el arte sin derechos resueltos quedan fuera.

- [Manifiesto de origen/exportación](2026-10-22-source-manifest.json), SHA-256 `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`. Las rutas de `exported_files` son relativas a `game/`.
- [Validación de entrega](2026-10-22-delivery-validation.md), SHA-256 `f9b31d92a51bd2fb785ecdddd498e0f6d319bbdae5fbf74a5156ad36821e0956`. Es el recibo del responsable técnico; la validación de la PR distingue las comprobaciones ejecutadas en la rama de integración.

Durante la importación inicial se comprobó cada archivo técnico contra su hash exportado, tamaño y modo. Un saneamiento posterior para publicación sustituye una asignación personal de revisión por un rol genérico en la guía de colaboración. El [registro de saneamiento](publication-overlay.json) conserva los hashes anterior y posterior: 1.637 archivos del juego siguen idénticos al snapshot 04 y cambia un archivo documental. El manifiesto y recibo originales describen el snapshot inmutable; no afirman que la guía saneada conserve sus bytes. Se mantienen hashes de origen y transformaciones. Los informes saneados son derivados, no evidencia runtime original byte a byte. Consulta [`game/EXPORT_PROVENANCE.md`](../../game/EXPORT_PROVENANCE.md).

El snapshot 04 finaliza los dos JSON generados después del build; su manifiesto registra dos builds idempotentes. Recompilar el subárbol para publicación debe conservar los hashes generados originales y el saneamiento documentado. La exportación 03 se rechazó porque el build cambiaba referencias de hash de guías generadas y el formato de procedencia.

La comprobación completa del diff inicial señala CRLF en CSV generados y 19 líneas con espacios finales en tres archivos fijados de RomPatcher.js. Se conservan sus bytes. La comprobación pasa para contenido propio al reconocer CRLF y excluir únicamente el subárbol sin cambios `game/web/vendor/rompatcher/`; no se modifican las reglas globales de whitespace.

Se excluyen ROMs, partidas, estados, volcados de memoria, archivos comprimidos, enlaces simbólicos y workflows de Pages. No hay release ni publicación automática. Privacidad y derechos de redistribución son criterios separados; una PR privada no acepta todo el juego ni hardware físico.
