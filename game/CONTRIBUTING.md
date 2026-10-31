# Contributing

## English

Clone the repository and enter the technical project subtree. Direct pushes require collaborator access; request it from the repository owner if needed:

```sh
git clone https://github.com/0xCyberBerserker/pokemon-ultimate-gold.git
cd pokemon-ultimate-gold/game
```

Use your existing GitHub authentication and never place credentials in a URL or commit.

### Project and local workflow

The main project is a Python-standard-library toolchain and a static, browser-only patcher/wiki. The patcher runs locally in the browser; there is no backend or upload service. The normal build and test workflow needs Python 3, with no package-install step.

From `pokemon-ultimate-gold/game` (the technical project directory):

```sh
python3 tools/build_site.py
python3 -m unittest discover -s tests -v
python3 -m http.server 8767 --bind 127.0.0.1 --directory web
```

Open `http://127.0.0.1:8767/` for the wiki home, or `http://127.0.0.1:8767/wiki/#/patcher` for its integrated patcher. The server command stays in the foreground; stop it with Ctrl+C. `tools/build_site.py` writes the local `web/` payload and does not publish it.

### React wiki preview

The React migration is not yet release-verified. In an isolated checkout, inspect the lockfile and dependency provenance, then run `pnpm audit`, `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm test` and `pnpm build` from `wiki-frontend/` using Node.js 26.12.1 and pnpm 12.16.1. An audit with no advisories is not a security guarantee. From `game/`, `python3 tools/build_site.py --react-dist wiki-frontend/dist` generates the site with the React entry point; it rewrites local `web/`, so protect existing changes and use a disposable checkout. The ordinary command without `--react-dist` retains the original wiki. See [the frontend README](wiki-frontend/README.md) for the local HTTP check and remaining verification. The updated Pages workflow is manual and has not been run or deployed as part of this migration.

The optional clean-ROM end-to-end test runs only when `SACRED_GOLD_CLEAN_ROM` points to a file outside the repository. It must be a clean HeartGold USA image of 134,217,728 bytes with SHA-256 `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`, as pinned in `patches/manifest.json`. The Python CLI test also needs `xdelta3` already available on `PATH` or selected through `SACRED_GOLD_XDELTA`; the browser-engine test runs only when Node.js is available. This guide does not install tools. Without the clean ROM, ROM-dependent positive tests are skipped. Never add the ROM or its path to Git. Other candidate QA must use the exact ROM SHA recorded in that candidate's evidence; do not infer compatibility across builds.

### Scope and data handling

Alpha 2 is the selectable experimental download; Alpha 1 remains available as the earlier build. The private EV/IV editor and Kris work are experimental research, not downloadable features. Keep ROMs, output ROMs, saves, emulator states, screenshots, private sprites, and raw QA captures outside Git. Do not add new artwork or third-party material without approved provenance and rights review. Preserve existing credits and licenses.

The generated site is a local build artifact. This repository does not publish GitHub Pages or create releases automatically. Do not deploy or release without a separate explicit authorization. Keep changes focused, preserve existing manifests and evidence boundaries, and do not add dependencies or CI changes as part of a documentation or content contribution.

### Branches and review

Create a topic branch under `features/`, for example `features/contributor-guide`. Push only that branch and open a pull request against the repository's configured default branch. Request review from a project collaborator through their existing GitHub collaborator entry; do not guess or hard-code a username. Include the commands and focused checks you ran. Do not force-push shared branches.

## Español

Clona el repositorio y entra en el subdirectorio técnico del proyecto. Los pushes directos requieren acceso de colaborador; solicítalo al propietario si lo necesitas:

```sh
git clone https://github.com/0xCyberBerserker/pokemon-ultimate-gold.git
cd pokemon-ultimate-gold/game
```

Usa la autenticación de GitHub ya configurada. Nunca incluyas credenciales en una URL o un commit.

### Proyecto y flujo local

El proyecto principal usa herramientas de la biblioteca estándar de Python y un patcher/wiki estático que funciona en el navegador. El patcher procesa los archivos localmente; no hay backend ni servicio de subida. El flujo normal de build y pruebas requiere Python 3 y no necesita instalar paquetes.

Desde `pokemon-ultimate-gold/game` (el directorio técnico del proyecto):

```sh
python3 tools/build_site.py
python3 -m unittest discover -s tests -v
python3 -m http.server 8767 --bind 127.0.0.1 --directory web
```

Abre `http://127.0.0.1:8767/` para el inicio de la wiki, o `http://127.0.0.1:8767/wiki/#/patcher` para su parcheador integrado. El servidor queda en primer plano; detenlo con Ctrl+C. `tools/build_site.py` genera la carpeta local `web/` y no la publica.

### Vista previa de la wiki React

La migración a React aún no está verificada para release. En una copia aislada, revisa el lockfile y la procedencia de las dependencias; después ejecuta `pnpm audit`, `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm test` y `pnpm build` desde `wiki-frontend/` con Node.js 26.12.1 y pnpm 12.16.1. Una auditoría sin avisos no garantiza la seguridad. Desde `game/`, `python3 tools/build_site.py --react-dist wiki-frontend/dist` genera el sitio con la entrada React; modifica la carpeta local `web/`, por lo que debes proteger los cambios existentes y usar una copia desechable. El comando normal sin `--react-dist` conserva la wiki original. Consulta [el README del frontend](wiki-frontend/README.md) para la comprobación HTTP local y las verificaciones pendientes. El workflow de Pages actualizado es manual y no se ha ejecutado ni desplegado como parte de esta migración.

La prueba E2E opcional con ROM limpia solo se ejecuta si `SACRED_GOLD_CLEAN_ROM` apunta a un archivo fuera del repositorio. Debe ser una imagen limpia de HeartGold USA de 134.217.728 bytes con SHA-256 `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`, fijado en `patches/manifest.json`. La prueba CLI de Python también requiere que `xdelta3` ya esté disponible en `PATH` o se seleccione mediante `SACRED_GOLD_XDELTA`; la prueba del motor web solo se ejecuta si Node.js está disponible. Esta guía no instala herramientas. Sin la ROM se omiten las pruebas positivas que dependen de ella. Nunca añadas la ROM ni su ruta a Git. El QA de otras candidatas debe usar el SHA exacto indicado en su propia evidencia; no infieras compatibilidad entre builds.

### Alcance y manejo de datos

Alpha 2 es la descarga experimental seleccionable; Alpha 1 sigue disponible como build anterior. El editor EV/IV privado y el trabajo de Kris son investigación experimental, no funciones descargables. Mantén ROMs, ROMs generadas, partidas, estados del emulador, capturas, sprites privados y capturas QA sin procesar fuera de Git. No añadas arte nuevo ni material de terceros sin revisar procedencia y derechos. Conserva los créditos y licencias existentes.

El sitio generado es un artefacto de build local. Este repositorio no publica GitHub Pages ni crea releases automáticamente. No despliegues ni publiques una release sin autorización explícita aparte. Mantén los cambios acotados, conserva los manifiestos y límites de evidencia existentes, y no añadas dependencias ni cambios de CI como parte de una contribución de documentación o contenido.

### Ramas y revisión

Crea una rama temática bajo `features/`, por ejemplo `features/contributor-guide`. Sube solo esa rama y abre un pull request contra la rama predeterminada configurada en el repositorio. Solicita revisión a una persona colaboradora del proyecto mediante su entrada existente en GitHub; no adivines ni fijes un nombre de usuario. Incluye los comandos y comprobaciones acotadas que ejecutaste. No fuerces el push de ramas compartidas.

Made with 🖤 in Barcelona City 🇪🇸
