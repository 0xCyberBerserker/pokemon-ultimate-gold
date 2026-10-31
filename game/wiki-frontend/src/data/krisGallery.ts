import type { Localized } from './types.ts';

export interface GalleryReference {
  collection_id?: string;
  run_id?: string;
  frame_index_from_filename?: number | null;
  frame_number_basis?: number | string | null;
  source_file?: string;
  source_seal?: string;
  source_seal_sha256?: string;
  build_sha256?: string;
  status_as_sealed?: string;
}
export interface GalleryImage {
  id: string;
  file: string;
  sha256: string;
  caption: Localized;
  alt: Localized;
  build_sha256s?: string[];
  source_references: GalleryReference[];
  permissions?: { credit?: Localized };
}
export interface GalleryCollection { caption: Localized; stage: string; status_note?: Localized }
export interface GalleryManifest {
  collections: Record<string, GalleryCollection>;
  images: GalleryImage[];
}
export interface OrderedImage { image: GalleryImage; primary: GalleryReference }

export function galleryStatuses(image: GalleryImage, collections: Record<string, GalleryCollection>): string[] {
  return [...new Set((image.source_references || []).map((ref) => collections[ref.collection_id || '']?.stage).filter((stage): stage is string => Boolean(stage)))];
}

export function galleryImagePath(file: string): string | null {
  return /^png\/[A-Za-z0-9._-]+\.png$/.test(file) ? `../assets/kris-progress/${file}` : null;
}

export function orderedGallery(manifest: GalleryManifest, collectionId = ''): OrderedImage[] {
  const order = new Map(Object.keys(manifest.collections).map((id, index) => [id, index]));
  const frame = (reference: GalleryReference) => typeof reference.frame_index_from_filename === 'number' ? reference.frame_index_from_filename : Number.MAX_SAFE_INTEGER;
  const compare = (a: GalleryReference, b: GalleryReference) =>
    (order.get(a.collection_id || '') ?? Number.MAX_SAFE_INTEGER) - (order.get(b.collection_id || '') ?? Number.MAX_SAFE_INTEGER) ||
    (a.run_id || '').localeCompare(b.run_id || '') || frame(a) - frame(b);
  return manifest.images.filter((image) => !collectionId || (image.source_references || []).some((ref) => ref.collection_id === collectionId))
    .map((image) => ({ image, primary: [...(image.source_references || [])].filter((ref) => !collectionId || ref.collection_id === collectionId).sort(compare)[0] || {} }))
    .sort((a, b) => compare(a.primary, b.primary) || a.image.id.localeCompare(b.image.id));
}
