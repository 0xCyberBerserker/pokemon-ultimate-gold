# Ultimate Gold project instructions

## Scope

This repository contains a reproducible xdelta patch, a browser-only patcher and generated wiki for GitHub Pages, plus optional Python CLI/Qt tools for the Sacred Gold Plus custom build. ROMs, saves, emulator states, and archives stay outside Git. Existing NDS/GBA browser patchers are the reference approach: the vendored RomPatcher.js VCDIFF engine is pinned; do not replace it with a custom decoder without evidence.

## Commands

```text
python3 -m unittest discover -s tests -v
python3 tools/build_site.py
python3 -m http.server 8767 --bind 127.0.0.1 --directory web
LD_LIBRARY_PATH=/external/tools/usr/lib python3 tools/patcher.py /external/HeartGold-USA.nds output.nds --xdelta /external/tools/usr/bin/xdelta3
```

Set `SACRED_GOLD_CLEAN_ROM` to run the positive end-to-end test with the external clean ROM, and `SACRED_GOLD_XDELTA` when xdelta3 is outside PATH. `patches/manifest.json` selects the default and must exactly match one versioned manifest. Alpha 1 contains native TM Refill. Selectable experimental Alpha 2 is exact FIX6a (`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`), with Rocket kit, evolution-shop stock and owned-HM actions; evidence and limits are linked by hashes in `manifest-alpha2.json`. Do not inherit the isolated kit's 288 assertions or Alpha 1 gameplay checks without exact-target evidence. Plus has 60 canonical key-item slots; its legacy 50-slot projection is not a full-capacity QA oracle. Wiki and cheat-catalog target hashes must match the default manifest. EV/IV editor probes stay separate and are not downloadable Alpha 2 features.

## Boundaries

- Do not add ROMs, save files, states, or temporary archives.
- Do not publish, add a remote, or push without explicit user instruction.
- Do not describe runtime cheats as native ROM behavior.
- Keep gameplay and physical-controller acceptance separate from patch integrity.
- Preserve third-party credits and applicable licenses; this project does not claim ownership of upstream assets or patches.

Code and comments are English. Public documentation is English first and Spanish second.

Made with 🖤 in Barcelona City 🇪🇸

## Español

Repo local de parche e instalador reproducible. Las ROMs, partidas, estados y archivos temporales quedan fuera de Git. No crear remotos ni publicar sin autorización explícita. Los códigos de MT son de runtime; no anunciarlos como comportamiento nativo. Separar integridad del parche, pruebas reales y aceptación de hardware. Las guías propias están en `docs/`; los datos se regeneran desde una ROM externa del hash exacto. Código/comentarios en inglés y documentación English primero, Español después. Ejecutar los tests indicados antes de entregar; no inicializar Argot automáticamente.

El manifiesto principal debe coincidir exactamente con uno de los manifiestos por versión. Alfa 2 es seleccionable y experimental; sus pruebas acotadas no aceptan toda la aventura ni heredan silenciosamente las de alfa 1. Los hashes de wiki y catálogo de trucos deben coincidir con la versión predeterminada. Los prototipos del editor EV/IV permanecen separados de las descargas.
