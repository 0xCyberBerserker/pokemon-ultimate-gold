import type { Language } from './types';

type GuideEntry = { id: string; title: string; description: string; href: string };

export function groupGuides(entries: GuideEntry[], language: Language) {
  const es = language === 'es';
  const groups = [
    { label: es ? 'Empieza aquí' : 'Start here', matches: (id: string) => ['player', 'faq', 'web-patcher'].includes(id) },
    { label: es ? 'Jugar y explorar' : 'Play and explore', matches: (id: string) => ['trainer-battles', 'battle-frontier', 'mechanics', 'hm', 'items', 'tm-guide', 'tm-refill', 'repel-reuse'].includes(id) },
    { label: es ? 'Datos de referencia y fuentes' : 'Reference data and sources', matches: (id: string) => ['evolutions', 'item-locations', 'trainer-locations', 'sources', 'sources-inventory', 'drayano-crosscheck', 'mods-crosscheck', 'pchal-resources', 'nature-override-consumers'].includes(id) },
    { label: es ? 'Características y herramientas opcionales' : 'Features and optional tools', matches: (id: string) => ['features', 'kit', 'cheats'].includes(id) },
    { label: es ? 'Estado y recursos del proyecto' : 'Project status and assets', matches: (id: string) => ['progress', 'discrepancy-register', 'branding-assets', 'custom-item-art', 'wiki-ui'].includes(id) },
    { label: es ? 'Estudios de viabilidad y propuestas' : 'Feasibility studies and proposals', matches: (id: string) => id.includes('feasibility') || ['stat-editor', 'kris'].includes(id) },
    { label: es ? 'Informes de QA y verificación' : 'QA and verification reports', matches: (id: string) => id === 'qa' || id === 'cheat-kit-audit' || id.startsWith('qa-') || id.endsWith('-qa') || id.includes('-qa-') || id.includes('-review') || id.includes('fix6a') },
    { label: es ? 'Otros registros del proyecto' : 'Additional project records', matches: () => true },
  ].map((group) => ({ ...group, entries: [] as GuideEntry[] }));
  for (const entry of entries) groups.find((group) => group.matches(entry.id))!.entries.push(entry);
  return groups.filter((group) => group.entries.length);
}
