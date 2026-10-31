import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../data/types';
import type { PatchSource } from '../../data/wiki';
import './patcher.css';

export default function Patcher({ language, source }: { language: Language; source: PatchSource }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);
  const embeddedUrl = import.meta.env.DEV ? '/patcher-source/' : '../index.html';
  const standaloneUrl = `${embeddedUrl}?standalone=1&lang=${language}`;
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || !event.data) return;
      if (event.data.type === 'patcher-height') {
        const value = Number(event.data.height);
        if (Number.isFinite(value)) setHeight(Math.max(420, Math.min(value, 1800)));
      }
      if (event.data.type === 'patcher-ready') frame.current?.contentWindow?.postMessage({ type: 'wiki-language', language }, location.origin);
    }
    window.addEventListener('message', onMessage);
    frame.current?.contentWindow?.postMessage({ type: 'wiki-language', language }, location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, [language]);

  return <section className="patcher-page">
    <p className="eyebrow">{language === 'es' ? 'PARCHEADOR DEL PROYECTO' : 'PROJECT PATCHER'}</p>
    <h1>{language === 'es' ? 'Parcheador de Ultimate Gold' : 'Ultimate Gold patcher'}</h1>
    <p className="patcher-intro">{language === 'es'
      ? 'Elige una versión dentro del selector y aplica el parche localmente en tu navegador. Cada jugador aporta su propia ROM limpia de Pokémon HeartGold (USA); esta web no ofrece ROMs.'
      : 'Choose a build from the version selector and patch locally in your browser. Each player must provide their own clean Pokémon HeartGold (USA) ROM; this site does not provide ROMs.'}</p>
    <p>{language === 'es' ? 'La ROM seleccionada no se sube y no necesitas una cuenta.' : 'The selected ROM is not uploaded and no account is needed.'}</p>
    <aside className="patcher-note">{language === 'es' ? 'Entrada requerida' : 'Required input'}: {source.size / 1048576} MiB · SHA-256 <code>{source.sha256}</code>. {language === 'es'
      ? 'Recomendamos crear tu propio volcado desde un cartucho original que tengas cuando la legislación local lo permita.'
      : 'We recommend making your own dump from an original cartridge you own where local law permits.'}</aside>
    <aside className="patcher-disclaimer">{language === 'es'
      ? 'Proyecto fan no oficial, sin afiliación ni respaldo de Nintendo, Game Freak o The Pokémon Company. Pokémon y los derechos relacionados pertenecen a sus titulares. No es asesoramiento legal ni una garantía sobre la legalidad del volcado; consulta las normas locales.'
      : 'Unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and related rights belong to their respective owners. This is not legal advice and does not guarantee ROM-dump legality; check local rules.'}</aside>
    <iframe ref={frame} title={language === 'es' ? 'Parcheador local de Ultimate Gold' : 'Ultimate Gold local patcher'} className="patcher-frame" height={height} src={`${embeddedUrl}?embedded=wiki`} />
    <p className="patcher-fallback">{language === 'es' ? '¿Prefieres abrirlo aparte?' : 'Prefer a separate page?'} <a href={standaloneUrl} target="_blank" rel="noopener noreferrer">{language === 'es' ? 'Abrir parcheador independiente' : 'Open standalone patcher'}</a></p>
  </section>;
}
