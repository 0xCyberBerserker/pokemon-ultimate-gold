# Wiki v2 implementation plan / Plan de wiki v2

## English

The requested result is a real bilingual game wiki with a language selector, categories, sprites and usable species/trainer/move/item information. Raw exports remain a secondary reference. The source and output ROM hashes and the working browser patcher stay unchanged.

1. Data and assets: enrich the existing exact-ROM exports with pinned public naming/sprite references. Preserve target mechanics and flag unresolved custom names. Check 493 unique species, valid joins and 493 local sprites.
2. Web interface: implement a categorized static wiki with a persistent EN/ES selector, searchable Pokédex and trainers, species details with stats/learnsets/evolutions, move/item views and guide pages. Only the selected language is displayed. Verify routes, populated content and filters.
3. Integrate and test: generate the static payload without a backend or runtime CDN. Exercise desktop/mobile navigation, species/trainer details, language switching and the unchanged patcher. Review actual screenshots; reject raw Markdown, broken assets, empty routes or mixed-language prose.

Visual thesis: a restrained game reference with a clear sidebar, compact typography, authentic pixel sprites and semantic type colors. Content starts at the working encyclopedia, with project tooling secondary. Interaction thesis: persistent navigation, fast local filtering and focused detail views; subtle state transitions respect reduced motion.

This explicit redesign request opens a bounded implementation window from 18:47 to 19:32 UTC on 2026-10-21, with integration/closure reserved until 19:40 UTC. No automatic renewal. No publishing, new ROM species or HM binary patching is part of the wiki redesign. HM field use remains an explicitly recorded, unimplemented request.

The subsequent native TM-refill-item request runs in parallel in an isolated ROM. It requires actual bag-use, return-to-menu and save/reload acceptance before the public delta or manifest can change. The first candidate refilled the intended owned slots, preserved HMs and retained the item, but returned to a black screen; it is rejected for delivery until corrected. The exact NPC giver remains pending. No working ChatGPT consultation channel is connected (`consultation_unavailable`); existing local plans and reversible isolated work are retained.

## Español

Resultado pedido: wiki de juego web con selector de idioma, categorías, sprites y fichas útiles. Los exports crudos pasan a segundo plano. No cambian los hashes de ROM ni el patcher que ya funciona.

Las etapas son datos/assets, interfaz web e integración con pruebas reales. Se exige 493 especies, uniones y sprites válidos; navegación y filtros funcionales; sólo el idioma seleccionado visible; pruebas de escritorio/móvil y revisión de capturas. No se aceptan Markdown crudo, enlaces rotos, vistas vacías ni prosa en dos idiomas a la vez.

Dirección visual: referencia de juego sobria, barra lateral clara, tipografía compacta, sprites pixel art auténticos y colores de tipos con significado. Navegación persistente, filtros rápidos y fichas centradas en el contenido.

Ventana finita: 18:47–19:32 UTC, con reserva de cierre hasta las 19:40 UTC del 21 de octubre de 2026. Sin renovación automática, publicación ni especies nuevas. Las MO sin Pokémon quedan registradas como petición todavía no implementada y no se mezclan con este rediseño.

La petición posterior del objeto nativo de MT se ejecuta en paralelo sobre una ROM aislada. Exige uso real, regreso a la bolsa y guardado/recarga antes de cambiar el delta o manifiesto públicos. La primera candidata repuso las cantidades previstas, mantuvo las MO y conservó el objeto, pero dejó pantalla negra: no se entrega mientras falle. El NPC queda pendiente. No hay canal verificable de consulta ChatGPT (`consultation_unavailable`); se conserva el plan local y el trabajo reversible aislado.
