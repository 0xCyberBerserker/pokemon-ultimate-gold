import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { Language, WikiData } from '../../data/types';
import { buildSearchIndex, searchGroups } from '../../data/search';

export default function GlobalSearch({ data, language }: { data: WikiData; language: Language }) {
  const es = language === 'es';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [limit, setLimit] = useState(5);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen((value) => !value); }
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { if (!open) return; const previous = document.activeElement as HTMLElement | null; input.current?.focus(); return () => previous?.focus(); }, [open]);
  const index = useMemo(() => buildSearchIndex(data, language), [data, language]);
  const groups = useMemo(() => searchGroups(index, query, limit), [index, query, limit]);
  const results = groups.flatMap((group) => group.entries);
  return <><button className="search-trigger" aria-label={es ? 'Búsqueda global' : 'Global search'} onClick={() => setOpen(true)}><Search size={18} /><span>{es ? 'Buscar' : 'Search'} <kbd>Ctrl K</kbd></span></button>
    {open && <div className="search-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><div ref={dialog} className="search-dialog" role="dialog" aria-modal="true" aria-label={es ? 'Búsqueda global' : 'Global search'} onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>('input,button,a[href]') || [])];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    }}>
      <div className="search-dialog-header"><Search size={20} /><input ref={input} role="combobox" aria-expanded="true" aria-controls="global-search-results" aria-activedescendant={results[active] ? `global-result-${active}` : undefined} aria-label={es ? 'Buscar en la wiki' : 'Search the wiki'} value={query} placeholder={es ? 'Buscar en la wiki…' : 'Search the wiki…'} onChange={(event) => { setQuery(event.target.value); setActive(0); setLimit(5); }} onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setActive((current) => Math.min(current + 1, results.length - 1)); }
        if (event.key === 'ArrowUp') { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
        if (event.key === 'Enter' && results[active]) { location.hash = results[active].href; setOpen(false); }
      }} /><button aria-label={es ? 'Cerrar búsqueda' : 'Close search'} onClick={() => setOpen(false)}>×</button></div>
      <div className="search-results" id="global-search-results" role="listbox">{groups.map((group) => <div role="group" aria-label={group.category} key={group.category}><p className="search-group">{group.category} · {group.entries.length}/{group.total}</p>{group.entries.map((entry) => { const index = results.indexOf(entry); return <a role="option" aria-selected={index === active} id={`global-result-${index}`} className={index === active ? 'search-active' : ''} href={entry.href} key={`${entry.category}-${entry.href}-${index}`} onClick={() => setOpen(false)}><span className="search-result-label"><span>{entry.label}</span>{entry.detail && <small>{entry.detail}</small>}</span></a>; })}</div>)}{query && !results.length && <p>{es ? 'Sin resultados.' : 'No results.'}</p>}</div>
      {groups.some((group) => group.entries.length < group.total) && <button className="search-more" onClick={() => { setLimit((value) => value + 20); setActive(0); input.current?.focus(); }}>{es ? 'Mostrar más resultados' : 'Show more results'}</button>}
    </div></div>}
  </>;
}
