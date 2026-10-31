import type { Language, WikiData } from '../../data/types';
import { localized } from '../../data/wiki';
import { publicGuideHtml } from '../../data/guide-links';
import './player-guide.css';

export default function PlayerGuide({ data, language }: { data: WikiData; language: Language }) {
  const es = language === 'es';
  const guide = data.guides.player;
  if (!guide) return <p>{es ? 'Guía no disponible.' : 'Guide unavailable.'}</p>;
  const steps = es ? [
    ['Prepara tu juego', 'Usa tu propia ROM limpia compatible de Pokémon HeartGold USA. Conserva el original y una copia de tus partidas.', '#/guide/web-patcher', 'Ver instrucciones'],
    ['Aplica el parche', 'Elige una versión y crea el archivo del juego desde el parcheador; no apiles parches.', '#/patcher', 'Abrir parcheador'],
    ['Comienza la aventura', 'Abre el archivo resultante en tu emulador compatible y guarda tu partida con normalidad.', '#/guide/faq', 'Preguntas frecuentes'],
    ['Consulta la wiki', 'Busca Pokémon, entrenadores y rutas mientras preparas tu equipo.', '#/trainers', 'Ver entrenadores'],
    ['Opcional: trucos', 'Revisa la versión y las advertencias antes de usar cualquier código.', '#/cheats', 'Ver catálogo de trucos'],
  ] : [
    ['Prepare your game', 'Use your own compatible clean Pokémon HeartGold USA ROM. Keep the original and a backup of your saves.', '#/guide/web-patcher', 'See instructions'],
    ['Apply the patch', 'Choose a build and create the game file in the patcher; do not stack patches.', '#/patcher', 'Open patcher'],
    ['Start your adventure', 'Open the resulting file in your compatible emulator and save your game normally.', '#/guide/faq', 'Frequently asked questions'],
    ['Explore the wiki', 'Look up Pokémon, trainers and routes as you prepare your team.', '#/trainers', 'View trainers'],
    ['Optional: cheats', 'Check the version and warnings before using any code.', '#/cheats', 'View cheat catalog'],
  ];
  return <section className="player-guide">
    <a className="back-link" href="#/guides">← {es ? 'Guías' : 'Guides'}</a>
    <h1>{localized(guide.title, language)}</h1>
    <p>{es ? 'Cinco pasos para preparar el juego y encontrar lo que necesitas durante la aventura.' : 'Five steps to prepare the game and find what you need during your adventure.'}</p>
    <ol className="player-guide-steps">{steps.map(([title, text, href, action], index) => <li className="panel" key={href}><span className="player-guide-number">{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{text}</p><a className="text-link" href={href}>{action} →</a></div></li>)}</ol>
    <details className="panel guide-html"><summary>{es ? 'Guía completa e información adicional' : 'Complete guide and additional information'}</summary><div dangerouslySetInnerHTML={{ __html: publicGuideHtml('player', guide.body[language] || '', language) }} /></details>
  </section>;
}
