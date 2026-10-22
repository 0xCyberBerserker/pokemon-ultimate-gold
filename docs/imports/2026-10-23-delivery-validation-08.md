# Collaboration delivery 08

## English

Owner: Dev. Status: prepared for independent export review; not an editor release. Snapshot: `ultimate-gold-collaboration-20261023-08`.

- Manifest SHA-256: `5ec6ff0fdfcd8bf56f84fd651953f45d0cbc4eb11eeac62115eeae278e23e2ba`.
- Stable source fingerprint: `5a90b265c262764c39fe7c397403d82d8b3fc81273e6bce88183a76dc4e79bef`; 1651 included source files, 1652 exported files, 5 excluded entries, 137 hash references rebased.
- Exporter V4 SHA-256: `d02e9c790c92ffa2314ea486534946ad76b19e43d694d38681219b3af26132c4`. Two copied-site builds passed and were idempotent; final inventory SHA-256 `40570d0867fafb9343f3ffee448c99f1fec9193634b938957e1dd7c123e59103`.
- Relative to export07: no added or removed files; four content files changed, plus the two HTML cache references already integrated by PR18. Relative to public main `02638754b4b3254244a6761dc6a6dffc1fc06800`, expect only the four content files. Preserve repository-root management documents and existing import records.
- Validation copy: `frontend-export08-validation`. `python3 -m unittest discover -s tests -p test_web.py -v`: 16 total, 15 passed, one skipped because external ROM/Node was not configured for that test. No new browser behavior or patch payload is introduced. Browser rendering remains a separate publication check.

### Content and acceptance

The Nature guide and editor status now record the exact-build Chikorita/Adamant native apply, save and cold-start case, with equivalent beginner summaries in English and Spanish. The editor remains separate from downloadable Alpha 2. The roadmap records the bounded result, not complete gameplay acceptance.

| Changed content | Export SHA-256 |
| --- | --- |
| `game/docs/qa-editor-current-status.md` | `7b7173e9777cb8164618c6ca6ee67b84a6ba24943561e2cf2d98602c7369c974` |
| `game/docs/qa-nature-integrated-reset-review.md` | `cfc16360987b004d9545801a493d72783d67fff4b21c48e4716d2a5f583082b2` |
| `game/roadmap.md` | `9718aabd46072564ea9a5f44b3d2382e205596ccda6c56a8e454cc8246593bd6` |
| `game/web/data/wiki-data.json` | `92b84f9b81852e2e2a1144983d81f6c959c684fcae381423a077c9b661cf18d4` |

Native evidence is pinned in the guide: auditor `20c7272cf5e97acba2f9d59230b8694a82d642f42d97e03addee8a328691ab6c`, acceptance JSON `c9acfba59d3da552cbc5043148825c065bb3858ddd9f3b8cd06542755e540226`, independent review `0b132f93eaac9280d3cb0660a67e548c8442394362cce0fa319edff2e35915f8`. The review reproduced the report in read-only mode. It does not prove battle, PC, physical-device or complete adventure acceptance. No new ROM, patch or save is delivered.

## Español

Responsable: Dev. Estado: preparado para revisión independiente del export; no es una publicación del editor. Snapshot: `ultimate-gold-collaboration-20261023-08`. Los hashes, el inventario y los archivos anteriores son comunes a ambos idiomas.

- El origen permaneció estable; el exportador saneó las rutas y reajustó 137 referencias hash. Las dos compilaciones de la copia fueron idempotentes.
- Frente al export07 no hay altas ni bajas: cambian cuatro archivos de contenido y las dos referencias de caché HTML ya integradas en PR18. Frente a main `02638754b4b3254244a6761dc6a6dffc1fc06800`, se esperan únicamente los cuatro archivos de contenido. Conservar los documentos de gestión de la raíz y el registro de importaciones.
- En una copia de validación: 16 pruebas, 15 correctas y una omitida porque la prueba no tenía configurados ROM/Node externos. El contenido no introduce comportamiento nuevo del navegador ni otro parche. El renderizado publicado requiere su propia comprobación.
- La guía de naturalezas y el estado del editor explican el caso nativo de Chikorita/Adamant, guardado y arranque en frío. Incluyen un resumen para principiantes en ambos idiomas. El editor sigue separado de Alfa 2 descargable.
- El caso tiene revisión independiente y aceptación acotada. No demuestra combates, PC, dispositivos físicos ni toda la aventura. No se entrega ninguna ROM, partida ni parche nuevo.
