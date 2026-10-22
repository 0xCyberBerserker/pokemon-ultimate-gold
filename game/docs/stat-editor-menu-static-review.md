# Portable editor: static review / Editor portátil: revisión estática

## English

**Verdict: PASS for a bounded native smoke test. Runtime and gameplay acceptance remain pending.** I parsed the candidate, its portable-launch parent, and the exact FIX6a donor read-only. I did not rebuild the ROM or use an emulator/core.

| Artifact | SHA-256 |
|---|---|
| Candidate `portable-stat-editor-menu-fix6a.nds` | `025429759de1b688b6521839dbf44671e03bf54b9376ba34cb598d8da1265885` |
| Parent `portable-kit-launch-probe-fix2.nds` | `604101b971d182902928b73f3b9717ff26751aed1bc5a933e65b40f85425a79f` |
| FIX6a donor `qa-kit-shop-owned-hm-paged-fix6a.nds` | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` |
| Builder `qa/portable_stat_editor_menu_build.py` | `1da3c72e6a8dc6130edad8d5665246be7351e38a16ee94531b8151c2c292a74c` |
| Builder report `build.json` | `955733fdef6ad07b6331094653e68181aac47c0c916c20f51bb0ba587ae0e3a7` |

The candidate has the same 513 filesystem entries as its parent. Only `a/0/1/2` and `a/0/2/7` payloads differ. The script NARC changes exactly members 3 and 842; the text NARC changes exactly banks 40 and 542. Member 842 and bank 542 match the FIX6a donor byte-for-byte, restoring the Rocket gift content replaced by the earlier probe. The item NARC is byte-identical to the parent, not to FIX6a: it retains the parent’s item-118 launcher metadata (member 515 SHA-256 `00886a28ba8f8b93c086bc3b1502cd025d8eb072c03d9dc939bf6fe35fe954fc`, selectable bit set, `fieldUseFunc=5`).

ARM7 and both overlay tables match the parent; all 129 loaded ARM9 overlay payloads and metadata also match. ARM7 additionally matches FIX6a. The 56 physical ARM9 diff ranges match the builder report. They are confined to: dispatch count 856→857 (one byte at `0x020FAC90`); 416 bytes of Read856 at `0x023D6900` (SHA-256 `9297ca29cd0933268d3ed88a7591cc1070fb2e3d00ca7fa00e91d7d30e500e7d`); the table byte-count field 3424→3428; and the new entry at index 856 pointing to Thumb address `0x023D6901`. Entries 0–855, the table low/high guards, the EV/IV helper, preview and mutator blocks, launcher block, arena-high value `0x023D5000`, and remaining Read856 reserve bytes are unchanged. The new handler bytes match the retained `stat_editor_read.bin`; no setter was added to this read opcode.

The candidate’s bank-3 table has 73 entries: its original 72 targets move uniformly by four bytes, every original script body remains byte-identical, and the appended entry is global-script candidate 2072 (bank index 72). Its 17,590-byte payload matches `stat_editor_menu_script.py` exactly. The decoded 2,908 commands contain 1,098 branches, all landing on command boundaries. The script starts with the audited lock/fade/party-selector lifecycle and has no NPC-dependent opcodes 45, 47, or 104.

The inherited 208-byte launcher block matches `portable_kit_launch.bin` (SHA-256 `29a543fedc8a371368ba954d04d87c67032acae7a456eea753bfbb202cd63d17`). Its disassembly passes script ID `0x818` (2072) to `QueueScript` with both `lastInteracted` and user data null. The callback slot points to wrapper `0x023D6801`; the adjacent registered-item field callback is null. The script avoids facing-object commands and uses `NonNPCMsg`; source evidence says `LockAll` handles a null last-interacted object. This supports a no-NPC static route, but does not prove runtime dispatch, message-bank resolution, menu behavior, or return lifecycle.

Bank 40 retains all 117 prior decoded word vectors and appends exactly the 30 generated labels at IDs 117–146. Existing encrypted payload offsets may be reserialized; the review confirms decoded message semantics, not byte-identical bank storage. Source mapping places global scripts from 2000 in bank 3 with message bank 40, before the next 2500 threshold. 2072 is a candidate derived from the appended index, not an independently allocated source constant; exhaustive decoded-binary consumer analysis was outside this review.

**Limits:** no native game, save/cold, mutation, cancel, repeat-use, or item-quantity test was performed on this ROM. Only the Bag `USE` route is in scope for the next smoke. The registered-item shortcut remains unsupported because the adjacent field-use callback is null; do not treat a visible `REGISTER` option as evidence that the shortcut works. A smoke pass would still not accept save persistence or the complete editor.

## Español

**Veredicto: PASS para una prueba nativa acotada. La aceptación runtime y de juego sigue pendiente.** Analicé en modo solo lectura la candidata, su padre con launcher y el donante FIX6a exacto. No reconstruí la ROM ni usé emulador/core.

Las huellas SHA-256 de candidata, padre, donante, builder e informe aparecen en la tabla de la sección inglesa. La candidata conserva las 513 entradas del sistema de archivos de su padre; solo cambian los payloads `a/0/1/2` y `a/0/2/7`. En el NARC de scripts cambian únicamente los miembros 3 y 842; en el NARC de textos, los bancos 40 y 542. El miembro 842 y el banco 542 coinciden byte a byte con FIX6a y restauran el contenido Rocket que sustituyó la sonda anterior. El NARC de objetos sí es idéntico al padre —no a FIX6a— y conserva los metadatos de launcher del objeto 118 del padre: miembro 515, SHA-256 `00886a28ba8f8b93c086bc3b1502cd025d8eb072c03d9dc939bf6fe35fe954fc`, seleccionable y `fieldUseFunc=5`.

ARM7 y ambas tablas de overlays coinciden con el padre; también coinciden los 129 payloads y metadatos de overlays ARM9 cargados. ARM7 coincide además con FIX6a. Los 56 rangos de diferencia física ARM9 coinciden con el informe: contador 856→857 en `0x020FAC90`; Read856 de 416 bytes en `0x023D6900`; metadato de tabla 3424→3428; y nueva entrada 856 con puntero Thumb `0x023D6901`. Las entradas 0–855, guards, helper EV/IV, preview, mutadores, launcher, arena alta `0x023D5000` y resto de la reserva Read856 permanecen iguales. Los bytes del handler coinciden con el binario conservado y este opcode de lectura no incorpora setter.

El banco 3 contiene 73 entradas: los 72 destinos previos se desplazan +4, todos sus cuerpos siguen idénticos y el nuevo índice 72 da el ID global candidato 2072. El payload de 17.590 bytes coincide exactamente con el generador. Sus 2.908 comandos incluyen 1.098 ramas a límites de comando válidos; empieza con la secuencia auditada de bloqueo/transición/selector y no contiene opcodes dependientes de NPC 45, 47 ni 104.

El launcher heredado de 208 bytes coincide con `portable_kit_launch.bin`. Su desensamblado pasa `0x818` (2072) a `QueueScript` con `lastInteracted=NULL` y datos de usuario nulos. El callback apunta al wrapper `0x023D6801`; el callback de campo contiguo para el atajo de objeto registrado es nulo. El guion evita comandos que miran al frente y usa `NonNPCMsg`; la fuente indica que `LockAll` admite `lastInteracted` nulo. Es evidencia estática de la ruta sin NPC, no prueba de despacho runtime, resolución de banco de mensajes, menú ni retorno.

El banco de mensajes 40 conserva los 117 vectores de palabras decodificados y añade las 30 etiquetas generadas en IDs 117–146. El codec puede reserializar offsets cifrados; esta revisión confirma semántica decodificada, no almacenamiento byte a byte. La asignación fuente sitúa scripts globales desde 2000 en banco 3 y mensajes 40, antes del umbral 2500. El 2072 es candidato por el índice añadido, no una constante de fuente asignada independientemente; no hice un análisis exhaustivo de consumidores en binarios decodificados.

**Límites:** no probé juego nativo, guardado/recarga fría, mutación, cancelación, reutilización ni cantidad del objeto en esta ROM. La siguiente prueba debe limitarse a `USAR` desde la Bolsa. El atajo del objeto registrado sigue sin soporte porque el callback de campo contiguo es nulo; que aparezca `REGISTRAR` no demuestra que funcione. Superar el smoke tampoco aceptaría persistencia ni el editor completo.
