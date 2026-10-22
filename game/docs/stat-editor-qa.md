# Stat editor QA / Pruebas del editor

## English

**Experimental probes only. The downloadable Alpha 2 does not include this editor.**

**Latest portable candidate:** no-REGISTER `03d8711…57c620` independently passes HP IV 15 → 16, native Save and fresh cold persistence, plus four native rejection checks at EV/IV limits. Its predecessor textfix `99810da…0684a` separately passes HP EV 0 → 4, EV/IV resets and HP IV 0 → 5 → Repeat → 10. These bounded cases do not establish complete editor or release acceptance. Alpha 2 still contains no editor. Earlier failures and exact scopes remain below.

### Textfixed portable editor: bounded persistence

**Integration requirement:** the prototype adds an editor action to item 118. The corrected [compatibility review](qa-stat-editor-integration-compatibility.json) confirms that Alpha2 uses this item as a possession marker for reusable consumables; it had no previous USE menu. There is no demonstrated loss of that menu. A separate editor item is being prepared to keep these functions clearly organized. Its native action, consumable reuse and NPC delivery still need acceptance before integration.

**NPC delivery candidate:** the [reviewed migration](qa-item119-npc-migration-plan.json) has a [private build](qa-item119-npc-build.json) and [static review](qa-item119-npc-static-review.md). Cheat Kit possession identifies an existing recipient; the Yes/No branch checks ownership, space and the grant result. The active expanded-Bag capacity is60 Key Items slots, with the first50 mirrored to retail SaveArray3. Existing-recipient, extra-slot grant and bounded Save/cold evidence are accepted for parent08e; fresh-recipient and actual-full-pocket behavior remain pending.

**Expanded-inventory checkpoint ([corrected evidence](qa-item119-npc-full-pocket-failure.md)):** Stat Editor was genuinely added as entry51 and appears in the native Bag on page9/9. The validated BPAC cache contains item119×1. The expanded pocket has60 slots; the original50-slot SaveArray3 is only a projection. The false-success diagnosis is withdrawn and defensive18b set aside. The extra-slot gift also survives [native Save/cold](qa-item119-extra-slot-persistence.json), with the [declared intermediate trace limit](qa-item119-extra-slot-persistence-review.md). The actual60-slot boundary still awaits native QA.

**Separate-item checkpoint:** private candidate `8bc4692eab0644a1b4366da4d7cae0f47ce09429953d198f1732fe0f96f81f62` has a dedicated item 119, **Stat Editor**, with its description in the native description bank. The [build](qa-stat-editor-item119-build.json) clears REGISTER; the [captured smoke](qa-stat-editor-item119-smoke.json) opens USE → party slot 0 → EVs/IVs/Exit and returns to the field. Root inspected the menu, name and description screenshots. Its icon is still a question-mark placeholder. The test adds 119 to a disposable copy of an existing save; it does not prove NPC acquisition. There was no stat write or Save. Bag and SaveArray3 match exactly; Party snapshots differ in encryption phase, so no raw-array identity or valid decoded/checksum claim is made for slot 2. The [independent v2 review](qa-stat-editor-item119-review.md) reproduced the frozen report exactly. Version 2 corrects the auditor's address metadata and adds range/overlap negative checks; the [historical v1 report](qa-stat-editor-item119-smoke-v1-historical.json) remains preserved. Neither download includes this candidate; native mutation/persistence, convenience-item regression and NPC delivery remain separate gates.

**Inventory-auditor scope:** this target has a BPAC expanded-Bag cache at the compiled address `0x023DD700`, with payload at `0x023DD714`. A reader must validate the BPAC magic and its association with the current SaveData/SaveArray3 before interpreting that cache. The separate 1,952-byte SaveArray3 comparison covers the original retail projection; it does not establish the complete expanded inventory or its actual capacity. Both stores must be checked.

Candidate `99810da8497d6f0ac4ac65693c276f11b232f795d1e18d82f7d607ae32c0684a` has two frozen native reports, each using its own disposable profile and fresh cold run without imported state or cheats. Both increment cases passed [independent review](qa-stat-menu-textfix-increments-review.json), including ancestry, exact Party/Bag/item/reserve checks and saved persistence.

| Clefairy, party slot 0 | No branch | Yes, native Save and fresh cold reload |
| --- | --- | --- |
| HP IV +1 | Party unchanged; field return | 15 → 16 retained |
| HP EV +4 | Party unchanged; field return | 0 → 4 retained |

The separate [Repeat IV +10 case](qa-stat-menu-repeat-iv10-native.json) starts at HP IV 0, reaches 5, then uses Repeat once to reach 10. Native Save advances the MAIN counter 12 → 13; a fresh same-ROM cold load keeps the saved DSV hash and IV 10. The report records unchanged PID, other IVs/party slots, Bag and audited reserve sections. Its [independent review](qa-stat-menu-repeat-iv10-review.json) passes this bounded chain. Gameplay-wide or release acceptance is not assessed. An overwritten duplicate fork is explicitly excluded from evidence.

A subsequent [portable EV-reset audit](qa-stat-menu-textfix-reset-ev-native.json) starts from the saved HP-EV-4 fixture. No preserves the party and returns to the field; Yes clears the six EVs, preserves IV/PID/other records/Bag/reserves and retains zero after native Save and fresh cold reload. The MAIN counter advances 11 → 12 with valid CRC. This passes [independent review](qa-stat-menu-textfix-resets-review.json); repeat use and a second reset are not claimed.

The separate [portable IV-reset audit](qa-stat-menu-textfix-reset-iv-native.json) starts from the saved HP-IV-16 fixture. No returns without changes; Yes clears all six IVs, preserves EV/PID/other party data/Bag/reserves, and matches the native stat formula using exact-target personal data. Native Save advances 11 → 12 with valid CRC; a fresh same-ROM cold run retains zero. This also passes independent review. These two fixtures do not prove resets for every species, level or party slot.

Both reset lineages are resolved in the review record. Additional DSV payload bytes remain unattributed; repeated resets are untested.

Both saved MAIN counters advance 10 → 11 with valid CRC. The expected edited party record, other party members, Bag, Cheat Kit quantity and code reserves are checked strictly. See the separate [portable IV audit](qa-stat-menu-textfix-iv-native.json) and [portable EV audit](qa-stat-menu-textfix-ev4-native.json).

These cases do not prove repeat use, other slots/statistics/steps, portable resets, limits, natures or visible stat recalculation. The IV report lists 196 changed DSV bytes in 56 spans; changes outside the checked Party/counter/CRC fields remain unattributed. Alpha 2 is unchanged.

