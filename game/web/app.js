const params = new URLSearchParams(location.search);
const embedded = params.get('embedded') === 'wiki';
const standalone = params.get('standalone') === '1';
if (embedded) {
  document.documentElement.classList.add('patcher-embedded');
} else if (!standalone) {
  const wikiUrl = new URL('./wiki/', document.baseURI);
  wikiUrl.hash = location.hash;
  location.replace(wikiUrl.href);
}

const SOURCE_SHA256 = '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105';
const SOURCE_SIZE = 134217728;
const CATALOG_URL = new URL('./data/patch-catalog.json', document.baseURI);
const text = {
  en: {
    eyebrow:'ULTIMATE GOLD / LOCAL PATCHER', title:'Ultimate Gold local patcher',
    description:'Patch locally using your own clean Pokémon HeartGold (USA) ROM. This site does not provide ROM files.',
    source:'Your clean Pokémon HeartGold (USA) ROM', size:'Expected size: 128 MiB', choose:'Choose a clean .nds first.',
    apply:'Apply patch', ready:'Ready.', hash:'SHA-256', working:'Patching locally…',
    done:'Patch complete. Download the output.', download:'Download patched .nds', wiki:'Wiki', licenses:'Licenses',
    cheat:'Download TM99 cheat (.cht)', badSize:'The selected ROM has the wrong size.',
    badSource:'The selected ROM does not match the required clean SHA-256.',
    badPatch:'Patch asset is incomplete or its SHA-256 does not match.',
    badOutput:'Output SHA-256 mismatch.', failed:'The patch could not be completed. Check the clean ROM and patch files.',
    expectedSize:'Expected size:', requiredSha:'Required SHA-256:', validatingSource:'Validating source…',
    fetchingDelta:'Loading patch asset…', applying:'Applying patch locally…', validatingOutput:'Validating output…',
    loadingCatalog:'Loading available builds…', catalogFailed:'Build catalog could not be loaded.',
    loadingManifest:'Loading selected build…', manifestFailed:'Selected build manifest is invalid or unavailable.',
    versionLabel:'Build version', versionLanguage:'Language',
    privacy:'Patching runs in this browser; the selected ROM is not uploaded and no account is needed.',
    sourceNote:'Required input: a clean 128 MiB dump with SHA-256 65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105. We recommend making your own dump from an original cartridge you own where local law permits.',
    disclaimer:'Unofficial fan-made project, not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and related rights belong to their respective owners. This is not legal advice or a guarantee about ROM-dump legality; check local rules.',
    cheatNote:'Optional TM99 emulator profile', tmNote:'Native TM Refill: receive it from the New Bark pedestrian and use it from Key Items. No cheat required.',
    tmNoteAlpha2:'Native TM Refill: the Rocket kit giver in New Bark Town offers it. Use it from Key Items; it needs no emulator cheat.',
    buildNote:'Alpha 2 is the latest experimental build with bounded QA; full-story testing is pending. Alpha 1 remains available. EV/IV editing and Kris are not included.',
    step1:'Choose clean ROM', step2:'Verify and patch locally', step3:'Download output',
    ariaSteps:'Patch steps', ariaLanguage:'Language', ariaVersion:'Build version'
  },
  es: {
    eyebrow:'ULTIMATE GOLD / PARCHEADOR LOCAL', title:'Parcheador local de Ultimate Gold',
    description:'Aplica el parche local con tu propia ROM limpia de Pokémon HeartGold (USA). Esta web no proporciona ROMs.',
    source:'Tu ROM limpia de Pokémon HeartGold (USA)', size:'Tamaño esperado: 128 MiB', choose:'Elige primero un .nds limpio.',
    apply:'Aplicar parche', ready:'Listo.', hash:'SHA-256', working:'Aplicando localmente…',
    done:'Parche completado. Descarga la salida.', download:'Descargar .nds parcheado', wiki:'Wiki', licenses:'Licencias',
    cheat:'Descargar código MT99 (.cht)', badSize:'La ROM seleccionada tiene un tamaño incorrecto.',
    badSource:'La ROM seleccionada no coincide con el SHA-256 limpio requerido.',
    badPatch:'El parche está incompleto o su SHA-256 no coincide.', badOutput:'El SHA-256 de la salida no coincide.',
    failed:'No se pudo completar el parche. Comprueba la ROM limpia y el archivo del parche.',
    expectedSize:'Tamaño esperado:', requiredSha:'SHA-256 requerido:', validatingSource:'Validando la fuente…',
    fetchingDelta:'Cargando el parche…', applying:'Aplicando el parche localmente…', validatingOutput:'Validando la salida…',
    loadingCatalog:'Cargando versiones disponibles…', catalogFailed:'No se pudo cargar el catálogo de versiones.',
    loadingManifest:'Cargando la versión seleccionada…', manifestFailed:'El manifiesto seleccionado no es válido o no está disponible.',
    versionLabel:'Versión del build', versionLanguage:'Idioma',
    privacy:'El parche se aplica en este navegador; no se sube la ROM seleccionada ni necesitas una cuenta.',
    sourceNote:'Entrada requerida: volcado limpio de 128 MiB con SHA-256 65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105. Recomendamos crear tu propio volcado desde un cartucho original que tengas cuando la legislación local lo permita.',
    disclaimer:'Proyecto fan no oficial, sin afiliación ni respaldo de Nintendo, Game Freak o The Pokémon Company. Pokémon y los derechos relacionados pertenecen a sus titulares. No es asesoramiento legal ni una garantía sobre la legalidad del volcado; consulta las normas locales.',
    cheatNote:'Perfil MT99 opcional del emulador', tmNote:'Recarga MT nativa: recíbela del transeúnte de Pueblo Primavera y úsala desde Objetos Clave. No necesita códigos.',
    tmNoteAlpha2:'TM Refill (Recarga MT): el NPC del kit Rocket en New Bark Town (Pueblo Primavera) lo ofrece. Úsalo desde Objetos Clave; no necesita códigos.',
    buildNote:'Alfa 2 es la última versión experimental con QA acotado; falta probar la historia completa. Alfa 1 sigue disponible. No incluye editor EV/IV ni Kris.',
    step1:'Elige una ROM limpia', step2:'Verifica y aplica localmente', step3:'Descarga la salida',
    ariaSteps:'Pasos del parche', ariaLanguage:'Idioma', ariaVersion:'Versión del build'
  }
};

