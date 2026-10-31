import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../data/types';
import type { PatchSource } from '../../data/wiki';

export default function Patcher({ language, source }: { language: Language; source: PatchSource }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);
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
  return <section><h1>{language === 'es' ? 'Parcheador' : 'Patcher'}</h1><p>{language === 'es' ? 'Elige una versión y aplica el parche en tu navegador. Cada jugador aporta su propia ROM limpia de Pokémon HeartGold (USA); esta web no distribuye ROMs.' : 'Choose a build and patch it in your browser. Each player provides their own clean Pokémon HeartGold (USA) ROM; this site does not distribute ROMs.'}</p><p className="patcher-source">{language === 'es' ? 'Entrada requerida' : 'Required input'}: {source.size / 1048576} MiB · SHA-256 <code>{source.sha256}</code></p><p>{language === 'es' ? 'La ROM seleccionada no se sube y no necesitas una cuenta.' : 'The selected ROM is not uploaded and no account is needed.'}</p><p>{language === 'es' ? 'Proyecto fan no oficial, sin afiliación ni respaldo de Nintendo, Game Freak o The Pokémon Company. Los derechos pertenecen a sus titulares.' : 'Unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak or The Pokémon Company. Rights remain with their owners.'}</p><iframe ref={frame} title={language === 'es' ? 'Parcheador de Ultimate Gold' : 'Ultimate Gold patcher'} className="patcher-frame" height={height} src={import.meta.env.DEV ? '/patcher-source/?embedded=wiki' : '../?embedded=wiki'} /><p><a className="text-link" href="#/patcher" target="_blank" rel="noopener noreferrer">{language === 'es' ? 'Abrir esta página en otra pestaña' : 'Open this page in another tab'}</a></p></section>;
}