### Cheat Kit context menu

**Bag-menu fix:** separate candidate `03d8711…57c620` removes the unsupported REGISTER option from Cheat Kit while retaining USE. Its [build record](qa-stat-menu-noregister-build.json) and [independent static review](qa-stat-menu-noregister-static-review.json) confirm that only the selectable bit in item 118 metadata changes; game code and editor scripts remain identical. The [native smoke test](qa-stat-menu-noregister-native.json) and [independent native review](qa-stat-menu-noregister-native-review.json) confirm party selection, EV/IV menu and field return with party/Bag/reserves intact.

This exact candidate now also has a [native HP IV 15 → 16 write, Save and fresh cold report](qa-stat-menu-noregister-iv16-native.json), with [independent review](qa-stat-menu-noregister-iv16-review.json). The selected MAIN counter advances 10 → 11; both saved CRCs are valid. PID, other IVs, EVs, other party records and Bag remain intact. One cold RAM capture interrupts slot 2 at an exact 16-byte cipher boundary: its transient checksum is invalid, so that capture is accepted only as a strict source-byte boundary match, not as a decoded Pokémon. The saved slot itself remains exact and valid. Other statistics and party↔PC remain pending on this hash.

### Native limit rejection

The [bounded limit report](qa-stat-menu-noregister-limits-native.json) and [independent artifact review](qa-stat-menu-noregister-limits-review.json) cover three disposable fixtures and four requests on `03d8711…57c620`:

| Fixture | Request | Observed result |
| --- | --- | --- |
| HP EV 255; other EVs zero | HP EV +1 | Rejected; no mutation |
| HP EV 250, Attack EV 250, Defense EV 10; total 510 | HP EV +1 | Rejected; no mutation |
| HP IV 31 | HP IV +1 and +5 | Both rejected; no mutation |

Each reaches the native rejection message and returns to the visible field after acknowledgment and Back/Exit. Party bytes match at strict cipher boundaries; Bag, reserved ranges and fixture batteries remain exact. These rejection branches perform no native Save. **Visual issue:** the retained screenshot cuts off the final words of “No increase is available. No change was made.” The data checks pass; complete message readability does not. Explicit line wrapping is required in the integration candidate. These cases do not test near-limit clamping, every stat or PC transfers.

![Cheat Kit context menu: USE, MOVE and CANCEL; no REGISTER option.](../assets/qa/portable-editor-use-menu.png)

### Native party selection and field return

The isolated selector candidate, SHA-256 `b987fec615e44e01d1505297599a31f1a584c6bf8029e677cb49ba507bbffb5b`, passed two separate branches from the same open-selector state:

| Action | Native result | After acknowledging the message |
| --- | --- | --- |
| Cancel | Slot result 255 | Clean field, no open dialogue or script task |
| Choose the first Pokémon | Slot result 0 | Clean field, no open dialogue or script task |

![Native party selector in the isolated QA build; both DS screens are shown so the Cancel control remains visible.](../assets/qa/stat-editor-party-menu.png)

![Return to the field after acknowledging cancellation; the location image shows the upper DS screen.](../assets/locations/stat-editor-field-return.png)

The audit covers seven runs and twenty captures. Battery bytes remain unchanged, both save slots have valid CRCs, and the complete Bag array matches the source save. Party records match that same save byte for byte, including strictly verified two-byte native encryption boundaries in interrupted RAM samples. Those transitional samples are not labelled checksum-valid. Helper bytes and feature-reserve guards also match their expected images. No stat setter is called.

The player was positioned beside a stationary Rocket NPC in a disposable save. This proves the selector lifecycle in that fixture; it does not prove normal-story access, wandering NPC behavior, stat editing, PC storage or a portable item. There was no post-action save/cold-persistence test because this probe makes no saved edits.

See the [machine-readable selector audit](qa-stat-selector-native.json) and [independent review](qa-stat-selector-review.json). Original captures and local run artifacts remain identified by hashes in those records.

### Native preview and cancellation

A separate preview-only candidate, SHA-256 `f1ab9f71c73903802f4185760d97923db720b2bdf1a92d2904ac21fa510d09d9`, passed both branches. It uses a fixed first-party slot; it does not yet combine the selector above with the preview.

| Action | Observed result | Saved Pokémon changes |
| --- | --- | --- |
| Preview HP IV +1 for Clefairy | Source IV 15; proposed IV 16 | None |
| Cancel | Cancel status; no proposed value | None |

The QA script pauses before closing, so its result variables can be measured while the script environment is still active. Acknowledging the result returns to the field. Independent review confirmed that the sampler only reads RAM, and checked the unchanged battery, strict party/Bag comparisons, command table, helper code and reserve guards. Neither a setter nor a reset is called.

See the [native preview audit](qa-stat-preview-native.json) and [independent preview review](qa-stat-preview-review.json). This proves one HP-IV preview and cancellation in an isolated probe, not saved editing, other statistics, nature changes or the final tool.

### Combined selector and preview

The combined candidate, SHA-256 `938149619b2620d3b56871ad30f3526dcd3f8c748a726d02a311191f6d5a3634`, now passes the complete selector-to-preview route. Choosing Clefairy in slot 0 returns status 0 and proposed HP IV 16 from its stored IV 15; Cancel returns status 1, no proposal (`65535`) and slot 255. Both branches return to the field after acknowledgement.

Seven runs cover a state-free cold start, navigation and both result/acknowledgement branches. The battery, strict party/Bag comparisons and three code reserves remain intact. Root independently reproduced the audit, inspected the result/field captures and verified rejection of injected cold-start states and declared cheats. See the [combined native audit](qa-stat-combined-native.json) and [root review](qa-stat-combined-review.json). Other slots, writes, resets, saved edits and the portable tool remain untested.

### Confirmed HP-IV increment inside the game

The isolated Set-IV candidate, SHA-256 `ef41db697c047c8a1488b87ff3549d80025bdf9c524d3b4cb573058c87da7a4f`, passed Yes and No branches. Before consent, the proposed HP IV is 16 and confirmation is unset. Yes changes only Clefairy's HP IV from 15 to 16; No leaves the party unchanged. Both return to the field after acknowledgement. Eight runs and independent review cover the state-free cold start, exact mutation, unchanged other Pokémon/PID/Bag/battery and protected code. The unchanged derived stats in this fixture do not demonstrate a visible stat recalculation.

See the [native Set-IV audit](qa-stat-set-iv-native.json) and [independent review](qa-stat-set-iv-review.json). This report does not cover saved persistence, resets, other statistics/slots or the final portable UI. The provisional bilingual prompt needs continuation and will require shorter final text.

