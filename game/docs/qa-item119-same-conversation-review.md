# Rocket kit and Stat Editor: same-conversation correction

## English

Status: static correction verified; bounded native acquisition and reentry accepted.

The [fresh-recipient report before the fix](qa-item119-fresh-recipient-before-fix.json), SHA-256 `9dd67ebe55dad610ec2b08948a3a3f3671485d9b2c0566b49fbe3e5580564964`, proves that parent candidate `2eaf…` delivers all nine original gifts but returns to the field before offering item 119. A second conversation offers the editor; accepting adds exactly one, and reentry does not duplicate it. Root reproduced that frozen report exactly. There was no Save or USE in this acquisition test.

The [private correction build](qa-item119-same-conversation-build.json), candidate SHA-256 `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`, replaces the success-only CloseMsg/ReleaseAll/End tail at bank 842 offset `0x218D` with a jump to a ten-byte appended trampoline at `0x229A`. It closes and releases the acknowledged gift message, then enters the existing editor offer at `0x21C4`. The failed post-grant check still targets `0x2193`; earlier cancellation/failure paths and all nine GiveItem instructions remain unchanged.

Root independently compared the serialized ROMs: ARM9, ARM7, entry/load addresses, overlay tables, FNT and all filesystem files are exact except script archive `a/0/1/2`, member 842. Within that member, only the six-byte success tail changes and ten bytes are appended. Root verified both relative jumps against the source-checked GoTo opcode 22 and reproduced all four host tests. This establishes the static delta, not native dialogue success. A new cold AA0C profile is being tested without states from another ROM or cheats. The downloadable default is unchanged.

The subsequent [11-run native report](qa-item119-same-conversation-native.json), SHA-256 `cc265d56035e82d16c5d0f57ea822177739338fd38b21363e6eebd70ac1d4d9c`, reproduces byte for byte in root's audit. The nine gifts are present before the same-conversation offer, Yes adds only 119×1, and reentry leaves the Bag unchanged. The AA0C battery remains exact. Party checks preserve explicit cipher-boundary/checksum limits; this lot does not establish post-grant Save, USE or general game acceptance.

## Español

Estado: corrección estática verificada; adquisición y reentrada nativas aceptadas con alcance acotado.

El [informe anterior al arreglo](qa-item119-fresh-recipient-before-fix.json) acredita que la candidata `2eaf…` entrega los nueve regalos, pero termina la conversación antes de ofrecer el editor. Una segunda conversación permite recibir el objeto 119 una sola vez; volver a hablar no lo duplica. Root reprodujo exactamente el informe congelado. Ese lote no guardó ni utilizó el editor.

La [construcción privada corregida](qa-item119-same-conversation-build.json), con el hash indicado arriba, modifica únicamente la salida de éxito del último regalo: tras su acuse, salta a la oferta existente del editor. Conserva los nueve regalos, la rama de fallo y las cancelaciones anteriores.

Root comparó las ROM serializadas: código, overlays, FNT y archivos permanecen exactos salvo el miembro 842 del archivo de guiones. Solo se sustituyen seis bytes de la cola de éxito y se añaden diez. Los saltos y las cuatro pruebas host pasan. El análisis estático por sí solo no acredita el diálogo; la aceptación nativa posterior usa arranque en frío y perfil AA0C separado, sin trucos ni estados de otra ROM. El parche descargable no cambia.

La [prueba nativa posterior de 11 ejecuciones](qa-item119-same-conversation-native.json), con el hash indicado arriba, se reproduce byte a byte en root. Los nueve regalos están presentes antes de la oferta en la misma conversación; Sí añade solo 119×1 y volver a hablar deja la Bolsa idéntica. La batería AA0C no cambia. Las comprobaciones del equipo declaran sus límites de frontera de cifrado/checksum; este lote no acredita Save posterior, USE ni aceptación general del juego.
