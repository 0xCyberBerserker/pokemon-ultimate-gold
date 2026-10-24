(() => {
  const MANIFEST_URL = '../data/kris-gallery.json';
  const STATUS_ORDER = ['current', 'qa_partial', 'historical', 'experimental'];
  const FRIENDLY_COLLECTIONS = Object.freeze({
    'New game and naming flow, bounded historical sample.': ['Starting a new game', 'Empezar una partida nueva'],
    'Opening movie before the portrait update; historical comparison.': ['Opening movie and portrait: earlier version', 'Película inicial y retrato: versión anterior'],
    'Historical opening-movie capture with the small scene-four portrait before scale correction; title also shown.': ['Opening movie and title: earlier portrait', 'Película inicial y título: retrato anterior'],
    'Rocket disguise field diagnostic; not full costume acceptance.': ['Kris explores a Team Rocket disguise', 'Kris explora un disfraz del Team Rocket'],
    'Fishing cast diagnostic; no catch or full fishing acceptance.': ['Trying to fish', 'Probar la pesca'],
    'Bounded bicycle mount, four-direction ride, dismount and control return.': ['Cycling: mount, ride and dismount', 'Bici: subir, pedalear y bajar'],
    'First cycling attempt stopped before the bicycle menu; inconclusive.': ['First attempt to ride a bike', 'Primer intento en bicicleta'],
    'Ladder attempt stopped at the entry-height gate; inconclusive.': ['Ladder attempt before reaching the next area', 'Intento de escalera antes de llegar a la siguiente zona'],
    'Final ladder attempt stopped at the landing-map gate; inconclusive.': ['Another ladder attempt', 'Otro intento de escalera'],
    'Female field walking and running visual trace; bounded sample.': ['Kris walks and runs', 'Kris camina y corre'],
    'Observer pilot stopped on a contract gate; detection not assessed.': ['Automatic capture test stopped early', 'Prueba de captura automática detenida antes de terminar'],
    'Observer pilot with capture disabled; diagnostic only.': ['Automatic capture test without screenshots', 'Prueba de captura automática sin imágenes'],
    'Observer pilot with capture enabled; detection not assessed.': ['Automatic capture test with screenshots', 'Prueba de captura automática con imágenes'],
    'Owner-linked walking and running RAM trace; not pixel-state coverage.': ['Kris walking and running: movement trace', 'Kris camina y corre: registro del movimiento'],
    'Owner-linked observations of the remaining selector indices.': ['Movement selection states', 'Estados de selección del movimiento'],
    'Wild Chinchou appeared and fled; no capture.': ['A wild Chinchou appears and escapes', 'Aparece un Chinchou salvaje y escapa'],
    'Historical fixture entry was blocked; no HOF view was reached.': ['Entering an earlier saved game', 'Entrar en una partida guardada anterior'],
    'Bounded trainer and Hall of Fame transition through credits.': ['Trainer and Hall of Fame sequence', 'Entrenador y secuencia del Salón de la Fama'],
    'Cold-load field movement diagnostic.': ['Moving around after reopening the game', 'Moverse por el mapa tras volver a abrir la partida'],
    'Fishing cast ended with no bite; encounter gate not reached.': ['Fishing without a bite', 'Pesca sin picada'],
    'Bounded ordinary trainer throw introduction; no battle progression.': ['A trainer introduces a battle', 'Un entrenador inicia un combate'],
    'Card and Pokégear phone observations.': ['Kris’s card and Pokégear', 'Tarjeta de Kris y Pokégear'],
    'Johto map observation.': ['The Johto map', 'El mapa de Johto'],
    'Paired sign observation: Kris\'s House and Ethan\'s House.': ['Signs outside Kris and Ethan’s houses', 'Letreros de las casas de Kris y Ethan'],
    'Camera capture and one ordinary save, bounded.': ['Taking a photo and saving the game', 'Hacer una foto y guardar la partida'],
    'Cold-continue and PC viewing of the one new photo from the prior case.': ['Viewing a saved photo on the PC', 'Ver una foto guardada en el PC'],
    'Bag pocket diagnostic.': ['Exploring the Bag', 'Explorar la Bolsa'],
    'Historical bag navigation reference frames.': ['Opening and browsing the Bag', 'Abrir y recorrer la Bolsa'],
    'Historical bag navigation and return frames.': ['Returning from the Bag', 'Volver desde la Bolsa'],
    'Summary screen and ordinary-save observation.': ['Pokémon summary and saving', 'Resumen del Pokémon y guardado'],
    'Bounded normal-save and cold-load cycle.': ['Saving and reopening the game', 'Guardar y volver a abrir la partida'],
    'Nurse healing and return observation; healing persistence not tested.': ['Healing with a Nurse', 'Curarse con una Enfermera'],
    'Male field and menu sample; bounded, no save.': ['Ethan explores the map and menus', 'Ethan explora el mapa y los menús'],
    'Female field and menu sample; bounded, no save.': ['Kris explores the map and menus', 'Kris explora el mapa y los menús'],
    'Historical Surf-on-water and return captures from feature; no new execution on the later build.': ['Surfing and returning: earlier version', 'Surf y regreso: versión anterior'],
    'Historical Surf-on-water and return captures from Core 13; no new execution on the later build.': ['Surfing and returning: earlier version', 'Surf y regreso: versión anterior']
  });
  let manifestPromise;
  let renderSequence = 0;

  const copy = {
    en: {
      heading: 'Kris progress gallery',
      intro: 'There is no hand-picked highlight reel yet. This view shows all currently available incomplete test captures. Browse the complete archive for earlier and experimental images too.',
      caveat: 'This is a progress gallery, not a complete playthrough or release acceptance. Some images show earlier versions, experiments, or incomplete tests. Alpha 2 remains unchanged.',
      search: 'Search captions or scenes',
      scene: 'All scenes',
      status: 'All statuses',
      selectionOnly: 'Browse the complete archive',
      previous: 'Previous',
      next: 'Next',
      page: (current, total) => `Page ${current} of ${total}`,
      showing: (visible, total, archive) => `${visible} matching images across ${total}; full archive: ${archive}`,
      empty: 'No images match these filters.',
      missing: 'The gallery manifest could not be loaded.',
      download: 'Open original PNG',
      details: 'Capture details',
      statusLabel: {
        current: 'Current snapshot',
        historical: 'Historical',
        experimental: 'Experimental',
        qa_partial: 'Partial testing'
      },
      sceneFallback: 'Uncategorized scene',
      build: 'Build SHA-256',
      run: 'Capture references',
      capture: 'Capture SHA-256',
      provenance: 'Provenance',
      captureNote: 'Technical capture note',
      scopeNote: 'Scope note',
      originalAlt: 'Original capture description'
    },
    es: {
      heading: 'Galería de progreso de Kris',
      intro: 'Todavía no hay una selección de capturas destacadas. Esta vista muestra todas las capturas de pruebas incompletas disponibles. Explora el catálogo completo para ver también imágenes anteriores y experimentales.',
      caveat: 'Esta galería muestra progreso; no representa una partida completa ni la aceptación de la versión. Algunas imágenes muestran versiones anteriores, experimentos o pruebas incompletas. Alfa 2 sigue sin cambios.',
      search: 'Buscar pies o escenas',
      scene: 'Todas las escenas',
      status: 'Todos los estados',
      selectionOnly: 'Explorar el catálogo completo',
      previous: 'Anterior',
      next: 'Siguiente',
      page: (current, total) => `Página ${current} de ${total}`,
      showing: (visible, total, archive) => `${visible} capturas coincidentes de ${total}; catálogo completo: ${archive}`,
      empty: 'Ninguna imagen coincide con estos filtros.',
      missing: 'No se pudo cargar el índice de la galería.',
      download: 'Abrir PNG original',
      details: 'Detalles de captura',
      statusLabel: {
        current: 'Captura actual',
        historical: 'Histórica',
        experimental: 'Experimental',
        qa_partial: 'Prueba parcial'
      },
      sceneFallback: 'Escena sin clasificar',
      build: 'SHA-256 de la build',
      run: 'Referencias de captura',
      capture: 'SHA-256 de la captura',
      provenance: 'Procedencia',
      captureNote: 'Nota técnica de captura',
      scopeNote: 'Límites de la prueba',
      originalAlt: 'Descripción original de la captura'
    }
  };

  function localized(value, lang, fallback = '') {
    if (value && typeof value === 'object') return String(value[lang] ?? value.en ?? value.es ?? fallback);
    return String(value ?? fallback);
  }

  function safePngUrl(path) {
    if (typeof path !== 'string' || !path) return null;
    try {
      const url = new URL(path, document.baseURI);
      const assetRoot = new URL('../assets/kris-progress/', document.baseURI);
      return url.origin === location.origin
        && url.pathname.startsWith(assetRoot.pathname)
        && /\.png$/i.test(url.pathname)
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  function element(name, className, value) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function statusKey(rawValue) {
    const raw = String(rawValue || 'experimental').toLowerCase();
    if (['current', 'current_snapshot', 'latest'].includes(raw)) return 'current';
    if (['historical', 'superseded', 'previous'].includes(raw)) return 'historical';
    if (['qa_partial', 'partial_qa', 'partial'].includes(raw)) return 'qa_partial';
    return 'experimental';
  }

  function collectionIdsFor(item) {
    return [...new Set((Array.isArray(item.source_references) ? item.source_references : [])
      .map(reference => reference.collection_id)
      .filter(Boolean)
      .map(String))];
  }

  function collectionLabel(collection, lang, fallback) {
    const sourceCaption = localized(collection?.caption || collection?.title || collection?.name, 'en', fallback);
    const friendly = FRIENDLY_COLLECTIONS[sourceCaption];
    if (friendly) return friendly[lang === 'es' ? 1 : 0];
    return localized(collection?.caption || collection?.title || collection?.name, lang, fallback);
  }

  function statusesFor(item, collections) {
    const statuses = collectionIdsFor(item)
      .map(id => collections.get(id)?.stage)
      .filter(Boolean)
      .map(statusKey);
    if (!statuses.length) statuses.push(statusKey(item.status || item.state || item.review_status));
    return [...new Set(statuses)].sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b));
  }

  function sceneFor(item, collections, lang, t) {
    const ids = collectionIdsFor(item);
    if (!ids.length && (item.collection_id || item.scene_id)) ids.push(String(item.collection_id || item.scene_id));
    const labels = ids.map(id => {
      const collection = collections.get(id);
      return collectionLabel(collection, lang, '');
    }).filter(Boolean);
    return {
      ids,
      label: labels.length ? labels.join(lang === 'es' ? ' · ' : ' · ') : localized(item.scene, lang, t.sceneFallback)
    };
  }

  function imageCard(item, lang, t, collections) {
    const filename = item.filename || item.file || item.asset;
    const src = safePngUrl(item.src || item.path || (filename ? `../assets/kris-progress/${filename}` : ''));
    if (!src) return null;
    const scene = sceneFor(item, collections, lang, t);
    const statuses = statusesFor(item, collections);
    const figure = element('figure', 'kris-gallery-card');
    figure.dataset.scene = scene.ids.join(' ');
    figure.dataset.status = statuses.join(' ');

    const link = element('a', 'kris-gallery-card__image');
    link.href = src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', `${t.download}: ${scene.label}`);
    const image = document.createElement('img');
    image.src = src;
    image.alt = `${lang === 'es' ? 'Captura del juego: ' : 'Game screenshot: '}${scene.label}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    link.append(image);
    figure.append(link);

    const caption = element('figcaption', 'kris-gallery-card__caption');
    caption.append(element('strong', '', scene.label));
    for (const status of statuses) {
      caption.append(element('span', `kris-gallery-status kris-gallery-status--${status}`, t.statusLabel[status]));
    }
    const download = element('a', 'kris-gallery-download', t.download);
    download.href = src;
    download.download = String(filename || item.id || 'kris-capture.png');
    caption.append(download);
    figure.append(caption);

    const details = element('details', 'kris-gallery-card__details');
    details.append(element('summary', '', t.details));
    const list = element('dl', 'kris-gallery-metadata');
    const refs = Array.isArray(item.source_references) ? item.source_references : [];
    const builds = [...new Set([...(item.build_sha256s || []), ...refs.map(reference => reference.build_sha256)].filter(Boolean))];
    const referenceSummary = refs.map(reference => {
      const collection = collections.get(String(reference.collection_id));
      const sceneName = localized(collection?.caption || collection?.title, lang, reference.collection_id || '');
      const run = reference.run_id ? `${lang === 'es' ? 'ejecución' : 'run'} ${reference.run_id}` : '';
      const frame = reference.frame_index_from_filename ?? reference.frame_number_basis;
      const frameLabel = frame !== undefined && frame !== null ? `${lang === 'es' ? 'fotograma' : 'frame'} ${frame}` : '';
      return [sceneName, run, frameLabel].filter(Boolean).join(' · ');
    }).filter(Boolean);
    const fields = [
      [t.captureNote, localized(item.caption, lang, '')],
      [t.originalAlt, localized(item.alt, lang, '')],
      [t.scopeNote, [...new Set(collectionIdsFor(item).map(id => localized(collections.get(id)?.status_note, lang, '')).filter(Boolean))].join(' · ')],
      [t.build, builds.join(', ')],
      [t.run, refs.length ? `${refs.length} ${lang === 'es' ? 'referencias de captura' : 'capture references'}` : ''],
      [t.capture, item.sha256],
      [t.provenance, localized(item.permissions?.credit, lang, '')],
      [lang === 'es' ? 'Escenas de origen' : 'Source scenes', referenceSummary.join('; ')]
    ];
    for (const [label, value] of fields) {
      if (!value) continue;
      list.append(element('dt', '', label), element('dd', '', String(value)));
    }
    if (list.childElementCount) details.append(list);
    figure.append(details);
    return figure;
  }

  async function loadManifest() {
    manifestPromise ||= fetch(MANIFEST_URL).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
    return manifestPromise;
  }

  async function mount(container, lang) {
    const sequence = ++renderSequence;
    const language = lang === 'es' ? 'es' : 'en';
    const t = copy[language];
    container.replaceChildren();
    const page = element('section', 'kris-gallery');
    page.append(element('p', 'eyebrow', 'ULTIMATE GOLD · KRIS'));
    page.append(element('h1', '', t.heading));
    page.append(element('p', 'kris-gallery-intro', t.intro));
    page.append(element('p', 'notice kris-gallery-notice', t.caveat));
    container.append(page);

    let manifest;
    try {
      manifest = await loadManifest();
    } catch {
      if (sequence === renderSequence) page.append(element('p', 'notice', t.missing));
      return;
    }
    if (sequence !== renderSequence || !container.isConnected) return;

    const items = Array.isArray(manifest.images) ? manifest.images : (Array.isArray(manifest.items) ? manifest.items : []);
    const collectionRows = Array.isArray(manifest.collections)
      ? manifest.collections
      : Object.entries(manifest.collections || {}).map(([id, value]) => ({ id, ...value }));
    const collections = new Map(collectionRows.map(row => [String(row.id), row]));
    const selection = manifest.editorial_selection || {};
    const selectionRows = Array.isArray(selection) ? selection : (selection.images || selection.items || []);
    const selectedIds = new Set(selectionRows.flatMap(row => typeof row === 'string' ? [row] : [row.id, row.image_id, row.filename, row.file, row.sha256, row.collection_id].filter(Boolean)).map(String));
    const explicitSelection = items.filter(item => item.editorial_selected === true || [item.id, item.filename, item.file, item.sha256, ...collectionIdsFor(item)].some(value => value && selectedIds.has(String(value))));
    const selectedItems = explicitSelection.length
      ? explicitSelection
      : items.filter(item => statusesFor(item, collections).includes('qa_partial'));
    const scenes = new Map();
    for (const [id, collection] of collections) {
      scenes.set(id, collectionLabel(collection, language, t.sceneFallback));
    }

    const filters = element('div', 'kris-gallery-filters');
    const searchLabel = element('label', 'kris-gallery-search');
    searchLabel.append(element('span', '', t.search));
    const search = element('input');
    search.type = 'search';
    search.autocomplete = 'off';
    searchLabel.append(search);
    const sceneSelect = element('select');
    sceneSelect.setAttribute('aria-label', t.scene);
    sceneSelect.append(new Option(t.scene, ''));
    for (const [id, label] of scenes) sceneSelect.append(new Option(label, id));
    const statusSelect = element('select');
    statusSelect.setAttribute('aria-label', t.status);
    statusSelect.append(new Option(t.status, ''));
    for (const status of STATUS_ORDER) {
      if (items.some(item => statusesFor(item, collections).includes(status))) statusSelect.append(new Option(t.statusLabel[status], status));
    }
    filters.append(searchLabel, sceneSelect, statusSelect);
    page.append(filters);

    const selectionToggleLabel = element('label', 'kris-gallery-selection-toggle');
    const selectionToggle = element('input');
    selectionToggle.type = 'checkbox';
    selectionToggle.checked = false;
    selectionToggleLabel.append(selectionToggle, element('span', '', t.selectionOnly));
    page.append(selectionToggleLabel);

    const statusLine = element('p', 'kris-gallery-count', t.showing(0, 0));
    statusLine.setAttribute('role', 'status');
    const grid = element('div', 'kris-gallery-grid');
    const empty = element('p', 'notice kris-gallery-empty', t.empty);
    empty.hidden = true;
    const pager = element('nav', 'kris-gallery-pager');
    pager.setAttribute('aria-label', language === 'es' ? 'Páginas de capturas' : 'Capture pages');
    const previous = element('button', '', t.previous);
    previous.type = 'button';
    const pageLabel = element('span', '', '');
    const next = element('button', '', t.next);
    next.type = 'button';
    pager.append(previous, pageLabel, next);
    page.append(statusLine, grid, empty, pager);

    const pageSize = 48;
    let pageNumber = 0;
    const applyFilters = () => {
      const query = search.value.trim().toLocaleLowerCase(language);
      const source = selectionToggle.checked || !selectedItems.length ? items : selectedItems;
      const matches = source.filter(item => {
        const scene = sceneFor(item, collections, language, t);
        const caption = localized(item.caption, language, scene.label).toLocaleLowerCase(language);
        return (!sceneSelect.value || scene.ids.includes(sceneSelect.value))
          && (!statusSelect.value || statusesFor(item, collections).includes(statusSelect.value))
          && (!query || `${caption} ${scene.label.toLocaleLowerCase(language)}`.includes(query));
      });
      const pages = Math.max(1, Math.ceil(matches.length / pageSize));
      pageNumber = Math.min(pageNumber, pages - 1);
      const start = pageNumber * pageSize;
      const cards = matches.slice(start, start + pageSize).map(item => imageCard(item, language, t, collections)).filter(Boolean);
      grid.replaceChildren(...cards);
      statusLine.textContent = t.showing(matches.length, source.length, items.length);
      empty.hidden = matches.length !== 0;
      pager.hidden = matches.length <= pageSize;
      previous.disabled = pageNumber === 0;
      next.disabled = pageNumber >= pages - 1;
      pageLabel.textContent = t.page(pageNumber + 1, pages);
    };
    search.addEventListener('input', applyFilters);
    sceneSelect.addEventListener('change', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    selectionToggle.addEventListener('change', () => { pageNumber = 0; applyFilters(); });
    previous.addEventListener('click', () => { pageNumber--; applyFilters(); });
    next.addEventListener('click', () => { pageNumber++; applyFilters(); });
    applyFilters();
  }

  window.KrisProgress = Object.freeze({ mount });
})();
