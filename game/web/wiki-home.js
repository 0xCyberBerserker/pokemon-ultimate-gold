(function () {
  'use strict';

  const copy = {
    en: {
      eyebrow: 'JOHTO FIELD GUIDE',
      title: 'Your Johto guide.',
      intro: 'Follow trainer teams by location, check Pokémon and move details, and look up items or machines as you play through Johto.',
      primary: 'Explore trainer teams',
      secondary: 'Open the Pokédex',
      features: 'Builds & features',
      art: 'Johto starter Pokémon',
      artLabel: 'JOHTO / GENERATION II',
      countSpecies: 'Pokédex entries',
      countTrainers: 'trainer records',
      countMoves: 'moves',
      countMachines: 'TMs & HMs',
      indexTitle: 'Choose a reference',
      indexIntro: 'Go straight to the information you need.',
      routeTitle: 'Adventure route',
      routeBody: 'Browse battles by location, then inspect each trainer’s team, items, and move details.',
      routeAction: 'Explore trainers',
      reference: 'Field references',
      guideTitle: 'Guides & field notes',
      guideBody: 'Mechanics, route notes, and project-specific guidance.',
      cheatsTitle: 'Cheats',
      cheatsBody: 'Check optional codes and what they change in play.',
      patcherTitle: 'Patcher',
      patcherBody: 'Open the patcher and choose the build from its own version selector.',
      startTitle: 'Not sure where to start?',
      startIntro: 'Bring your own clean Pokémon HeartGold (USA) ROM, then use the patcher with a separate save.',
      startPatcher: 'Open the patcher',
      startGuide: 'Read the player guide',
      startFaq: 'Open the FAQ',
      startSteps: 'Getting started',
      dexBody: 'Species, types, stats, abilities, and learnsets.',
      movesBody: 'Find a move by name, type, or battle class.',
      itemsBody: 'Look up item details and acquisition records.',
      machinesBody: 'Check this build’s numbered TM and HM records.',
      local: 'GAME REFERENCE'
    },
    es: {
      eyebrow: 'GUÍA DE CAMPO DE JOHTO',
      title: 'Tu guía de Johto.',
      intro: 'Consulta los equipos por ubicación, revisa datos de Pokémon y movimientos, y encuentra objetos o máquinas mientras recorres Johto.',
      primary: 'Explorar equipos',
      secondary: 'Abrir la Pokédex',
      features: 'Versiones y características',
      art: 'Pokémon iniciales de Johto',
      artLabel: 'JOHTO / GENERACIÓN II',
      countSpecies: 'entradas de Pokédex',
      countTrainers: 'registros de entrenadores',
      countMoves: 'movimientos',
      countMachines: 'MT y MO',
      indexTitle: 'Elige una referencia',
      indexIntro: 'Ve directamente a la información que necesitas.',
      routeTitle: 'Ruta de aventura',
      routeBody: 'Recorre los combates por ubicación y consulta el equipo, los objetos y los movimientos de cada entrenador.',
      routeAction: 'Ver entrenadores',
      reference: 'Referencias de campo',
      guideTitle: 'Guías y notas de campo',
      guideBody: 'Mecánicas, rutas y documentación específica del proyecto.',
      cheatsTitle: 'Trucos',
      cheatsBody: 'Consulta códigos opcionales y sus efectos en la partida.',
      patcherTitle: 'Parcheador',
      patcherBody: 'Accede al parcheador y elige la versión dentro de su selector.',
      startTitle: '¿No sabes por dónde empezar?',
      startIntro: 'Aporta tu propia ROM limpia de Pokémon HeartGold (USA) y usa el parcheador con un guardado separado.',
      startPatcher: 'Accede al parcheador',
      startGuide: 'Leer la guía del jugador',
      startFaq: 'Abrir preguntas frecuentes',
      startSteps: 'Primeros pasos',
      dexBody: 'Especies, tipos, estadísticas, habilidades y aprendizaje.',
      movesBody: 'Busca movimientos por nombre, tipo o clase de combate.',
      itemsBody: 'Consulta objetos y registros de obtención.',
      machinesBody: 'Revisa las MT y MO numeradas de esta versión.',
      local: 'GUÍA DE JUEGO'
    }
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function countSummary(data) {
    const machines = Array.isArray(data.tmhm) ? data.tmhm : [];
    return [
      [Array.isArray(data.species) ? data.species.length : 0, 'countSpecies'],
      [Array.isArray(data.trainers) ? data.trainers.length : 0, 'countTrainers'],
      [Object.keys(data.moves || {}).length, 'countMoves'],
      [machines.length, 'countMachines']
    ];
  }

  function referenceRow(href, number, title, description, count) {
    return `<a class="home-reference" href="${href}"><span class="home-reference-index">${number}</span><span class="home-reference-copy"><strong>${title}</strong><small>${description}</small></span>${count ? `<span class="home-reference-count">${count}</span>` : ''}<span class="home-arrow" aria-hidden="true">↗</span></a>`;
  }

  function render(data, lang) {
    const language = lang === 'es' ? 'es' : 'en';
    const text = copy[language];
    const source = data && typeof data === 'object' ? data : {};
    const counts = countSummary(source);
    const count = key => {
      const entry = counts.find(([, label]) => label === key);
      return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US').format(entry ? entry[0] : 0);
    };
    const starters = [
      ['152', 'Chikorita'],
      ['155', 'Cyndaquil'],
      ['158', 'Totodile']
    ];

    return `<div class="home-page">
      <section class="home-hero" aria-labelledby="home-title">
        <div class="home-hero-copy">
          <p class="eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>${text.eyebrow}</p>
          <p class="home-wordmark">ULTIMATE <strong>GOLD</strong><span>WIKI</span></p>
          <h1 id="home-title">${escapeHtml(text.title).replace(/\n/g, '<br>')}</h1>
          <p class="home-lede">${text.intro}</p>
          <div class="home-actions"><a class="button button-primary" href="#/trainers">${text.primary}<span aria-hidden="true">↗</span></a><a class="button button-quiet" href="#/pokemon">${text.secondary}<span aria-hidden="true">→</span></a><a class="button button-quiet home-features-link" href="#/guide/features">${text.features}<span aria-hidden="true">→</span></a></div>
        </div>
        <div class="home-hero-art" role="img" aria-label="${text.art}">
          <div class="home-art-caption"><span>01</span><span>${text.artLabel}</span></div>
          <div class="home-art-scene"><span class="home-art-ring home-art-ring-one"></span><span class="home-art-ring home-art-ring-two"></span>${starters.map(([id, name], index) => `<img class="home-starter home-starter-${index + 1}" src="../sprites/pokemon/${id}.png" alt="${name}" loading="eager">`).join('')}<span class="home-art-ground"></span></div>
          <div class="home-art-foot"><span>${language === 'es' ? 'INICIALES DE JOHTO' : 'JOHTO STARTERS'}</span><span aria-hidden="true">✳</span></div>
        </div>
      </section>

      <section class="home-countline" aria-label="${language === 'es' ? 'Contenido de la wiki' : 'Wiki contents'}">
        ${counts.map(([amount, key]) => `<div class="home-count"><strong>${new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US').format(amount)}</strong><span>${text[key]}</span></div>`).join('')}
        <span class="home-local-mark"><span class="home-status-dot"></span>${text.local}</span>
      </section>

      <section class="home-onboarding" aria-labelledby="home-onboarding-title">
        <div class="home-onboarding-copy"><p class="section-kicker">${text.startSteps}</p><h2 id="home-onboarding-title">${text.startTitle}</h2><p>${text.startIntro}</p></div>
        <nav class="home-onboarding-actions" aria-label="${text.startSteps}">
          <a class="home-start-link home-start-primary" href="#/patcher"><span class="home-start-number">01</span><strong>${text.startPatcher}</strong><span class="home-arrow" aria-hidden="true">↗</span></a>
          <a class="home-start-link" href="#/guide/player"><span class="home-start-number">02</span><strong>${text.startGuide}</strong><span class="home-arrow" aria-hidden="true">→</span></a>
          <a class="home-start-link" href="#/faq"><span class="home-start-number">03</span><strong>${text.startFaq}</strong><span class="home-arrow" aria-hidden="true">→</span></a>
        </nav>
      </section>

      <section class="home-index" aria-labelledby="home-index-title">
        <header class="home-section-heading"><div><p class="section-kicker">${language === 'es' ? 'CONSULTA RÁPIDA' : 'QUICK REFERENCE'}</p><h2 id="home-index-title">${text.indexTitle}</h2></div><p>${text.indexIntro}</p></header>
        <div class="home-index-layout">
          <a class="home-adventure" href="#/trainers">
            <span class="home-adventure-kicker"><span class="home-status-dot"></span>${language === 'es' ? 'RECORRIDO PRINCIPAL' : 'MAIN ROUTE'}</span>
            <span class="home-route-path" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="home-adventure-title">${text.routeTitle}</span>
            <span class="home-adventure-body">${text.routeBody}</span>
            <span class="home-adventure-bottom"><span>${text.routeAction}</span><span aria-hidden="true">↗</span></span>
          </a>
          <div class="home-reference-list" aria-label="${text.reference}">
            ${referenceRow('#/pokemon', '01', 'Pokédex', text.dexBody, count('countSpecies'))}
            ${referenceRow('#/moves', '02', language === 'es' ? 'Movimientos' : 'Moves', text.movesBody, count('countMoves'))}
            ${referenceRow('#/items', '03', language === 'es' ? 'Objetos' : 'Items', text.itemsBody, '')}
            ${referenceRow('#/machines', '04', language === 'es' ? 'MT / MO' : 'TMs / HMs', text.machinesBody, count('countMachines'))}
            ${referenceRow('#/guides', '05', text.guideTitle, text.guideBody, '')}
            ${referenceRow('#/cheats', '06', text.cheatsTitle, text.cheatsBody, '')}
            ${referenceRow('#/patcher', '07', text.patcherTitle, text.patcherBody, '')}
          </div>
        </div>
      </section>
    </div>`;
  }

  const navMedia = window.matchMedia('(max-width: 800px)');
  const syncNavigation = () => {
    const menu = document.querySelector('.nav-menu');
    if (menu) menu.open = !navMedia.matches;
  };
  syncNavigation();
  if (navMedia.addEventListener) navMedia.addEventListener('change', syncNavigation);
  else navMedia.addListener(syncNavigation);

  document.addEventListener('click', event => {
    if (!navMedia.matches) return;
    const menu = document.querySelector('.nav-menu');
    const target = event.target instanceof Element ? event.target : null;
    if (menu?.open && (!menu.contains(target) || target?.closest('#category-nav a'))) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (!navMedia.matches) return;
    const menu = document.querySelector('.nav-menu');
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });

  window.UltimateHome = Object.freeze({ render });
})();
