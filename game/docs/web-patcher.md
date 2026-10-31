# Web patcher / Patcher web

## English

The Pages workflow follows [GitHub's custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). It builds, validates and deploys the static site when manually invoked from the default branch.

The GitHub Pages payload is static and patches locally in the browser. It verifies the clean HeartGold SHA-256, the vendored delta SHA-256, and the exact target SHA-256 before offering a download. No ROM is uploaded and patching requires no backend.

Ultimate Gold alpha 1 includes the native reusable [TM Refill item](tm-refill-item.md), obtained from the New Bark pedestrian. It does not require a cheat. The downloadable TM99 emulator profile remains an optional alternative, disabled by default.

The selector defaults to **Kris + updated credits — experimental**, the latest cumulative candidate. One patch applies directly to the compatible clean input; do not stack older patches. Alpha 1 and Alpha 2 remain selectable. The latest candidate includes the previously documented features by reviewed lineage, plus Kris, credits and an experimental stat editor. Limited editor cases were tested on an earlier build, with no new editor QA on this candidate. Full adventure and hardware testing remain open. The wiki data and cheat catalog describe Alpha 2 and have not been verified against the latest candidate. See [current gameplay scope](project-status.md).

The VCDIFF engine is vendored from [Marc Robledo's RomPatcher.js](https://github.com/marcrobledo/RomPatcher.js/) at commit `4f17297cd1dc0835a0b0747497fa15f5f63f1623`; its MIT license is retained under `web/vendor/rompatcher/`. `tools/build_site.py` copies the local delta and generates a relative wiki from `docs/`.

Build locally with `python3 tools/build_site.py`, then publish the `web/` directory through a manually reviewed Pages workflow. No ROM is part of the payload.

## Español

El workflow sigue la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): genera, comprueba y despliega la web estática al invocarlo manualmente desde la rama predeterminada.

El payload de GitHub Pages es estático y aplica el patch localmente en el navegador. Verifica el SHA-256 de HeartGold limpia, el SHA-256 del delta incluido y el SHA-256 exacto de la salida antes de ofrecer la descarga. No sube la ROM y no usa backend ni CDN.

Ultimate Gold alfa 1 incluye el [objeto nativo de recarga de MT](tm-refill-item.md), entregado por el transeúnte de Pueblo Primavera. No necesita códigos. El perfil MT99 descargable sigue siendo una alternativa opcional del emulador, desactivada por defecto.

El selector abre **Kris + créditos actualizados — experimental**, la candidata acumulativa más reciente. Un único parche se aplica directamente sobre la entrada limpia compatible; no apiles parches anteriores. Alfa 1 y Alfa 2 siguen disponibles. La candidata incluye las funciones previas por linaje revisado, además de Kris, créditos y un editor de estadísticas experimental. Algunos casos del editor se probaron en una versión anterior, sin nuevas pruebas del editor en esta candidata. Siguen pendientes la aventura completa y las pruebas en hardware. Los datos de la wiki y el catálogo de trucos describen Alfa 2 y no se han verificado contra la candidata más reciente. Consulta el [alcance actual](project-status.md).

El motor VCDIFF procede de RomPatcher.js de Marc Robledo en el commit indicado arriba; conserva su licencia MIT. `tools/build_site.py` copia el delta local y genera una wiki relativa desde `docs/`.
