import type { Language, Localized, Species, WikiData } from './types.ts';
import { localized } from './wiki.ts';
import { normalizeSearch } from './text.ts';

function searchNames(value: Localized | undefined): string {
  return value ? `${value.en || ''} ${value.es || ''}` : '';
}
function acquisitionSearch(item: WikiData['items'][string]): string {
  return (item.acquisition || []).map((record) => `${searchNames(record.location?.name)} ${searchNames(record.method)}`).join(' ');
}
export function filterMoves(data: WikiData, language: Language, query: string, type: string, category: string) {
  const normalized = normalizeSearch(query.trim());
  return Object.entries(data.moves).filter(([, move]) =>
    (!type || String(move.type_id) === type) && (!category || String(move.category) === category) &&
    normalizeSearch(`${searchNames(move.name)} ${localized(move.name, language)}`).includes(normalized));
}
export function filterItems(data: WikiData, language: Language, query: string, category: string) {
  const normalized = normalizeSearch(query.trim());
  return Object.entries(data.items).filter(([, item]) =>
    (!category || item.category_id === category) &&
    normalizeSearch(`${searchNames(item.name)} ${localized(item.name, language)} ${acquisitionSearch(item)}`).includes(normalized));
}
export function filterMachines(data: WikiData, language: Language, query: string, kind: string, type: string) {
  const normalized = normalizeSearch(query.trim());
  return data.tmhm.filter((machine) => {
    const item = data.items[machine.item_id];
    const move = data.moves[machine.move_id];
    return (!kind || machine.kind === kind) && (!type || String(move?.type_id) === type) &&
      normalizeSearch(`${machine.kind} ${machine.number} ${searchNames(move?.name)} ${localized(move?.name, language)} ${searchNames(item?.name)} ${item ? acquisitionSearch(item) : ''}`).includes(normalized);
  });
}
export function filterLearnset(species: Species, moves: WikiData['moves'], query: string) {
  const normalized = normalizeSearch(query.trim());
  return species.learnset.filter((entry) => normalizeSearch(`${entry.level} ${searchNames(moves[entry.move_id]?.name)}`).includes(normalized));
}
