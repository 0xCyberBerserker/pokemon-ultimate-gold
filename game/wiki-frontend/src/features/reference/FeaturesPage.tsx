import type { Language, Localized, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { publicGuideHtml } from '../../data/guide-links';
import './project-overview.css';

type Props = { data: WikiData; language: Language; patchDefault?: Localized; wikiVersion?: Localized };

export default function FeaturesPage({ data, language, patchDefault, wikiVersion }: Props) {
  const es = language === 'es';
  const guide = data.guides.features;
  if (!guide) return <p>{es ? 'Características no disponibles.' : 'Features unavailable.'}</p>;

  return <section className="project-overview">
    <a className="back-link" href="#/guides">← {es ? 'Guías' : 'Guides'}</a>
    <header className="project-overview-header">
      <div><p className="section-tag">ULTIMATE GOLD</p><h1>{es ? 'Qué ofrece Ultimate Gold' : 'What Ultimate Gold offers'}</h1>
        <p>{es ? 'Una versión personalizada de HeartGold con cambios seleccionados, herramientas de consulta y builds con alcances distintos.' : 'A customized HeartGold experience with selected changes, reference tools and builds with different scopes.'}</p></div>
      <a className="project-overview-cta" href="#/patcher">{es ? 'Ver versiones en el parcheador' : 'See builds in the patcher'} →</a>
    </header>

    <div className="project-build-labels">
      <div className="panel"><span>{es ? 'Datos de esta wiki' : 'This wiki’s data'}</span><strong>{wikiVersion ? localized(wikiVersion, language) : (es ? 'Versión sin verificar' : 'Version not verified')}</strong></div>
      <div className="panel"><span>{es ? 'Predeterminado del parcheador' : 'Patcher default'}</span><strong>{patchDefault ? localized(patchDefault, language) : (es ? 'Consultar parcheador' : 'Check the patcher')}</strong></div>
    </div>

    <div className="project-feature-grid">
      <article className="panel project-feature-card">
        <span className="project-feature-kicker">{es ? 'BASE' : 'FOUNDATION'}</span>
        <h2>{es ? 'HeartGold y Pokédex clásica' : 'HeartGold and the classic Pokédex'}</h2>
        <p>{es ? 'Las builds conservan las 493 especies originales. No añaden especies nuevas.' : 'The builds retain the original 493 species. No new species are added.'}</p>
      </article>
      <article className="panel project-feature-card">
        <span className="project-feature-kicker">{es ? 'ALFA 2 · PRUEBAS ACOTADAS' : 'ALPHA 2 · BOUNDED TESTS'}</span>
        <h2>{es ? 'Cambios para la aventura' : 'Adventure changes'}</h2>
        <p>{es ? 'Incluye un regalo opcional del Team Rocket, existencias de objetos evolutivos y acciones de MO sin enseñar el movimiento. Hay evidencia nativa representativa; no equivale a probar toda la historia.' : 'Includes an optional Team Rocket gift, evolution-item shop stock and HM actions without teaching the move. Representative native evidence exists; it does not amount to a full story playthrough.'}</p>
      </article>
      <article className="panel project-feature-card">
        <span className="project-feature-kicker">{es ? 'WIKI' : 'WIKI'}</span>
        <h2>{es ? 'Consulta para preparar tu equipo' : 'References for team planning'}</h2>
        <p>{es ? 'Busca Pokémon, entrenadores, movimientos, objetos y rutas; revisa equipos, estadísticas y tipos con las etiquetas de evidencia disponibles.' : 'Look up Pokémon, trainers, moves, items and routes; review teams, stats and types alongside their documented evidence labels.'}</p>
      </article>
    </div>

    <article className="panel project-kit-summary">
      <h2>{es ? 'Kit Rocket (regalo del Team Rocket)' : 'Rocket Kit (Team Rocket gift)'}</h2>
      <ul>
        <li><strong>{es ? 'Qué es:' : 'What it is:'}</strong> {es ? 'Un regalo opcional de nueve objetos; incluye el marcador Cheat Kit (objeto 118).' : 'An optional gift of nine items; it includes the Cheat Kit marker (item 118).'}</li>
        <li><strong>{es ? 'Dónde:' : 'Where:'}</strong> {es ? 'Al sur de la casa suroeste de New Bark Town (Pueblo Primavera).' : 'South of the southwest house in New Bark Town (Pueblo Primavera).'}</li>
        <li><strong>{es ? 'Requisito:' : 'Requirement:'}</strong> {es ? 'Aceptar la oferta. La interacción de Alfa 2 está confirmada en el hash exacto; rechazarla, repetirla o recibirla con la Bolsa llena sigue sin probarse.' : 'Accept the offer. The Alpha 2 interaction is confirmed on the exact hash; declining, repeating it or accepting with a full Bag remain untested.'}</li>
        <li><strong>{es ? 'Cómo se usa:' : 'How to use it:'}</strong> {es ? 'Acepta «Do you like to cheat?» y conserva Cheat Kit (objeto 118) en la Bolsa para activar la reutilización. La guía describe este ejemplo: Bag → Key Items → TM Refill → Use (Bolsa → Objetos clave → Recarga MT → Usar) repone a 99 las MT01–MT92 que ya posees y no concede las ausentes; ese uso concreto aún no está verificado en Alfa 2. Sí hay pruebas exactas de reutilización de Rare Candy (Caramelo Raro), Oran Berry (Baya Aranja) y Max Repel (Repelente Máximo) en Alfa 2. Cuerda Huida en una cueva y bayas equipadas en combate siguen pendientes.' : 'Accept “Do you like to cheat?” and keep Cheat Kit (item 118) in your Bag to enable reuse. The guide describes this example: Bag → Key Items → TM Refill → Use sets owned TM01–TM92 to 99 and does not grant missing TMs; this specific use has not been verified on Alpha 2. Exact-target Alpha 2 checks do verify reuse of Rare Candy, Oran Berry and Max Repel. Escape Rope in a cave and held berries in battle remain pending.'}</li>
      </ul>
      <a className="text-link" href="#/guide/kit">{es ? 'Ver guía y límites del Kit Rocket' : 'Read the Rocket Kit guide and limits'} →</a>
    </article>

    <details className="panel project-technical-details">
      <summary>{es ? 'Procedencia, límites y notas técnicas completas' : 'Full provenance, limitations and technical notes'}</summary>
      <figure aria-label={es ? 'Linaje y ruta de los parches' : 'Lineage and patch routes'}>
        <figcaption><strong>{es ? 'Linaje y ruta de los parches' : 'Lineage and patch routes'}</strong></figcaption>
        <p>{es ? 'Linaje acreditado' : 'Credited upstream lineage'}: Drayano · Sacred Gold / Storm Silver 1.05 → Sacred Gold Plus 1.2.3</p>
        <p>{es ? 'Parches directos desde HeartGold USA limpia' : 'Direct patches from clean HeartGold USA'}: Ultimate Gold {es ? 'Alfa' : 'Alpha'} 1 · Ultimate Gold {es ? 'Alfa' : 'Alpha'} 2</p>
        <p>{es ? 'El linaje indica procedencia, no una secuencia para apilar parches. Cada versión utiliza su propio parche directo desde la ROM limpia.' : 'Lineage describes provenance, not a patch-stacking recipe. Each build uses its own direct patch from the clean ROM.'}</p>
      </figure>
      <div className="guide-html" dangerouslySetInnerHTML={{ __html: publicGuideHtml('features', guide.body[language] || '', language) }} />
    </details>
  </section>;
}
