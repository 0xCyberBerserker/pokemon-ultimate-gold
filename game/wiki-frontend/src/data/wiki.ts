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
  const catalog = rawCatalog as { default?: string; versions?: Record<string, { manifest?: string; label?: Localized }> } | null;
  const version = catalog?.default ? catalog.versions?.[catalog.default] : undefined;
  if (!version?.manifest || !/^\.\/patch-manifest-[a-z0-9-]+\.json$/.test(version.manifest) || !version.label?.en || !version.label.es) {
    throw new Error('Invalid patch catalog');
  }
  const manifest = await readJson(`../data/${version.manifest.slice(2)}`, signal) as { target?: { sha256?: string }; source?: PatchSource } | null;
  if (!manifest?.target?.sha256 || manifest.target.sha256 !== (data as WikiData).target_sha256) throw new Error('Wiki data target mismatch');
  if (!manifest.source || !/^[a-f0-9]{64}$/.test(manifest.source.sha256) || !Number.isSafeInteger(manifest.source.size) || manifest.source.size <= 0) throw new Error('Invalid source manifest');
  return { data: data as WikiData, version: version.label, source: manifest.source };
}
