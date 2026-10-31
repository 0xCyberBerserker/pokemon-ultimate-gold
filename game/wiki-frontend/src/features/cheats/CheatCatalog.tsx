import { useEffect, useMemo, useState } from 'react';
import type { Language } from '../../data/types';
import { filterCheats, retroarchProfile, validateCheatCatalog, type CheatCatalog as Catalog, type CheatEntry } from '../../data/cheats';
import './cheat-catalog.css';

const copy = {
  en: {
    title: 'Cheat catalog', intro: 'Complete Action Replay codes, organized by category. All are optional; this page only displays text.',
    scope: 'This catalog is checked against Alpha 2; its codes have not been verified for the newer Kris build. The 2,110 status labels are unchanged. A bounded Alpha 1 runtime test covers 00-006 and 80-002; it verifies emulated-memory effects after a code-off process reload, not battery-save persistence or normal gameplay.',
    limitedStatus: 'Bounded Alpha 1 RAM test · no battery persistence', limited: 'A separate bounded Alpha1 test kept the value after a code-off emulator process reload. This does not establish battery-save persistence or normal gameplay.',
    original: 'Original source titles and instructions are retained where no authored translation exists.', search: 'Search codes, titles or IDs', category: 'All categories', folder: 'All source folders', status: 'All checks',
    static_only: 'Syntax checked · effect untested', guard_mismatch: 'ROM guard mismatch', syntax_issue: 'Syntax issue', unknownStatus: 'Status unavailable',
    activation: 'Detected button conditions', continuous: 'No standard button condition detected; inspect the code and source instructions.',
    before: 'Before using a code', usageTitle: 'How to use', riskTitle: 'Risks and limits',
    statesTitle: 'Recorded catalog states', empty: 'No codes match these filters.', profileSafety: 'An exported profile starts with its code disabled. Enable it only when needed.',
    instructions: 'Add the complete block as one Action Replay code in your emulator. Start with it disabled, enable only the selected code for its required scene, then disable it and restart the emulator to discard code patches. Saved item or party changes remain in that save.',
    backup: 'Use a separate copy of your save for experiments. Do not combine codes that alter the same feature; native Rocket items and speed changes already cover some conveniences.',
    wrapper: 'Requires a custom melonDS wrapper; copying this block alone does not provide the picker UI.',
    capture: 'Trainer capture: catching the Pokémon, keeping it in the party/PC and retaining it after save/restart are separate tests. They remain untested here.',
    source: 'Original source instructions', code: 'Complete code', copy: 'Copy code', copied: 'Copied', failedCopy: 'Select and copy the code below',
    previous: 'Previous', next: 'Next', results: 'results', target: 'Static-check target SHA-256', mismatch: 'An equality guard does not match this ROM. This can stop the guarded part from applying; it is not verified compatible.',
    loading: 'Loading catalog…', failure: 'Catalog unavailable or target mismatch.', guide: 'Usage guide', runtime: 'Read the bounded runtime QA report', credits: 'Source and credits', download: 'Download RetroArch profile',
  },
  es: {
    title: 'Catálogo de trucos', intro: 'Códigos Action Replay completos, organizados por categorías. Son opcionales; esta página sólo muestra texto.',
    scope: 'Este catálogo está comprobado contra Alfa 2; sus códigos no se han verificado para la versión más reciente con Kris. Las etiquetas de las 2.110 entradas no han cambiado. Una prueba acotada en Alfa 1 cubre 00-006 y 80-002; verifica efectos en la memoria del emulador tras recargar un estado en un proceso sin códigos, no persistencia en la batería ni jugabilidad normal.',
    limitedStatus: 'Prueba RAM acotada en Alfa 1 · sin persistencia en batería', limited: 'Una prueba separada en Alpha1 mantuvo el valor tras cargar un estado en otro proceso del emulador sin códigos. No demuestra persistencia en la batería ni jugabilidad normal.',
    original: 'Se conservan títulos e instrucciones originales de la fuente cuando no hay traducción propia.', search: 'Buscar códigos, títulos o ID', category: 'Todas las categorías', folder: 'Todas las carpetas de origen', status: 'Todas las comprobaciones',
    static_only: 'Sintaxis comprobada · efecto sin probar', guard_mismatch: 'Condición incompatible con la ROM', syntax_issue: 'Error de sintaxis', unknownStatus: 'Estado no disponible',
    activation: 'Condiciones de botones detectadas', continuous: 'No se detectó una condición de botones estándar; consulta el código y las instrucciones de origen.',
    before: 'Antes de usar un código', usageTitle: 'Cómo usarlo', riskTitle: 'Riesgos y límites',
    statesTitle: 'Estados registrados en el catálogo', empty: 'Ningún código coincide con estos filtros.', profileSafety: 'El perfil exportado incluye el código desactivado. Actívalo solo cuando lo necesites.',
    instructions: 'Añade el bloque completo como un único código Action Replay en tu emulador. Empieza con él desactivado, activa sólo el elegido en la escena correspondiente, después desactívalo y reinicia el emulador para descartar parches de código. Los cambios guardados en objetos o equipo permanecen en esa partida.',
    backup: 'Experimenta con una copia separada de tu partida. No combines códigos que alteren la misma función; los objetos Rocket nativos y los cambios de velocidad ya cubren algunas comodidades.',
    wrapper: 'Necesita un wrapper propio de melonDS; copiar este bloque no proporciona la interfaz del selector.',
    capture: 'Captura de entrenadores: capturar el Pokémon, conservarlo en equipo/PC y mantenerlo tras guardar y reiniciar son pruebas distintas. Aquí siguen sin probar.',
    source: 'Instrucciones originales de la fuente', code: 'Código completo', copy: 'Copiar código', copied: 'Copiado', failedCopy: 'Selecciona y copia el código de abajo',
    previous: 'Anterior', next: 'Siguiente', results: 'resultados', target: 'SHA-256 de la ROM comprobada', mismatch: 'Una condición de igualdad no coincide con esta ROM. Puede impedir aplicar la parte condicionada; no tiene compatibilidad verificada.',
    loading: 'Cargando catálogo…', failure: 'Catálogo no disponible o hash de destino distinto.', guide: 'Guía de uso', runtime: 'Leer el informe acotado de QA en runtime', credits: 'Fuente y créditos', download: 'Descargar perfil RetroArch',
  },
} as const;

