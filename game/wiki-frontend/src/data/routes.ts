const sections = ['moves', 'items', 'machines', 'abilities', 'guides', 'guide', 'evolutions', 'faq', 'mechanics', 'patcher', 'cheats', 'kris-progress'] as const;
type Section = typeof sections[number];
export type Route = { kind: 'home' | 'not-found' } | { kind: 'pokemon' | 'trainers'; id?: number } | { kind: Section; id?: string };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return { kind: 'home' };
  if (parts.length > 2) return { kind: 'not-found' };
  const [section, id] = parts;
  if (section === 'pokemon' || section === 'trainers') {
    if (id && (!/^\d+$/.test(id) || Number(id) < 1)) return { kind: 'not-found' };
    return id ? { kind: section, id: Number(id) } : { kind: section };
  }
  if (sections.includes(section as Section)) return id ? { kind: section as Section, id } : { kind: section as Section };
  return { kind: 'not-found' };
}
