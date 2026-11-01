# Experimental Nintendo DS resource checks

## English

These read-only diagnostics cover selected NARC, 2D and 3D Nintendo DS resource structures. They are **experimental and incomplete**: a successful partial check is not a full validity, gameplay or hardware certification. They do not extract or distribute game files.

### Requirements and commands

Run from `game/` using existing Node.js and Python 3; no additional Python packages are required:

```sh
node tools/validate_narc.cjs ARCHIVE.narc --json
python3 tools/validate_nitro_textures.py MODEL.nsbmd --json
python3 tools/validate_nitro_textures.py MODEL.nsbmd --textures TEXTURES.nsbtx --animation ANIMATION.nsbtp --json
python3 tools/validate_nitro_textures.py TEXTURES.nsbtx --texture-name TEXTURE --palette-name PALETTE --json
python3 tools/validate_nitro_textures.py CHAR.ncgr --screen SCREEN.nscr --palette PALETTE.nclr --json
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_validate_*.py' -v
```

Omit `--json` for a human-readable result. The 4×4 name options are supplied together and apply only to an explicitly selected compressed texture/palette pair. The 2D screen and palette options are supplied together and cannot be combined with 3D options. Inputs are read without modification; JSON results include SHA-256 hashes of supplied resources.

`FAIL` exits 1 for an invalid supported structure or a mismatch with the supplied resources. `INCOMPLETE` and `UNSUPPORTED` exit 2: respectively, checks ran with known gaps or the input layout is outside the supported profile. Neither means a full PASS. Python argument errors also exit 2. The NARC checker prints JSON failures to stderr; the graphics checker prints JSON results to stdout.

### Scope and limitations

- NARC: checks header, BTAF/BTNF/GMIF block boundaries and allocation ranges, including ordering and overlap. It reuses the repository's record reader. Filename-table contents and member semantics are not validated; the ordering rule is a conservative supported profile.
- BMD0/BTX0/TEX0: checks declared block and model boundaries, dictionary sizes and node-reference ranges, texture payload spans, palette start offsets, material binding IDs and supplied texture/palette names. Dictionary lookup equivalence, render-command indices, full material semantics and individual palette extents are not validated.
- BTP0/PAT0: checks name tables, keyframe bounds, indices and nondecreasing order, and compares resource names against the supplied texture set. With BMD0 input, track names are compared against the union of model material names; unmatched tracks are reported as incomplete. Duplicate-frame and duration edge cases, binding to a particular model and other animation formats remain unverified.
- 4×4: checks actual color reads against the shared palette buffer for the pair explicitly named by the caller. It does not infer exclusive palette lengths or prove the game uses that pair. Other pairs remain unchecked.
- 2D: supports a non-scanned 4bpp text-screen profile and checks referenced NCGR tiles and NCLR buffer accesses for the supplied NSCR. Extended and inverted-size palettes are unsupported. Other 2D profiles, runtime VRAM mapping and rendered appearance are not verified.

The checks can identify some out-of-bounds references that could cause defects. They cannot certify game binding, visual correctness, compatibility with every HGSS build or real hardware behavior. The tests use synthetic resources; no protected game assets are included.

### Sources and attribution

