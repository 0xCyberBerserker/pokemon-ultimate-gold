import type { Language, Localized, WikiData } from './types.ts';
import { localized } from './wiki.ts';
import { normalizeSearch } from './text.ts';

export interface SearchEntry { label: string; category: string; href: string; terms: string; normalized?: string }
function names(value: Localized | undefined) { return `${value?.en || ''} ${value?.es || ''}`; }

export function buildSearchIndex(data: WikiData, language: Language): SearchEntry[] {
  const es = language === 'es';
  const entries = [
    ...data.species.map((entry) => ({ label: localized(entry.name, language), terms: `${entry.id} ${names(entry.name)}`, category: 'Pokédex', href: `#/pokemon/${entry.id}` })),
    ...data.trainers.map((entry) => ({ label: `${localized(entry.class_name, language)} ${localized(entry.name, language)}`, terms: `${names(entry.class_name)} ${names(entry.name)}`, category: es ? 'Entrenadores' : 'Trainers', href: `#/trainers/${entry.id}` })),
    ...data.trainers.flatMap((entry) => (entry.locations || []).map((place) => ({ label: `${localized(place.name, language)} · ${localized(entry.name, language)}`, terms: `${names(place.name)} ${names(entry.name)}`, category: es ? 'Ubicaciones' : 'Locations', href: `#/trainers/${entry.id}` }))),
    ...Object.entries(data.moves).map(([id, entry]) => ({ label: localized(entry.name, language), terms: names(entry.name), category: es ? 'Movimientos' : 'Moves', href: `#/moves/${id}` })),
    ...Object.entries(data.abilities).map(([id, entry]) => ({ label: localized(entry.name, language), terms: `${names(entry.name)} ${names(entry.description)}`, category: es ? 'Habilidades' : 'Abilities', href: `#/abilities/${id}` })),
    ...Object.entries(data.items).map(([id, entry]) => ({ label: localized(entry.name, language), terms: names(entry.name), category: es ? 'Objetos' : 'Items', href: `#/items/${id}` })),
    ...data.tmhm.map((entry) => ({ label: `${es ? (entry.kind === 'tm' ? 'MT' : 'MO') : entry.kind.toUpperCase()} ${entry.number} · ${localized(data.moves[entry.move_id]?.name, language)}`, terms: `${entry.kind} ${entry.number} ${names(data.moves[entry.move_id]?.name)}`, category: es ? 'MT / MO' : 'TMs / HMs', href: `#/items/${entry.item_id}` })),
    ...Object.entries(data.guides).map(([id, entry]) => ({ label: localized(entry.title, language), terms: `${names(entry.title)} ${(entry.body.en || '').replace(/<[^>]*>/g, ' ')} ${(entry.body.es || '').replace(/<[^>]*>/g, ' ')}`, category: es ? 'Guías' : 'Guides', href: `#/guide/${id}` })),
  ];
  return entries.map((entry) => ({ ...entry, normalized: normalizeSearch(`${entry.label} ${entry.terms}`) }));
}

export function searchGroups(index: SearchEntry[], query: string, limit = 5) {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const grouped = new Map<string, { category: string; entries: SearchEntry[]; total: number }>();
  for (const entry of index) {
    const haystack = entry.normalized ?? normalizeSearch(`${entry.label} ${entry.terms}`);
    if (!words.every((word) => haystack.includes(word))) continue;
    let group = grouped.get(entry.category);
    if (!group) { group = { category: entry.category, entries: [], total: 0 }; grouped.set(entry.category, group); }
    group.total++;
    if (group.entries.length < limit) group.entries.push(entry);
  }
  return [...grouped.values()];
}
