import { lazy, Suspense, useEffect, useState } from 'react';
import { BookOpen, Compass, Moon, Sun, Swords, Package, Sparkles, Disc3, Wrench } from 'lucide-react';
import { loadWiki, type PatchSource } from './data/wiki';
import type { GameMode, Language, Localized, WikiData } from './data/types';
import { strings } from './i18n';
import { parseRoute } from './data/routes';
import GlobalSearch from './features/search/GlobalSearch';

const TrainerExplorer = lazy(() => import('./features/trainers/TrainerExplorer'));
const Pokedex = lazy(() => import('./features/pokedex/Pokedex'));
const Reference = lazy(() => import('./features/reference/Reference'));
const Patcher = lazy(() => import('./features/patcher/Patcher'));
const Home = lazy(() => import('./features/home/Home'));
const CheatCatalog = lazy(() => import('./features/cheats/CheatCatalog'));
const KrisGallery = lazy(() => import('./features/kris/KrisGallery'));

export default function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('sgp-language') === 'es' ? 'es' : 'en');
  const [mode, setMode] = useState<GameMode>(() => localStorage.getItem('ultimate-gold-game-mode') === 'plus' ? 'plus' : 'normal');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('ug-preview-theme') === 'light' ? 'light' : localStorage.getItem('ug-preview-theme') === 'dark' ? 'dark' : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [data, setData] = useState<WikiData | null>(null);
  const [wikiVersion, setWikiVersion] = useState<Localized | null>(null);
  const [patchSource, setPatchSource] = useState<PatchSource | null>(null);
  const [error, setError] = useState(false);
  const [route, setRoute] = useState(() => location.hash || '#/');
  const t = strings[language];
  useEffect(() => {
    const controller = new AbortController();
    loadWiki(controller.signal).then((result) => { setData(result.data); setWikiVersion(result.version); setPatchSource(result.source); }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.lang = language; }, [theme, language]);
  useEffect(() => {
    const preference = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => { if (!localStorage.getItem('ug-preview-theme')) setTheme(event.matches ? 'dark' : 'light'); };
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    let previous = location.hash || '#/';
    const onRoute = () => {
      const next = location.hash || '#/';
      if (parseRoute(previous).kind !== 'trainers' || parseRoute(next).kind !== 'trainers') window.scrollTo(0, 0);
      previous = next;
      setRoute(next);
    };
    window.addEventListener('hashchange', onRoute);
    return () => window.removeEventListener('hashchange', onRoute);
  }, []);
  const parsed = parseRoute(route);
  const isPokedex = parsed.kind === 'pokemon';
  const routeName = parsed.kind === 'home' ? '' : parsed.kind;
  const isReference = ['moves', 'items', 'machines', 'abilities', 'guides', 'guide', 'evolutions', 'faq', 'mechanics'].includes(routeName);
  const isPatcher = routeName === 'patcher';
  const isHome = !routeName;
  const isCheats = routeName === 'cheats';
  const isKris = routeName === 'kris-progress';
  const pokemonId = parsed.kind === 'pokemon' ? parsed.id : undefined;
  const currentLabel = isHome ? t.home : isPokedex ? t.pokedex : routeName === 'moves' ? (language === 'es' ? 'Movimientos' : 'Moves') : routeName === 'abilities' ? (language === 'es' ? 'Habilidades' : 'Abilities') : routeName === 'items' ? (language === 'es' ? 'Objetos' : 'Items') : routeName === 'machines' ? (language === 'es' ? 'MT / MO' : 'TMs / HMs') : routeName === 'evolutions' ? (language === 'es' ? 'Evoluciones' : 'Evolutions') : routeName === 'faq' ? (language === 'es' ? 'Preguntas frecuentes' : 'FAQ') : routeName === 'mechanics' ? (language === 'es' ? 'Tipos y mecánicas' : 'Types and mechanics') : isReference ? t.guides : isPatcher ? t.patcher : routeName === 'cheats' ? (language === 'es' ? 'Trucos' : 'Cheats') : routeName === 'kris-progress' ? (language === 'es' ? 'Progreso de Kris' : 'Kris progress') : t.trainers;
  const navigation = [
    { title: language === 'es' ? 'Primeros pasos' : 'Getting started', links: [
      { href: '#/', label: t.home, icon: Compass, active: isHome },
      { href: '#/guide/player', label: language === 'es' ? 'Guía del jugador' : 'Player guide', icon: BookOpen, active: route === '#/guide/player' },
      { href: '#/patcher', label: t.patcher, icon: Wrench, active: isPatcher },
      { href: '#/faq', label: language === 'es' ? 'Preguntas frecuentes' : 'FAQ', icon: Compass, active: routeName === 'faq' },
    ] },
    { title: language === 'es' ? 'Aventura' : 'Adventure', links: [
      { href: '#/trainers', label: t.trainers, icon: Swords, active: routeName === 'trainers' },
      { href: '#/guides', label: t.guides, icon: Compass, active: routeName === 'guides' || (routeName === 'guide' && !['#/guide/player', '#/guide/features', '#/guide/progress', '#/guide/sources-inventory'].includes(route)) },
      { href: '#/kris-progress', label: language === 'es' ? 'Progreso de Kris' : 'Kris progress', icon: Compass, active: isKris },
    ] },
    { title: language === 'es' ? 'Enciclopedia' : 'Encyclopedia', links: [
      { href: '#/pokemon', label: t.pokedex, icon: BookOpen, active: isPokedex },
      { href: '#/evolutions', label: language === 'es' ? 'Evoluciones' : 'Evolutions', icon: Sparkles, active: routeName === 'evolutions' },
      { href: '#/moves', label: language === 'es' ? 'Movimientos' : 'Moves', icon: Sparkles, active: routeName === 'moves' },
      { href: '#/abilities', label: language === 'es' ? 'Habilidades' : 'Abilities', icon: Sparkles, active: routeName === 'abilities' },
      { href: '#/items', label: language === 'es' ? 'Objetos' : 'Items', icon: Package, active: routeName === 'items' },
      { href: '#/machines', label: language === 'es' ? 'MT / MO' : 'TMs / HMs', icon: Disc3, active: routeName === 'machines' },
      { href: '#/mechanics', label: language === 'es' ? 'Tipos y mecánicas' : 'Types and mechanics', icon: BookOpen, active: routeName === 'mechanics' },
    ] },
    { title: language === 'es' ? 'Proyecto' : 'Project', links: [
      { href: '#/guide/features', label: language === 'es' ? 'Características' : 'Features', icon: Sparkles, active: route === '#/guide/features' },
      { href: '#/guide/progress', label: language === 'es' ? 'Estado y versiones' : 'Status and versions', icon: Compass, active: route === '#/guide/progress' },
      { href: '#/guide/sources-inventory', label: language === 'es' ? 'Fuentes' : 'Sources', icon: BookOpen, active: route === '#/guide/sources-inventory' },
      { href: '../LICENSES.html', label: language === 'es' ? 'Créditos y licencias' : 'Credits and licenses', icon: BookOpen, active: false },
      { href: '#/cheats', label: language === 'es' ? 'Trucos' : 'Cheats', icon: Sparkles, active: isCheats },
    ] },
  ];
  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#/"><span className="brand-symbol">UG</span><span><strong>ULTIMATE GOLD</strong><small>FAN WIKI</small></span></a>
      <nav aria-label="Wiki">{navigation.map((group) => <div className="nav-group" key={group.title}><p className="nav-heading">{group.title}</p>{group.links.map(({ href, label, icon: Icon, active }) => <a key={href} className={active ? 'nav-current' : ''} aria-current={active ? 'page' : undefined} href={href}><Icon size={19} />{label}</a>)}</div>)}</nav><p className="sidebar-foot">{t.project}</p>
    </aside>
    <div className="main-column"><header className="topbar"><strong>ULTIMATE GOLD <span> / {currentLabel}</span></strong><div className="controls">{data && <GlobalSearch data={data} language={language} />}
      <label><span>{t.mode}</span><select value={mode} onChange={(event) => { const next = event.target.value as GameMode; setMode(next); localStorage.setItem('ultimate-gold-game-mode', next); }}><option value="normal">Normal</option><option value="plus">Plus</option></select></label>
      <label><span>{t.language}</span><select value={language} onChange={(event) => { const next = event.target.value as Language; setLanguage(next); localStorage.setItem('sgp-language', next); }}><option value="en">English</option><option value="es">Español</option></select></label>
      <button className="theme-button" aria-label={t.theme} onClick={() => { const next = theme === 'light' ? 'dark' : 'light'; setTheme(next); localStorage.setItem('ug-preview-theme', next); }}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button>
    </div></header><main><div className="preview-note">{t.preview}{wikiVersion && <> · {language === 'es' ? 'Datos de la wiki' : 'Wiki data'}: {wikiVersion[language]}</>}</div><Suspense fallback={<p role="status">{t.loading}</p>}>{error ? <p role="alert">{t.error}</p> : data ? isHome ? <Home data={data} language={language} /> : isPokedex ? <Pokedex data={data} language={language} id={pokemonId} /> : isReference ? <Reference key={routeName} data={data} language={language} route={route} /> : isPatcher && patchSource ? <Patcher language={language} source={patchSource} /> : isKris ? <KrisGallery language={language} /> : isCheats ? <CheatCatalog language={language} target={data.target_sha256} /> : parsed.kind === 'trainers' ? <TrainerExplorer data={data} language={language} mode={mode} /> : <p role="alert">{language === 'es' ? 'Sección no encontrada.' : 'Section not found.'}</p> : <p role="status">{t.loading}</p>}</Suspense></main><footer>Made with 🖤 in Barcelona City 🇪🇸</footer></div>
  </div>;
}
