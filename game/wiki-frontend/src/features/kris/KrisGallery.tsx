import { useEffect, useMemo, useState } from 'react';
import type { Language } from '../../data/types';
import { localized } from '../../data/wiki';
import { editorialGallery, galleryImagePath, galleryStatuses, orderedGallery, type GalleryManifest } from '../../data/krisGallery';

const sceneNames: Record<string, [string, string]> = {
  'k01-core16': ['Early new-game and naming test', 'Prueba temprana de partida nueva y nombre'],
  'k02-core46': ['Opening movie: earlier portrait', 'Película inicial: retrato anterior'],
  'k02-core51': ['Opening movie: small portrait', 'Película inicial: retrato pequeño'],
  'k02-core97': ['Opening movie: portrait sequence', 'Película inicial: secuencia del retrato'],
  'k04-core36': ['Team Rocket disguise', 'Disfraz del Team Rocket'],
  'k04-core39': ['Fishing attempt', 'Prueba de pesca'],
  'k04-core48': ['Cycling attempt: inconclusive', 'Intento de bicicleta: inconcluso'],
  'k04-core49': ['Cycling in four directions', 'Bicicleta en cuatro direcciones'],
  'k04-core50': ['Ladder entry: inconclusive', 'Entrada a la escalera: inconclusa'],
  'k04-core52': ['Ladder landing: inconclusive', 'Llegada de la escalera: inconclusa'],
  'k04-k05-core32': ['Automatic capture test stopped early', 'Prueba de captura automática detenida antes de terminar'],
  'k04-k05-core34': ['Automatic capture test without screenshots', 'Prueba de captura automática sin imágenes'],
  'k04-k05-core35': ['Automatic capture test with screenshots', 'Prueba de captura automática con imágenes'],
  'k04-k05-core47': ['Walking and running: visual sample', 'Caminar y correr: muestra visual'],
  'k05-core40': ['Walking and running: movement trace', 'Caminar y correr: registro de movimiento'],
  'k05-core41': ['Movement selection states', 'Estados de selección del movimiento'],
  'k06-core21': ['A wild Chinchou escapes', 'Un Chinchou salvaje escapa'],
  'k06-core24': ['Hall of Fame entry: incomplete', 'Entrada al Salón de la Fama: incompleta'],
  'k06-core25': ['Hall of Fame and credits', 'Salón de la Fama y créditos'],
  'k06-core26': ['Movement after cold load', 'Movimiento tras carga en frío'],
  'k06-core42': ['Fishing without a bite', 'Pesca sin picada'],
  'k06-core43': ['Trainer battle introduction', 'Inicio de combate con entrenador'],
  'k07-k08-core18': ['Trainer card and Pokégear', 'Tarjeta de entrenador y Pokégear'],
  'k08-core20': ['Johto map', 'Mapa de Johto'],
  'k09-core37-38-sign': ['Kris and Ethan’s house signs', 'Letreros de las casas de Kris y Ethan'],
  'k10-core44': ['Taking a photo and saving', 'Hacer una foto y guardar'],
  'k10-core45': ['Viewing a photo on the PC', 'Ver una foto en el PC'],
  'k11-core17': ['Bag pockets: historical diagnostic', 'Bolsillos de la Bolsa: diagnóstico histórico'],
  'k11-core22': ['Bag navigation: earlier test', 'Navegación de la Bolsa: prueba anterior'],
  'k11-core23': ['Returning from the Bag', 'Volver desde la Bolsa'],
  'k11-core27': ['Pokémon summary and save', 'Resumen de Pokémon y guardado'],
  'k11-core28': ['Save and cold load', 'Guardar y cargar en frío'],
  'k11-core29': ['Healing at a Pokémon Center', 'Curarse en un Centro Pokémon'],
  'k11-core30': ['Ethan: field and menus', 'Ethan: mapa y menús'],
  'k11-core31': ['Kris: field and menus', 'Kris: mapa y menús'],
  'surf-hm-native-v1': ['Surf: earlier test', 'Surf: prueba anterior'],
};
const pageSize = 24;