A separate [persistence audit](qa-stat-set-iv-persistence.json), reproduced by an [independent reviewer](qa-stat-set-iv-persistence-review.json), verifies native Save and a fresh 5,500-frame process using that saved DSV with no imported state or cheats. The save counter advances from 9 to 10 with valid CRCs; HP IV 16 survives, with PID, other Pokémon fields, party members and Bag preserved. The cold-start inputs reopen the editor prompt but do not confirm a second edit. Twelve other save-payload byte changes are listed without semantic attribution; this remains bounded QA of the exact candidate.

### Separate native EV and IV resets

Both isolated reset candidates passed Yes/No and field-return checks:

| Operation | Yes | No |
| --- | --- | --- |
| Reset EVs | The six fixture values 1/2/3/1/2/3 become zero | All six remain unchanged |
| Reset IVs | All six IVs become zero | The party remains unchanged |

The EV seed is explicitly synthetic and disposable; each EV is below 4, so its contribution to derived stats stays zero. The IV reset matches the exact personal-data record and native stat formula: Clefairy's Defense changes 10 → 9, Speed 11 → 8 and Special Attack 12 → 11, with HP preserved. PID, the other stat family, other party members, Bag and code guards remain intact. Interrupted RAM records require strict native cipher-boundary comparison; valid source-save checksums are checked separately.

See the [native reset audit](qa-stat-reset-native.json), [independent review](qa-stat-reset-independent-review.json) and [root replay review](qa-stat-reset-root-review.json). The final auditor checks every state against its parent's recorded output, same ROM/core/runner and source DSV. Four contract tests reject invalid ancestry. An incomplete excluded attempt has only preflight evidence, so its cause is not claimed. These reports do not prove post-reset save/cold recovery or a complete portable editor.

A separate [reset persistence audit](qa-stat-reset-persistence.json), reproduced byte for byte by an [independent reviewer](qa-stat-reset-persistence-review.json), verifies native saving and fresh-process recovery for both exact reset candidates. Both save counters advance 9 → 10 with valid CRCs; the expected party, Bag and three reserved code ranges survive. The cold runs import no emulator state and use no cheats, reaching the field at frames 4,300/4,900. Three negative checks reject imported cold states, altered party data and a mismatched cold battery. An initial EV cold attempt stopped at the title prompt and is excluded. Zero values alone cannot prove how many resets ran; the report makes no such claim.

### EV/IV write and reset commands: host checks

The proposed write/reset handlers passed independent code review and host tests with the real editor core and adapter, using stubbed game functions. The tests cover explicit Yes consent, No/unset/cancel without changes, invalid variables and pointers, empty slots and eggs, EV/IV limits, keeping the other stat family and PID unchanged, and one recalculation per accepted operation. Reset-specific rejection cases were added during review.

These host checks alone do not establish native confirmation, encrypted-record behavior or saved persistence; the native Set-IV evidence above has its own separate scope. See the [host review record](qa-stat-mutators-host-review.json).

A separate candidate now registers the two commands and passed [independent static review](qa-stat-mutators-static-review.json). The previous 854 dispatch entries, all 513 game files, ARM7, overlays and existing helper/guard bytes are preserved. An earlier build with an unsafe operand-reading macro was rejected before execution; the corrected build calls the verified native reader. Its script still does not invoke the mutators, so this proves the binary integration only.

### Separate portable launch probe

The isolated launch probe, SHA-256 `604101b971d182902928b73f3b9717ff26751aed1bc5a933e65b40f85425a79f`, opens the existing Cheat Kit from the Bag twice. The global test script 2072 reaches its wait marker; A and B each return to the field. The item remains at quantity one, with strict party/Bag comparison and unchanged battery. Its seed comes from the actual Alpha 2 Rocket gift, native Save and same-ROM cold recovery; no emulator state crosses ROM versions. The [launch audit](qa-stat-portable-launch-native.json) has passed [independent review](qa-stat-portable-launch-review.json), including byte-exact replay of the report. This does not cover saving after portable use or regression of TM Refill/Party Healer.

This probe opens only a test script, not the editor menus. Registered shortcut use is unsupported and untested; use **Bag → Cheat Kit → USE**. The separate full-menu candidate `025429759de1b688b6521839dbf44671e03bf54b9376ba34cb598d8da1265885` passed independent binary review but **failed its first native cancellation smoke test**: the party selector opens, B returns selection 255, and both screens remain black after acknowledgement and script completion. Party, Bag and battery stayed intact. Further editing tests are stopped while the return lifecycle is diagnosed. It is not a download release.

The [failed smoke record](qa-stat-portable-menu-smoke-025.json) preserves eight linked runs and ten captures. A zero TaskManager is recorded as script completion only; it is explicitly not accepted as a visible field return.

The [minimal fade correction](qa-stat-portable-menu-fadefix.json) swaps only the two fade directions to match the native selector lifecycle. The regression test fails before the change and passes after it; an independent whole-ROM comparison finds exactly two changed bytes, with all other bytes preserved. Candidate `2abb1c8cf87540aad70d3c7c13517bee5a159ef3e38af11a1440030b276317ed` is undergoing its own cold smoke test. The static correction alone does not establish a visible return or working editor menus.

The [corrected cold smoke](qa-stat-portable-menu-fadefix-smoke.json) visibly shows the cancellation message and returns to the field after A; root inspected both captures. An [independent review](qa-stat-portable-menu-fadefix-review.json) confirms the frozen chain, hashes and exact saved battery. Re-entry navigation stopped in the Bag before reaching the party selector, so it does not test another editor session or establish a new editor fault. A later [offline integrity supplement](qa-stat-portable-menu-integrity-review.json) verifies all three retained final RAM snapshots: strict party records match the source DSV at exact native cipher boundaries, full canonical Bag bytes match, and all three code reserves match the ROM. Two interrupted slot-2 records are not given decoded semantic claims. This closes snapshot integrity only; editing operations remain unaccepted.

![Portable editor cancellation after the fade correction; both DS screens.](../assets/qa/portable-editor-fadefix-cancel.png)

![Visible field after acknowledging cancellation; both DS screens.](../assets/qa/portable-editor-fadefix-field.png)

### Portable-menu integration

A later [no-write navigation audit](qa-stat-portable-family-menu.json) reaches the party selector through the corrected Bag navigation and selects slot 0. RAM confirms script 2072 is alive at the native menu wait: the saved slot is 0 and menu result `0x800C` remains `0xEEEE`, waiting for a choice. The expected EV/IV list is not visible over the field. Party, the canonical Bag and all three reserved sections match their exact source references at the retained checkpoints. A historical zero-padding/arena validator is inapplicable to this composed build; direct ROM comparisons pass. The visible menu remains under investigation, not a confirmed early script exit. No editing operation is attempted from this state.

