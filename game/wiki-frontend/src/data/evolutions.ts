import type { Species } from './types';

export function evolutionFamilies(species: Species[]) {
  const byId = new Map(species.map((entry) => [entry.id, entry]));
  const adjacency = new Map(species.map((entry) => [entry.id, new Set<number>()]));
  const edges = species.flatMap((entry) => entry.evolutions.flatMap((evolution) => {
    if (!byId.has(evolution.target)) return [];
    adjacency.get(entry.id)?.add(evolution.target);
    adjacency.get(evolution.target)?.add(entry.id);
    return [{ from: entry, to: byId.get(evolution.target)!, evolution }];
  }));
  const seen = new Set<number>();
  const families: { members: Species[]; roots: Species[]; edges: typeof edges }[] = [];
  for (const entry of species) {
    if (seen.has(entry.id) || !adjacency.get(entry.id)?.size) continue;
    const pending = [entry.id];
    const ids = new Set<number>();
    while (pending.length) {
      const id = pending.pop()!;
      if (ids.has(id)) continue;
      ids.add(id); seen.add(id);
      for (const neighbor of adjacency.get(id) || []) if (!ids.has(neighbor)) pending.push(neighbor);
    }
    const members = [...ids].map((id) => byId.get(id)!).sort((a, b) => a.id - b.id);
    const familyEdges = edges.filter((edge) => ids.has(edge.from.id) && ids.has(edge.to.id)).sort((a, b) => a.from.id - b.from.id || a.to.id - b.to.id);
    const incoming = new Set(familyEdges.map((edge) => edge.to.id));
    const roots = members.filter((member) => !incoming.has(member.id));
    families.push({ members, roots: roots.length ? roots : [members[0]], edges: familyEdges });
  }
  return families.sort((a, b) => a.roots[0].id - b.roots[0].id);
}
