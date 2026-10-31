import type { Language } from './types';

export type GuideEntry = { id: string; title: string; description: string; href: string };
export type GuideAudience = 'player' | 'technical';
export type GuideTag = 'start' | 'advanced' | 'reference' | 'technical';
export type GuideGroup = { audience: GuideAudience; id: string; label: string; entries: GuideEntry[] };

const playerGuides: Record<string, GuideTag> = {
  player: 'start', faq: 'start', 'web-patcher': 'start',
  features: 'reference', evolutions: 'reference', items: 'reference',
  'item-locations': 'reference', 'trainer-locations': 'reference',
  'trainer-battles': 'advanced', 'battle-frontier': 'advanced', cheats: 'advanced',
  hm: 'advanced', 'tm-guide': 'advanced', 'tm-refill': 'advanced', kit: 'advanced', 'repel-reuse': 'advanced',
};

const groupLabels: Record<Language, Record<string, string>> = {
  en: {
    essentials: 'Start here', play: 'Play and explore', reference: 'Player reference',
    provenance: 'Sources and provenance', qa: 'QA and verification', studies: 'Studies and proposals',
    project: 'Project records',
  },
  es: {
    essentials: 'Empieza aquí', play: 'Jugar y explorar', reference: 'Referencia para jugadores',
    provenance: 'Fuentes y procedencia', qa: 'QA y verificación', studies: 'Estudios y propuestas',
    project: 'Registros del proyecto',
  },
};

const tagLabels: Record<Language, Record<GuideTag, string>> = {
  en: { start: 'Start here', advanced: 'Advanced', reference: 'Reference', technical: 'Technical' },
  es: { start: 'Para empezar', advanced: 'Avanzado', reference: 'Referencia', technical: 'Técnico' },
};

export function classifyGuide(id: string): { audience: GuideAudience; tag: GuideTag; group: string } {
  const tag = playerGuides[id];
  if (tag === 'start') return { audience: 'player', tag, group: 'essentials' };
  if (tag === 'advanced') return { audience: 'player', tag, group: 'play' };
  if (tag === 'reference') return { audience: 'player', tag, group: 'reference' };

  const group = id.includes('feasibility') || id.includes('study') || id === 'stat-editor' || id === 'kris'
    ? 'studies'
    : id.includes('source') || id.includes('crosscheck') || id === 'pchal-resources'
      ? 'provenance'
      : id === 'qa' || id.includes('qa') || id.includes('review') || id.includes('audit') || id.includes('fix6a')
        ? 'qa'
        : 'project';
  return { audience: 'technical', tag: 'technical', group };
}

export function guideTagLabel(tag: GuideTag, language: Language): string {
  return tagLabels[language][tag];
}

export function groupGuides(entries: GuideEntry[], language: Language): GuideGroup[] {
  const groups = new Map<string, GuideGroup>();
  for (const entry of entries) {
    const classification = classifyGuide(entry.id);
    const key = `${classification.audience}:${classification.group}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        audience: classification.audience,
        id: classification.group,
        label: groupLabels[language][classification.group] || groupLabels[language].project,
        entries: [],
      };
      groups.set(key, group);
    }
    group.entries.push(entry);
  }
  return [...groups.values()];
}