The [saved-RAM diagnosis](qa-stat-menu-prerequisite-diagnosis.json) identifies a missing native prerequisite: field-menu mode is 0 and its transition state is ready, whereas `MenuExec` requires mode 3. The generator omits `TouchscreenMenuHide` (746). Retail callers hide before entering the menu family, retain mode 3 between submenus and use `TouchscreenMenuShow` (747) on terminal exit. A separate correction is being prepared; the display and restoration still need native verification.

A [separate UI-mode build](qa-stat-menu-uimode-build.json), SHA-256 `5a61083689668f3efcf46c4821b77b336875af5237a36f9985eb4cc159bd7d44`, adds that Hide/Show lifecycle. The host model first rejects the original mode-0 menu entry, then passes with the correction, including mode restoration and selector cancellation bypassing Hide/Show. Its [independent static review](qa-stat-menu-uimode-static-review.json) verifies unchanged ARM9/ARM7, a single changed script member and the same previous command graph after removing Hide/Show. Native display testing is in progress; the download remains Alpha 2.

The new native run now displays **EVs / IVs / Exit** after choosing party slot 0. Root inspected the capture, and the live field-interface task reports mode 3/state 1. Preview, No and exit-restoration checks are still in progress; this observation does not accept editing operations.

![Visible EV/IV family menu in the corrected UI-mode candidate; both DS screens.](../assets/qa/portable-editor-uimode-family.png)

The numerical preview is correct in the retained RAM (current 15, proposed/shown 16, status 0, confirmation `FFFF`), but its text renders unreadable glyphs. The popup alone is not accepted as a usable preview, and no Yes branch is run while this is unresolved.

The text diagnosis identifies two argument-free STRVAR tokens in `confirm_increment`. Native expansion requires the field index as the first argument. The actual script buffers current into field 1 and proposed into field 2; the correction must bind those indices explicitly. The resulting encoded word vectors and native readable display still require verification in a separate candidate.

![Unaccepted confirmation text with unreadable numeric substitutions.](../assets/qa/portable-editor-uimode-preview-text-fail.png)

The [18-run native audit](qa-stat-menu-uimode-native.json) consolidates menu visibility, the RAM preview, No/Back/Exit and mode 0/state 1 restoration. An [independent review](qa-stat-menu-uimode-review.json) reproduces its frozen report and rejects altered state provenance. It verifies strict party/Bag/reserve preservation and the unchanged seed battery, while retaining the unreadable text as a failed visual check. The [runner review](qa-stat-menu-uimode-runner-review.json) explicitly limits its source-equivalence finding to empty cheats; it does not accept code effects.

A [text-only candidate](qa-stat-menu-textfix-build.json), SHA-256 `99810da8497d6f0ac4ac65693c276f11b232f795d1e18d82f7d607ae32c0684a`, corrects the two placeholder field arguments. Its [independent static review](qa-stat-menu-textfix-static-review.json) confirms that only text bank 40, message 134 changes; script 2072, ARM9 and ARM7 remain exact. The regression test rejects the old zero-argument tokens and passes the corrected vectors. Native display evidence follows.

The text-only candidate renders **Current: 15; proposed: 16. Apply this change?** correctly in its own native run. The numeric variables agree, and confirmation is unset at that retained pre-choice state. This historical probe fixes the display failure; the later No/Yes and persistence evidence is listed at the top of this page.

![Readable native HP-IV preview in the textfix candidate; both DS screens.](../assets/qa/portable-editor-textfix-preview.png)

### What remains

Portable HP IV +1, HP EV +4, separate EV/IV resets, and one HP IV Repeat to 10 now have independently reviewed bounded native persistence evidence. Other statistics/steps, boundary cases, other slots, party↔PC transfer, broader item/story regression, nature control and release integration remain pending. None of the bounded reports proves the whole ROM. Follow [editor implementation status](ev-iv-kit-feasibility.md).

## Español

**Solo sondas experimentales. La descarga Alpha 2 no incluye este editor.**

**Última candidata portátil:** sin REGISTER `03d8711…57c620` supera revisión independiente de IV de PS 15 → 16, guardado nativo y persistencia tras arranque en frío, además de cuatro rechazos nativos en límites EV/IV. Su predecesora textfix `99810da…0684a` supera por separado EV de PS 0 → 4, reinicios EV/IV e IV de PS 0 → 5 → Repeat → 10. Estos casos acotados no aceptan el editor completo ni una release. Alpha 2 sigue sin incluir el editor. Debajo se conservan los fallos y alcances exactos anteriores.

### Editor portátil con texto corregido: persistencia acotada

**Requisito de integración:** el prototipo añade una acción de editor al objeto 118. La [revisión de compatibilidad corregida](qa-stat-editor-integration-compatibility.json) confirma que Alpha2 usa este objeto como marca de posesión para reutilizar consumibles; no tenía un menú USE previo. No se ha demostrado que se perdiera ese menú. Se prepara un objeto de editor separado para organizar claramente las funciones. Antes de integrarlo hay que aceptar su uso nativo, la reutilización de consumibles y su entrega por NPC.

**Candidata de entrega NPC:** la [migración revisada](qa-item119-npc-migration-plan.json) tiene [construcción privada](qa-item119-npc-build.json) y [revisión estática](qa-item119-npc-static-review.md). La posesión de Cheat Kit identifica a un receptor anterior; la rama Sí/No comprueba posesión, espacio y entrega. La capacidad expandida activa es de60 huecos de Key Items; los50 primeros se reflejan en SaveArray3 retail. Se acepta evidencia acotada de receptor anterior, entrega en hueco extra y Save/frío de08e; faltan receptor nuevo y bolsillo lleno real.

**Control de inventario expandido ([evidencia corregida](qa-item119-npc-full-pocket-failure.md)):** Stat Editor se añadió como entrada51 y aparece en la Bolsa nativa, página9/9. La caché BPAC validada contiene119×1. El bolsillo expandido tiene60 huecos; SaveArray3 original de50 es solo una proyección. Se retira el diagnóstico de éxito falso y se aparta18b. El regalo extra también sobrevive a [Save/frío nativo](qa-item119-extra-slot-persistence.json), con el [límite intermedio de trazabilidad declarado](qa-item119-extra-slot-persistence-review.md). Falta QA nativa del límite real de60.

