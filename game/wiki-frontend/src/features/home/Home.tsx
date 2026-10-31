import { BookOpen, Compass, Disc3, Package, Sparkles, Swords, Wrench } from 'lucide-react';
import type { Language, WikiData } from '../../data/types';

export default function Home({ language, data }: { language: Language; data: WikiData }) {
  const es = language === 'es';
  return <section className="home-page"><div className="home-hero"><img src="../assets/branding/ultimate-gold-header.png" alt={es ? 'Ho-Oh sobrevolando Johto al atardecer, con la marca Ultimate Gold.' : 'Ho-Oh flying over Johto at sunset, with Ultimate Gold branding.'} /><div><h1>{es ? 'Tu guía de Johto.' : 'Your Johto guide.'}</h1><p>{es ? 'Consulta los equipos por ubicación, revisa datos de Pokémon y movimientos, y encuentra objetos o máquinas mientras recorres Johto.' : 'Follow trainer teams by location, check Pokémon and move details, and look up items or machines as you play through Johto.'}</p><div className="home-actions"><a href="#/trainers">{es ? 'Explorar equipos' : 'Explore trainer teams'} →</a><a href="#/pokemon">{es ? 'Abrir la Pokédex' : 'Open the Pokédex'} →</a></div></div></div>
    <h2>{es ? 'Empieza tu aventura' : 'Start your adventure'}</h2>
    <div className="home-start">
      <article className="panel home-start-guide"><BookOpen aria-hidden="true" /><div><h3>{es ? 'Guía del jugador' : 'Player guide'}</h3><p>{es ? 'Conoce el juego y prepara tus primeros pasos.' : 'Get to know the game and prepare for your first steps.'}</p><a href="#/guide/player">{es ? 'Leer la guía' : 'Read the guide'} <span aria-hidden="true">→</span></a></div></article>
      <article className="panel home-start-journey"><Compass aria-hidden="true" /><div><h3>{es ? 'Recorre Johto y Kanto' : 'Travel through Johto and Kanto'}</h3><p>{es ? 'Consulta entrenadores y equipos por tramo.' : 'Find trainers and teams by journey stage.'}</p><a href="#/trainers">{es ? 'Ver el recorrido' : 'Explore the journey'} <span aria-hidden="true">→</span></a></div></article>
      <article className="panel home-start-partners"><div><h3>{es ? 'Tu equipo Pokémon' : 'Your Pokémon team'}</h3><p>{es ? 'Explora especies, habilidades y evoluciones.' : 'Explore species, abilities and evolutions.'}</p><a href="#/pokemon">{es ? 'Abrir la Pokédex' : 'Open the Pokédex'} <span aria-hidden="true">→</span></a></div><div className="home-partners" aria-hidden="true">{[152, 155, 158].map((id) => <img src={`../sprites/pokemon/${id}.png`} alt="" key={id} />)}</div></article>
    </div>
    <h2>{es ? 'Explora la wiki' : 'Explore the wiki'}</h2><div className="home-grid">{[
      { href: '#/trainers', title: es ? 'Entrenadores' : 'Trainers', detail: `${data.trainers.length}`, icon: Swords },
      { href: '#/pokemon', title: 'Pokédex', detail: `${data.species.length}`, icon: BookOpen },
      { href: '#/evolutions', title: es ? 'Evoluciones' : 'Evolutions', detail: es ? 'Familias' : 'Families', icon: Sparkles },
      { href: '#/moves', title: es ? 'Movimientos' : 'Moves', detail: `${Object.keys(data.moves).length}`, icon: Sparkles },
      { href: '#/items', title: es ? 'Objetos' : 'Items', detail: `${Object.keys(data.items).length}`, icon: Package },
      { href: '#/machines', title: es ? 'MT y MO' : 'TMs and HMs', detail: `${data.tmhm.length}`, icon: Disc3 },
      { href: '#/guides', title: es ? 'Guías' : 'Guides', detail: es ? 'Ayuda y recursos' : 'Help and resources', icon: BookOpen },
      { href: '#/patcher', title: es ? 'Parcheador' : 'Patcher', detail: es ? 'Aplicación local' : 'Local patching', icon: Wrench },
    ].map(({ href, title, detail, icon: Icon }) => <a href={href} className="panel" key={href}><Icon aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span><span className="home-card-arrow" aria-hidden="true">→</span></a>)}</div>
  </section>;
}
