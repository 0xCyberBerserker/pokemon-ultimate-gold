import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BookOpen, Compass, House, Info, Map, Moon, Sun, Swords, Package, Sparkles, Disc3, Wrench, Menu, X } from 'lucide-react';
import { loadWiki, type PatchSource } from './data/wiki';
import type { GameMode, Language, Localized, WikiData } from './data/types';
import { strings } from './i18n';
import { parseRoute } from './data/routes';
import GlobalSearch from './features/search/GlobalSearch';
import SectionErrorBoundary from './SectionErrorBoundary';

const TrainerExplorer = lazy(() => import('./features/trainers/TrainerExplorer'));
const Pokedex = lazy(() => import('./features/pokedex/Pokedex'));
const Reference = lazy(() => import('./features/reference/Reference'));
const Patcher = lazy(() => import('./features/patcher/Patcher'));
const Home = lazy(() => import('./features/home/Home'));
const CheatCatalog = lazy(() => import('./features/cheats/CheatCatalog'));
const KrisGallery = lazy(() => import('./features/kris/KrisGallery'));

function readPreference(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Preferences remain active for this session. */ }
}

export function startWikiLoadAttempt<T>(signal: AbortSignal, load: (signal: AbortSignal) => Promise<T>, onSuccess: (result: T) => void, onError: () => void) {
  void load(signal).then((result) => {
    if (!signal.aborted) onSuccess(result);
  }).catch(() => {
    if (!signal.aborted) onError();
  });
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => readPreference('sgp-language') === 'es' ? 'es' : 'en');
  const [mode, setMode] = useState<GameMode>(() => readPreference('ultimate-gold-game-mode') === 'plus' ? 'plus' : 'normal');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readPreference('ug-preview-theme') === 'light' ? 'light' : readPreference('ug-preview-theme') === 'dark' ? 'dark' : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [data, setData] = useState<WikiData | null>(null);
  const [wikiVersion, setWikiVersion] = useState<Localized | null>(null);
  const [patchVersion, setPatchVersion] = useState<Localized | null>(null);
  const [patchSource, setPatchSource] = useState<PatchSource | null>(null);
  const [error, setError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [navGroup, setNavGroup] = useState<number | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [route, setRoute] = useState(() => location.hash || '#/');
  const t = strings[language];
  useEffect(() => {
    const controller = new AbortController();
    startWikiLoadAttempt(controller.signal, loadWiki, (result) => { setData(result.data); setWikiVersion(result.version); setPatchVersion(result.patchVersion); setPatchSource(result.source); setError(false); }, () => setError(true));
    return () => controller.abort();
  }, [loadAttempt]);
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.lang = language; }, [theme, language]);
  useEffect(() => {
    const preference = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => { if (!readPreference('ug-preview-theme')) setTheme(event.matches ? 'dark' : 'light'); };
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
      setNavGroup(null);
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
    { title: language === 'es' ? 'Primeros pasos' : 'Getting started', icon: House, links: [
      { href: '#/', label: t.home, icon: Compass, active: isHome },
      { href: '#/guide/player', label: language === 'es' ? 'Guía del jugador' : 'Player guide', icon: BookOpen, active: route === '#/guide/player' },
      { href: '#/patcher', label: t.patcher, icon: Wrench, active: isPatcher },
      { href: '#/faq', label: language === 'es' ? 'Preguntas frecuentes' : 'FAQ', icon: Compass, active: routeName === 'faq' },
    ] },
    { title: language === 'es' ? 'Aventura' : 'Adventure', icon: Map, links: [
      { href: '#/trainers', label: t.trainers, icon: Swords, active: routeName === 'trainers' },
      { href: '#/guides', label: t.guides, icon: Compass, active: routeName === 'guides' || (routeName === 'guide' && !['#/guide/player', '#/guide/features', '#/guide/progress', '#/guide/sources-inventory'].includes(route)) },
      { href: '#/kris-progress', label: language === 'es' ? 'Progreso de Kris' : 'Kris progress', icon: Compass, active: isKris },
    ] },
    { title: language === 'es' ? 'Enciclopedia' : 'Encyclopedia', icon: BookOpen, links: [
      { href: '#/pokemon', label: t.pokedex, icon: BookOpen, active: isPokedex },
      { href: '#/evolutions', label: language === 'es' ? 'Evoluciones' : 'Evolutions', icon: Sparkles, active: routeName === 'evolutions' },
      { href: '#/moves', label: language === 'es' ? 'Movimientos' : 'Moves', icon: Sparkles, active: routeName === 'moves' },
      { href: '#/abilities', label: language === 'es' ? 'Habilidades' : 'Abilities', icon: Sparkles, active: routeName === 'abilities' },
      { href: '#/items', label: language === 'es' ? 'Objetos' : 'Items', icon: Package, active: routeName === 'items' },
      { href: '#/machines', label: language === 'es' ? 'MT / MO' : 'TMs / HMs', icon: Disc3, active: routeName === 'machines' },
      { href: '#/mechanics', label: language === 'es' ? 'Tipos y mecánicas' : 'Types and mechanics', icon: BookOpen, active: routeName === 'mechanics' },
    ] },
    { title: language === 'es' ? 'Proyecto' : 'Project', icon: Info, links: [
      { href: '#/guide/features', label: language === 'es' ? 'Características' : 'Features', icon: Sparkles, active: route === '#/guide/features' },
      { href: '#/guide/progress', label: language === 'es' ? 'Estado y versiones' : 'Status and versions', icon: Compass, active: route === '#/guide/progress' },
      { href: '#/guide/sources-inventory', label: language === 'es' ? 'Fuentes' : 'Sources', icon: BookOpen, active: route === '#/guide/sources-inventory' },
      { href: '../LICENSES.html', label: language === 'es' ? 'Créditos y licencias' : 'Credits and licenses', icon: BookOpen, active: false },
      { href: '#/cheats', label: language === 'es' ? 'Trucos' : 'Cheats', icon: Sparkles, active: isCheats },
    ] },
  ];
  const selectedGroup = navGroup ?? Math.max(0, navigation.findIndex((group) => group.links.some((link) => link.active)));
  return <div className="app-shell">
    <aside className="sidebar" onKeyDown={(event) => { if (event.key === 'Escape' && navOpen) { setNavOpen(false); menuButton.current?.focus(); } }}><a className="brand" href="#/"><img src="../assets/branding/ultimate-gold-icon.svg" alt="" /><span><strong>Pokémon<br />ULTIMATE GOLD</strong><small>FAN WIKI</small></span></a>
      <button ref={menuButton} className="mobile-menu-button" aria-controls="wiki-navigation" aria-expanded={navOpen} aria-label={language === 'es' ? (navOpen ? 'Cerrar menú' : 'Abrir menú') : (navOpen ? 'Close menu' : 'Open menu')} onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <nav id="wiki-navigation" className={navOpen ? 'nav-open' : ''} aria-label="Wiki">
        <div className="nav-categories" aria-label={language === 'es' ? 'Categorías' : 'Categories'}>{navigation.map((group, index) => <button key={group.title} type="button" className={selectedGroup === index ? 'category-current' : ''} aria-controls={`nav-group-${index}`} aria-pressed={selectedGroup === index} onClick={() => setNavGroup(index)}><group.icon size={17} aria-hidden="true" />{group.title}</button>)}</div>
        {navigation.map((group, index) => <div key={group.title} id={`nav-group-${index}`} className="nav-links" aria-label={group.title} hidden={selectedGroup !== index}>{group.links.map(({ href, label, icon: Icon, active }) => <a key={href} className={active ? 'nav-current' : ''} aria-current={active ? 'page' : undefined} href={href} onClick={() => setNavOpen(false)}><Icon size={19} aria-hidden="true" /><span>{label}</span></a>)}</div>)}
      </nav><p className="sidebar-foot">{t.project}</p>
    </aside>
    <div className="main-column"><header className="topbar"><div className="current-section">{currentLabel}</div><div className="controls">{data && <GlobalSearch data={data} language={language} />}
      <label><span>{t.mode}</span><select value={mode} onChange={(event) => { const next = event.target.value as GameMode; setMode(next); writePreference('ultimate-gold-game-mode', next); }}><option value="normal">Normal</option><option value="plus">Plus</option></select></label>
      <label><span>{t.language}</span><select value={language} onChange={(event) => { const next = event.target.value as Language; setLanguage(next); writePreference('sgp-language', next); }}><option value="en">English</option><option value="es">Español</option></select></label>
      <button className="theme-button" aria-label={t.theme} onClick={() => { const next = theme === 'light' ? 'dark' : 'light'; setTheme(next); writePreference('ug-preview-theme', next); }}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button>
    </div></header><main><SectionErrorBoundary key={route} language={language}><Suspense fallback={<p role="status">{t.loading}</p>}>{error ? <div className="panel section-error" role="alert"><p>{t.error}</p><button type="button" onClick={() => { setError(false); setLoadAttempt((attempt) => attempt + 1); }}>{language === 'es' ? 'Reintentar' : 'Try again'}</button></div> : data ? isHome ? <Home data={data} language={language} /> : isPokedex ? <Pokedex data={data} language={language} id={pokemonId} /> : isReference ? <Reference key={routeName} data={data} language={language} route={route} patchDefault={patchVersion ?? undefined} wikiVersion={wikiVersion ?? undefined} /> : isPatcher && patchSource ? <Patcher language={language} source={patchSource} /> : isKris ? <KrisGallery language={language} /> : isCheats ? <CheatCatalog language={language} target={data.target_sha256} /> : parsed.kind === 'trainers' ? <TrainerExplorer data={data} language={language} mode={mode} /> : <p role="alert">{language === 'es' ? 'Sección no encontrada.' : 'Section not found.'}</p> : <p role="status">{t.loading}</p>}</Suspense></SectionErrorBoundary></main><footer>{wikiVersion && <span>{language === 'es' ? 'Datos' : 'Data'}: {wikiVersion[language].split(' — ')[0]} · </span>}Made with 🖤 in Barcelona City 🇪🇸</footer></div>
  </div>;
}
