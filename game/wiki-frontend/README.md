# Ultimate Gold Wiki — React frontend

## English

This React frontend is used by the published wiki. The generated game data and existing patcher remain the reference; changes require review and the relevant checks before deployment.

### Local use

Node.js 26 and pnpm 12 were used. From `game/`, start the existing site on loopback:

```sh
python3 -m http.server 8767 --bind 127.0.0.1 --directory web
```

In another terminal, from `game/wiki-frontend/`:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev --port 5173 --strictPort
pnpm test
pnpm build
pnpm check:production
```

Vite proxies the shared data, sprites, assets, credits, legacy wiki pages and `/patcher-source` to that site server. The preview reads the existing generated JSON and sprites; the production output goes to `dist/`, not `game/web/`. Kris progress and the cheat catalog use React views over their existing datasets; browser checks cover representative interactions. The lockfile was checked with `pnpm audit`; a clean report does not guarantee a dependency is safe.

`check:production` rebuilds the preview and serves it with the existing shared site files under a simulated Pages project subdirectory on loopback. After an opt-in site build, `PUG_INTEGRATED=1 node --test checks/production-http.test.mjs` checks the actual generated `web/` output against `dist/`. Neither check runs a browser or executes the patcher.

For authorized local browser QA, build first and run `PUG_CHROMIUM=/path/to/chromium python checks/browser-smoke.py` with Python Playwright already installed. Omit `PUG_CHROMIUM` to use Playwright's configured Chromium. The script uses loopback and blocks other network requests. Set `PUG_INTEGRATED=1` to test a previously generated `web/` instead of `dist/`. `python checks/patcher-roundtrip.py /path/to/clean.nds /path/to/chromium --version alpha2` additionally tests a real local patch after checking the manifest source hash; it deletes its temporary output. Use `--version alpha1` for the other build.

`PUG_CHROMIUM=/path/to/chromium python checks/guide-parity.py` opens every guide in both languages and compares its source text with the rendered page. This is a content-preservation check, not a visual or factual review.

The existing generator also accepts an explicit local preview option, from `game/`: `python3 tools/build_site.py --react-dist wiki-frontend/dist`. It regenerates `web/` before installing the prebuilt React index and hashed assets; run it only in a clean, disposable checkout after protecting local changes. It rejects a modified wiki index, conflicting asset names, missing assets and a relaxed entry-point CSP. A `.react-build.json` receipt records the generated index hash so a later build can update it without accepting unrecorded edits; old hashed assets are retained. Without this option it retains the original wiki. The Pages workflow builds this output when manually dispatched from the default branch.

### Contracts and status

- Existing routes use `#/…`. The preview includes the home page, trainers, Pokédex, evolutions, moves, abilities, items, machines, guides, FAQ, mechanics, Kris progress, cheats and the embedded patcher. Full backwards compatibility remains to be verified.
- `game/docs/wiki-data.json` is enriched by `game/tools/build_site.py` into `game/web/data/wiki-data.json`, including guides and other derived references. Never run the generator over another checkout with unprotected changes. This preview does not generate or alter data.
- The team view uses `levels_by_mode` and `move_ids_by_mode`. IVs are calculated from trainer records and EVs use native creation defaults; unknown values are displayed as unavailable. Species abilities are explicitly labelled as possible, not as the individual Pokémon's confirmed ability. Nonzero form codes are shown with a base-species sprite caveat.
- The wiki data is pinned to the Alpha 2 manifest, independently of the patcher's default and the Normal/Plus mode. It is not verified against the newer Kris candidate.
- The preview embeds the existing patcher using an iframe and same-origin `patcher-ready`, `patcher-height` and `wiki-language` messages. Local Chromium roundtrips for Alpha 1 and Alpha 2 produced the manifest hashes from a matching user-provided input; see `PARITY.md` for scope. Its scripts, workers, manifests and hashes must remain untouched.
- The guide offers light and dark themes, stage navigation and branching evolution families. A selected trainer outside the current filters remains visible with an explicit notice. The patcher offers a separate-page fallback if the embedded view is unavailable.
- Visual palette: use light cream for broad light-theme surfaces and neutral charcoal in dark mode. Reserve gold for accents and small selected controls, not page or panel backgrounds.
- Route artwork is pending: commission a distinct decorative illustration for each location through ChatGPT. Do not reuse the generic Ho-Oh banner as a map or as evidence of an in-game location.
- Full data parity, search coverage and accessibility verification remain incomplete. Do not claim complete functional parity or acceptance.
- The current wiki CSP restricts scripts and styles to `self`; any integration must retain its protections and avoid inline script/style requirements.

## Español

Este frontend React se usa en la wiki publicada. Los datos generados del juego y el parcheador existente siguen siendo la referencia; los cambios requieren revisión y las comprobaciones pertinentes antes de desplegar.

### Uso local

Se han usado Node.js 26 y pnpm 12. Desde `game/`, inicia el servidor existente en loopback:

```sh
python3 -m http.server 8767 --bind 127.0.0.1 --directory web
```

