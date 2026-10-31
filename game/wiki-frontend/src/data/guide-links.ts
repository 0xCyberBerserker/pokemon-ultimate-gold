import type { Language } from './types';

// These corrections apply to the public 236947a export; source documents remain unchanged.
export function publicGuideHtml(id: string, html: string, language: Language): string {
  if (id === 'alpha2-frontier-qa') {
    return html.replaceAll('href="qa-alpha2-frontier-outcome-qa.html"', 'href="#/guide/alpha2-frontier-outcome-qa"');
  }
  if (id === 'qa-nature-integrated-no-save-cold-review') {
    const note = language === 'es' ? 'evidencia detallada no publicada' : 'detailed evidence not published';
    return html.replace(/<a href="\.\.\/data\/acceptance\.json">([^<]*)<\/a>/g, `<span>$1 (${note})</span>`);
  }
  return html;
}
