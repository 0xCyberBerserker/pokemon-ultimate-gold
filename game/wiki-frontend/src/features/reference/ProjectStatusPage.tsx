import type { Language, Localized, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { publicGuideHtml } from '../../data/guide-links';
import './project-overview.css';

type Props = { data: WikiData; language: Language; patchDefault?: Localized; wikiVersion?: Localized };

export default function ProjectStatusPage({ data, language, patchDefault, wikiVersion }: Props) {
  const es = language === 'es';
  const guide = data.guides.progress;
  if (!guide) return <p>{es ? 'Estado del proyecto no disponible.' : 'Project status unavailable.'}</p>;

  return <section className="project-overview project-status-page">
    <a className="back-link" href="#/guides">← {es ? 'Guías' : 'Guides'}</a>
    <header className="project-overview-header">
      <div><p className="section-tag">{es ? 'ESTADO · 31 OCT 2026' : 'STATUS · 31 OCT 2026'}</p><h1>{es ? 'Estado y versiones' : 'Status and builds'}</h1>
        <p>{es ? 'La descarga, los datos de la wiki y las candidatas privadas son referencias distintas. Este resumen indica qué corresponde a cada una.' : 'The download, wiki data and private candidates are separate references. This summary identifies which status belongs to each.'}</p></div>
      <a className="project-overview-cta" href="#/patcher">{es ? 'Abrir parcheador' : 'Open patcher'} →</a>
    </header>

    <div className="project-status-grid">
      <article className="panel project-status-card">
        <span className="project-status-state">{es ? 'DISPONIBLE · EXPERIMENTAL' : 'AVAILABLE · EXPERIMENTAL'}</span>
        <h2>{es ? 'Alfa 2' : 'Alpha 2'}</h2>
        <p>{es ? 'Build seleccionable con kit Rocket, existencias de objetos evolutivos y acciones de MO. Las pruebas son acotadas; no certifican toda la aventura.' : 'Selectable build with the Rocket kit, evolution-item stock and HM actions. Testing is bounded and does not certify the full adventure.'}</p>
      </article>
      <article className="panel project-status-card">
        <span className="project-status-state">{es ? 'DATOS VERIFICADOS POR HASH' : 'HASH-PINNED DATA'}</span>
        <h2>{wikiVersion ? localized(wikiVersion, language) : (es ? 'Datos de la wiki' : 'Wiki data')}</h2>
        <p>{es ? 'La wiki usa datos cotejados con su manifiesto. Su versión puede diferir de la versión predeterminada del parcheador.' : 'Wiki data is checked against its manifest. Its version may differ from the patcher default.'}</p>
      </article>
      <article className="panel project-status-card">
        <span className="project-status-state">{es ? 'DISPONIBLE · EXPERIMENTAL' : 'AVAILABLE · EXPERIMENTAL'}</span>
        <h2>{patchDefault ? localized(patchDefault, language) : (es ? 'Versión del parcheador' : 'Patcher build')}</h2>
        <p>{es ? 'Build pública predeterminada seleccionada por el catálogo del parcheador.' : 'Public default build selected by the patcher catalog.'}</p>
      </article>
      <article className="panel project-status-card project-status-private">
        <span className="project-status-state">{es ? 'CANDIDATA PRIVADA · REVISIÓN ACOTADA' : 'PRIVATE CANDIDATE · BOUNDED REVIEW'}</span>
        <h2>{es ? 'Kris: revisión técnica superada' : 'Kris: technical review passed'}</h2>
        <p>{es ? 'La revisión corresponde a una candidata privada concreta. Sus resultados no acreditan la build pública predeterminada que aparece arriba. Consulta el historial para ver su alcance; no equivale a aceptar una partida completa.' : 'This review concerns one specific private candidate. Its results do not establish the public default build shown above. See the history for its scope; it does not amount to full-playthrough acceptance.'}</p>
      </article>
    </div>

    <p className="project-status-caveat" role="note">{es
      ? 'Las pruebas de una versión no se atribuyen automáticamente a otra. Consulta el historial técnico antes de comparar resultados.'
      : 'Tests from one build do not automatically apply to another. Check the technical history before comparing results.'}</p>

    <details className="panel project-technical-details">
      <summary>{es ? 'Historial técnico completo: pruebas, fechas, hashes y límites' : 'Full technical history: tests, dates, hashes and limits'}</summary>
      <p>{localized(guide.title, language)}</p>
      <div className="guide-html" dangerouslySetInnerHTML={{ __html: publicGuideHtml('progress', guide.body[language] || '', language) }} />
    </details>
  </section>;
}