**Control del objeto separado:** la candidata privada `8bc4692eab0644a1b4366da4d7cae0f47ce09429953d198f1732fe0f96f81f62` tiene un objeto 119 propio, **Stat Editor**, con descripción en el banco nativo correcto. Su [construcción](qa-stat-editor-item119-build.json) elimina REGISTER; el [smoke capturado](qa-stat-editor-item119-smoke.json) abre USE → posición 0 del equipo → EVs/IVs/Exit y regresa al campo. Root inspeccionó las capturas del menú, nombre y descripción. Su icono sigue siendo un interrogante provisional. La prueba añade 119 a una copia desechable de una partida existente; no demuestra adquisición por NPC. No se escribieron estadísticas ni se guardó. Bolsa y SaveArray3 coinciden exactamente; las capturas Party difieren en fase de cifrado, por lo que no se afirma igualdad cruda ni decodificación/checksum válido de la posición 2. La [revisión independiente v2](qa-stat-editor-item119-review.md) reprodujo exactamente el informe congelado. La versión 2 corrige las direcciones del auditor y añade pruebas negativas de rango/solape; se conserva el [informe histórico v1](qa-stat-editor-item119-smoke-v1-historical.json). Ninguna descarga incluye la candidata; mutación/persistencia nativas, regresión de consumibles y entrega por NPC siguen como puertas separadas.

**Alcance del auditor de inventario:** este objetivo tiene una caché BPAC de Bolsa expandida en la dirección compilada `0x023DD700`, con datos desde `0x023DD714`. El lector debe validar la marca BPAC y su asociación con el SaveData/SaveArray3 actual antes de interpretarla. La comparación separada de SaveArray3 de 1.952 bytes cubre la proyección retail original; no acredita el inventario expandido completo ni su capacidad real. Hay que comprobar ambos almacenes.

La candidata `99810da8497d6f0ac4ac65693c276f11b232f795d1e18d82f7d607ae32c0684a` tiene dos informes nativos congelados, cada uno con perfil temporal propio y arranque en frío sin estado importado ni cheats. Ambos incrementos superan [revisión independiente](qa-stat-menu-textfix-increments-review.json), incluidos linaje, equipo/Bolsa/objeto/reservas exactos y persistencia guardada.

| Clefairy, posición 0 del equipo | Rama No | Sí, guardado nativo y arranque en frío |
| --- | --- | --- |
| IV de PS +1 | Equipo intacto; vuelta al campo | Persiste 15 → 16 |
| EV de PS +4 | Equipo intacto; vuelta al campo | Persiste 0 → 4 |

El caso separado de [Repeat IV +10](qa-stat-menu-repeat-iv10-native.json) empieza con IV de PS 0, llega a 5 y usa Repeat una vez para llegar a 10. El guardado nativo avanza el contador MAIN de 12 a 13; un arranque en frío con la misma ROM conserva el hash del DSV guardado y el IV 10. El informe registra PID, otros IV/posiciones del equipo, Bolsa y secciones de reserva auditadas sin cambios. Su [revisión independiente](qa-stat-menu-repeat-iv10-review.json) aprueba esta cadena acotada. No evalúa aceptación general de juego ni de release. Una bifurcación duplicada sobrescrita queda excluida expresamente de la evidencia.

Una [auditoría posterior de reinicio EV portátil](qa-stat-menu-textfix-reset-ev-native.json) parte del guardado con EV de PS 4. No conserva el equipo y vuelve al campo; Sí borra los seis EV, conserva IV/PID/otros registros/Bolsa/reservas y mantiene los ceros tras guardado nativo y arranque en frío. El contador MAIN pasa de 11 a 12 con CRC válido. Supera [revisión independiente](qa-stat-menu-textfix-resets-review.json); no se afirma repetición ni un segundo reinicio.

La [auditoría separada de reinicio IV portátil](qa-stat-menu-textfix-reset-iv-native.json) parte del guardado con IV de PS 16. No vuelve sin cambios; Sí borra los seis IV, conserva EV/PID/otros datos del equipo/Bolsa/reservas y coincide con la fórmula nativa de estadísticas usando datos personales del objetivo exacto. El guardado nativo pasa de 11 a 12 con CRC válido; un arranque en frío con la misma ROM conserva los ceros. También supera revisión independiente. Estos dos fixtures no prueban reinicios de todas las especies, niveles o posiciones del equipo.

Ambos linajes quedan resueltos en el dictamen. Los bytes adicionales del payload DSV siguen sin atribuir; no se probaron reinicios repetidos.

Ambos contadores MAIN pasan de 10 a 11 con CRC válido. Se comprueban estrictamente el registro editado esperado, los demás Pokémon, Bolsa, cantidad de Cheat Kit y reservas de código. Consulta las auditorías separadas de [IV portátil](qa-stat-menu-textfix-iv-native.json) y [EV portátil](qa-stat-menu-textfix-ev4-native.json).

Estos casos no prueban repetición, otras posiciones/estadísticas/pasos, reinicios portátiles, límites, naturalezas ni recálculo visible. El informe IV enumera 196 bytes modificados del DSV en 56 tramos; los cambios fuera de equipo/contador/CRC comprobados quedan sin atribuir. Alpha 2 sigue igual.

### Menú contextual de Cheat Kit

**Corrección de Bolsa:** la candidata separada `03d8711…57c620` elimina la opción REGISTER no implementada de Cheat Kit y conserva USE. Su [registro de construcción](qa-stat-menu-noregister-build.json) y [revisión estática independiente](qa-stat-menu-noregister-static-review.json) confirman que solo cambia el bit de registro del objeto 118; código del juego y guiones del editor quedan idénticos. La [prueba nativa](qa-stat-menu-noregister-native.json) y su [revisión independiente](qa-stat-menu-noregister-native-review.json) confirman selección, menú EV/IV y vuelta al campo con equipo/Bolsa/reservas intactos.

Esta candidata exacta ya tiene también [prueba nativa de escritura IV de PS 15 → 16, guardado y arranque en frío](qa-stat-menu-noregister-iv16-native.json), con [revisión independiente](qa-stat-menu-noregister-iv16-review.json). El contador MAIN seleccionado pasa de 10 a 11; ambos CRC guardados son válidos. Se conservan PID, demás IV, EV, resto del equipo y Bolsa. Una captura de RAM en frío interrumpe la posición 2 en una frontera exacta de cifrado de 16 bytes: el checksum transitorio no es válido, por lo que esa captura solo se acepta como coincidencia estricta de bytes con su origen, no como Pokémon decodificado. La posición guardada permanece exacta y válida. Faltan otras estadísticas y equipo↔PC en este hash.

### Rechazo nativo en los límites

