export type Language = 'en' | 'es';
export type GameMode = 'normal' | 'plus';
export type Localized = { en: string; es: string };

export interface Species {
  id: number;
  name: Localized;
  generation: number;
  types: number[];
  abilities: number[];
  stats: number[];
  evolutions: { target: number; condition?: Localized }[];
  learnset: { level: number; move_id: number }[];
  ability_slots?: { slot: number; ability_id: number | null }[];
  stat_comparison?: { status: string; baseline_stats: number[]; target_stats: number[]; delta: number[]; baseline_total: number; target_total: number; total_delta: number; decreased_stat_indices: number[] };
}
export interface Member {
  slot: number;
  species_id: number;
  form?: number;
  level: number;
  item_id: number;
  move_ids: number[];
  ivs?: number[];
  evs?: number[];
  iv_source?: string;
  ev_source?: string;
  move_resolution?: string;
  levels_by_mode?: Record<GameMode, number>;
  move_ids_by_mode?: Record<GameMode, number[]>;
}
export interface Trainer {
  id: number;
  name: Localized;
  class_name: Localized;
  members: Member[];
  locations?: { id: number; name: Localized }[];
  location_status?: string;
  journey?: { stage_id: string; kind: string; order: number } | null;
  portrait?: { src: string } | null;
}
export interface WikiData {
  target_sha256: string;
  species: Species[];
  species_stat_comparison?: { counts: { boosted: number; redistributed: number; unchanged: number }; record_layout: { path: string }; sources: { baseline: { sha256: string }; target: { sha256: string } } };
  trainers: Trainer[];
  types: Record<string, Localized & { icon?: string }>;
  moves: Record<string, { name: Localized; type_id: number; category: number; power: number; accuracy: number; pp: number; description: Localized }>;
  abilities: Record<string, { name: Localized; description: Localized }>;
  items: Record<string, { name: Localized; description: Localized; sprite?: string; category_id?: string; category?: Localized; nds_id?: number; icon_status?: string; acquisition?: Acquisition[] }>;
  guides: Record<string, { title: Localized; body: Record<Language, string> }>;
  tmhm: { item_id: number; move_id: number; kind: string; number: number }[];
  game_modes: Record<GameMode, { description: Localized }>;
  trainer_journey: { stages: { id: string; name: Localized }[] };
}
export interface Acquisition {
  location?: { name?: Localized };
  method?: Localized;
  status?: string;
  price?: number;
  shop_id?: number;
  source?: { title?: string; reference?: string; url?: string; author_reference?: string; claim?: string; transcription?: string };
  evidence?: {
    scope?: string;
    rom_sha256?: string;
    base_rom_sha256?: string;
    proof?: { kind?: string; item_id?: number; species_ids?: number[] };
    report?: { path?: string; sha256?: string };
    screenshots?: { path?: string; alt?: string; sha256?: string }[];
  };
}
