import type { Language, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { publicGuideHtml } from '../../data/guide-links';
import './mechanics.css';

type Props = { data: WikiData; language: Language };

export default function MechanicsPage({ data, language }: Props) {
  const es = language === 'es';
  const report = data.guides.mechanics;
  const reportBody = report?.body[language] || '';

  return <section className="mechanics-page">
    <div className="section-title">
      <div><p className="section-tag">ULTIMATE GOLD</p><h1>{es ? 'Tipos y efectividad' : 'Types and effectiveness'}</h1></div>
      <span className="mechanics-data-badge">{es ? 'Datos de la wiki: Alfa 2' : 'Wiki data: Alpha 2'}</span>
    </div>
    <p className="mechanics-intro">{es
      ? 'Consulta cómo afectan los tipos a un ataque y a quien lo recibe. La tabla de cruces concreta de Alfa 2 aún está pendiente de cotejo con el hash exacto.'
      : 'Learn how types affect an attack and its target. The Alpha 2 matchup table is still pending verification against the exact build hash.'}</p>

    <article className="panel mechanics-pending" role="note">
      <strong>{es ? 'Tabla de efectividades pendiente de verificación' : 'Effectiveness table pending verification'}</strong>
      <p>{es
        ? 'La auditoría disponible corresponde a otro build experimental anterior a Alfa 2. Sus cruces no se atribuyen a esta versión. Esta página no muestra relaciones concretas hasta disponer de datos cotejados con Alfa 2.'
        : 'The available audit covers a different experimental build that predates Alpha 2. Its matchups are not attributed to this version. This page will show specific pairings once Alpha 2 data has been verified.'}</p>
    </article>

    <section className="mechanics-outcomes" aria-labelledby="mechanics-outcomes-title">
      <h2 id="mechanics-outcomes-title">{es ? 'Cómo leer una efectividad' : 'How to read effectiveness'}</h2>
      <p>{es
        ? 'El gráfico de tipos relaciona el tipo del ataque con el tipo de quien lo recibe. Estas etiquetas explican los resultados posibles; no indican cruces concretos de Alfa 2.'
        : 'The type chart relates an attack’s type to the target’s type. These labels explain the possible outcomes; they do not identify specific Alpha 2 matchups.'}</p>
      <div className="mechanics-outcome-list">
        <article className="panel mechanics-outcome">
          <span className="mechanics-outcome-symbol" aria-hidden="true">↑</span>
          <div><h3>{es ? 'Débil ante el ataque' : 'Weak to the attack'}</h3><p>{es ? 'El tipo defensor recibe más daño de ese tipo de ataque.' : 'The defending type takes more damage from that attack type.'}</p></div>
        </article>
        <article className="panel mechanics-outcome">
          <span className="mechanics-outcome-symbol" aria-hidden="true">↓</span>
          <div><h3>{es ? 'Resiste el ataque' : 'Resists the attack'}</h3><p>{es ? 'El tipo defensor recibe menos daño de ese tipo de ataque.' : 'The defending type takes less damage from that attack type.'}</p></div>
        </article>
        <article className="panel mechanics-outcome">
          <span className="mechanics-outcome-symbol" aria-hidden="true">∅</span>
          <div><h3>{es ? 'Inmunidad' : 'Immunity'}</h3><p>{es ? 'Ese tipo de ataque no afecta a ese tipo defensor.' : 'That attack type has no effect on that defending type.'}</p></div>
        </article>
      </div>
    </section>

    {reportBody && <details className="panel mechanics-technical-report">
      <summary>{es ? 'Informe técnico de mecánicas y compatibilidad' : 'Technical mechanics and compatibility report'}</summary>
      <p>{localized(report.title, language)}</p>
      <div className="guide-html" dangerouslySetInnerHTML={{ __html: publicGuideHtml('mechanics', reportBody, language) }} />
    </details>}
  </section>;
}