- [HoennB2](https://github.com/logdog2325/HoennB2/tree/aee43563873235221f29d442ac7af04bdff02f95), MIT: dictionary, material-binding and PAT0 layouts adapted from `b2tools/nsbtx.py` and `b2tools/anim_tex_check.py`. See [license and copyright notice](hoennb2-MIT-LICENSE.txt). Black 2-specific archive indices and RAM addresses are not reused.
- [Apicula pattern parser](https://github.com/scurest/apicula/blob/3d4e91e14045392a49c89e86dab8cb936225588c/src/nitro/pattern.rs) and [texture decoder](https://github.com/scurest/apicula/blob/3d4e91e14045392a49c89e86dab8cb936225588c/src/nds/decode_texture.rs), 0BSD: independent format references.
- [Nitro G3D format notes](https://github.com/scurest/nsbmd_docs/blob/ca24070e37cf607f7b30e6fcda1052ff84368909/nsbmd_docs.txt) and [GBATEK](https://problemkaputt.de/gbatek.htm): reverse-engineered format references, not official hardware specifications.
- [NitroGfx](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/tools/nitrogfx/gfx.c), MIT: 2D format reference. No NitroGfx code is included as a new dependency.

## Español

Estos diagnósticos de solo lectura cubren determinadas estructuras NARC y recursos gráficos Nintendo DS 2D y 3D. Son **experimentales e incompletos**: superar una comprobación parcial no certifica la validez completa, el juego ni el hardware. No extraen ni distribuyen archivos del juego.

### Requisitos y comandos

Ejecuta desde `game/` con Node.js y Python 3 ya disponibles; no se requieren paquetes Python adicionales:

```sh
node tools/validate_narc.cjs ARCHIVO.narc --json
python3 tools/validate_nitro_textures.py MODELO.nsbmd --json
python3 tools/validate_nitro_textures.py MODELO.nsbmd --textures TEXTURAS.nsbtx --animation ANIMACION.nsbtp --json
python3 tools/validate_nitro_textures.py TEXTURAS.nsbtx --texture-name TEXTURA --palette-name PALETA --json
python3 tools/validate_nitro_textures.py CHAR.ncgr --screen PANTALLA.nscr --palette PALETA.nclr --json
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_validate_*.py' -v
```

Omite `--json` para la salida legible. Las opciones de nombres 4×4 se proporcionan juntas y se aplican solo a la pareja comprimida seleccionada. Las opciones de pantalla y paleta 2D se proporcionan juntas y no se combinan con opciones 3D. Las entradas se leen sin modificarlas; JSON incluye los SHA-256 de los recursos suministrados.

`FAIL` devuelve 1 ante una estructura soportada inválida o una discrepancia entre los recursos suministrados. `INCOMPLETE` y `UNSUPPORTED` devuelven 2: respectivamente, se realizaron comprobaciones con carencias conocidas o el formato queda fuera del perfil admitido. Ninguno supone un PASS completo. Los errores de argumentos de Python también devuelven 2. El comprobador NARC emite los errores JSON por stderr; el gráfico emite los resultados JSON por stdout.

### Cobertura y límites

- NARC: comprueba cabecera, límites de bloques BTAF/BTNF/GMIF y rangos de asignación, incluidos orden y solapamiento. Reutiliza el lector de registros del repositorio. No valida los nombres ni la semántica de los miembros; el orden es una restricción conservadora del perfil admitido.
- BMD0/BTX0/TEX0: comprueba límites declarados de bloques y modelos, tamaños de diccionario y referencias de nodos, rangos de texturas, posiciones iniciales de paletas, IDs de material y nombres de recursos suministrados. No valida la equivalencia de búsqueda del diccionario, índices de comandos de dibujo, semántica completa de materiales ni extensiones individuales de paleta.
- BTP0/PAT0: comprueba tablas de nombres, límites de keyframes, índices y orden no decreciente, y compara nombres con el conjunto de texturas suministrado. Con BMD0, compara tracks con la unión de nombres de materiales de sus modelos; los ausentes se indican como incompletos. Siguen sin verificarse los casos límite de duración y frames repetidos, el vínculo con un modelo concreto y otros formatos de animación.
- 4×4: comprueba lecturas reales de color contra el buffer compartido de paletas para la pareja indicada explícitamente. No deduce longitudes exclusivas de paleta ni demuestra que el juego use esa pareja. El resto de parejas no se comprueba.
- 2D: admite el perfil de pantalla de texto 4bpp sin barrido y comprueba tiles NCGR y accesos al buffer NCLR para el NSCR suministrado. No admite paletas extendidas ni con tamaño invertido. No verifica otros perfiles 2D, la asignación de VRAM ni el aspecto renderizado.

Las comprobaciones pueden detectar algunas referencias fuera de límites que causen defectos. No certifican el vínculo en el juego, el resultado visual, compatibilidad con todas las builds HGSS ni comportamiento en hardware real. Los tests usan recursos sintéticos; no incluyen assets protegidos.

### Fuentes y atribución

- [HoennB2](https://github.com/logdog2325/HoennB2/tree/aee43563873235221f29d442ac7af04bdff02f95), MIT: layouts de diccionarios, enlaces de materiales y PAT0 adaptados de `b2tools/nsbtx.py` y `b2tools/anim_tex_check.py`. Consulta la [licencia y atribución](hoennb2-MIT-LICENSE.txt). No se reutilizan índices de archivo ni direcciones RAM específicos de Black 2.
- [Parser de patrones de Apicula](https://github.com/scurest/apicula/blob/3d4e91e14045392a49c89e86dab8cb936225588c/src/nitro/pattern.rs) y [decoder de texturas](https://github.com/scurest/apicula/blob/3d4e91e14045392a49c89e86dab8cb936225588c/src/nds/decode_texture.rs), 0BSD: referencias independientes del formato.
- [Notas del formato Nitro G3D](https://github.com/scurest/nsbmd_docs/blob/ca24070e37cf607f7b30e6fcda1052ff84368909/nsbmd_docs.txt) y [GBATEK](https://problemkaputt.de/gbatek.htm): referencias de ingeniería inversa, no especificaciones oficiales de hardware.
- [NitroGfx](https://github.com/pret/pokeheartgold/blob/6988158691eb6178cff697cda0428045ddcba5fb/tools/nitrogfx/gfx.c), MIT: referencia del formato 2D. NitroGfx no se incluye como dependencia nueva.
