# Collaboration delivery 04 / Entrega de colaboración 04

## English

Snapshot: `ultimate-gold-collaboration-20261022-04/game/`, for import under the management repository's `game/` directory. Repository-root scaffolding and workflows are separate deliverables. Private PR only; no merge, visibility change, or deployment is authorized by this receipt.

- Manifest SHA-256: `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`.
- Independent verification: all 1,638 final files match manifest hashes, sizes, and modes; no missing entries, forbidden ROM/save/archive files, or personal filesystem paths detected, including decoded JSON strings.
- Exactly two files differ from snapshot 03: `web/data/wiki-data.json` and `web/vendor/provenance.json`. Every delivered file is byte-identical to the previously built validation-03 tree, on which 57 ROM-backed tests and 12 hidden-browser checks passed. This reuses those checks; they were not rerun against a different game implementation.
- Exporter V4's 10 regression tests independently passed. Its manifest records two copied site builds with identical final inventories. The importer must independently rebuild and check byte identity before committing.
- Exporter SHA-256: `d02e9c790c92ffa2314ea486534946ad76b19e43d694d38681219b3af26132c4`. Test source SHA-256: `9ac69108a99da04469b0e5e8fb430ace0a7ff729e3cf2cdd39ad411222f79155`.

Kris artwork remains excluded. Native gameplay verification remains bounded to documented cases; this delivery does not establish full-game or release acceptance. Earlier exports and receipts remain historical and must not be substituted for this snapshot.

## Español

Snapshot: `ultimate-gold-collaboration-20261022-04/game/`, para importar bajo `game/` en el repositorio de gestión. La estructura raíz y los workflows se entregan por separado. Solo PR privada; este recibo no autoriza merge, cambio de visibilidad ni despliegue.

- SHA-256 del manifiesto: `0bdfd94361807d657c697089684b98f186640506ed966ac6289665a0cfb19915`.
- Verificación independiente: los 1.638 archivos finales coinciden en hash, tamaño y permisos; sin entradas ausentes, ROM, partidas, archivos comprimidos ni rutas personales detectadas, incluidas cadenas JSON decodificadas.
- Solo cambian dos archivos respecto al snapshot 03: `web/data/wiki-data.json` y `web/vendor/provenance.json`. Todos los archivos entregados son idénticos a la copia validation-03 ya compilada, donde pasaron 57 pruebas con ROM y 12 comprobaciones de navegador oculto. Se reutiliza esa evidencia; no se repitieron pruebas sobre otra implementación.
- Las 10 pruebas del exportador V4 pasan en revisión independiente. Su manifiesto registra dos compilaciones de la copia con inventario final idéntico. El integrador debe recompilar y verificar identidad de bytes antes del commit.
- Los hashes del exportador y sus pruebas figuran arriba y corresponden a los archivos verificados.

El arte de Kris sigue excluido. La QA nativa está limitada a los casos documentados; esta entrega no acredita toda la aventura ni una release. Las exportaciones y recibos anteriores se conservan como históricos y no deben sustituir este snapshot.
