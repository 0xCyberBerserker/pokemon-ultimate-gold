# World Tournament feasibility / Viabilidad del Torneo Mundial

## English

**Status: research only. No PWT code, assets, Gen 5 binaries, or ROM changes are included.**

The user explicitly deferred implementation on 22 October 2026. Keep this as a future idea and study; PWT integration is outside the current work.

### Finding

A PWT-style tournament is technically plausible as a new HGSS-native facility, but the bounded source review found no ready-made PWT implementation for HGSS/NDS. The accepted Alpha 1 already contains the Battle Frontier hub, five facilities, a native Tower party validator, and facility-specific scripts. The lowest-risk route is to clone a facility scene and its event presentation, then implement bracket state and progression in the existing HGSS engine. This is a future design recommendation, not an accepted feature.

The official Black 2/White 2 PWT uses an elimination tournament and draws on Gym Leaders and Champions; its documented formats include Single, Double, Triple, and Rotation battles. That defines the inspiration, not a compatible binary or data source. HGSS should start with the battle formats that the existing engine can prove; Triple and Rotation need a separate compatibility investigation before they enter scope.

### Reuse candidates reviewed

| Candidate | What it offers | Compatibility and rights outcome |
|---|---|---|
| HGSS source stack: local [`pokeheartgold`](https://github.com/pret/pokeheartgold/tree/6988158691eb6178cff697cda0428045ddcba5fb) and [`hg-engine`](https://github.com/BluRosie/hg-engine) checkouts | Native HGSS maps, scripts, Battle Frontier facilities, save records, and battle flow provide the closest implementation substrate. The `hg-engine` README describes a HeartGold engine overhaul, not a PWT module. | Use as architecture references. The checked-out `pokeheartgold` tree has no root `LICENSE`/`COPYING` file; do not copy its code until rights are clarified. `hg-engine`'s README permits code/assets only with no money (including donations), no paywall, and replicated credits; check this project's distribution constraints and per-file provenance before reuse. Both require a source-level compatibility audit against the exact Alpha 1 build. |
| [HGSS Competitive Battle Factory hack](https://www.pokecommunity.com/threads/hgss-competitive-battle-factory-frontier-romhack.534245/) | Its author describes a HGSS patch replacing 950 Battle Factory sets, with round scaling and level-50 play guidance. It demonstrates an exact-platform facility/data modification. | The public post offers a patch and save, not source code or an explicit code/data reuse license. Do not import its patch or data. It may inform feature requirements only. |
| [Pokémon Battle Theater](https://github.com/logdog2325/pokemon-battle-theater) | Current README documents a Gen 3 Emerald simulator with BW2 PWT rosters and eight-trainer single-elimination brackets. This is a useful behavior reference. | It targets vanilla Emerald (GBA), not HGSS/NDS; its repository page has no license or explicit reuse grant. Use only as a design reference unless its author grants permission. Do not port its binary or assets. |

Credit is not a substitute for reuse permission. No candidate above supplies a licensed, drop-in HGSS PWT module.

### Recommended future slice

1. Clone a Frontier facility's lobby/event presentation in the HGSS source and reuse the native battle launch path. The Battle Arcade's game-board transition and the Tower's registration/party-check flow are useful patterns; they are not a ready bracket engine.
2. Start with an eight-entrant, single-elimination cup using a fixed, versioned trainer roster and one confirmed HGSS format. Keep bracket seed, entrant IDs, current round, and result in an explicitly versioned save extension so power loss or a normal save/reload cannot corrupt an in-progress cup.
3. Reuse local trainer records only after checking their target version and provenance. Do not copy BW2 scripts, overlays, graphics, or other ROM binaries. Add multi-format play and special online trainers only after the battle engine and external-service dependencies are independently verified.
4. Validate bracket generation, opponent uniqueness, wins/losses, interruption/reload, reward idempotence, story access, level handling, and save migration in a fresh profile. Keep static resource presence separate from runtime acceptance.

### Sources and limits

- Nintendo's [official PWT announcement](https://www.nintendo.com/en-gb/News/2012/Get-ready-to-enter-the-Pokemon-World-Tournament-646905.html) says the mode debuted in Black 2/White 2 and describes its elimination and battle formats.
- `pret/pokeheartgold` source is a work in progress. Its README warns that changes to function/data layout may crash the game; the local checkout has no root license file. Use the pinned local commit as architecture evidence, not permission to redistribute code.
- The [HG Engine README](https://github.com/BluRosie/hg-engine/blob/main/README.md) sets no-money/no-paywall terms and requires copying its credits. This is not a standard permissive license; review the terms before reuse.
- The [Battle Theater repository](https://github.com/logdog2325/pokemon-battle-theater) and [release notes](https://github.com/logdog2325/pokemon-battle-theater/releases/) identify Emerald as the target; no project license or reuse grant was found on the reviewed repository page. The HGSS Factory findings come from the [author's project post](https://www.pokecommunity.com/threads/hgss-competitive-battle-factory-frontier-romhack.534245/).
- Research checked these primary project sources on 2026-10-22. “Not found” means not found in this bounded review, not proof that no other project exists.

## Español

**Estado: solo investigación. No se incluyen código PWT, recursos, binarios de Gen 5 ni cambios de ROM.**

El usuario aplazó expresamente la implementación el 22 de octubre de 2026. Se conserva como idea y estudio de futuro; integrar PWT queda fuera del trabajo actual.

### Hallazgo

Un torneo inspirado en el PWT es técnicamente viable como instalación nueva nativa de HGSS, pero la revisión acotada no encontró una implementación PWT lista para HGSS/NDS. Alpha 1 ya contiene el vestíbulo de la Frontera, cinco instalaciones, un validador nativo de equipo para la Torre y scripts específicos. El camino con menos riesgo es clonar una escena de instalación y su presentación de eventos, y después añadir el estado del cuadro y la progresión al motor HGSS existente. Es una recomendación futura, no una función aceptada.

El PWT oficial de Black 2/White 2 usa eliminación directa y reúne líderes de gimnasio y campeones; sus formatos documentados incluyen combates Individuales, Dobles, Triples y Rotación. Eso define la inspiración, no una fuente de binarios o datos compatible. HGSS debería empezar por los formatos que el motor existente pueda demostrar; Triples y Rotación requieren una revisión de compatibilidad separada antes de incorporarlos al alcance.

### Candidatos de reutilización revisados

| Candidato | Qué aporta | Compatibilidad y permisos |
|---|---|---|
| Fuentes HGSS: copias locales de [`pokeheartgold`](https://github.com/pret/pokeheartgold/tree/6988158691eb6178cff697cda0428045ddcba5fb) y [`hg-engine`](https://github.com/BluRosie/hg-engine) | Mapas, scripts, instalaciones de la Frontera, registros de guardado y flujo de combate nativos de HGSS: la base técnica más próxima. El README de `hg-engine` describe una revisión del motor de HeartGold, no un módulo PWT. | Úsalas como referencia de arquitectura. El árbol local de `pokeheartgold` no tiene `LICENSE`/`COPYING` en la raíz; no copies código hasta aclarar los derechos. El README de `hg-engine` permite usar código/recursos solo sin dinero (incluidas donaciones), sin muro de pago y copiando sus créditos; comprueba que las condiciones de distribución del proyecto lo permitan y revisa la procedencia de cada archivo. Ambas fuentes requieren una auditoría de compatibilidad contra Alpha 1 exacta. |
| [Hack HGSS Competitive Battle Factory](https://www.pokecommunity.com/threads/hgss-competitive-battle-factory-frontier-romhack.534245/) | Su autor describe un parche HGSS que sustituye 950 sets de la Fábrica, con progresión por rondas y recomendaciones para jugar a nivel 50. Demuestra una modificación de datos de instalación en la misma plataforma. | La publicación ofrece parche y partida, no código fuente ni licencia explícita de reutilización de código/datos. No importes el parche ni sus datos; puede servir únicamente para analizar requisitos. |
| [Pokémon Battle Theater](https://github.com/logdog2325/pokemon-battle-theater) | El README actual describe un simulador de Emerald de Gen 3 con plantillas del PWT de BW2 y cuadros de eliminación directa con ocho participantes. Sirve como referencia de comportamiento. | Apunta a Emerald de GBA, no a HGSS/NDS; la página del repositorio no muestra licencia ni permiso explícito de reutilización. Úsalo solo como referencia de diseño salvo permiso del autor. No portes sus binarios ni recursos. |

Dar crédito no sustituye el permiso de reutilización. Ningún candidato aporta un módulo PWT para HGSS que sea instalable y cuente con licencia verificada.

### Alcance futuro recomendado

1. Clonar una presentación de vestíbulo/eventos de una instalación de la Frontera en las fuentes HGSS y reutilizar el lanzamiento nativo del combate. La transición al tablero de juego del Arcade y el registro/validación de equipo de la Torre son patrones útiles; no constituyen un motor de cuadros listo.
2. Empezar con una copa de ocho participantes, eliminación directa, plantilla de entrenadores fija y versionada y un formato HGSS confirmado. Guardar semilla del cuadro, IDs de participantes, ronda y resultado en una extensión de guardado versionada para que un corte de energía o una carga normal no corrompan una copa en curso.
3. Reutilizar los datos locales de entrenadores solo tras comprobar versión y procedencia. No copies scripts, overlays, gráficos ni otros binarios de BW2. Añade varios formatos y entrenadores online especiales solo después de verificar por separado el motor de combate y sus dependencias externas.
4. Validar generación del cuadro, unicidad de rivales, victorias/derrotas, interrupción y recarga, idempotencia de premios, acceso por historia, niveles y migración de partidas en un perfil nuevo. Mantén la presencia estática de recursos separada de la aceptación runtime.

### Fuentes y límites

- El [anuncio oficial de Nintendo sobre el PWT](https://www.nintendo.com/en-gb/News/2012/Get-ready-to-enter-the-Pokemon-World-Tournament-646905.html) confirma que debutó en Black 2/White 2 y describe sus formatos y eliminación.
- `pret/pokeheartgold` sigue en desarrollo. Su README advierte que cambiar la distribución de funciones o datos puede bloquear el juego; la copia local no contiene licencia en la raíz. Usa el commit fijado como referencia técnica, no como permiso para redistribuir código.
- El [README de HG Engine](https://github.com/BluRosie/hg-engine/blob/main/README.md) impone condiciones de no cobrar/no usar muro de pago y requiere replicar los créditos. No equivale a una licencia permisiva estándar; revisa los términos antes de reutilizarlo.
- El [repositorio de Battle Theater](https://github.com/logdog2325/pokemon-battle-theater) y sus [versiones](https://github.com/logdog2325/pokemon-battle-theater/releases/) indican que el objetivo es Emerald; en la página revisada no encontramos licencia ni permiso de reutilización. Los datos del hack de la Fábrica proceden de la [publicación de su autor](https://www.pokecommunity.com/threads/hgss-competitive-battle-factory-frontier-romhack.534245/).
- Se revisaron estas fuentes primarias de proyectos el 22-10-2026. “No encontrado” se limita a esta búsqueda acotada y no demuestra que no exista otro proyecto.
