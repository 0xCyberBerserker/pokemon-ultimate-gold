export function pageOf<T>(entries: T[], requestedPage: number, pageSize: number) {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid page size');
  const pages = Math.max(1, Math.ceil(entries.length / pageSize));
  const page = Math.max(0, Math.min(Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 0, pages - 1));
  return { items: entries.slice(page * pageSize, (page + 1) * pageSize), page, pages };
}