En otra terminal, desde `game/wiki-frontend/`:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev --port 5173 --strictPort
pnpm test
pnpm build
pnpm check:production
```

Vite redirige los datos, sprites, recursos, créditos, páginas antiguas y `/patcher-source` al servidor local. La vista consume el JSON generado y los sprites existentes; la salida de producción va a `dist/`, no a `game/web/`. El progreso de Kris y el catálogo de trucos usan vistas React sobre sus datos existentes; se han comprobado interacciones representativas en navegador. Se ha comprobado el lockfile con `pnpm audit`; un informe limpio no garantiza que una dependencia sea segura.

`check:production` recompila la vista y la sirve con los archivos compartidos del sitio bajo un subdirectorio de Pages simulado en loopback. Tras generar el sitio con la opción React, `PUG_INTEGRATED=1 node --test checks/production-http.test.mjs` comprueba el `web/` generado real frente a `dist/`. Ninguna de estas pruebas ejecuta un navegador ni el parcheador.

Para QA local autorizado en navegador, compila primero y ejecuta `PUG_CHROMIUM=/ruta/a/chromium python checks/browser-smoke.py` con Playwright para Python ya instalado. Omite `PUG_CHROMIUM` para usar el Chromium configurado en Playwright. El script usa loopback y bloquea las demás peticiones de red. Usa `PUG_INTEGRATED=1` para probar un `web/` ya generado en lugar de `dist/`. `python checks/patcher-roundtrip.py /ruta/al/original.nds /ruta/a/chromium --version alpha2` prueba además un parche local real tras comprobar el hash de entrada del manifiesto; elimina su salida temporal. Usa `--version alpha1` para la otra versión.

`PUG_CHROMIUM=/ruta/a/chromium python checks/guide-parity.py` abre cada guía en ambos idiomas y compara el texto de origen con la página renderizada. Comprueba la conservación del contenido, no su presentación visual ni la veracidad de cada afirmación.

El generador existente también admite una opción explícita de vista local, desde `game/`: `python3 tools/build_site.py --react-dist wiki-frontend/dist`. Regenera `web/` antes de instalar el índice React compilado y sus recursos versionados; ejecútala solo en una copia limpia y desechable, tras proteger los cambios locales. Rechaza índices de wiki modificados, nombres de recursos en conflicto, recursos ausentes y una CSP relajada en el punto de entrada. Un recibo `.react-build.json` registra el hash del índice generado para que una compilación posterior pueda actualizarlo sin aceptar ediciones no registradas; se conservan los recursos versionados anteriores. Sin esta opción mantiene la wiki original. El workflow de Pages compila esta salida cuando se activa manualmente desde la rama predeterminada.

### Contratos y estado

- Las rutas existentes usan `#/…`. La vista incluye inicio, entrenadores, Pokédex, evoluciones, movimientos, habilidades, objetos, máquinas, guías, FAQ, mecánicas, progreso de Kris, trucos y el parcheador integrado. La compatibilidad completa queda pendiente de comprobación.
- `game/tools/build_site.py` enriquece `game/docs/wiki-data.json` y genera `game/web/data/wiki-data.json`, incluidas guías y otras referencias derivadas. No ejecutes el generador sobre otro checkout con cambios sin proteger. Esta vista no genera ni altera los datos.
- La ficha del equipo usa `levels_by_mode` y `move_ids_by_mode`. Los IV se calculan a partir de registros de entrenador y los EV proceden de los valores de creación nativa; los valores desconocidos se muestran como no disponibles. Las habilidades de especie se indican como posibles, no como habilidad individual confirmada. Los códigos de forma distintos de cero se muestran con una aclaración sobre el sprite de la especie base.
- Los datos de la wiki se fijan al manifiesto de Alfa 2, independientemente de la versión predeterminada del parcheador y del modo Normal/Plus. No están verificados contra la candidata más reciente con Kris.
- La vista integra el parcheador existente mediante un iframe y mensajes del mismo origen `patcher-ready`, `patcher-height` y `wiki-language`. Pruebas locales en Chromium generaron Alfa 1 y Alfa 2 con los hashes del manifiesto desde un original aportado por el usuario que coincide con el hash requerido; consulta `PARITY.md` para el alcance. Sus scripts, workers, manifiestos y hashes deben permanecer intactos.
- La guía ofrece temas claro y oscuro, navegación por etapas y familias de evolución ramificadas. Si el entrenador seleccionado queda fuera de los filtros, permanece visible con un aviso explícito. El parcheador ofrece una página independiente si la vista integrada no está disponible.
- Paleta visual: usa crema claro en las superficies amplias del tema claro y gris carbón neutro en modo oscuro. Reserva el dorado para acentos y pequeños controles seleccionados, no para fondos de página o paneles.
- El arte de rutas está pendiente: encargar a ChatGPT una ilustración decorativa distinta para cada lugar. No reutilizar la cabecera genérica de Ho-Oh como mapa ni como evidencia de ubicaciones del juego.
- Quedan pendientes la equivalencia de datos completa, la cobertura de búsqueda y la comprobación de accesibilidad. No se puede afirmar equivalencia funcional completa ni aceptación.
- La CSP actual restringe scripts y estilos a `self`; la integración debe conservar sus protecciones y evitar requisitos de script o estilos inline.
