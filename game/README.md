# Ultimate Gold — browser patcher and game wiki

Browser-only patcher and game wiki for GitHub Pages, with optional CLI and Qt tools. Builds start from the exact clean Pokémon HeartGold USA source, based on Sacred Gold Plus and Drayano's work. No ROM is included.

## English

### Quick start

1. Run `python3 tools/build_site.py`.
2. Preview with `python3 -m http.server 8767 --bind 127.0.0.1 --directory web` and open `http://127.0.0.1:8767/`.
3. Choose a build and your clean 128 MiB `.nds`, apply the patch, then download the verified result. Extract ZIP files before using the browser interface.

**Builds:** Kris Sprint 2 is the experimental browser default, including Kris, updated credits and an experimental EV/IV/nature editor by reviewed lineage. Limited editor cases were tested on earlier builds; no new editor QA was performed on this candidate. Alpha 1 and Alpha 2 remain selectable. The wiki and cheat catalog describe Alpha 2 and have not been verified for the newer target. Exact-target tests cover representative actions, not the complete story. [Current scope](docs/project-status.md).

All ROM processing happens in the browser. No backend, account, ROM upload or installed xdelta tool is required. [Web guide](docs/web-patcher.md). The generated `web/` directory is the Pages payload.

Documentation: [our final guides](docs/README.md), [493-species table](docs/species-493.csv), [source cross-checks](docs/sources-inventory.md). These are authored guides and derived data, not copies of upstream manuals.

Contributing: [setup, tests, QA boundaries and pull-request review](CONTRIBUTING.md).

For the native Qt interface, run `python3 tools/patcher_gui.py` (PySide6 and xdelta3 required). It follows the system palette and includes English/Spanish. `python3 tools/install_desktop.py` previews menu/desktop entries; add `--install` to create them without replacing existing shortcuts. The CLI requires only Python standard library plus xdelta3.

For the optional CLI, keep the clean `.nds` outside the repository and run:

```bash
LD_LIBRARY_PATH=/external/tools/usr/lib python3 tools/patcher.py \
  /external/HeartGold-USA.nds \
  /external/output/Ultimate-Gold-alpha2.nds \
  --xdelta /external/tools/usr/bin/xdelta3
```

The patcher checks source, delta, and output SHA-256 values, writes atomically, and refuses an existing output unless `--force` is supplied. A `.zip` containing exactly one `.nds` is accepted.

To select Alpha 1 in the CLI, add `--manifest patches/manifest-alpha1.json` and choose a separate output such as `/external/output/Ultimate-Gold-alpha1.nds`. Keep saves for different builds separate.

Run tests with `SACRED_GOLD_CLEAN_ROM=/external/HeartGold-USA.nds python3 -m unittest discover -s tests -v`.

The manifest names each output. Alpha 2's Rocket NPC in New Bark Town offers the kit; Alpha 1's pedestrian offers TM Refill only. TM Refill needs no emulator code. Runtime and persistence evidence remain specific to each target and action; full-story, evolution, PC-storage and controller acceptance remain pending. [Current evidence](docs/project-status.md).

### Español

La interfaz principal es el patcher de navegador y nuestra wiki para GitHub Pages. Genera la web con `python3 tools/build_site.py`; previsualiza con `python3 -m http.server 8767 --bind 127.0.0.1 --directory web` y abre `http://127.0.0.1:8767/`. Elige versión y tu `.nds` limpio de 128 MiB, aplica el parche y descarga el resultado verificado. Extrae antes los ZIP.

**Versiones:** Kris Sprint 2 es la opción web experimental predeterminada, con Kris, créditos actualizados y un editor EV/IV/naturalezas experimental por linaje revisado. Algunos casos del editor se probaron en versiones anteriores; no se realizaron nuevas pruebas del editor en esta candidata. Alfa 1 y Alfa 2 siguen disponibles. Los datos de la wiki y el catálogo de trucos describen Alfa 2 y no se han verificado para el nuevo destino. Las pruebas del hash exacto cubren casos representativos, no la historia completa. [Alcance actual](docs/project-status.md).

Todo el procesamiento de la ROM es local. No necesita backend, cuenta, subir la ROM ni xdelta instalado. [Guía web](docs/web-patcher.md). `web/` contiene la entrega para Pages.

Guías: [documentación final propia](docs/README.md), [tabla de 493 especies](docs/species-493.csv), [fuentes contrastadas](docs/sources-inventory.md). No son copias de los manuales originales.

Contribuir: [preparación, pruebas, límites de QA y revisión de pull requests](CONTRIBUTING.md).

Interfaz Qt nativa: `python3 tools/patcher_gui.py` (requiere PySide6 y xdelta3). Respeta la paleta del sistema y ofrece English/Español. `python3 tools/install_desktop.py` muestra los accesos de menú/escritorio; `--install` los crea sin reemplazar otros. La CLI sólo requiere Python estándar y xdelta3.

El proyecto genera y verifica parches desde Pokémon HeartGold USA limpia y exacta, basado en Sacred Gold Plus y el trabajo de Drayano. No contiene ninguna ROM. Para elegir alfa 1 en la CLI, añade `--manifest patches/manifest-alpha1.json` y usa una salida separada como `/external/output/Ultimate-Gold-alpha1.nds`. Separa también los guardados de cada versión.

La CLI verifica los hashes de fuente, delta y salida, escribe de forma atómica y rechaza sobrescribir salvo con `--force`. Acepta un ZIP con un único `.nds`. El manifiesto nombra la salida. En alfa 2, el NPC Rocket de New Bark Town (Pueblo Primavera) ofrece el kit; en alfa 1, el transeúnte ofrece solo TM Refill. No necesita códigos del emulador. Las pruebas y la persistencia corresponden a cada hash y acción; faltan historia completa, evolución, PC y mando físico. [Evidencia actual](docs/project-status.md).

Made with 🖤 in Barcelona City 🇪🇸
