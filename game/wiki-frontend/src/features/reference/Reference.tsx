import { useDeferredValue, useState } from 'react';
import { localized } from '../../data/wiki';
import type { Language, WikiData } from '../../data/types';
import { evolutionFamilies } from '../../data/evolutions';
import Acquisition from './Acquisition';
import { filterItems, filterMachinesForSearch, filterMoves } from '../../data/reference';
import { splitFaq } from '../../data/faq';
import { publicGuideHtml } from '../../data/guide-links';
import { normalizeSearch } from '../../data/text';
import GuideIndex from './GuideIndex';
import MechanicsPage from './MechanicsPage';
import PlayerGuide from './PlayerGuide';
import TypeBadge from './TypeBadge';
import './evolutions.css';

const WIKI_TARGET_LABELS: Record<string, { en: string; es: string }> = {
  '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6': { en: 'Alpha 2', es: 'Alfa 2' },
  'fc0bf04ec57fa30121fdb50a4da3a94c300fc0abe171c96b3e60bc2e674baff4': { en: 'Kris Sprint 2', es: 'Kris Sprint 2' },
  '6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132': { en: 'Alpha 1', es: 'Alfa 1' },
};

type Props = { data: WikiData; language: Language; route: string };
type MachineEntryProps = {
  title: string;
  href: string;
  machine: WikiData['tmhm'][number];
  data: WikiData;
  language: Language;
  compatibleSpecies?: WikiData['species'];
  initiallyOpen?: boolean;
};

export function MachineEntry({ title, href, machine, data, language, compatibleSpecies, initiallyOpen = false }: MachineEntryProps) {
  const es = language === 'es';
  const [open, setOpen] = useState(initiallyOpen);
  return <details className="panel machine-entry" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary><strong>{title}</strong><TypeBadge id={data.moves[machine.move_id].type_id} types={data.types} language={language} /><span>{localized(data.items[machine.item_id]?.name, language)}</span></summary>
    <p><a className="text-link" href={href}>{es ? 'Abrir ficha del objeto' : 'Open item page'}</a> · <a className="text-link" href={`#/moves/${machine.move_id}`}>{es ? 'Ver movimiento' : 'View move'}</a></p>
    {compatibleSpecies ? <><h3>{es ? `Pokémon compatibles (${compatibleSpecies.length})` : `Compatible Pokémon (${compatibleSpecies.length})`}</h3>{open && <div className="evolution-members">{compatibleSpecies.map((species) => <a key={species.id} href={`#/pokemon/${species.id}`}><img src={`../sprites/pokemon/${species.id}.png`} alt="" loading="lazy" /><span>{localized(species.name, language)}</span></a>)}</div>}</> : <p>{es ? 'Compatibilidad individual no disponible para estos datos.' : 'Individual compatibility is unavailable for this data target.'}</p>}
    <Acquisition records={data.items[machine.item_id]?.acquisition} language={language} compact />
  </details>;
}

