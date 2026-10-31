import type { Language, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';

export default function TypeBadge({ id, types, language }: { id: number; types: WikiData['types']; language: Language }) {
  const type = types[id];
  return <span className={`type-badge type-${id}`}>{type?.icon && <img src={type.icon} alt="" loading="lazy" />}{localized(type, language)}</span>;
}
