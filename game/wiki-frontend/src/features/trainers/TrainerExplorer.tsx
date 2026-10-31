import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { GameMode, Language, Member, Trainer, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { memberForMode } from '../../data/team';
import { orderTrainers } from '../../data/journey';
import { normalizeSearch } from '../../data/text';
import { strings } from '../../i18n';

type Props = { data: WikiData; language: Language; mode: GameMode };
const PAGE_SIZE = 40;
const STAT_ORDER = [0, 1, 2, 4, 5, 3];

function MemberCard({ member, data, language, mode }: Props & { member: Member }) {
  const t = strings[language];
  const species = data.species.find((entry) => entry.id === member.species_id);
  const resolved = memberForMode(member, mode);
  const moveIds = resolved.moveIds;
  const stats = [resolved.ivs, resolved.evs];
  return <article className="member-card">
    <div className="member-heading">
      <img src={`../sprites/pokemon/${member.species_id}.png`} alt="" loading="lazy" />
      <div><h3><a href={`#/pokemon/${member.species_id}`}>{localized(species?.name, language)}</a></h3><span>{language === 'es' ? 'Nv.' : 'Lv.'} {resolved.level}</span>
        <div className="type-list">{species?.types.map((id) => <span className={`type-badge type-${id}`} key={id}>{localized(data.types[id], language)}</span>)}</div>
      </div>
    </div>
    {!!member.form && <p className="note">{language === 'es' ? `Código de forma registrado: ${member.form}. El sprite y las habilidades mostrados corresponden a la especie base; la apariencia de esta forma no está verificada aquí.` : `Recorded form code: ${member.form}. The displayed sprite and abilities belong to the base species; this form’s appearance is not verified here.`}</p>}
    <p><strong>{t.item}:</strong> {member.item_id ? <a className="text-link" href={`#/items/${member.item_id}`}>{localized(data.items[member.item_id]?.name, language)}</a> : t.noItem}</p>
    <p><strong>{t.abilities}:</strong> {species?.abilities.length ? species.abilities.map((id, index) => <span key={id}>{index > 0 && ', '}<a className="text-link" href={`#/abilities/${id}`}>{localized(data.abilities[id]?.name, language)}</a></span>) : t.unknown}</p>
    <p className="note">{t.abilityNote}</p>
    <div className="move-list"><strong>{t.moves}</strong>{moveIds.map((id, index) => { const move = data.moves[id]; return <a className="move-link" href={`#/moves/${id}`} key={`${index}-${id}`}>{localized(move?.name, language)}<small>{localized(move ? data.types[move.type_id] : undefined, language)} · {language === 'es' ? 'Potencia' : 'Power'} {move?.power ?? '—'} · PP {move?.pp ?? '—'}</small></a>; })}</div>
    <p className="note">{t.moveNote}: {member.move_resolution === 'derived_from_target_learnset' ? t.derived_from_target_learnset : member.move_resolution === 'explicit_target_record' ? (language === 'es' ? 'Registro explícito' : 'Explicit record') : member.move_resolution === 'alternate_form_pending' ? (language === 'es' ? 'Forma alternativa pendiente' : 'Alternate form pending') : t.unknown}</p>
    <div className="stat-tables">{stats.map((values, group) => <div className="stat-group" key={group}>
      <h4>{group === 0 ? 'IV' : 'EV'}</h4>
      {t.stats.map((name, index) => { const value = values?.[STAT_ORDER[index]]; return <div className="stat-line" key={name}><span>{name}</span>{value != null && <progress aria-label={`${group === 0 ? 'IV' : 'EV'} ${name}`} max={group === 0 ? 31 : 255} value={value} />}<strong>{value ?? '—'}</strong></div>; })}
    </div>)}</div>
    <p className="note">{member.iv_source === 'native_uniform_difficulty_scale' && member.ev_source === 'native_creation_default_no_custom_spread' ? t.ivNote : t.unknown}</p>
  </article>;
}

export default function TrainerExplorer({ data, language, mode }: Props) {
  const t = strings[language];
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [pokemonQuery, setPokemonQuery] = useState('');
  const [moveQuery, setMoveQuery] = useState('');
  const [kind, setKind] = useState('first_visit');
  const [stage, setStage] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const detail = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(() => {
    const match = location.hash.match(/^#\/trainers\/(\d+)$/);
    return match ? Number(match[1]) : null;
  });
  useEffect(() => {
    const sync = () => { const match = location.hash.match(/^#\/trainers\/(\d+)$/); setSelected(match ? Number(match[1]) : null); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const deferredQuery = useDeferredValue(normalizeSearch(query));
  const normalizedPokemon = normalizeSearch(pokemonQuery);
  const normalizedMove = normalizeSearch(moveQuery);
  const speciesById = useMemo(() => new Map(data.species.map((s) => [s.id, s])), [data.species]);
  const categories = useMemo(() => [...new Map(data.trainers.map((entry) => [entry.class_name.en, entry.class_name])).entries()].sort((a, b) => localized(a[1], language).localeCompare(localized(b[1], language))), [data.trainers, language]);
  const filtered = useMemo(() => orderTrainers(data.trainers.filter((trainer) => {
    const encounter = trainer.journey?.kind || 'other';
    if (kind && encounter !== kind) return false;
    if (stage && (trainer.journey?.stage_id || 'other') !== stage) return false;
    if (category && trainer.class_name.en !== category) return false;
    if (normalizedPokemon && !trainer.members.some((member) => normalizeSearch(localized(speciesById.get(member.species_id)?.name, language)).includes(normalizedPokemon))) return false;
    if (normalizedMove && !trainer.members.some((member) => (member.move_ids_by_mode?.[mode] ?? member.move_ids).some((id) => normalizeSearch(localized(data.moves[id]?.name, language)).includes(normalizedMove)))) return false;
    const words = [localized(trainer.name, language), localized(trainer.class_name, language),
      ...(trainer.locations || []).map((place) => localized(place.name, language)),
      ...trainer.members.flatMap((member) => [localized(speciesById.get(member.species_id)?.name, language),
        ...(member.move_ids_by_mode?.[mode] ?? member.move_ids).map((id) => localized(data.moves[id]?.name, language))])];
    return normalizeSearch(words.join(' ')).includes(deferredQuery);
  }), data.trainer_journey.stages), [category, data, deferredQuery, kind, language, mode, normalizedMove, normalizedPokemon, speciesById, stage]);
  const maxPage = Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, maxPage);
  const trainer: Trainer | undefined = data.trainers.find((entry) => entry.id === selected);
  function selectTrainer(id: number) {
    setSelected(id);
    location.hash = `/trainers/${id}`;
    requestAnimationFrame(() => detail.current?.focus());
  }
  return <LazyMotion features={domAnimation} strict><section>
    <div className="section-title"><div><p className="section-tag">JOHTO · ULTIMATE GOLD</p><h1>{t.title}</h1><p>{t.intro}</p></div><span className="count">{filtered.length} {t.results}</span></div>
    <p className="mode-note">{localized(data.game_modes[mode]?.description, language)}</p>
    <div className="filters">
      <label>{t.search}<input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} /></label>
      <label>{t.kind}<select value={kind} onChange={(e) => { setKind(e.target.value); setPage(0); }}><option value="">{t.allKinds}</option><option value="first_visit">{t.first_visit}</option><option value="rematch">{t.rematch}</option><option value="other">{t.other}</option></select></label>
      <label>{t.stage}<select value={stage} onChange={(e) => { setStage(e.target.value); setPage(0); }}><option value="">{t.allStages}</option>{data.trainer_journey.stages.map((entry) => <option key={entry.id} value={entry.id}>{localized(entry.name, language)}</option>)}<option value="other">{t.other}</option></select></label>
      <label>{language === 'es' ? 'Categoría de entrenador' : 'Trainer category'}<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }}><option value="">{language === 'es' ? 'Todas' : 'All'}</option>{categories.map(([key, name]) => <option key={key} value={key}>{localized(name, language)}</option>)}</select></label>
      <label>Pokémon<input type="search" value={pokemonQuery} onChange={(event) => { setPokemonQuery(event.target.value); setPage(0); }} /></label>
      <label>{language === 'es' ? 'Movimiento' : 'Move'}<input type="search" value={moveQuery} onChange={(event) => { setMoveQuery(event.target.value); setPage(0); }} /></label>
    </div>
    <div className="explorer">
      <div className="trainer-list" aria-label={t.trainers}>{filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((entry) => <m.button whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.12 }} className={`trainer-option ${selected === entry.id ? 'selected' : ''}`} key={entry.id} onClick={() => selectTrainer(entry.id)} aria-pressed={selected === entry.id}>
        {entry.portrait?.src && <img src={entry.portrait.src} alt="" loading="lazy" />}<span className="trainer-identity"><strong>{localized(entry.name, language)}</strong><small>{localized(entry.class_name, language)} · {entry.locations?.map((place) => localized(place.name, language)).join(', ') || t.unknown}</small><span className="trainer-preview">{entry.members.map((member) => <span key={member.slot}><img src={`../sprites/pokemon/${member.species_id}.png`} alt="" loading="lazy" /><small>{localized(speciesById.get(member.species_id)?.name, language)} · {memberForMode(member, mode).level}</small></span>)}</span></span><span aria-hidden="true">›</span>
      </m.button>)}{filtered.length === 0 && <p>{t.noResults}</p>}
        {maxPage > 0 && <div className="pagination"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{t.previous}</button><span>{currentPage + 1} / {maxPage + 1}</span><button disabled={currentPage === maxPage} onClick={() => setPage(currentPage + 1)}>{t.next}</button></div>}
      </div>
      <div ref={detail} className="trainer-detail" role="region" aria-label={language === 'es' ? 'Detalle del equipo' : 'Team details'} tabIndex={-1}>{trainer ? <><div className="detail-heading">{trainer.portrait?.src && <img src={trainer.portrait.src} alt="" />}<div><p>{localized(trainer.class_name, language)}</p><h2>{localized(trainer.name, language)}</h2><p>{t.location}: {trainer.locations?.map((place) => localized(place.name, language)).join(', ') || t.unknown}{trainer.location_status === 'pending' && ` · ${language === 'es' ? 'Ubicación pendiente de confirmar' : 'Location pending confirmation'}`}</p><p>{t.kind}: {trainer.journey?.kind === 'first_visit' ? t.first_visit : trainer.journey?.kind === 'rematch' ? t.rematch : t.other} · {t.stage}: {localized(data.trainer_journey.stages.find((entry) => entry.id === trainer.journey?.stage_id)?.name, language)}</p></div></div><h2>{t.team} · {trainer.members.length}</h2><div className="team-grid">{trainer.members.map((member) => <MemberCard key={member.slot} member={member} data={data} language={language} mode={mode} />)}</div></> : <p className="empty-detail">{language === 'es' ? 'Selecciona un entrenador para ver su equipo.' : 'Select a trainer to view their team.'}</p>}</div>
    </div>
  </section></LazyMotion>;
}