export default function KrisGallery({ language, initialManifest }: { language: Language; initialManifest?: GalleryManifest }) {
  const es = language === 'es';
  const [manifest, setManifest] = useState<GalleryManifest | null>(initialManifest || null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [scene, setScene] = useState('');
  const [status, setStatus] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (initialManifest) return;
    const controller = new AbortController();
    fetch('../data/kris-gallery.json', { signal: controller.signal }).then((response) => { if (!response.ok) throw new Error('Gallery unavailable'); return response.json(); })
      .then((value: unknown) => { if (!value || typeof value !== 'object' || !Array.isArray((value as GalleryManifest).images) || !(value as GalleryManifest).collections) throw new Error('Invalid gallery'); setManifest(value as GalleryManifest); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [initialManifest]);
  const selected = useMemo(() => manifest ? editorialGallery(manifest) : new Set<string>(), [manifest]);
  const matches = useMemo(() => {
    if (!manifest) return [];
    const term = query.trim().toLocaleLowerCase();
    return orderedGallery(manifest, scene).filter(({ image }) => {
      if (!showAll && selected.size && !selected.has(image.id)) return false;
      const refs = image.source_references || [];
      if (status && !galleryStatuses(image, manifest.collections).includes(status)) return false;
      const searchable = [image.caption?.en, image.caption?.es, ...refs.flatMap((ref) => { const id = ref.collection_id || ''; return [id, sceneNames[id]?.[0], sceneNames[id]?.[1], manifest.collections[id]?.caption?.en, manifest.collections[id]?.caption?.es]; })].join(' ').toLocaleLowerCase();
      return searchable.includes(term);
    });
  }, [manifest, scene, status, query, selected, showAll]);
  if (error) return <p role="alert">{es ? 'No se pudo cargar el índice de la galería.' : 'The gallery index could not be loaded.'}</p>;
  if (!manifest) return <p role="status">{es ? 'Cargando galería…' : 'Loading gallery…'}</p>;
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  return <section className="kris-progress"><h1>{es ? 'Progreso de Kris' : 'Kris progress'}</h1>
    <p>{es ? 'Estas capturas documentan pruebas concretas de una candidata privada. Están agrupadas por escena y ordenadas por ejecución y fotograma; ese orden no demuestra la cronología entre pruebas distintas.' : 'These captures document specific tests of a private candidate. They are grouped by scene and ordered by run and frame; that order does not establish the chronology between separate tests.'}</p>
    <div className="preview-note"><strong>{es ? 'Una primera variante experimental' : 'An early experimental variant'}</strong><p>{es ? 'Se construyó una primera variante privada sobre una ROM de prueba, pero se rechazó visualmente porque los recortes incluían fragmentos de otros sprites. La construcción y el aspecto visual son comprobaciones distintas; esta galería aún no identifica qué captura corresponde a esa variante.' : 'A first private variant was built on a test ROM, but was visually rejected because the crops included fragments of other sprites. Building the variant and checking its appearance are separate checks; this gallery does not yet identify which capture corresponds to that variant.'} <a className="text-link" href="#/guide/kris">{es ? 'Consultar el contexto y sus límites' : 'Read the context and its limits'}</a>.</p></div>
    <p>{es ? 'Las imágenes son evidencia parcial; no demuestran una partida completa ni aceptación de la versión. Alfa 2 no incluye esta candidata privada.' : 'These images are partial evidence; they do not establish a complete playthrough or release acceptance. Alpha 2 does not include this private candidate.'}</p>
    <div className="filters"><label>{es ? 'Buscar escenas o capturas' : 'Search scenes or captures'}<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label>
      <label>{es ? 'Escena' : 'Scene'}<select value={scene} onChange={(event) => { setScene(event.target.value); setPage(0); }}><option value="">{es ? 'Todas las escenas' : 'All scenes'}</option>{Object.entries(manifest.collections).map(([id, collection]) => <option value={id} key={id}>{sceneNames[id]?.[es ? 1 : 0] || localized(collection.caption, language)}</option>)}</select></label>
      <label>{es ? 'Estado' : 'Status'}<select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="">{es ? 'Todos los estados' : 'All statuses'}</option><option value="historical">{es ? 'Histórica' : 'Historical'}</option><option value="qa_partial">{es ? 'Prueba parcial' : 'Partial testing'}</option><option value="experimental">{es ? 'Experimental' : 'Experimental'}</option><option value="current">{es ? 'Actual' : 'Current'}</option></select></label></div>
    <label><input type="checkbox" checked={showAll} onChange={(event) => { setShowAll(event.target.checked); setPage(0); }} /> {es ? 'Mostrar archivo completo' : 'Show complete archive'}</label>
    <p role="status">{matches.length} / {manifest.images.length} {es ? 'capturas' : 'captures'}</p>
    <div className="kris-gallery-grid">{matches.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(({ image, primary }) => {
      const path = galleryImagePath(image.file);
      if (!path) return null;
      const id = primary.collection_id || '';
      const collection = manifest.collections[id];
      const title = sceneNames[id]?.[es ? 1 : 0] || localized(collection?.caption, language);
      const frame = primary.frame_index_from_filename;
      const statuses = galleryStatuses(image, manifest.collections).map((stage) => stage === 'historical' ? (es ? 'Histórica' : 'Historical') : stage === 'qa_partial' ? (es ? 'Prueba parcial' : 'Partial testing') : stage === 'experimental' ? 'Experimental' : stage === 'current' ? (es ? 'Actual' : 'Current') : stage);
      const scopeNotes = [...new Set(image.source_references.map((ref) => localized(manifest.collections[ref.collection_id || '']?.status_note, language)).filter((note) => note !== '—'))];
      return <figure className="kris-gallery-card" key={image.id}><a href={path} target="_blank" rel="noopener noreferrer"><img src={path} alt={localized(image.alt, language)} loading="lazy" /></a><figcaption><strong>{title}</strong><p>{localized(image.caption, language)}</p><p>{statuses.join(' · ') || '—'}{frame != null && ` · ${es ? 'Fotograma' : 'Frame'} ${frame}`}</p><a href={path} download>{es ? 'Abrir PNG original' : 'Open original PNG'}</a></figcaption><details><summary>{es ? 'Detalles y procedencia' : 'Details and provenance'}</summary>{scopeNotes.map((note) => <p key={note}>{note}</p>)}<p>{es ? 'Descripción original' : 'Original description'}: {localized(image.alt, language)}</p><p>SHA-256: <code>{image.sha256}</code></p><p>{es ? 'Builds' : 'Builds'}: <code>{(image.build_sha256s || []).join(', ') || '—'}</code></p><p>{localized(image.permissions?.credit, language)}</p><ul>{image.source_references.map((ref, index) => <li key={index}>{ref.collection_id} · {ref.run_id || '—'} · {ref.source_file || '—'}{ref.status_as_sealed && <> · {ref.status_as_sealed}</>}{ref.source_seal && <> · {ref.source_seal}</>}{ref.source_seal_sha256 && <> · <code>{ref.source_seal_sha256}</code></>}{ref.build_sha256 && <> · <code>{ref.build_sha256}</code></>}</li>)}</ul></details></figure>;
    })}</div>{!matches.length && <p>{es ? 'Ninguna captura coincide con los filtros.' : 'No captures match these filters.'}</p>}
    <nav className="kris-gallery-pager" aria-label={es ? 'Páginas de capturas' : 'Capture pages'}><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{es ? 'Anterior' : 'Previous'}</button><span>{currentPage + 1} / {pages}</span><button disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>{es ? 'Siguiente' : 'Next'}</button></nav>
  </section>;
}
