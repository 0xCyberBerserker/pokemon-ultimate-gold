import type { Language, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import './detail-pages.css';

export default function AbilityDetail({ data, language, id }: { data: WikiData; language: Language; id: string | number }) {
  const es = language === 'es';
  const key = String(id);
  const ability = data.abilities[key];
  if (!ability) return <p>{es ? 'Habilidad no disponible.' : 'Ability unavailable.'}</p>;

  const slots = new Map<number, WikiData['species']>();
  for (const species of data.species) {
    for (const slot of species.ability_slots || []) {
      if (slot.ability_id !== Number(key)) continue;
      slots.set(slot.slot, [...(slots.get(slot.slot) || []), species]);
    }
  }

  return <section className="detail-page ability-detail">
    <a className="back-link" href="#/abilities">← {es ? 'Habilidades' : 'Abilities'}</a>
    <header className="detail-header"><p className="section-tag">{es ? 'HABILIDAD' : 'ABILITY'}</p><h1>{localized(ability.name, language)}</h1></header>
    <article className="panel detail-description"><h2>{es ? 'Efecto descrito' : 'Recorded description'}</h2><p>{localized(ability.description, language)}</p></article>
    <article className="panel detail-related">
      <h2>{es ? 'Especies con esta habilidad estándar' : 'Species with this standard ability'}</h2>
      {slots.size ? [...slots].sort(([a], [b]) => a - b).map(([slot, species]) => <section className="detail-slot" key={slot}>
        <h3>{es ? `Ranura estándar ${slot}` : `Standard slot ${slot}`}</h3>
        <ul className="detail-link-list">{species.map((entry) => <li key={entry.id}><a className="detail-pokemon-link" href={`#/pokemon/${entry.id}`}><img src={`../sprites/pokemon/${entry.id}.png`} alt="" loading="lazy" /><span>#{String(entry.id).padStart(3, '0')} · {localized(entry.name, language)}</span></a></li>)}</ul>
      </section>) : <p>{es ? 'No hay especies registradas para esta ranura en los datos disponibles.' : 'No species are recorded for this slot in the available data.'}</p>}
      <p className="detail-caveat">{es
        ? 'La descripción procede de datos de referencia; las ranuras corresponden a los datos seleccionados. Las habilidades individuales de Pokémon de entrenadores y la activación del efecto no están verificadas aquí.'
        : 'The description comes from reference data; slots come from the selected dataset. Individual trainer Pokémon abilities and in-game activation are not verified here.'}</p>
    </article>
  </section>;
}
