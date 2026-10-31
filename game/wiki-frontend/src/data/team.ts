import type { GameMode, Member } from './types';

export function memberForMode(member: Member, mode: GameMode) {
  return {
    level: member.levels_by_mode?.[mode] ?? member.level,
    moveIds: member.move_ids_by_mode?.[mode] ?? member.move_ids,
    ivs: member.ivs,
    evs: member.evs,
  };
}