const $ = (id) => document.getElementById(id);
const requestedLanguage = params.get('lang');
let language = requestedLanguage === 'en' || requestedLanguage === 'es' ? requestedLanguage : (localStorage.getItem('sgp-language') === 'es' ? 'es' : 'en');
let catalog = null;
let currentManifest = null;
let currentManifestUrl = null;
let outputUrl = '';
let statusState = { key:'loadingCatalog', kind:'', detail:'' };

async function sha256(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function setStatusCode(key, kind = '', detail = '') {
  statusState = {key, kind, detail};
  const t = text[language];
  const suffix = detail ? (key === 'badSize' ? ` ${t.expectedSize} ${detail} bytes.` :
    (key === 'badSource' || key === 'badPatch' || key === 'badOutput' ? ` ${t.requiredSha} ${detail}` : ` ${detail}`)) : '';
  $('status').textContent = `${t[key] || t.failed}${suffix}`;
  $('status').className = kind;
}

function translate() {
  language = $('language').value;
  localStorage.setItem('sgp-language', language);
  document.documentElement.lang = language;
  const t = text[language];
  $('eyebrow').textContent = t.eyebrow;
  $('title').textContent = t.title;
  $('description').textContent = t.description;
  $('source-label').textContent = t.source;
  $('size-note').textContent = t.size;
  $('hash-label').textContent = t.hash;
  $('apply').textContent = t.apply;
  $('wiki-link').textContent = t.wiki;
  $('license-link').textContent = t.licenses;
  $('cheat-link').textContent = t.cheat;
  $('step1').textContent = t.step1;
  $('step2').textContent = t.step2;
  $('step3').textContent = t.step3;
  $('steps').setAttribute('aria-label', t.ariaSteps);
  $('version-label').textContent = t.versionLabel;
  $('version').setAttribute('aria-label', t.ariaVersion);
  $('language').setAttribute('aria-label', t.ariaLanguage);
  refreshVersionLabels();
  translateNotes();
  if (statusState.key) setStatusCode(statusState.key, statusState.kind, statusState.detail);
}

function refreshVersionLabels() {
  if (!catalog) return;
  for (const option of $('version').options) {
    const entry = catalog.versions[option.value];
    if (entry) option.textContent = entry.label[language];
  }
  const entry = catalog.versions[$('version').value];
  if (entry) $('version-note').textContent = entry.note[language];
}

function translateNotes() {
  const t = text[language];
  $('privacy').textContent = t.privacy;
  $('tmNote').textContent = $('version').value === 'alpha2' ? t.tmNoteAlpha2 : t.tmNote;
  $('buildNote').textContent = t.buildNote;
  $('source-note').textContent = t.sourceNote;
  $('disclaimer').textContent = t.disclaimer;
  if (!$('download').hidden) $('download').textContent = t.download;
}

function clearOutput() {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  outputUrl = '';
  $('download').hidden = true;
  $('download').removeAttribute('href');
}

async function readManifest(version) {
  const entry = catalog?.versions?.[version];
  if (!entry || typeof entry.manifest !== 'string') throw new Error('manifest');
  const manifestUrl = new URL(entry.manifest, CATALOG_URL);
  const dataRoot = new URL('./data/', document.baseURI);
  if (manifestUrl.origin !== location.origin || !manifestUrl.pathname.startsWith(dataRoot.pathname)) throw new Error('manifest');
  const response = await fetch(manifestUrl, {cache:'no-store'});
  if (!response.ok) throw new Error('manifest');
  const manifest = await response.json();
  if (manifest.source?.sha256 !== SOURCE_SHA256 || manifest.source?.size !== SOURCE_SIZE ||
      typeof manifest.target?.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(manifest.target.sha256) ||
      !/^[a-z0-9._-]+$/i.test(manifest.delta?.file || '') || !Number.isInteger(manifest.delta?.size) ||
      !/^[0-9a-f]{64}$/.test(manifest.delta?.sha256 || '')) throw new Error('manifest');
  return {manifest, manifestUrl};
}

async function selectVersion(version, showStatus = true) {
  clearOutput();
  currentManifest = null;
  currentManifestUrl = null;
  $('apply').disabled = true;
  $('version').disabled = true;
  if (showStatus) setStatusCode('loadingManifest');
  try {
    const loaded = await readManifest(version);
    currentManifest = loaded.manifest;
    currentManifestUrl = loaded.manifestUrl;
    $('version').value = version;
    refreshVersionLabels();
    translateNotes();
    setStatusCode('ready');
  } catch (_) {
    setStatusCode('manifestFailed', 'error');
  } finally {
    $('version').disabled = false;
    $('apply').disabled = !currentManifest;
  }
}

async function patchRom() {
  const file = $('rom').files[0];
  if (!file) return setStatusCode('choose', 'error');
  if (!currentManifest || !currentManifestUrl) return setStatusCode('manifestFailed', 'error');
  clearOutput();
  $('apply').disabled = true;
  $('version').disabled = true;
  $('rom').disabled = true;
  setStatusCode('validatingSource');
  const manifest = currentManifest;
  try {
    if (file.size !== manifest.source.size) { const error = new Error('size'); error.code = 'badSize'; error.detail = manifest.source.size; throw error; }
    const source = await file.arrayBuffer();
    const sourceHash = await sha256(source);
    $('source-hash').textContent = sourceHash;
    if (sourceHash !== manifest.source.sha256) { const error = new Error('source'); error.code = 'badSource'; error.detail = manifest.source.sha256; throw error; }
    setStatusCode('fetchingDelta');
    const deltaUrl = new URL(`../assets/${encodeURIComponent(manifest.delta.file)}`, currentManifestUrl);
    const assetsRoot = new URL('../assets/', currentManifestUrl);
    if (deltaUrl.origin !== location.origin || !deltaUrl.pathname.startsWith(assetsRoot.pathname)) { const error = new Error('delta path'); error.code = 'badPatch'; error.detail = manifest.delta.sha256; throw error; }
    const response = await fetch(deltaUrl, {cache:'no-store'});
    if (!response.ok) { const error = new Error('delta'); error.code = 'badPatch'; error.detail = manifest.delta.sha256; throw error; }
    const delta = await response.arrayBuffer();
    if (delta.byteLength !== manifest.delta.size || await sha256(delta) !== manifest.delta.sha256) { const error = new Error('delta'); error.code = 'badPatch'; error.detail = manifest.delta.sha256; throw error; }
    setStatusCode('applying');
    const workerUrl = new URL('./worker.js', document.baseURI);
    const worker = new Worker(workerUrl);
    let result;
    try {
      result = await new Promise((resolve, reject) => {
        worker.onmessage = ({data}) => data.error ? reject(new Error(data.error)) : resolve(data);
        worker.onerror = reject;
        worker.postMessage({source, delta}, [source, delta]);
      });
    } finally { worker.terminate(); }
    setStatusCode('validatingOutput');
    if (result.hash !== manifest.target.sha256) { const error = new Error('output'); error.code = 'badOutput'; error.detail = manifest.target.sha256; throw error; }
    outputUrl = URL.createObjectURL(new Blob([result.output], {type:'application/octet-stream'}));
    $('download').href = outputUrl;
    $('download').download = manifest.target.filename;
    $('download').hidden = false;
    $('download').textContent = text[language].download;
    setStatusCode('done', 'success');
  } catch (error) {
    setStatusCode(error.code || 'failed', 'error', error.detail || '');
  } finally {
    $('apply').disabled = false;
    $('version').disabled = false;
    $('rom').disabled = false;
  }
}

async function initializeCatalog() {
  $('apply').disabled = true;
  try {
    const response = await fetch(CATALOG_URL, {cache:'no-store'});
    if (!response.ok) throw new Error('catalog');
    catalog = await response.json();
    if (catalog.schema !== 'ultimate-gold-patch-catalog/v1' || !['alpha1', 'alpha2'].includes(catalog.default) ||
        !catalog.versions?.alpha1 || !catalog.versions?.alpha2) throw new Error('catalog');
    $('version').replaceChildren(...Object.keys(catalog.versions).map((id) => {
      const option = document.createElement('option'); option.value = id; option.textContent = catalog.versions[id].label[language]; return option;
    }));
    $('version').value = catalog.default;
    refreshVersionLabels();
    await selectVersion(catalog.default, false);
  } catch (_) {
    setStatusCode('catalogFailed', 'error');
  }
}

$('language').value = language;
$('language').addEventListener('change', translate);
$('version').addEventListener('change', () => selectVersion($('version').value));
$('apply').addEventListener('click', patchRom);
translate();
initializeCatalog();

window.addEventListener('pagehide', () => { if (outputUrl) URL.revokeObjectURL(outputUrl); });

function postEmbeddedHeight() {
  if (!embedded || window.parent === window) return;
  window.parent.postMessage({type:'patcher-height', height:document.documentElement.scrollHeight}, location.origin);
}
if (embedded) {
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'wiki-language') return;
    if (!['en', 'es'].includes(event.data.language)) return;
    $('language').value = event.data.language;
    translate();
    postEmbeddedHeight();
  });
  if ('ResizeObserver' in window) new ResizeObserver(postEmbeddedHeight).observe(document.querySelector('main'));
  else window.addEventListener('resize', postEmbeddedHeight);
  window.parent.postMessage({type:'patcher-ready'}, location.origin);
  postEmbeddedHeight();
}