El [informe acotado de límites](qa-stat-menu-noregister-limits-native.json) y su [revisión independiente de artefactos](qa-stat-menu-noregister-limits-review.json) cubren tres fixtures desechables y cuatro peticiones en `03d8711…57c620`:

| Fixture | Petición | Resultado observado |
| --- | --- | --- |
| EV de PS 255; resto de EV a cero | EV de PS +1 | Rechazado; sin cambios |
| EV de PS 250, Ataque 250, Defensa 10; total 510 | EV de PS +1 | Rechazado; sin cambios |
| IV de PS 31 | IV de PS +1 y +5 | Ambos rechazados; sin cambios |

Cada caso alcanza el mensaje nativo de rechazo y vuelve al campo visible tras confirmar y usar Atrás/Salir. El equipo coincide en fronteras estrictas de cifrado; Bolsa, reservas y baterías de fixture quedan exactos. Estas ramas no realizan guardado nativo. **Fallo visual:** la captura conservada corta las últimas palabras de «No increase is available. No change was made.». Pasan los datos, pero no la legibilidad completa. La candidata de integración debe incorporar un salto de línea explícito. Estos casos no prueban ajustes próximos al límite, todas las estadísticas ni transferencias al PC.

![Menú de Cheat Kit: USE, MOVE y CANCEL; sin opción REGISTER.](../assets/qa/portable-editor-use-menu.png)

### Selector nativo y vuelta al mapa

La candidata aislada del selector, SHA-256 `b987fec615e44e01d1505297599a31f1a584c6bf8029e677cb49ba507bbffb5b`, superó dos ramas separadas desde el mismo estado con el selector abierto:

| Acción | Resultado nativo | Tras aceptar el mensaje |
| --- | --- | --- |
| Cancelar | Posición 255 | Mapa limpio, sin diálogo ni tarea de script abiertos |
| Elegir el primer Pokémon | Posición 0 | Mapa limpio, sin diálogo ni tarea de script abiertos |

![Selector nativo en la candidata de QA; se muestran ambas pantallas para conservar visible el control Cancelar.](../assets/qa/stat-editor-party-menu.png)

![Vuelta al mapa tras aceptar la cancelación; la imagen de ubicación muestra la pantalla superior de DS.](../assets/locations/stat-editor-field-return.png)

La auditoría cubre siete ejecuciones y veinte capturas. La batería no cambia, ambas ranuras tienen CRC válido y el array completo de la Bolsa coincide con la partida fuente. Los registros del equipo coinciden byte por byte con esa misma partida, incluidas las fronteras nativas de cifrado de dos bytes verificadas estrictamente en muestras RAM interrumpidas. Esas muestras transitorias no se etiquetan como checksum válido. También coinciden los bytes del helper y las guardas de reserva. No se llama a ningún setter de estadísticas.

Se situó al jugador junto a un NPC Rocket estacionario en una copia desechable. Esto demuestra el ciclo del selector en ese escenario; no demuestra acceso por historia normal, NPC deambulando, edición de estadísticas, almacenamiento del PC ni un objeto portátil. No se probó persistencia mediante guardado/recarga posterior porque esta sonda no modifica datos guardados.

Consulta la [auditoría del selector](qa-stat-selector-native.json) y la [revisión independiente](qa-stat-selector-review.json). Sus hashes identifican las capturas originales y los artefactos locales.

### Previsualización nativa y cancelación

Otra candidata de solo previsualización, SHA-256 `f1ab9f71c73903802f4185760d97923db720b2bdf1a92d2904ac21fa510d09d9`, superó ambas ramas. Utiliza el primer Pokémon fijado para la prueba; todavía no une el selector anterior con la previsualización.

| Acción | Resultado observado | Cambios en el Pokémon guardado |
| --- | --- | --- |
| Previsualizar IV de PS +1 en Clefairy | IV original 15; propuesta 16 | Ninguno |
| Cancelar | Estado de cancelación; sin valor propuesto | Ninguno |

El script de QA espera antes de cerrarse para medir las variables con su entorno todavía activo. Tras aceptar el resultado vuelve al mapa. La revisión independiente confirmó que el muestreador solo lee RAM y verificó batería intacta, comparación estricta de equipo/Bolsa, tabla de comandos, código del helper y guardas de reserva. No se llama a ningún setter ni reinicio.

Consulta la [auditoría de previsualización](qa-stat-preview-native.json) y su [revisión independiente](qa-stat-preview-review.json). Esto demuestra una vista previa de IV de PS y cancelación en una sonda aislada, no edición persistente, otras estadísticas, naturalezas ni la herramienta final.

### Selector y previsualización combinados

La candidata combinada, SHA-256 `938149619b2620d3b56871ad30f3526dcd3f8c748a726d02a311191f6d5a3634`, ya supera el recorrido completo del selector a la propuesta. Elegir a Clefairy en la posición 0 devuelve estado 0 y propuesta de IV de PS 16 desde su IV almacenado 15; Cancelar devuelve estado 1, sin propuesta (`65535`) y posición 255. Ambas ramas vuelven al campo tras aceptar el mensaje.

Siete ejecuciones cubren arranque en frío sin estado importado, navegación y ambas ramas de resultado/aceptación. Permanecen intactos batería, comparación estricta de equipo/Bolsa y las tres reservas de código. Root reprodujo la auditoría de forma independiente, inspeccionó las capturas de resultado/campo y comprobó que rechaza estados importados en el arranque frío y cheats declarados. Consulta la [auditoría combinada](qa-stat-combined-native.json) y la [revisión de root](qa-stat-combined-review.json). Faltan otras posiciones, modificaciones, reinicios, cambios guardados y la herramienta portátil.

### Incremento de IV de PS confirmado dentro del juego

La candidata aislada Set-IV, SHA-256 `ef41db697c047c8a1488b87ff3549d80025bdf9c524d3b4cb573058c87da7a4f`, superó las ramas Sí y No. Antes del consentimiento propone IV de PS 16 y la confirmación está sin asignar. Sí cambia únicamente el IV de PS de Clefairy de 15 a 16; No conserva el equipo. Ambas vuelven al campo tras aceptar el mensaje. Ocho ejecuciones y revisión independiente cubren arranque frío sin estado, cambio exacto, otros Pokémon/PID/Bolsa/batería intactos y código protegido. Las estadísticas derivadas no cambian en este caso, por lo que no demuestra un recálculo visible.

Consulta la [auditoría nativa Set-IV](qa-stat-set-iv-native.json) y la [revisión independiente](qa-stat-set-iv-review.json). Este informe no cubre persistencia guardada, reinicios, otras estadísticas/posiciones ni la interfaz portátil final. El mensaje bilingüe provisional necesita continuación y requerirá un texto final más corto.