const pageSize = 24;
export default function CheatCatalog({ language, target, initialCatalog }: { language: Language; target: string; initialCatalog?: Catalog }) {
  const t = copy[language];
  const [catalog, setCatalog] = useState<Catalog | null>(initialCatalog || null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [folder, setFolder] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState<{ id: string; success: boolean } | null>(null);
  useEffect(() => {
    if (initialCatalog) return;
    const controller = new AbortController();
    fetch('../data/cheat-catalog.json', { signal: controller.signal }).then((response) => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); })
      .then((value: Catalog) => { if (!validateCheatCatalog(value, target)) throw new Error('Target mismatch'); setCatalog(value); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [target, initialCatalog]);
  const entries = useMemo(() => catalog ? filterCheats(catalog.entries, { query, category, folder, status }) : [], [catalog, query, category, folder, status]);
  if (error || (catalog && !validateCheatCatalog(catalog, target))) return <p role="alert">{t.failure}</p>;
  if (!catalog) return <p role="status">{t.loading}</p>;
  const pages = Math.max(1, Math.ceil(entries.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const statusCounts = catalog.entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
    return counts;
  }, {});
  const statusLabel = (value: string) => value in t ? t[value as keyof typeof t] : t.unknownStatus;
  const statusClass = (value: string) => ['static_only', 'guard_mismatch', 'syntax_issue'].includes(value) ? value : 'unknown';
  function download(entry: CheatEntry) {
    const url = URL.createObjectURL(new Blob([retroarchProfile(entry, language, catalog!.target_sha256)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `Ultimate-Gold-${entry.id}-untested.cht`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="cheat-catalog"><h1>{t.title}</h1><p>{t.intro}</p><p className="preview-note">{t.scope}</p>
    <section className="cheat-guidance" aria-labelledby="cheat-guidance-title"><h2 id="cheat-guidance-title">{t.before}</h2><div className="cheat-guidance-grid">
      <article><h3>{t.usageTitle}</h3><p>{t.instructions}</p></article><article><h3>{t.riskTitle}</h3><p>{t.backup}</p></article>
    </div></section>
    <section className="cheat-status-overview" aria-labelledby="cheat-status-title"><h2 id="cheat-status-title">{t.statesTitle}</h2><div className="cheat-status-legend">{Object.entries(statusCounts).sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => <span className={`cheat-status-badge cheat-status-${statusClass(value)}`} key={value}><strong>{statusLabel(value)}</strong><span>{count.toLocaleString(language)}</span></span>)}</div></section>
    <p>{t.original}</p>
    <p><a className="text-link" href="#/guide/cheats">{t.guide}</a> · <a className="text-link" href="#/guide/cheat-runtime-qa">{t.runtime}</a>{catalog.source.url.startsWith('https://') && <> · <a className="text-link" href={catalog.source.url}>{t.credits}</a></>}</p>
    <div className="filters"><label>{t.search}<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label>
      <label>{t.category}<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }}><option value="">{t.category}</option>{Object.entries(catalog.categories).map(([id, label]) => <option key={id} value={id}>{label[language]}</option>)}</select></label>
      <label>{t.folder}<select value={folder} onChange={(event) => { setFolder(event.target.value); setPage(0); }}><option value="">{t.folder}</option>{catalog.folders.map((entry) => <option key={entry.id} value={entry.id}>{entry.source_title}</option>)}</select></label>
      <label>{t.status}<select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="">{t.status}</option>{Object.keys(statusCounts).sort().map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label></div>
    <p role="status">{entries.length.toLocaleString(language)} / {catalog.entries.length.toLocaleString(language)} {t.results}</p><p className="cheat-export-note">{t.profileSafety}</p>
    <div className="cheat-list">{entries.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((entry) => {
      const runtimeChecked = ['00-006', '80-002'].includes(entry.id);
      const statusText = entry.status === 'guard_mismatch' ? t.guard_mismatch : entry.status === 'syntax_issue' ? t.syntax_issue : entry.status === 'static_only' ? t.static_only : t.unknownStatus;
      return <article className="cheat-card" key={entry.id}><div className="cheat-meta"><span>{catalog.categories[entry.category]?.[language]} · {entry.id}</span><span className={`cheat-status-badge cheat-status-${statusClass(entry.status)}`}>{statusText}</span>{runtimeChecked && <span>{t.limitedStatus}</span>}</div><h2>{entry.title[language]}</h2>{entry.source_title !== entry.title[language] && <p>{entry.source_title}</p>}
        {runtimeChecked && <p className="preview-note">{t.limited} <a className="text-link" href="#/guide/cheat-runtime-qa">{t.runtime}</a></p>}{entry.status === 'guard_mismatch' && <p className="preview-note">{t.mismatch}</p>}{entry.requires_custom_wrapper && <p className="preview-note">{t.wrapper}</p>}{entry.id === '30-004' && <p className="preview-note">{t.capture}</p>}
        <details><summary>{t.code}</summary><p><strong>{t.activation}:</strong> {entry.activation_buttons.length ? entry.activation_buttons.join(' / ') : t.continuous}</p>
          <button onClick={async () => { try { await navigator.clipboard.writeText(entry.code); setCopied({ id: entry.id, success: true }); } catch { setCopied({ id: entry.id, success: false }); } }}>{copied?.id === entry.id ? copied.success ? t.copied : t.failedCopy : t.copy}</button>{' '}<button onClick={() => download(entry)}>{t.download}</button><pre tabIndex={0}><code>{entry.code}</code></pre>
          {entry.source_note && <details><summary>{t.source}</summary><p>{entry.source_note}</p></details>}</details></article>;
    })}</div>{!entries.length && <p className="cheat-empty" role="status">{t.empty}</p>}<nav className="cheat-pager" aria-label={language === 'es' ? 'Páginas de trucos' : 'Cheat pages'}><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{t.previous}</button><span>{currentPage + 1} / {pages}</span><button disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>{t.next}</button></nav><p className="cheat-target">{t.target}: <code>{catalog.target_sha256}</code></p>
  </section>;
}
