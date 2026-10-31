import type { Language } from '../../data/types';
import { classifyGuide, groupGuides, guideTagLabel, type GuideEntry } from '../../data/guide-groups';
import './guide-index.css';

type Props = {
  entries: GuideEntry[];
  language: Language;
  filter?: (entry: GuideEntry) => boolean;
};

export default function GuideIndex({ entries, language, filter }: Props) {
  const es = language === 'es';
  const filtered = filter ? entries.filter(filter) : entries;
  const groups = groupGuides(filtered, language);
  const playerGroups = groups.filter((group) => group.audience === 'player');
  const technicalGroups = groups.filter((group) => group.audience === 'technical');
  const essentials = playerGroups.find((group) => group.id === 'essentials');

  return <div className="guide-index">
    {essentials && <section className="guide-index-essentials" aria-labelledby="guide-index-essentials">
      <div className="guide-index-heading"><div><p className="section-tag">{es ? 'GUÍAS PARA JUGAR' : 'PLAYER GUIDES'}</p><h2 id="guide-index-essentials">{es ? 'Empieza aquí' : 'Start here'}</h2></div><span className="count">{essentials.entries.length}</span></div>
      <div className="guide-index-cards">{essentials.entries.map((entry) => <GuideCard entry={entry} language={language} key={entry.id} featured />)}</div>
    </section>}
    {playerGroups.filter((group) => group.id !== 'essentials').map((group) => <section className="guide-index-section" key={group.id}>
      <h2>{group.label}</h2><div className="guide-index-cards">{group.entries.map((entry) => <GuideCard entry={entry} language={language} key={entry.id} />)}</div>
    </section>)}
    {technicalGroups.length > 0 && <section className="guide-index-technical" aria-labelledby="guide-index-technical">
      <div className="guide-index-heading"><div><p className="section-tag">{es ? 'DOCUMENTACIÓN' : 'DOCUMENTATION'}</p><h2 id="guide-index-technical">{es ? 'Documentación técnica' : 'Technical documentation'}</h2></div><span className="count">{technicalGroups.reduce((total, group) => total + group.entries.length, 0)}</span></div>
      <p className="guide-index-intro">{es ? 'Fuentes, QA, estudios y registros del proyecto.' : 'Sources, QA, studies, and project records.'}</p>
      {technicalGroups.map((group) => <section className="guide-index-section" key={group.id}><h3>{group.label}</h3><div className="guide-index-cards">{group.entries.map((entry) => <GuideCard entry={entry} language={language} key={entry.id} />)}</div></section>)}
    </section>}
  </div>;
}

function GuideCard({ entry, language, featured = false }: { entry: GuideEntry; language: Language; featured?: boolean }) {
  const classification = classifyGuide(entry.id);
  return <a className={`panel guide-index-card${featured ? ' guide-index-card-featured' : ''}`} href={entry.href} key={entry.id}>
    <span className={`guide-index-tag guide-index-tag-${classification.tag}`}>{guideTagLabel(classification.tag, language)}</span>
    <strong>{entry.title}</strong>
  </a>;
}
