# Combined Kit and Evolution-Shop QA

**Status:** Partial pass. On FIX5, the native Party Healer, Rare Candy, Oran Berry, Covenant Orb purchase, normal save, and cold battery reload all passed. A separate FIX4 Repel use consumed the item despite the active infinite-Repel marker; FIX5 Repel behavior was not tested.

## English

**Combined target:** `qa-kit-shop-owned-hm-paged-fix5.nds`, SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Runner SHA-256 `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`; core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`.

- Native Party Healer cleared status and restored Clefairy and Machop HP/PP. Rare Candy raised Clefairy from level 5 to 6. Oran Berry restored 10 HP to Machop. Every native action ran with codes disabled.
- Across the kit actions, all 594 Bag slots, non-target Pokémon records, key-item markers 113/114/118, and five reserve-canary regions stayed unchanged. Temporary one-frame codes only prepared the isolated injury fixtures.
- Golden battery provenance is separate from runtime state: `fc9dcfa6…` is the read-only seed; `e2366b6e…` is its native-saved FIX4 runtime derivative from the earlier owned-HM flow. The FIX5 kit tests use a separate same-ROM DSV profile (`3824e502…`), not either FIX4 battery or state.
- FIX5 shop provenance: the initial fixture seed `11b3a2c3…` came from another ROM (`231a0a2f…`) and was used only to prepare a copy. Before the Orb test, that copy was booted and natively saved on FIX5 as `2ec5c436…` after the earlier Moon Stone purchase (item 81, 3→4; money ₽994399→₽992299). The Orb test used a copy of this same-ROM save with no savestate import; no Orb purchase acceptance was inherited.
- The native 34-item stock showed Covenant Orb at ₽3500. The test started with one Orb and bought one more: quantity 1→2, money ₽992299→₽988799 (−₽3500). No other Bag item changed; all three party records, markers 113/114/118, and five reserve canaries remained identical.
- The native save used both YES confirmations and ran 7000 frames without codes. Its DSV was `ee78674a…`. A cold battery reload ran 5100 frames with no savestate input and restored the Orb count, money, party, inventory, markers, and canaries.
- Repel remains a known failure: on FIX4 (`c64dc998…`), one native Max Repel use displayed its use and 250-step messages, then item 77 was absent while marker 118 remained. Source inspection found the Repel flow calls `Pocket_TakeItem` directly after setting quantity to 1, bypassing the `Bag_TakeItem` hook for IDs 76–79. FIX5 runtime was not tested. This QA task did not modify source.

The [machine-readable report](qa-combined-kit-shop.json) records 197 passing assertions, run IDs, exact build hashes, DSV provenance, and screenshot hashes. The FIX4 golden-seed/runtime-derivative lineage remains recorded in the historical evidence section of that report.

## Español

**Estado:** Aprobación parcial. En FIX5 superaron las pruebas las acciones nativas Party Healer, Caramelo Raro y Baya Aranja, la compra de Orbe del Pacto, el guardado normal y la carga fría de batería. Un uso separado de Repel en FIX4 consumió el objeto pese al marcador de Repel infinito activo; el comportamiento de Repel en FIX5 no se probó.

**Objetivo combinado:** `qa-kit-shop-owned-hm-paged-fix5.nds`, SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. SHA-256 del ejecutor `2de6eec7f25dd846dfbaaf5922b1f78df25643c52d6fbe881ed6002a1b5169d8`; SHA-256 del núcleo `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`.

- Party Healer nativo eliminó el estado alterado y restauró PS/PP de Clefairy y Machop. Caramelo Raro subió a Clefairy del nivel 5 al 6. Baya Aranja recuperó 10 PS de Machop. Los códigos estaban desactivados durante todas las acciones nativas.
- En las acciones del kit permanecieron intactos los 594 espacios de la Bolsa, los registros de los Pokémon no objetivo, los marcadores de objetos clave 113/114/118 y cinco regiones de reserva. Los códigos temporales de un fotograma solo prepararon los fixtures aislados de lesión.
- La procedencia de batería dorada se distingue del estado de runtime: `fc9dcfa6…` es la semilla de solo lectura; `e2366b6e…` es su derivado de runtime FIX4 guardado de forma nativa durante el flujo previo de MO. Las pruebas del kit FIX5 usan un perfil DSV distinto de la misma ROM (`3824e502…`), no una batería ni un estado FIX4.
- Procedencia de tienda FIX5: la semilla inicial del fixture `11b3a2c3…` procedía de otra ROM (`231a0a2f…`) y solo preparó una copia. Antes de probar el Orbe, esa copia arrancó y se guardó de forma nativa en FIX5 como `2ec5c436…`, después de la compra anterior de Piedra Lunar (objeto 81, 3→4; dinero ₽994399→₽992299). La prueba del Orbe usó una copia de ese guardado de la misma ROM, sin importar savestates; no se heredó la aceptación de compra del Orbe.
- El inventario nativo de 34 artículos mostró el Orbe del Pacto a ₽3500. La prueba empezó con un Orbe y compró otro: cantidad 1→2, dinero ₽992299→₽988799 (−₽3500). No cambió ningún otro objeto de la Bolsa; quedaron idénticos los tres registros del equipo, los marcadores 113/114/118 y las cinco regiones de reserva.
- El guardado nativo usó las dos confirmaciones «Sí» y duró 7000 fotogramas, sin códigos. El DSV resultante fue `ee78674a…`. Una carga fría de batería duró 5100 fotogramas, sin savestate de entrada, y restauró la cantidad de Orbes, el dinero, el equipo, el inventario, los marcadores y las regiones de reserva.
- Repel sigue siendo un fallo conocido: en FIX4 (`c64dc998…`), un uso nativo de Repel Máximo mostró los mensajes de uso y duración de 250 pasos; después el objeto 77 ya no estaba, mientras el marcador 118 seguía activo. La inspección del código encontró que el flujo de Repel llama directamente a `Pocket_TakeItem` tras fijar la cantidad en 1, sin pasar por el hook `Bag_TakeItem` que cubre los IDs 76–79. No se probó el runtime FIX5. Esta tarea de QA no modificó el código fuente.

El [informe legible por máquina](qa-combined-kit-shop.json) registra 197 aserciones superadas, identificadores de ejecución, hashes exactos de builds, procedencia de DSV y hashes de capturas. La sección histórica del informe conserva la genealogía de semilla dorada y derivado de runtime FIX4.

Made with 🖤 in Barcelona City 🇪🇸
