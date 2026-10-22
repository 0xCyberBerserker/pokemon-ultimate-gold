# Cache-reference follow-up

## English

Snapshot 07 remains immutable. After publication at `bbeca7453565f1caf206a59304365fd78d92acae`, a persistent browser still rendered the previous homepage while a clean browser loaded the approved header. Asset URLs reused the earlier version query. This follow-up changes only the version queries of `wiki-home.js`, `wiki-app.js` and `wiki-style.css` to `20261022export07`, in the source template and matching generated index.

Both `game/web/wiki-template.html` and `game/web/wiki/index.html` change from SHA-256 `3803f45dc1159a5661d397fe9e8325fc2aa850a85d6909f7d7dafeaba675738c` to `35fcb41a51861ef6a279a25eaa1cee52da69cc9ca0906778b9ae25d97d47d25b`. No script, stylesheet, data, artwork or downloadable patch bytes change. Preserve the snapshot 07 manifest and record this two-file overlay separately. Targeted web unit discovery passed 15 cases with one expected skip; verify the deployed references and persistent-browser rendering after publication.

## Español

La instantánea 07 permanece intacta. Tras publicarla, un navegador persistente seguía mostrando la portada anterior mientras uno limpio cargaba la cabecera aprobada. Se reutilizaban las consultas de versión antiguas. Este ajuste cambia únicamente las versiones de las tres referencias indicadas, tanto en la plantilla como en el índice generado.

Los dos archivos conservan los hashes de origen y destino fijados arriba. No cambian los bytes de scripts, estilos, datos, imágenes ni parches. El manifiesto 07 debe conservarse como histórico y este ajuste registrarse por separado. Las unitarias web ejecutaron 15 casos y omitieron uno por requisitos externos. Falta comprobar las referencias y la portada en navegador persistente tras el despliegue.
