import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../data/types';
import type { PatchSource } from '../../data/wiki';
import frameThemeUrl from './patcher-frame-theme.css?url&no-inline';
import './patcher.css';

type FrameState = 'loading' | 'ready' | 'unavailable';

export default function Patcher({ language, source }: { language: Language; source: PatchSource }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(420);
  const [frameState, setFrameState] = useState<FrameState>('loading');
  const embeddedUrl = import.meta.env.DEV ? '/patcher-source/' : '../index.html';
  const standaloneUrl = `${embeddedUrl}?standalone=1&lang=${language}`;
  const isSpanish = language === 'es';

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || !event.data) return;
      if (event.data.type === 'patcher-height') {
        const value = Number(event.data.height);
        if (Number.isFinite(value)) setHeight(Math.max(420, Math.min(value, 1800)));
      }
      if (event.data.type === 'patcher-ready') {
        setFrameState('ready');
        frame.current?.contentWindow?.postMessage({ type: 'wiki-language', language }, location.origin);
      }
    }
    window.addEventListener('message', onMessage);
    frame.current?.contentWindow?.postMessage({ type: 'wiki-language', language }, location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, [language]);

  useEffect(() => {
    const syncFrameTheme = () => {
      const document = frame.current?.contentDocument;
      if (!document?.head) return;
      document.documentElement.dataset.wikiTheme = window.document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      if (document.querySelector('[data-wiki-patcher-theme]')) return;
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL(frameThemeUrl, location.href).href;
      stylesheet.dataset.wikiPatcherTheme = 'true';
      document.head.append(stylesheet);
    };
    const observer = new MutationObserver(syncFrameTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    frame.current?.addEventListener('load', syncFrameTheme);
    syncFrameTheme();
    return () => {
      observer.disconnect();
      frame.current?.removeEventListener('load', syncFrameTheme);
    };
  }, []);

  useEffect(() => {
    if (frameState === 'ready') return;
    const timeout = window.setTimeout(() => setFrameState('unavailable'), 8000);
    return () => window.clearTimeout(timeout);
  }, [frameState]);

  const frameMessage = frameState === 'loading'
    ? (isSpanish ? 'Cargando el motor local del parcheador…' : 'Loading the local patcher…')
    : (isSpanish ? 'La vista integrada no está disponible. Abre el parcheador independiente.' : 'The embedded view is unavailable. Open the standalone patcher.');

  return <section className="patcher-page">
    <header className="patcher-hero">
      <div className="patcher-hero-copy">
        <p className="patcher-eyebrow">{isSpanish ? 'HERRAMIENTA LOCAL · SIN SUBIR LA ROM' : 'LOCAL TOOL · ROM STAYS ON YOUR DEVICE'}</p>
        <h1>{isSpanish ? 'Parcheador de Ultimate Gold' : 'Ultimate Gold patcher'}</h1>
        <p>{isSpanish
          ? 'Elige una versión y aplica el parche en tu navegador con tu propia ROM limpia de Pokémon HeartGold (USA).'
          : 'Choose a build and patch locally in your browser with your own clean Pokémon HeartGold (USA) ROM.'}</p>
      </div>
      <div className="patcher-hero-mark" aria-hidden="true"><span>{isSpanish ? 'PARCHE' : 'PATCH'}</span><strong>01—03</strong><small>{isSpanish ? 'HERRAMIENTA LOCAL' : 'LOCAL WORKBENCH'}</small></div>
    </header>

    <div className="patcher-info-grid">
      <section className="patcher-source-card" aria-labelledby="patcher-source-title">
        <span className="patcher-card-index">01 / {isSpanish ? 'ENTRADA' : 'INPUT'}</span>
        <div>
          <h2 id="patcher-source-title">{isSpanish ? 'Tu ROM limpia' : 'Your clean ROM'}</h2>
          <p>{isSpanish ? 'Entrada requerida. No ofrecemos ROMs ni recibimos tus archivos.' : 'Required input. We do not provide ROMs or receive your files.'}</p>
          <code>{source.size / 1048576} MiB · SHA-256 {source.sha256}</code>
          <p className="patcher-source-guidance">{isSpanish
            ? 'Puedes crear tu propio volcado desde un cartucho original que tengas, cuando la legislación local lo permita.'
            : 'You may make your own dump from an original cartridge you own, where local law permits.'}</p>
        </div>
      </section>
      <aside className="patcher-disclaimer">
        <span className="patcher-card-index">{isSpanish ? 'NOTA DEL PROYECTO' : 'PROJECT NOTE'}</span>
        <p>{isSpanish
          ? 'Proyecto fan no oficial, sin afiliación ni respaldo de Nintendo, Game Freak o The Pokémon Company. Pokémon y los derechos relacionados pertenecen a sus titulares. No es asesoramiento legal ni garantiza la legalidad del volcado; consulta las normas locales.'
          : 'Unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and related rights belong to their owners. This is not legal advice and does not guarantee ROM-dump legality; check local rules.'}</p>
      </aside>
    </div>

    <section className="patcher-workbench" aria-labelledby="patcher-workbench-title">
      <div className="patcher-workbench-heading">
        <div><p className="patcher-eyebrow">02 / {isSpanish ? 'ELIGE · VERIFICA · PARCHEA' : 'SELECT · VERIFY · PATCH'}</p><h2 id="patcher-workbench-title">{isSpanish ? 'Área de parcheado' : 'Patch workbench'}</h2></div>
        <div className="patcher-workbench-actions">
          <span className="patcher-local-badge">{isSpanish ? 'PROCESAMIENTO LOCAL' : 'LOCAL PROCESSING'}</span>
          <a className="patcher-standalone-button patcher-standalone-inline" href={standaloneUrl} target="_blank" rel="noopener noreferrer">
            {isSpanish ? 'Vista independiente' : 'Standalone view'} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className={`patcher-frame-shell${frameState === 'ready' ? ' is-ready' : ''}`}>
        {frameState !== 'ready' && <div className="patcher-frame-placeholder" role="status" aria-live="polite">
          <span className="patcher-loading-mark" aria-hidden="true">UG</span>
          <p>{frameMessage}</p>
        </div>}
        <iframe
          ref={frame}
          title={isSpanish ? 'Parcheador local de Ultimate Gold' : 'Ultimate Gold local patcher'}
          className="patcher-frame"
          height={frameState === 'ready' ? height : 0}
          src={`${embeddedUrl}?embedded=wiki`}
          onError={() => setFrameState('unavailable')}
          aria-hidden={frameState !== 'ready'}
          tabIndex={frameState === 'ready' ? 0 : -1}
        />
      </div>
      <p className="patcher-workbench-footnote">{isSpanish ? '03 / Verifica el archivo de salida y descárgalo en tu dispositivo.' : '03 / Verify the output file and download it to your device.'}</p>
      <p className="patcher-fallback"><span>{isSpanish ? 'Si el área integrada no carga:' : 'If the embedded workbench does not load:'}</span> <a href={standaloneUrl} target="_blank" rel="noopener noreferrer">{isSpanish ? 'Abrir parcheador independiente' : 'Open standalone patcher'}</a></p>
    </section>
  </section>;
}
