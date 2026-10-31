import type { Language, Localized } from './types.ts';
import { normalizeSearch } from './text.ts';

export interface CheatEntry {
  id: string;
  category: string;
  folder: string;
  title: Localized;
  source_title: string;
  code: string;
  source_note?: string;
  activation_buttons: string[];
  status: string;
  requires_custom_wrapper?: boolean;
}
export interface CheatCatalog {
  target_sha256: string;
  source: { url: string };
  categories: Record<string, Localized>;
  folders: { id: string; source_title: string }[];
  entries: CheatEntry[];
}
export interface CheatFilters { query: string; category: string; folder: string; status: string }

export function validateCheatCatalog(catalog: CheatCatalog, target: string): boolean {
  return Boolean(target && catalog && catalog.target_sha256 === target && Array.isArray(catalog.entries) && Array.isArray(catalog.folders) && catalog.categories && typeof catalog.categories === 'object' && typeof catalog.source?.url === 'string');
}
export function filterCheats(entries: CheatEntry[], filters: CheatFilters): CheatEntry[] {
  const words = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  return entries.filter((entry) => (!filters.category || entry.category === filters.category) && (!filters.folder || entry.folder === filters.folder) && (!filters.status || entry.status === filters.status) &&
    words.every((word) => normalizeSearch(`${entry.id} ${entry.title.en} ${entry.title.es} ${entry.source_title} ${entry.code}`).includes(word)));
}
export function retroarchProfile(entry: CheatEntry, language: Language, target: string): string {
  return [`# Ultimate Gold ${entry.id}: runtime effect untested`, `# target_sha256: ${target}`, 'cheats = "1"',
    `cheat0_desc = ${JSON.stringify(entry.title[language])}`, 'cheat0_enable = "false"', 'cheat0_handler = "0"',
    `cheat0_code = "${entry.code.split('\n').join('+')}"`, ''].join('\n');
}
