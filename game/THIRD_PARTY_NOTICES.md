# Sources and rights / Fuentes y derechos

## English

This is a local patch project. No Nintendo ROM, save, upstream manual or emulator binary is included. The patcher code, authored guides and extracted factual tables are separate from the supplied ROM and mod sources. No blanket license over third-party game/mod assets is asserted.

- Sacred Gold / Storm Silver: Drayano, version 1.05 Complete. Trainer data and the official Speed-Up changes are used in the local adaptation. [Original project](https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/).
- Sacred Gold Plus: Umberto-DEV and credited contributors, release 1.2.3, source commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. The upstream source provides GPL-3.0 terms; those terms do not grant ownership of Nintendo game resources. [Pinned source](https://github.com/Umberto-DEV/sacred-gold-plus/tree/5b90a788ac3c7d1e4733b4d175a97811cc6745a3).
- The local adaptation keeps the original Drayano trainer archives, ports 18 native Speed-Up bytes and corrects two Ghost-type chart entries. Alpha 1 adds native TM Refill; the legacy TM99 emulator profile remains separate.
- Pokémon/item/type sprites come from the pinned PokeAPI sprite repository. Trainer portraits are decoded from the exact ROM data, with transparent backgrounds and the original frame layout preserved. Asset provenance manifests retain source references and hashes; no ownership of game artwork is asserted.
- xdelta3, Python and optional PySide6 are external runtime dependencies; their binaries are not redistributed here.
- The browser engine is Marc Robledo's [RomPatcher.js](https://github.com/marcrobledo/RomPatcher.js), commit `4f17297cd1dc0835a0b0747497fa15f5f63f1623`. Its MIT license and original notices are retained in `web/vendor/rompatcher/`. Embedded VCDIFF code also credits Joshua MacDonald under Apache-2.0; the original attribution is preserved in the source. [Vendored hashes](web/vendor/provenance.json).

Private GitHub collaboration has been authorized. Public publication, the license for the original project code and compliance of any publicly distributed patch/source bundle remain separate release decisions. This does not grant redistribution rights over third-party artwork; experimental Kris artwork is excluded from the collaboration import. See [source inventory](docs/sources-inventory.md) for inspected documents, hashes and the distinction between inherited and verified claims.

## Español

Proyecto local de parche. No incluye ROM de Nintendo, partidas, manuales originales ni binarios de emulador. Código propio, guías y tablas factuales se distinguen de los recursos del juego y mods; no se atribuye una licencia global sobre material de terceros.

Se acredita a Drayano por Sacred Gold 1.05 Complete y Speed-Up, y a Umberto-DEV y colaboradores por Plus 1.2.3, con commit y enlaces fijados arriba. El código upstream de Plus ofrece GPL-3.0; no implica propiedad sobre recursos de Nintendo. La adaptación conserva entrenadores, porta 18 bytes de velocidad y corrige dos interacciones Fantasma. Alfa 1 añade Recarga MT nativa; el perfil anterior del emulador sigue separado.

Los sprites de Pokémon, objetos y tipos proceden del repositorio PokeAPI fijado por commit. Los retratos se decodifican de los datos de la ROM exacta, conservando los fotogramas y con fondo transparente. Sus manifiestos guardan referencias y hashes; no se atribuye propiedad sobre el arte del juego.

Python, xdelta3 y PySide6 opcional son dependencias externas, sin binarios incluidos. La colaboración privada en GitHub está autorizada; la publicación pública, licencia del código propio y requisitos de distribución pública quedan como decisiones separadas de release. Esto no concede derechos de redistribución sobre arte de terceros; el arte experimental de Kris se excluye de la importación para colaboradores. El [inventario de fuentes](docs/sources-inventory.md) conserva trazabilidad y límites de verificación.

El motor web es RomPatcher.js de Marc Robledo, fijado por commit arriba, con licencia MIT y avisos originales conservados en `web/vendor/rompatcher/`. El código VCDIFF incluido acredita además a Joshua MacDonald bajo Apache-2.0. El manifiesto de procedencia registra los hashes de los archivos vendorizados.
