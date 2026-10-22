# Alpha2 Rocket gift: independent review

## English

The focused Rocket NPC gift check passes on the exact Alpha2 FIX6a ROM. I independently rechecked the ROM, core, runner, source DSV, disposable gift fixture, nine result/input/RAM/state chains, and six screenshot hashes. The runs use no runtime codes or cross-ROM emulator states, and each runner result keeps `gameplay_acceptance: NOT_ASSESSED`.

The native action adds nine quantity-one gifts to previously empty slots in the complete 594-slot Bag. TM Refill occupies key pocket slot 2, Party Healer slot 3, and marker 118 slot 4. Only the expected gift records changed in SaveArray3, and all 4 KiB of the reserved region compared byte-identically.

The party must not be described as byte-identical: post-action records have valid checksums, and the only decoded party change is Machop friendship 70→71. VAR_FRIENDSHIP_STEPS (VAR 0x404B in SaveArray4) reads 122 before the route, 9 after navigation stage 1, and 26 after acceptance. This corroborates one 128-step wrap during the route; the final 26 includes later steps.

No post-gift battery save or cold reload was tested. The review makes no claim about declining, repeating the gift, a full Bag, or wider story progression. Machine evidence and source hashes are in [`qa-alpha2-gift-review.json`](qa-alpha2-gift-review.json); the underlying run artifacts remain local and are not included in the public site.

## Español

La prueba focal del regalo del NPC Rocket supera la revisión para la ROM Alpha2 FIX6a exacta. Recalculé los hashes de ROM, core, runner, DSV fuente, fixture temporal, nueve cadenas de resultado/entrada/RAM/estado y seis capturas. Las ejecuciones no usan códigos activos ni estados de emulador de otra ROM; cada resultado del runner conserva `gameplay_acceptance: NOT_ASSESSED`.

La acción nativa añade nueve regalos de cantidad uno en huecos vacíos de la Bolsa completa de 594 posiciones. TM Refill queda en el hueco 2 del bolsillo clave, Party Healer en el 3 y el marcador 118 en el 4. En SaveArray3 solo cambian los registros de regalo previstos, y los 4 KiB de la región reservada permanecen idénticos byte a byte.

El equipo no debe describirse como idéntico byte a byte: los registros posteriores tienen checksums válidos y el único cambio decodificado es la amistad del Machop, de 70 a 71. VAR_FRIENDSHIP_STEPS (VAR 0x404B en SaveArray4) vale 122 antes de la ruta, 9 tras la etapa de navegación 1 y 26 tras aceptar. Esto corrobora un único wrap de 128 pasos durante la ruta; el valor final 26 incluye pasos posteriores.

No se probó un guardado en batería ni una recarga en frío después del regalo. La revisión no afirma resultados para rechazar, repetir el regalo, una Bolsa llena ni progreso más amplio de la historia. La evidencia mecánica y los hashes están en [`qa-alpha2-gift-review.json`](qa-alpha2-gift-review.json); los artefactos de ejecución permanecen locales y no se incluyen en el sitio público.