export default function Reference({ data, language, route }: Props) {
  const es = language === 'es';
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [machineKind, setMachineKind] = useState('');
  const q = useDeferredValue(normalizeSearch(query));
  const path = route.replace(/^#\/?/, '').split('/');
  const kind = path[0];
  const key = kind === 'faq' || kind === 'mechanics' ? kind : path[1];
  const title = kind === 'moves' ? (es ? 'Movimientos' : 'Moves') : kind === 'items' ? (es ? 'Objetos' : 'Items') : kind === 'machines' ? (es ? 'MT / MO' : 'TMs / HMs') : (es ? 'Guías' : 'Guides');
  if (kind === 'mechanics') return <MechanicsPage data={data} language={language} />;
  if (kind === 'guide' && key === 'player') return <PlayerGuide data={data} language={language} />;
  if ((kind === 'guide' || kind === 'faq' || kind === 'mechanics') && key && data.guides[key]) {
    const guide = data.guides[key];
    if (key === 'faq') {
      const { introduction, entries } = splitFaq(guide.body[language] || '');
      return <section><a className="back-link" href="#/guides">← {title}</a><article className="panel guide-html"><h1>{localized(guide.title, language)}</h1><div dangerouslySetInnerHTML={{ __html: introduction }} />{entries.map((entry, index) => <details className="faq-entry" key={index}><summary><span dangerouslySetInnerHTML={{ __html: entry.question }} /></summary><div dangerouslySetInnerHTML={{ __html: entry.answer }} /></details>)}</article></section>;
    }
    return <section><a className="back-link" href="#/guides">← {title}</a><article className="panel guide-html"><h1>{localized(guide.title, language)}</h1>{key === 'features' && <figure aria-label={es ? 'Linaje y ruta de los parches' : 'Lineage and patch routes'}><figcaption><strong>{es ? 'Linaje y ruta de los parches' : 'Lineage and patch routes'}</strong></figcaption><p>{es ? 'Linaje acreditado' : 'Credited upstream lineage'}: Drayano · Sacred Gold / Storm Silver 1.05 → Sacred Gold Plus 1.2.3</p><p>{es ? 'Parches directos desde HeartGold USA limpia' : 'Direct patches from clean HeartGold USA'}: Ultimate Gold {es ? 'Alfa' : 'Alpha'} 1 · Ultimate Gold {es ? 'Alfa' : 'Alpha'} 2</p><p>{es ? 'El linaje indica procedencia, no una secuencia para apilar parches. Cada versión utiliza su propio parche directo desde la ROM limpia.' : 'Lineage describes provenance, not a patch-stacking recipe. Each build uses its own direct patch from the clean ROM.'}</p></figure>}<div dangerouslySetInnerHTML={{ __html: publicGuideHtml(key, guide.body[language] || '', language) }} /></article></section>;
  }
  if ((kind === 'guide' && key) || kind === 'faq' || kind === 'mechanics') return <p>{es ? 'Entrada no disponible.' : 'Entry unavailable.'}</p>;
  if (kind === 'abilities') {
    if (key) {
      const ability = data.abilities[key];
      if (!ability) return <p>{es ? 'Habilidad no disponible.' : 'Ability unavailable.'}</p>;
      const species = data.species.filter((entry) => entry.ability_slots?.some((slot) => slot.ability_id === Number(key)));
      return <section><a className="back-link" href="#/abilities">← {es ? 'Habilidades' : 'Abilities'}</a><article className="panel"><h1>{localized(ability.name, language)}</h1><p>{localized(ability.description, language)}</p><h2>{es ? 'Especies con esta habilidad estándar' : 'Species with this standard ability'}</h2><p>{es ? 'Las habilidades individuales de los entrenadores pueden no estar verificadas.' : 'Individual trainer Pokémon abilities may not be verified.'}</p><div className="evolution-members">{species.map((entry) => <a key={entry.id} href={`#/pokemon/${entry.id}`}><img src={`../sprites/pokemon/${entry.id}.png`} alt="" loading="lazy" /><span>{localized(entry.name, language)}</span></a>)}</div>{!species.length && <p>{es ? 'Ninguna especie registrada.' : 'No species recorded.'}</p>}</article></section>;
    }
    const abilities = Object.entries(data.abilities).filter(([, ability]) => normalizeSearch(`${ability.name.en} ${ability.name.es} ${ability.description.en} ${ability.description.es}`).includes(q));
    return <section><div className="section-title"><h1>{es ? 'Habilidades' : 'Abilities'}</h1><span className="count" role="status">{abilities.length}</span></div><div className="filters"><label>{es ? 'Buscar habilidad' : 'Search abilities'}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><div className="reference-list ability-list">{abilities.map(([id, ability]) => <a className="panel ability-card" key={id} href={`#/abilities/${id}`}><strong>{localized(ability.name, language)}</strong><span>{localized(ability.description, language)}</span></a>)}</div>{!abilities.length && <p>{es ? 'No se encontraron habilidades.' : 'No abilities found.'}</p>}</section>;
  }
  if (kind === 'evolutions') {
    const filtered = evolutionFamilies(data.species).filter((family) => family.members.some((member) => normalizeSearch(`${member.name.en} ${member.name.es}`).includes(q)));
    return <section><h1>{es ? 'Evoluciones' : 'Evolutions'}</h1><p>{es ? 'Cada ficha reúne una familia completa y las condiciones de cada cambio, según los datos de esta ROM.' : 'Each card groups a complete family and the condition for every transition, using this ROM’s data.'}</p><div className="filters dex-filters"><label>{es ? 'Buscar Pokémon' : 'Search Pokémon'}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><p role="status">{filtered.length} {es ? 'familias evolutivas' : 'evolution families'}</p><div className="reference-list evolution-family-list">{filtered.map((family) => {
      const transitions = new Map<number, typeof family.edges>();
      family.edges.forEach((edge) => transitions.set(edge.from.id, [...(transitions.get(edge.from.id) || []), edge]));
      return <article className="evolution-family panel" key={family.roots[0].id}><h2>{es ? `Familia de ${family.roots.map((root) => localized(root.name, language)).join(' · ')}` : `${family.roots.map((root) => localized(root.name, language)).join(' · ')} family`}</h2><p>{family.members.length} {es ? 'especies' : 'species'} · {family.edges.length} {es ? 'cambios' : 'transitions'}</p>
        <div className="evolution-paths" aria-label={es ? 'Rutas de evolución' : 'Evolution paths'}>
          {[...transitions].map(([sourceId, edges]) => {
            const source = family.members.find((member) => member.id === sourceId)!;
            return <div className="evolution-path" key={sourceId}>
              <a className="evolution-pokemon" href={`#/pokemon/${source.id}`}><img src={`../sprites/pokemon/${source.id}.png`} alt="" loading="lazy" /><strong>{localized(source.name, language)}</strong></a>
              <span className="evolution-path-arrow" aria-hidden="true">→</span>
              <div className="evolution-branches">{edges.map(({ to, evolution }, index) => <a className="evolution-edge" href={`#/pokemon/${to.id}`} key={`${source.id}-${to.id}-${index}`}><span className="evolution-condition">{localized(evolution.condition, language)}</span><span aria-hidden="true" className="evolution-branch-arrow">→</span><span className="evolution-target"><img src={`../sprites/pokemon/${to.id}.png`} alt="" loading="lazy" /><strong>{localized(to.name, language)}</strong></span></a>)}</div>
            </div>;
          })}
        </div>
      </article>;
    })}</div></section>;
  }
  if ((kind === 'moves' || kind === 'items') && key) {
    const entry = kind === 'moves' ? data.moves[key] : data.items[key];
    if (!entry) return <p>{es ? 'Entrada no disponible.' : 'Entry unavailable.'}</p>;
    return <section><a className="back-link" href={`#/${kind}`}>← {title}</a><article className="panel"><h1>{kind === 'items' && es && entry.name.en !== entry.name.es ? `${entry.name.en} · ${entry.name.es}` : localized(entry.name, language)}</h1>{kind === 'items' && data.items[key].sprite && <img src={data.items[key].sprite} alt="" />}{kind === 'items' && data.items[key].icon_status === 'rom_placeholder' && <p>{es ? 'Icono provisional de la ROM' : 'ROM placeholder icon'}</p>}{kind === 'moves' && <TypeBadge id={data.moves[key].type_id} types={data.types} language={language} />}<p>{localized(entry.description, language)}</p>{kind === 'moves' && <p>{es ? 'Potencia' : 'Power'}: {data.moves[key].power} · {es ? 'Precisión' : 'Accuracy'}: {data.moves[key].accuracy} · PP: {data.moves[key].pp}</p>}{kind === 'items' && <><p>ID: {data.items[key].nds_id || key} · {localized(data.items[key].category, language)}</p><h2>{es ? 'Obtención documentada' : 'Documented acquisition'}</h2><Acquisition records={data.items[key].acquisition} language={language} /></>}</article></section>;
  }
  const compatibility = data.tmhm_compatibility?.target_sha256 === data.target_sha256 ? data.tmhm_compatibility.by_species : undefined;
  const compatibleSpeciesByItem = compatibility
    ? new Map(data.tmhm.map(({ item_id }) => [item_id, data.species.filter((species) => compatibility[String(species.id)]?.includes(item_id))]))
    : undefined;
  const targetLabel = WIKI_TARGET_LABELS[data.target_sha256]?.[language] || (es ? 'destino seleccionado' : 'selected target');
  const compatibilityLabel = data.tmhm_compatibility
    ? WIKI_TARGET_LABELS[data.tmhm_compatibility.target_sha256]?.[language] || (es ? 'otro destino' : 'another target')
    : undefined;
  const machineEntries = filterMachinesForSearch(data, language, q, machineKind, typeFilter);
  const entries = kind === 'moves' ? filterMoves(data, language, q, typeFilter, classFilter).map(([entryId, item]) => ({ id: entryId, title: localized(item.name, language), description: `${localized(data.types[item.type_id], language)} · ${item.category === 0 ? (es ? 'Físico' : 'Physical') : item.category === 1 ? (es ? 'Especial' : 'Special') : (es ? 'Estado' : 'Status')} · ${es ? 'Potencia' : 'Power'} ${item.power ?? '—'} · ${es ? 'Precisión' : 'Accuracy'} ${item.accuracy ?? '—'} · PP ${item.pp ?? '—'}`, href: `#/moves/${entryId}` })) :
    kind === 'items' ? filterItems(data, language, q, itemCategory).map(([entryId, item]) => ({ id: entryId, title: language === 'es' && item.name.en !== item.name.es ? `${item.name.en} · ${item.name.es}` : localized(item.name, language), description: `${localized(item.category, language)} · ${localized(item.description, language)}`, href: `#/items/${entryId}` })) :
    kind === 'machines' ? machineEntries.map((item) => ({ id: `${item.kind}-${item.number}`, title: `${es ? (item.kind === 'tm' ? 'MT' : 'MO') : item.kind.toUpperCase()} ${item.number} · ${localized(data.moves[item.move_id]?.name, language)}`, description: `${localized(data.items[item.item_id]?.name, language)} · ${localized(data.types[data.moves[item.move_id]?.type_id], language)}`, href: `#/items/${item.item_id}` })) :
    Object.entries(data.guides).map(([entryId, item]) => ({ id: entryId, title: localized(item.title, language), description: '', href: `#/guide/${entryId}` }));
  const filtered = ['moves', 'items', 'machines'].includes(kind) ? entries : entries.filter((entry) => normalizeSearch(`${entry.title} ${entry.description}`).includes(q));
  const categories = new Map(Object.values(data.items).filter((item) => item.category_id).map((item) => [item.category_id!, localized(item.category, language)]));
  return <section><div className="section-title"><div><p className="section-tag">ULTIMATE GOLD</p><h1>{title}</h1></div><span className="count">{filtered.length}</span></div>
    {kind === 'machines' && <p className="note">{compatibility
      ? (es ? `Datos de la wiki: ${targetLabel}. Busca una máquina o un Pokémon; abre la ficha para ver todas las especies compatibles.` : `Wiki data: ${targetLabel}. Search for a machine or Pokémon; open an entry to see all compatible species.`)
      : data.tmhm_compatibility
        ? (es ? `La tabla de compatibilidad corresponde a ${compatibilityLabel}; no se aplica a los datos de ${targetLabel}. La lista no se filtra por Pokémon.` : `The compatibility table is for ${compatibilityLabel}; it is not used with ${targetLabel} data. Results are not filtered by Pokémon.`)
        : (es ? `La compatibilidad por Pokémon no está disponible para los datos de ${targetLabel}.` : `Per-Pokémon compatibility is unavailable for ${targetLabel} data.`)}</p>}
    <div className="filters dex-filters"><label>{es ? 'Buscar' : 'Search'}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kind === 'machines' ? (es ? 'MT, movimiento o Pokémon' : 'TM, move, or Pokémon') : undefined} /></label>
      {(kind === 'moves' || kind === 'machines') && <label>{es ? 'Tipo' : 'Type'}<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="">{es ? 'Todos' : 'All'}</option>{Object.entries(data.types).map(([id, name]) => <option key={id} value={id}>{localized(name, language)}</option>)}</select></label>}
      {kind === 'moves' && <label>{es ? 'Clase' : 'Class'}<select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="">{es ? 'Todas' : 'All'}</option><option value="0">{es ? 'Físico' : 'Physical'}</option><option value="1">{es ? 'Especial' : 'Special'}</option><option value="2">{es ? 'Estado' : 'Status'}</option></select></label>}
      {kind === 'items' && <label>{es ? 'Categoría' : 'Category'}<select value={itemCategory} onChange={(event) => setItemCategory(event.target.value)}><option value="">{es ? 'Todas' : 'All'}</option>{[...categories].map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>}
      {kind === 'machines' && <label>{es ? 'Clase de máquina' : 'Machine kind'}<select value={machineKind} onChange={(event) => setMachineKind(event.target.value)}><option value="">{es ? 'Todas' : 'All'}</option><option value="tm">{es ? 'MT' : 'TM'}</option><option value="hm">{es ? 'MO' : 'HM'}</option></select></label>}
    </div>
    {kind === 'guides' ? <GuideIndex entries={filtered} language={language} /> : <div className="reference-list">{filtered.map((entry) => {
      const machine = kind === 'machines' ? data.tmhm.find((item) => `${item.kind}-${item.number}` === entry.id) : undefined;
      if (kind === 'items') {
        const item = data.items[entry.id];
        return <details className="panel item-entry" key={entry.id}><summary><span className="item-entry-heading">{item.sprite && <img src={item.sprite} alt="" loading="lazy" />}<span><strong>{entry.title}</strong>{item.icon_status === 'rom_placeholder' && <small>{es ? 'Icono provisional de la ROM' : 'ROM placeholder icon'}</small>}</span></span><span>{localized(item.category, language)}</span></summary><p>{localized(item.description, language)}</p><p><a className="text-link" href={entry.href}>{es ? 'Abrir ficha del objeto' : 'Open item page'}</a></p><Acquisition records={item.acquisition} language={language} /></details>;
      }
      if (machine) return <MachineEntry key={entry.id} title={entry.title} href={entry.href} machine={machine} data={data} language={language} compatibleSpecies={compatibleSpeciesByItem?.get(machine.item_id)} />;
      if (kind === 'moves') return <a className="panel" href={entry.href} key={entry.id}><strong>{entry.title}</strong><TypeBadge id={data.moves[entry.id].type_id} types={data.types} language={language} /><span>{entry.description}</span></a>;
      return <a className="panel" href={entry.href} key={entry.id}><strong>{entry.title}</strong><span>{entry.description}</span></a>;
    })}</div>}
  </section>;
}