Otra [auditoría de persistencia](qa-stat-set-iv-persistence.json), reproducida por un [revisor independiente](qa-stat-set-iv-persistence-review.json), verifica guardado nativo y un proceso nuevo de 5.500 frames con esa DSV guardada, sin importar estado ni usar cheats. El contador pasa de 9 a 10 con CRC válido; conserva IV de PS 16, PID, otros campos, miembros del equipo y Bolsa. Los inputs del arranque frío reabren el mensaje del editor, pero no confirman una segunda edición. Se enumeran doce cambios adicionales del payload sin atribuirles semántica; sigue siendo QA acotado de la candidata exacta.

### Reinicios EV e IV nativos separados

Ambas candidatas aisladas superan Sí/No y vuelta al campo:

| Operación | Sí | No |
| --- | --- | --- |
| Reiniciar EV | Los seis valores de prueba 1/2/3/1/2/3 pasan a cero | Los seis permanecen intactos |
| Reiniciar IV | Los seis IV pasan a cero | El equipo permanece intacto |

La partida EV es sintética y desechable; cada EV está por debajo de 4 y no aporta cambios a las estadísticas derivadas. El reinicio IV coincide con el registro de datos personales exacto y la fórmula nativa: Defensa de Clefairy 10 → 9, Velocidad 11 → 8 y Ataque Especial 12 → 11, conservando los PS. Permanecen intactos PID, la otra familia, otros miembros, Bolsa y guardas de código. Las muestras RAM interrumpidas requieren comparación estricta por fronteras de cifrado nativas; los checksums válidos de las partidas fuente se comprueban aparte.

Consulta la [auditoría nativa](qa-stat-reset-native.json), la [revisión independiente](qa-stat-reset-independent-review.json) y la [reproducción de root](qa-stat-reset-root-review.json). El auditor final comprueba cada estado contra la salida registrada de su padre, misma ROM/core/runner y DSV fuente. Cuatro pruebas de contrato rechazan orígenes inválidos. Un intento excluido e incompleto solo conserva preflight, por lo que no se afirma su causa. Estos informes no demuestran persistencia de los reinicios ni un editor portátil completo.

Otra [auditoría de persistencia de reinicios](qa-stat-reset-persistence.json), reproducida byte por byte por un [revisor independiente](qa-stat-reset-persistence-review.json), verifica guardado nativo y recuperación en procesos nuevos para ambas candidatas exactas. Los contadores pasan de 9 a 10 con CRC válido; se conservan el equipo esperado, Bolsa y tres reservas de código. Los arranques fríos no importan estados ni usan cheats y llegan al campo en los frames 4.300/4.900. Tres pruebas negativas rechazan estados importados en frío, equipo alterado y una batería fría distinta. Un primer intento EV quedó en el título y se excluye. Los valores cero no prueban cuántas veces se ejecutó el reinicio; el informe no lo afirma.

### Comandos de edición y reinicio EV/IV: pruebas host

Los handlers propuestos para modificar y reiniciar superaron la revisión independiente y las pruebas host con el núcleo y adaptador reales del editor, usando funciones del juego simuladas. Cubren consentimiento Sí explícito, No/sin confirmar/cancelar sin cambios, variables y punteros inválidos, posiciones vacías y huevos, límites EV/IV, conservación de la otra familia y del PID, y un recálculo por operación aceptada. La revisión añadió casos de rechazo específicos de Reset.

Estas pruebas host por sí solas no demuestran confirmación nativa, comportamiento de registros cifrados ni persistencia guardada; la evidencia nativa Set-IV anterior tiene su propio alcance separado. Consulta el [registro de revisión host](qa-stat-mutators-host-review.json).

Una candidata separada ya registra los dos comandos y supera la [revisión estática independiente](qa-stat-mutators-static-review.json). Conserva las 854 entradas anteriores del dispatch, los 513 archivos del juego, ARM7, overlays y los bytes previos de helpers y guardas. Se rechazó antes de ejecutarlo un build anterior con una macro insegura de lectura de operandos; el corregido llama al lector nativo verificado. Su script todavía no invoca los mutadores: esto demuestra únicamente la integración binaria.

### Sonda portátil separada

La sonda aislada de apertura, SHA-256 `604101b971d182902928b73f3b9717ff26751aed1bc5a933e65b40f85425a79f`, abre el Cheat Kit (Kit de trucos) desde la Bolsa dos veces. El script global de prueba 2072 alcanza su marcador de espera; A y B regresan al campo. El objeto conserva cantidad uno, con comparación estricta de equipo/Bolsa y batería intacta. La partida procede del regalo Rocket real de Alpha 2, guardado nativo y recarga fría con esa misma ROM; no se cruzan estados del emulador entre versiones. La [auditoría de apertura](qa-stat-portable-launch-native.json) supera la [revisión independiente](qa-stat-portable-launch-review.json), incluida reproducción byte por byte del informe. No cubre guardar después del uso portátil ni regresiones de TM Refill/Party Healer.

Esta sonda solo abre un script de prueba, no los menús del editor. El atajo registrado no está soportado ni probado; usar **Bag → Cheat Kit → USE**. Otra candidata con menú completo, `025429759de1b688b6521839dbf44671e03bf54b9376ba34cb598d8da1265885`, superó la revisión binaria independiente, pero **falló su primera prueba nativa de cancelación**: abre el selector, B devuelve posición 255 y ambas pantallas siguen negras tras aceptar el mensaje y terminar el script. Equipo, Bolsa y batería quedaron intactos. Se detienen las pruebas de edición mientras se diagnostica el retorno al mapa. No es una descarga publicada.

El [registro de la prueba fallida](qa-stat-portable-menu-smoke-025.json) conserva ocho ejecuciones enlazadas y diez capturas. Un TaskManager a cero se registra solo como final del script; expresamente no se acepta como vuelta visible al mapa.

La [corrección mínima del fundido](qa-stat-portable-menu-fadefix.json) intercambia únicamente las dos direcciones de fundido para respetar el ciclo nativo del selector. La prueba de regresión falla antes y pasa después; una comparación independiente de las ROM completas encuentra exactamente dos bytes distintos y conserva todos los demás. La candidata `2abb1c8cf87540aad70d3c7c13517bee5a159ef3e38af11a1440030b276317ed` está realizando su propia prueba fría. La corrección estática por sí sola no acredita regreso visible ni menús de edición funcionales.

