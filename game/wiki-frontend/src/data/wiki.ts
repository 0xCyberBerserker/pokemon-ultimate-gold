import type { Language, Localized, WikiData } from './types';

export function localized(value: Localized | undefined, language: Language): string {
  return value?.[language] || value?.en || '—';
}

async function readJson(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

export type PatchSource = { sha256: string; size: number };

export async function loadWiki(signal: AbortSignal): Promise<{ data: WikiData; version: Localized; source: PatchSource }> {
  const [data, rawCatalog] = await Promise.all([
    readJson('../data/wiki-data.json', signal),
    readJson('../data/patch-catalog.json', signal),
  ]);
  if (!data || typeof data !== 'object' || !Array.isArray((data as WikiData).trainers) || !Array.isArray((data as WikiData).species)) {
    throw new Error('Invalid wiki data');
  }
  const catalog = rawCatalog as { default?: string; wiki_data?: string; versions?: Record<string, { manifest?: string; label?: Localized }> } | null;
  const dataVersion = catalog?.wiki_data ? catalog.versions?.[catalog.wiki_data] : undefined;
  const patchVersion = catalog?.default ? catalog.versions?.[catalog.default] : undefined;
  const valid = (entry: typeof dataVersion) => !!entry?.manifest && /^\.\/patch-manifest-[a-z0-9-]+\.json$/.test(entry.manifest) && !!entry.label?.en && !!entry.label.es;
  if (!valid(dataVersion) || !valid(patchVersion) || !dataVersion?.manifest || !dataVersion.label || !patchVersion?.manifest) throw new Error('Invalid patch catalog');
  const [dataManifest, patchManifest] = await Promise.all([
    readJson(`../data/${dataVersion.manifest.slice(2)}`, signal),
    readJson(`../data/${patchVersion.manifest.slice(2)}`, signal),
  ]) as [{ target?: { sha256?: string } } | null, { source?: PatchSource } | null];
  if (!dataManifest?.target?.sha256 || dataManifest.target.sha256 !== (data as WikiData).target_sha256) throw new Error('Wiki data target mismatch');
  const source = patchManifest?.source;
  if (!source || !/^[a-f0-9]{64}$/.test(source.sha256) || !Number.isSafeInteger(source.size) || source.size <= 0) throw new Error('Invalid source manifest');
  return { data: data as WikiData, version: dataVersion.label, source };
}
