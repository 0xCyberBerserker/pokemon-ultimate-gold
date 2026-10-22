# User manual / Manual de usuario

## English

For the primary web interface, run `python3 tools/build_site.py`, then `python3 -m http.server 8767 --bind 127.0.0.1 --directory web`. Open `http://127.0.0.1:8767/`, select English or Spanish and choose your clean 128 MiB `.nds`. Extract a ZIP first. Apply, wait for verification and download the result. The source, delta and output SHA-256 must match; the browser never uploads your ROM. The site also links our wiki and the matching TM99 emulator profile. GitHub Pages publication remains deferred.

The following CLI route is optional and also supports a one-ROM ZIP:

Keep the clean HeartGold USA `.nds` outside the repository. Apply the patch with the bundled manifest:

```bash
LD_LIBRARY_PATH=/external/tools/usr/lib python3 tools/patcher.py \
  /external/HeartGold-USA.nds \
  /external/output/Ultimate-Gold-alpha2.nds \
  --xdelta /external/tools/usr/bin/xdelta3
```

The default output is `Ultimate-Gold-alpha2.nds`, pinned by `patches/manifest.json` and `patches/manifest-alpha2.json`. It is experimental and includes the Rocket convenience kit, evolution-shop stock and owned-HM actions. Its Rocket NPC in New Bark Town offers TM Refill and the other kit items. No emulator code is required for TM Refill; the legacy TM99 profile is optional.

The selector also offers **Alpha 1**, the earlier native TM Refill build with the pedestrian giver. To select it with the CLI, add `--manifest patches/manifest-alpha1.json` and use `/external/output/Ultimate-Gold-alpha1.nds` as a separate output. Alpha 2 has representative exact-target native tests; full-story acceptance remains pending. Neither download includes the EV/IV editor or Kris. Back up and separate saves between builds; patching never upgrades a save.

If a source, delta, or output hash fails, stop and preserve the files for investigation. Do not use `--force` unless the destination is intentionally disposable.

## Español

Interfaz web principal: ejecuta `python3 tools/build_site.py` y `python3 -m http.server 8767 --bind 127.0.0.1 --directory web`. Abre `http://127.0.0.1:8767/`, elige idioma y selecciona tu `.nds` limpio de 128 MiB. Extrae antes los ZIP. Aplica, espera la verificación y descarga el resultado. Deben coincidir los hashes de fuente, delta y salida; el navegador no sube tu ROM. La web enlaza nuestra wiki y el perfil MT99. La publicación en Pages queda aplazada.

La CLI opcional descrita arriba también admite un ZIP con una sola ROM:

Conserva el `.nds` limpio de HeartGold USA fuera del repositorio. Aplica el patch con el manifiesto incluido usando el mismo comando anterior y rutas locales equivalentes.

La salida predeterminada es `Ultimate-Gold-alpha2.nds`, fijada por `patches/manifest.json` y `patches/manifest-alpha2.json`. Es experimental e incluye kit Rocket, inventario evolutivo y acciones de MO sin enseñar movimientos. El NPC Rocket de New Bark Town (Pueblo Primavera) ofrece TM Refill (Recarga MT) y los demás objetos del kit. Este objeto no necesita códigos; el perfil MT99 anterior es opcional.

El selector también ofrece **Alfa 1**, la anterior con TM Refill nativo y el transeúnte que lo entrega. Para elegirla en la CLI, añade `--manifest patches/manifest-alpha1.json` y usa `/external/output/Ultimate-Gold-alpha1.nds` como salida separada. Alfa 2 tiene pruebas nativas representativas de su hash exacto; falta aceptar la historia completa. Ninguna descarga contiene el editor EV/IV ni Kris. Guarda copias y separa las partidas entre versiones; parchear no actualiza una partida.

Si falla cualquier hash de fuente, delta o salida, detén el proceso y conserva los archivos para investigar. No uses `--force` salvo que el destino sea desechable de forma intencionada.
