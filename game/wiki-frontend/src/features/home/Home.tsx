import type { Language, WikiData } from '../../data/types';

export default function Home({ language, data }: { language: Language; data: WikiData }) {
  const es = language === 'es';
  return <section className="home-page"><div className="home-hero"><img src="../assets/branding/ultimate-gold-header.png" alt={es ? 'Ho-Oh sobrevolando Johto al atardecer, con la marca Ultimate Gold.' : 'Ho-Oh flying over Johto at sunset, with Ultimate Gold branding.'} /><div><h1>{es ? 'Tu guía de Johto.' : 'Your Johto guide.'}</h1><p>{es ? 'Consulta los equipos por ubicación, revisa datos de Pokémon y movimientos, y encuentra objetos o máquinas mientras recorres Johto.' : 'Follow trainer teams by location, check Pokémon and move details, and look up items or machines as you play through Johto.'}</p><div className="home-actions"><a href="#/trainers">{es ? 'Explorar equipos' : 'Explore trainer teams'} →</a><a href="#/pokemon">{es ? 'Abrir la Pokédex' : 'Open the Pokédex'} →</a></div></div></div>
    <h2>{es ? 'Elige una referencia' : 'Choose a reference'}</h2><div className="home-grid">{[
      ['#/trainers', es ? 'Entrenadores' : 'Trainers', data.trainers.length],
      ['#/pokemon', 'Pokédex', data.species.length],
      ['#/moves', es ? 'Movimientos' : 'Moves', Object.keys(data.moves).length],
      ['#/machines', es ? 'MT y MO' : 'TMs and HMs', data.tmhm.length],
      ['#/guides', es ? 'Guías' : 'Guides', null],
      ['#/patcher', es ? 'Parcheador' : 'Patcher', null],
    ].map(([href, title, count]) => <a href={String(href)} className="panel" key={String(href)}><strong>{title}</strong>{count != null && <span>{count}</span>}<span aria-hidden="true">→</span></a>)}</div>
  </section>;
}
