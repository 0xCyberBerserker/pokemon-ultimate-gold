# Web patcher / Patcher web

## English

The Pages workflow follows [GitHub's custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). It uses current documented checkout/upload actions, builds and validates static files, and uploads only an artifact when manually invoked. No deploy job or remote is configured. Publishing remains a separate user instruction.

The GitHub Pages payload is static and patches locally in the browser. It verifies the clean HeartGold SHA-256, the vendored delta SHA-256, and the exact target SHA-256 before offering a download. No ROM is uploaded and no backend or CDN is used.

Ultimate Gold alpha 1 includes the native reusable [TM Refill item](tm-refill-item.md), obtained from the New Bark pedestrian. It does not require a cheat. The downloadable TM99 emulator profile remains an optional alternative, disabled by default.

The selector defaults to **Alpha 2 — experimental**, with the combined Rocket kit, evolution-shop stock and owned-HM changes; Alpha 1 remains available. Each build has its own manifest and delta, and changing builds clears the previous download. Both outputs passed real Chromium patch-and-download checks, including wrong-source and truncated-delta rejection. The integrated wiki download also matches Alpha 2. See [browser evidence](qa-alpha2-browser.json) and [current gameplay scope](project-status.md). EV/IV editing and Kris are absent from both downloads.

The VCDIFF engine is vendored from [Marc Robledo's RomPatcher.js](https://github.com/marcrobledo/RomPatcher.js/) at commit `4f17297cd1dc0835a0b0747497fa15f5f63f1623`; its MIT license is retained under `web/vendor/rompatcher/`. `tools/build_site.py` copies the local delta and generates a relative wiki from `docs/`.

Build locally with `python3 tools/build_site.py`, then publish the `web/` directory through a manually reviewed Pages workflow. No ROM is part of the payload.

## Español

El workflow sigue la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): genera, comprueba y empaqueta archivos estáticos al invocarlo manualmente. No tiene trabajo de despliegue ni remoto configurado. Publicar requiere la instrucción posterior del usuario.

El payload de GitHub Pages es estático y aplica el patch localmente en el navegador. Verifica el SHA-256 de HeartGold limpia, el SHA-256 del delta incluido y el SHA-256 exacto de la salida antes de ofrecer la descarga. No sube la ROM y no usa backend ni CDN.

Ultimate Gold alfa 1 incluye el [objeto nativo de recarga de MT](tm-refill-item.md), entregado por el transeúnte de Pueblo Primavera. No necesita códigos. El perfil MT99 descargable sigue siendo una alternativa opcional del emulador, desactivada por defecto.

El selector abre **Alfa 2 — experimental** por defecto, con kit Rocket, inventario evolutivo y acciones de MO del combinado; alfa 1 sigue disponible. Cada versión tiene manifiesto y delta propios; cambiar de versión limpia la descarga anterior. Ambas salidas pasaron parcheo y descarga reales en Chromium, incluido el rechazo de fuente incorrecta y delta truncado. La descarga integrada en la wiki también coincide con alfa 2. Consulta [evidencia del navegador](qa-alpha2-browser.json) y [alcance dentro del juego](project-status.md). Ninguna descarga incluye editor EV/IV ni Kris.

El motor VCDIFF procede de RomPatcher.js de Marc Robledo en el commit indicado arriba; conserva su licencia MIT. `tools/build_site.py` copia el delta local y genera una wiki relativa desde `docs/`.