La [prueba fría corregida](qa-stat-portable-menu-fadefix-smoke.json) muestra el mensaje de cancelación y vuelve visiblemente al mapa tras A; root inspeccionó ambas capturas. Una [revisión independiente](qa-stat-portable-menu-fadefix-review.json) confirma la cadena congelada, hashes y batería guardada exacta. La navegación de reentrada se detuvo en la Bolsa antes del selector, por lo que no prueba otra sesión del editor ni acredita un fallo nuevo suyo. Otro [suplemento de integridad offline](qa-stat-portable-menu-integrity-review.json) verifica las tres capturas RAM finales conservadas: equipo comparado estrictamente contra la DSV en fronteras de cifrado nativas exactas, Bolsa canónica completa y tres reservas de código iguales a la ROM. No se atribuye semántica descifrada a dos registros interrumpidos del slot 2. Solo se cierra la integridad de esas capturas; no se aceptan operaciones de edición.

![Cancelación del editor portátil tras corregir el fundido; ambas pantallas de DS.](../assets/qa/portable-editor-fadefix-cancel.png)

![Mapa visible después de aceptar la cancelación; ambas pantallas de DS.](../assets/qa/portable-editor-fadefix-field.png)

### Integración del menú portátil

Otra [auditoría de navegación sin escrituras](qa-stat-portable-family-menu.json) llega al selector mediante la navegación corregida de la Bolsa y elige la posición 0. La RAM confirma el script 2072 vivo en la espera nativa del menú: la posición conservada es 0 y el resultado `0x800C` sigue en `0xEEEE`, esperando una elección. La lista EV/IV esperada no aparece sobre el mapa. Equipo, Bolsa canónica y tres secciones reservadas coinciden con sus referencias exactas en las capturas conservadas. Un validador histórico de padding/arena no corresponde a este build compuesto; pasan las comparaciones directas contra la ROM. Se investiga la integración gráfica del menú; no es una salida anticipada del script confirmada. No se intenta ninguna operación de edición desde ese estado.

El [diagnóstico de RAM conservada](qa-stat-menu-prerequisite-diagnosis.json) identifica un requisito nativo omitido: el modo del menú de campo es 0 y su transición está lista, mientras `MenuExec` requiere modo 3. El generador omite `TouchscreenMenuHide` (746). Los scripts originales ocultan antes de entrar en los menús, conservan modo 3 entre submenús y usan `TouchscreenMenuShow` (747) al terminar. Se prepara una corrección separada; faltan verificación nativa del dibujo y de la restauración.

Otro [build separado del modo de interfaz](qa-stat-menu-uimode-build.json), SHA-256 `5a61083689668f3efcf46c4821b77b336875af5237a36f9985eb4cc159bd7d44`, añade ese ciclo de ocultar/restaurar. El modelo host rechaza primero la entrada original al menú en modo 0 y pasa con la corrección, incluida la restauración y la cancelación del selector sin pasar por ocultar/restaurar. Su [revisión estática independiente](qa-stat-menu-uimode-static-review.json) verifica ARM9/ARM7 intactos, un único miembro de scripts modificado y el mismo grafo anterior al retirar ocultar/restaurar. La prueba visual nativa está en curso; la descarga sigue siendo Alpha 2.

La nueva ejecución nativa ya muestra **EVs / IVs / Exit** después de elegir la posición 0. Root inspeccionó la captura y la tarea viva de interfaz registra modo 3/estado 1. Siguen en curso previsualización, No y restauración al salir; esta observación no acepta operaciones de edición.

![Menú EV/IV visible en la candidata con modo de interfaz corregido; ambas pantallas de DS.](../assets/qa/portable-editor-uimode-family.png)

La propuesta numérica es correcta en la RAM conservada (actual 15, propuesto/mostrado 16, estado 0, confirmación `FFFF`), pero el texto muestra glifos ilegibles. El popup por sí solo no se acepta como previsualización usable y no se ejecuta la rama Sí mientras siga este fallo.

El diagnóstico del texto encuentra dos tokens STRVAR sin argumentos en `confirm_increment`. La expansión nativa necesita el índice del campo como primer argumento. El script real guarda actual en el campo 1 y propuesto en el campo 2; la corrección debe enlazar esos índices explícitamente. Faltan verificar los vectores codificados resultantes y la visualización nativa legible en otra candidata.

![Texto de confirmación no aceptado por sustituciones numéricas ilegibles.](../assets/qa/portable-editor-uimode-preview-text-fail.png)

La [auditoría nativa de 18 ejecuciones](qa-stat-menu-uimode-native.json) consolida menú visible, propuesta en RAM, No/Volver/Salir y restauración de modo 0/estado 1. Una [revisión independiente](qa-stat-menu-uimode-review.json) reproduce el informe congelado y rechaza estados de origen alterado. Verifica equipo/Bolsa/reservas estrictamente conservados y batería semilla intacta, manteniendo el texto ilegible como comprobación visual fallida. La [revisión del runner](qa-stat-menu-uimode-runner-review.json) limita expresamente la equivalencia de fuente a cheats vacíos; no acepta efectos de códigos.

Otra [candidata solo de texto](qa-stat-menu-textfix-build.json), SHA-256 `99810da8497d6f0ac4ac65693c276f11b232f795d1e18d82f7d607ae32c0684a`, corrige los argumentos de campo de ambos tokens. Su [revisión estática independiente](qa-stat-menu-textfix-static-review.json) confirma que solo cambia el banco de texto 40, mensaje 134; script 2072, ARM9 y ARM7 quedan exactos. La prueba de regresión rechaza los tokens anteriores sin argumentos y pasa con los vectores corregidos. A continuación se conserva la prueba nativa de visualización.

La candidata solo de texto muestra correctamente **Current: 15; proposed: 16. Apply this change?** en su propia ejecución nativa. Las variables numéricas coinciden y la confirmación está sin asignar en ese estado conservado anterior a elegir. Esta sonda histórica corrige el fallo visual; las pruebas posteriores de No/Sí y persistencia aparecen al principio de la página.

![Propuesta nativa de IV de PS legible en la candidata textfix; ambas pantallas de DS.](../assets/qa/portable-editor-textfix-preview.png)

### Qué falta

IV de PS +1, EV de PS +4, reinicios EV/IV separados y una repetición de IV de PS hasta 10 ya tienen evidencia nativa acotada de persistencia revisada independientemente. Faltan otras estadísticas/pasos, límites, otras posiciones, transferencias equipo↔PC, regresión más amplia de objetos/historia, naturalezas e integración en la descarga. Ningún informe acotado demuestra toda la ROM. Consulta el [estado de implementación](ev-iv-kit-feasibility.md).
