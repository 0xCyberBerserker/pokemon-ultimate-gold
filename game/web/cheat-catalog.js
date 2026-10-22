/* Source-pinned, paginated Action Replay reference. No codes execute here. */
(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const copy = {
    en: {title:'Cheat catalog', intro:'Complete Action Replay codes, organized by category. All are optional; this page only displays text.',
      scope:'The 2,110 catalog status labels are unchanged. A bounded Alpha1 runtime test covers 00-006 and 80-002; it verifies emulated-memory effects after a code-off process reload, not battery-save persistence or normal gameplay.', runtime:'Read the bounded runtime QA report', limitedStatus:'Limited RAM test · no battery persistence', limited:'A separate bounded Alpha1 test kept the value after a code-off emulator process reload. This does not establish battery-save persistence or normal gameplay.',
      original:'Original source titles and instructions are retained where no authored translation exists.',
      search:'Search codes, titles or IDs', category:'All categories', folder:'All source folders', status:'All checks',
      static_only:'Syntax checked · effect untested', guard_mismatch:'ROM guard mismatch', syntax_issue:'Syntax issue',
      activation:'Detected button conditions', continuous:'No standard button condition detected; inspect the code and source instructions.',
      instructions:'Add the complete block as one Action Replay code in your emulator. Start with it disabled, enable only the selected code for its required scene, then disable it and restart the emulator to discard code patches. Saved item or party changes remain in that save.',
      backup:'Use a separate copy of your save for experiments. Do not combine codes that alter the same feature; native Rocket items and speed changes already cover some conveniences.',
      wrapper:'Requires a custom melonDS wrapper; copying this block alone does not provide the picker UI.',
      capture:'Trainer capture: catching the Pokémon, keeping it in the party/PC and retaining it after save/restart are separate tests. They remain untested here.',
      source:'Original source instructions', code:'Complete code', copy:'Copy code', copied:'Copied', copyFailed:'Select and copy the code below',
      previous:'Previous', next:'Next', results:'results', target:'Static-check target SHA-256', mismatch:'An equality guard does not match this ROM. This can stop the guarded part from applying; it is not verified compatible.',
      loading:'Loading catalog…', failure:'Catalog unavailable', guide:'Usage guide', credits:'Source and credits', download:'RetroArch profile · disabled'},
    es: {title:'Catálogo de trucos', intro:'Códigos Action Replay completos, organizados por categorías. Son opcionales; esta página sólo muestra texto.',
      scope:'Las etiquetas de estado de las 2.110 entradas no se han cambiado. Una prueba acotada en Alpha1 cubre 00-006 y 80-002; verifica efectos en la memoria del emulador tras recargar un estado en un proceso sin códigos, no persistencia en la batería ni jugabilidad normal.', runtime:'Leer el informe acotado de QA en runtime', limitedStatus:'Prueba RAM acotada · sin persistencia en batería', limited:'Una prueba separada en Alpha1 mantuvo el valor tras cargar un estado en otro proceso del emulador sin códigos. No demuestra persistencia en la batería ni jugabilidad normal.',
      original:'Se conservan títulos e instrucciones originales de la fuente cuando no hay traducción propia.',
      search:'Buscar códigos, títulos o ID', category:'Todas las categorías', folder:'Todas las carpetas de origen', status:'Todas las comprobaciones',
      static_only:'Sintaxis comprobada · efecto sin probar', guard_mismatch:'Condición incompatible con la ROM', syntax_issue:'Error de sintaxis',
      activation:'Condiciones de botones detectadas', continuous:'No se detectó una condición de botones estándar; consulta el código y las instrucciones de origen.',
      instructions:'Añade el bloque completo como un único código Action Replay en tu emulador. Empieza con él desactivado, activa sólo el elegido en la escena correspondiente, después desactívalo y reinicia el emulador para descartar parches de código. Los cambios guardados en objetos o equipo permanecen en esa partida.',
      backup:'Experimenta con una copia separada de tu partida. No combines códigos que alteren la misma función; los objetos Rocket nativos y los cambios de velocidad ya cubren algunas comodidades.',
      wrapper:'Necesita un wrapper propio de melonDS; copiar este bloque no proporciona la interfaz del selector.',
      capture:'Captura de entrenadores: capturar el Pokémon, conservarlo en equipo/PC y mantenerlo tras guardar y reiniciar son pruebas distintas. Aquí siguen sin probar.',
      source:'Instrucciones originales de la fuente', code:'Código completo', copy:'Copiar código', copied:'Copiado', copyFailed:'Selecciona y copia el código de abajo',
      previous:'Anterior', next:'Siguiente', results:'resultados', target:'SHA-256 de la ROM comprobada', mismatch:'Una condición de igualdad no coincide con esta ROM. Puede impedir aplicar la parte condicionada; no tiene compatibilidad verificada.',
      loading:'Cargando catálogo…', failure:'Catálogo no disponible', guide:'Guía de uso', credits:'Fuente y créditos', download:'Perfil RetroArch · desactivado'},
  };
  let pending, sequence = 0;
  const load = () => pending ||= fetch('../data/cheat-catalog.json').then(response => {
    if (!response.ok) throw new Error('catalog unavailable');
    return response.json();
  }).catch(error => { pending = null; throw error; });

  async function mount(container, language, targetHash) {
    const ticket = ++sequence, lang = language === 'es' ? 'es' : 'en', t = copy[lang];
    container.innerHTML = `<p>${t.loading}</p>`;
    try {
      const data = await load();
      if (ticket !== sequence || !location.hash.startsWith('#/cheats')) return;
      if (data.target_sha256 !== targetHash) throw new Error('catalog target mismatch');
      container.innerHTML = `<h1>${t.title}</h1><p class="intro">${t.intro}</p><p class="notice">${t.scope}</p><p class="muted">${t.original}</p>
        <p><a href="#/guide/cheats">${t.guide}</a> · <a href="#/guide/cheat-runtime-qa">${t.runtime}</a> · <a href="${escape(data.source.url)}">${t.credits}</a></p>
        <div class="filters"><input id="cheat-query" type="search" aria-label="${t.search}" placeholder="${t.search}">
        <select id="cheat-category" aria-label="${t.category}"><option value="">${t.category}</option>${Object.entries(data.categories).map(([id, label]) => `<option value="${id}">${escape(label[lang])}</option>`).join('')}</select>
        <select id="cheat-folder" aria-label="${t.folder}"><option value="">${t.folder}</option>${data.folders.map(folder => `<option value="${folder.id}">${escape(folder.source_title)}</option>`).join('')}</select>
        <select id="cheat-status" aria-label="${t.status}"><option value="">${t.status}</option>${['static_only','guard_mismatch','syntax_issue'].map(status => `<option value="${status}">${t[status]}</option>`).join('')}</select></div>
        <p id="cheat-count" role="status"></p><div id="cheat-results" class="cheat-list"></div><div class="cheat-pager"><button id="cheat-previous">${t.previous}</button><span id="cheat-page"></span><button id="cheat-next">${t.next}</button></div>
        <p class="muted cheat-target">${t.target}: <code>${escape(data.target_sha256)}</code></p>`;
      const get = id => container.querySelector(`#${id}`);
      const pageSize = 24;
      let page = 0;
      const paint = () => {
        const query = [get('cheat-query').value, document.getElementById('search')?.value || ''].join(' ').trim().toLowerCase();
        const category = get('cheat-category').value, folder = get('cheat-folder').value, status = get('cheat-status').value;
        const entries = data.entries.filter(entry => (!category || entry.category === category) && (!folder || entry.folder === folder) && (!status || entry.status === status)
          && query.split(/\s+/).filter(Boolean).every(word => `${entry.id} ${entry.title.en} ${entry.title.es} ${entry.source_title} ${entry.code}`.toLowerCase().includes(word)));
        const pages = Math.max(1, Math.ceil(entries.length / pageSize));
        page = Math.min(page, pages - 1);
        get('cheat-count').textContent = `${entries.length.toLocaleString(lang)} / ${data.entries.length.toLocaleString(lang)} ${t.results}`;
        get('cheat-results').innerHTML = entries.slice(page * pageSize, (page + 1) * pageSize).map(entry => { const runtimeChecked = ['00-006','80-002'].includes(entry.id); return `<article class="card cheat-card" data-cheat-id="${entry.id}">
          <div class="cheat-meta"><span>${escape(data.categories[entry.category][lang])} · ${entry.id}</span><span class="tag">${runtimeChecked ? t.limitedStatus : t[entry.status]}</span></div>
          <h2>${escape(entry.title[lang])}</h2>${entry.source_title !== entry.title[lang] ? `<p class="muted">${escape(entry.source_title)}</p>` : ''}
          ${runtimeChecked ? `<p class="notice">${t.limited} <a href="#/guide/cheat-runtime-qa">${t.runtime}</a></p>` : ''}
          ${entry.status === 'guard_mismatch' ? `<p class="notice">${t.mismatch}</p>` : ''}
          ${entry.requires_custom_wrapper ? `<p class="notice">${t.wrapper}</p>` : ''}
          ${entry.id === '30-004' ? `<p class="notice">${t.capture}</p>` : ''}
          <details><summary>${t.code}</summary><p>${t.instructions}</p><p>${t.backup}</p><p><b>${t.activation}:</b> ${entry.activation_buttons.length ? escape(entry.activation_buttons.join(' / ')) : t.continuous}</p>
          <button class="cheat-copy" data-id="${entry.id}">${t.copy}</button> <button class="cheat-download" data-id="${entry.id}">${t.download}</button><pre tabindex="0"><code>${escape(entry.code)}</code></pre>
          ${entry.source_note ? `<details><summary>${t.source}</summary><p class="source-note">${escape(entry.source_note)}</p></details>` : ''}</details></article>`; }).join('');
        get('cheat-page').textContent = `${page + 1} / ${pages}`;
        get('cheat-previous').disabled = page === 0;
        get('cheat-next').disabled = page >= pages - 1;
        container.querySelectorAll('.cheat-copy').forEach(button => button.onclick = async () => {
          const entry = data.entries.find(value => value.id === button.dataset.id);
          try { await navigator.clipboard.writeText(entry.code); button.textContent = t.copied; }
          catch { button.textContent = t.copyFailed; }
        });
        container.querySelectorAll('.cheat-download').forEach(button => button.onclick = () => {
          const entry = data.entries.find(value => value.id === button.dataset.id);
          const profile = [`# Ultimate Gold ${entry.id}: runtime effect untested`, `# target_sha256: ${data.target_sha256}`, 'cheats = "1"',
            `cheat0_desc = ${JSON.stringify(entry.title[lang])}`, 'cheat0_enable = "false"', 'cheat0_handler = "0"',
            `cheat0_code = "${entry.code.split('\n').join('+')}"`, ''].join('\n');
          const url = URL.createObjectURL(new Blob([profile], {type:'text/plain;charset=utf-8'}));
          const link = document.createElement('a');
          link.href = url; link.download = `Ultimate-Gold-${entry.id}-untested.cht`; link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
      };
      get('cheat-query').oninput = () => { page = 0; paint(); };
      for (const id of ['cheat-category','cheat-folder','cheat-status']) get(id).onchange = () => { page = 0; paint(); };
      const globalSearch = document.getElementById('search');
      if (globalSearch) { globalSearch.onchange = null; globalSearch.oninput = () => { page = 0; paint(); }; }
      get('cheat-previous').onclick = () => { page--; paint(); };
      get('cheat-next').onclick = () => { page++; paint(); };
      paint();
    } catch (error) {
      if (ticket === sequence && location.hash.startsWith('#/cheats')) container.innerHTML = `<p class="notice">${t.failure}: ${escape(error.message)}</p>`;
    }
  }
  window.UltimateCheats = {mount};
})();
