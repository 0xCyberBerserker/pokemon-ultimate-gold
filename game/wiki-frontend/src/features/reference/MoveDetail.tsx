import type { Language, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { displayMoveAccuracy, displayMovePower } from '../../data/move-values';
import TypeBadge from './TypeBadge';
import './detail-pages.css';

function compatibilityCoverage(data: WikiData) {
  const table = data.tmhm_compatibility;
  if (!table || table.target_sha256 !== data.target_sha256) return { status: 'unknown' as const };
  const bySpecies = table.by_species;
  if (!bySpecies || typeof bySpecies !== 'object' || Array.isArray(bySpecies)) return { status: 'unknown' as const };

  const speciesIds = new Set(data.species.map((species) => String(species.id)));
  let partial = Object.keys(bySpecies).some((speciesId) => !speciesIds.has(speciesId));
  for (const species of data.species) {
    const rows = bySpecies[String(species.id)];
    if (!Array.isArray(rows) || rows.some((itemId) => !Number.isSafeInteger(itemId))) partial = true;
  }
  return { status: partial ? 'partial' as const : 'complete' as const, bySpecies };
}

export default function MoveDetail({ data, language, id }: { data: WikiData; language: Language; id: string | number }) {
  const es = language === 'es';
  const key = String(id);
  const move = data.moves[key];
  if (!move) return <p>{es ? 'Movimiento no disponible.' : 'Move unavailable.'}</p>;

  const power = displayMovePower(move.power, language);
  const accuracy = displayMoveAccuracy(move.accuracy, language);
  const category = move.category === 0 ? (es ? 'Físico' : 'Physical') : move.category === 1 ? (es ? 'Especial' : 'Special') : move.category === 2 ? (es ? 'Estado' : 'Status') : (es ? 'Desconocida' : 'Unknown');
  const learnerRows = new Map<string, { species: WikiData['species'][number]; level: number }>();
  for (const species of data.species) {
    for (const entry of species.learnset) {
      if (entry.move_id === Number(key)) learnerRows.set(`${species.id}:${entry.level}`, { species, level: entry.level });
    }
  }
  const learners = [...learnerRows.values()]
    .sort((a, b) => a.level - b.level || a.species.id - b.species.id);
  const machines = data.tmhm.filter((machine) => machine.move_id === Number(key));
  const compatibility = compatibilityCoverage(data);

  return <section className="detail-page move-detail">
    <a className="back-link" href="#/moves">← {es ? 'Movimientos' : 'Moves'}</a>
    <header className="detail-header"><p className="section-tag">{es ? 'MOVIMIENTO' : 'MOVE'}</p><h1>{localized(move.name, language)}</h1><TypeBadge id={move.type_id} types={data.types} language={language} /></header>
    <article className="panel detail-description">
      <h2>{es ? 'Descripción de referencia' : 'Reference description'}</h2><p>{localized(move.description, language)}</p>
      <dl className="move-stat-grid">
        <div><dt>{es ? 'Clase' : 'Category'}</dt><dd>{category}</dd></div>
        <div><dt>{es ? 'Potencia' : 'Power'}</dt><dd>{power.value}</dd>{power.note && <small>{power.note}</small>}</div>
        <div><dt>{es ? 'Precisión' : 'Accuracy'}</dt><dd>{accuracy.value}</dd>{accuracy.note && <small>{accuracy.note}</small>}</div>
        <div><dt>PP</dt><dd>{move.pp}</dd></div>
      </dl>
      <p className="detail-caveat">{es
        ? 'La descripción es una referencia localizada; los valores reflejan los datos seleccionados. Esta ficha no verifica el comportamiento en partida.'
        : 'The description is a localized reference; values reflect the selected dataset. This page does not verify in-game behavior.'}</p>
    </article>
    <article className="panel detail-related">
      <h2>{es ? 'Aprendizaje por nivel' : 'Level-up learning'}</h2>
      {learners.length ? <ul className="detail-link-list move-learners">{learners.map(({ species, level }) => <li key={`${species.id}-${level}`}><strong>{es ? 'Nv.' : 'Lv.'} {level}</strong><a className="detail-pokemon-link" href={`#/pokemon/${species.id}`}><img src={`../sprites/pokemon/${species.id}.png`} alt="" loading="lazy" /><span>#{String(species.id).padStart(3, '0')} · {localized(species.name, language)}</span></a></li>)}</ul> : <p>{es ? 'No hay especies registradas con aprendizaje por nivel.' : 'No species are recorded with level-up learning.'}</p>}
    </article>
    <article className="panel detail-related">
      <h2>{es ? 'MT y MO' : 'TMs and HMs'}</h2>
      {machines.length ? machines.map((machine) => {
        const compatible = compatibility.status !== 'unknown'
          ? data.species.filter((species) => {
            const row = compatibility.bySpecies[String(species.id)];
            return Array.isArray(row) && row.every(Number.isSafeInteger) && row.includes(machine.item_id);
          })
          : undefined;
        return <section className="detail-machine" key={machine.item_id}>
          <h3><a href={`#/items/${machine.item_id}`}>{es ? (machine.kind === 'tm' ? 'MT' : 'MO') : machine.kind.toUpperCase()} {machine.number}</a></h3>
          <p className="detail-coverage">{compatibility.status === 'complete'
            ? (es ? 'Cobertura de compatibilidad completa para estos datos.' : 'Compatibility coverage is complete for this dataset.')
            : compatibility.status === 'partial'
              ? (es ? 'Cobertura parcial: se muestran solo las compatibilidades conocidas; las entradas ausentes o inválidas son desconocidas.' : 'Partial coverage: only known compatible entries are shown; missing or invalid entries remain unknown.')
              : (es ? 'Compatibilidad desconocida: la tabla falta, tiene un formato no utilizable o no coincide con el hash de estos datos.' : 'Compatibility unknown: the table is missing, unusable, or does not match this dataset hash.')}</p>
          {compatible ? compatible.length
            ? <ul className="detail-link-list detail-compatible-species">{compatible.map((species) => <li key={species.id}><a className="detail-pokemon-link" href={`#/pokemon/${species.id}`}><img src={`../sprites/pokemon/${species.id}.png`} alt="" loading="lazy" /><span>#{String(species.id).padStart(3, '0')} · {localized(species.name, language)}</span></a></li>)}</ul>
            : <p>{compatibility.status === 'complete'
              ? (es ? 'No hay especies compatibles registradas en esta tabla completa.' : 'No compatible species are recorded in this complete table.')
              : (es ? 'No se encontraron compatibilidades conocidas; las ausencias no confirman incompatibilidad.' : 'No known compatible entries were found; missing entries do not confirm incompatibility.')}</p>
            : null}
        </section>;
      }) : <p>{es ? 'No hay MT/MO registradas para este movimiento.' : 'No TMs or HMs are recorded for this move.'}</p>}
    </article>
  </section>;
}
