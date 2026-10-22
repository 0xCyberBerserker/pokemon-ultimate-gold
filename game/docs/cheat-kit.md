# Ultimate Gold Cheat Kit

## English

**Current availability (2026-10-22):** the patcher defaults to **Alpha 2 — experimental**, with the Rocket kit, target SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`. Alpha 1 remains selectable and contains TM Refill only. Alpha 2 has exact-target [Candy/Berry use](kit-regression-fix6a.md) and [Repel evidence](repel-reuse.md); full campaign acceptance remains pending. EV/IV editing is not included.

**Alpha 2 gift checked:** the Rocket NPC's offer and acceptance added the nine intended entries at quantity 1, including TM Refill, Party Healer and the final Cheat Kit marker. The full Bag and save-array comparison found no other inventory changes; a +1 walking friendship event is recorded separately. [Exact-target evidence and location capture](qa-alpha2-gift.md), [independent review](qa-alpha2-gift-review.md). Post-gift save/cold recovery, decline/repeat and full-bag cases have not been tested on Alpha 2.

The historical isolated kit candidate below is `25bfdc764457dc895bcca9d4cadf67c575b3309bdd671fd72892d3744efaf87f`. Its broader test matrix has traceability limitations and is not silently inherited by Alpha 2.

The optional Team Rocket NPC in New Bark Town offers TM Refill (113), Party Healer (114), Oran/Leppa/Lum Berries, Rare Candy, Max Repel and Escape Rope. The script skips owned gifts, verifies each insertion with native `HasItem`, and grants the Cheat Kit marker (118) last. Keeping that marker enables the reusable-item hook for Rare Candy, repels, Escape Rope and owned berries. Bag use and held-item use in battle require separate acceptance.

### Historical isolated-candidate QA

The machine-audited [acceptance record](qa-native-kit.json), generated 2026-10-21, reports **288/288 assertions passed, 0 failed** for the exact candidate SHA above. It independently checks RAM, canonical inventory, save files, loaded script bytes, states, and screenshots; a runner `PASS` alone means only that emulation completed. It confirms the candidate script body is uniquely loaded and active and matches its candidate hash.

| Case | Result |
|---|---|
| Normal gift, decline, and repeat | Expected counts; declining preserves the bag; repeat does not duplicate gifts. |
| Full key pocket | Synthetic fixture has 60 unique valid key items, excludes 114/118, and is verified full in canonical storage. No-code interaction leaves it unchanged and grants neither custom item. |
| One free slot and retry | Synthetic 59/60 fixture gets item 114 in slot 60 but not marker 118. After a separate slot is freed, retry adds 118 without changing pre-owned counts. |
| Healer and Candy | Healer restores status, HP, and PP; the marker allows Candy reuse; without the marker, Candy is consumed. |
| TM refill and HM exclusion | Canonical/native readback changes TM quantities 328/329 from 2/98 to 99/99, keeps absent TM 330 at 0, and HM 420 at 1. |
| Battery save and reload | A fresh process, with no state input or active codes, loads the same battery file; native inventory remains and Candy reuse still works. |

Traceability is limited: 14 archived result records omit one or both per-run core/runner hashes, and all 14 also lack a recorded input-state hash. The audit hashes the available input files separately without backfilling those records. The newer battery reload runs intentionally have no state input. Current runtime hashes are listed separately and are not attributed retroactively. Ten completed runs record core and runner hashes. The preserved runner snapshot is byte-identical to the instrument used for this acceptance; future runs must record their own hashes. Synthetic inventory cases establish controlled edge behavior, not normal campaign progression.

### Native implementation

- The builder verifies the input hash, patch preimages, reserve capacities and read-back bytes. Items 113, 114 and 118 use appended non-tossable key-item records.
- The `Bag_TakeItem` hook at `0x023DEB00` preserves the original arguments and replays the displaced prologue. Its fallback resumes at `0x02078440`. The menu uses 60/64 bytes; TM refill, healer and fallback use 86/88 bytes of their registered block.
- Party Healer calls the verified native `TaskManager_GetFieldSystem`, `SaveArray_Party_Get` and `HealParty` functions. TM Refill restores owned TM quantities below 99; absent TMs and HMs must remain unchanged.
- The NPC uses Rocket male sprite 222 and validated script command widths and branch targets. Message IDs are 8-bit operands.
- The current candidate acceptance covers the healer, Candy, TM refill and HM exclusion as listed above. A reusable bag-used Oran Berry was shown in an earlier shared-engine run, not this candidate-specific suite; held-berry use in battle is still a separate check.

EV/IV/Nature editing is a separate feasibility study, not part of this candidate; see [the EV/IV/Nature report](ev-iv-kit-feasibility.md). Nature editing needs an override that preserves PID-derived gender, ability, shininess, and form traits; the report does not claim this is implemented.

Full story progression, held berries in battle, Escape Rope in a cave and physical controls remain outside the current kit acceptance.

## Español

**Disponibilidad actual (22-10-2026):** el parcheador abre **Alfa 2 — experimental** por defecto, con el kit Rocket, SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`. Alfa 1 sigue seleccionable y solo contiene TM Refill (Recarga MT). Alfa 2 tiene pruebas de su hash exacto de [caramelo/baya](kit-regression-fix6a.md) y [repelentes](repel-reuse.md); falta aceptar la aventura completa. No incluye edición EV/IV.

**Regalo de alfa 2 comprobado:** la oferta y aceptación del NPC Rocket añadieron las nueve entradas previstas con cantidad 1, incluidos TM Refill (Recarga MT), Party Healer (Curador del equipo) y el marcador final Cheat Kit (Kit de trucos). La comparación completa de Bolsa y array de guardado no encontró otros cambios de inventario; se registra aparte un incremento de amistad al caminar. [Evidencia del hash exacto y captura de localización](qa-alpha2-gift.md), [revisión independiente](qa-alpha2-gift-review.md). Falta probar guardado/recarga tras el regalo, rechazo/repetición y bolsa llena en alfa 2.

El candidato aislado histórico descrito abajo es `25bfdc764457dc895bcca9d4cadf67c575b3309bdd671fd72892d3744efaf87f`. Su matriz más amplia tiene limitaciones de trazabilidad y no se hereda silenciosamente en alfa 2.

El NPC opcional del Team Rocket en New Bark Town (Pueblo Primavera) ofrece TM Refill (Recarga MT, 113), Party Healer (Curador del equipo, 114), Oran/Leppa/Lum Berries (bayas Aranja/Zanama/Ziuela), Rare Candy (Caramelo Raro), Max Repel (Repelente Máximo) y Escape Rope (Cuerda Huida). El script omite los regalos ya poseídos, comprueba cada inserción con `HasItem` nativo y entrega el marcador Cheat Kit (Kit de trucos, 118) al final. Llevarlo activa la reutilización de Rare Candy, repelentes, Escape Rope y bayas poseídas. Usar una baya desde la bolsa y consumirla equipada en combate necesitan pruebas distintas.

### QA histórica del candidato aislado

El [registro de aceptación auditado por máquina](qa-native-kit.json), generado el 21-10-2026, indica **288/288 aserciones superadas y 0 fallidas** para el SHA exacto del candidato. Comprueba por separado RAM, inventario canónico, archivos de guardado, bytes del script cargado, estados y capturas; `PASS` del runner por sí solo solo significa que acabó la emulación. Confirma que el cuerpo del script candidato se cargó una sola vez, está activo y coincide con el hash del candidato.

| Caso | Resultado |
|---|---|
| Regalo normal, rechazo y repetición | Cantidades previstas; rechazar conserva la bolsa y repetir no duplica regalos. |
| Bolsillo de objetos clave lleno | Fixture sintético con 60 objetos clave válidos y únicos, sin 114/118, verificado en almacenamiento canónico. La interacción sin códigos deja la bolsa igual y no entrega ninguno de esos objetos. |
| Un espacio libre y reintento | El fixture sintético 59/60 recibe el objeto 114 en el último espacio, pero no el marcador 118. Tras liberar otro espacio por separado, el reintento añade 118 y conserva las cantidades preexistentes. |
| Curador y Caramelo | El curador restaura estado, PS y PP; el marcador permite reutilizar el Caramelo; sin marcador, se consume. |
| Recarga MT y exclusión de MO | Lectura canónica/nativa: MT 328/329 pasan de 2/98 a 99/99; la MT 330 ausente queda en 0 y la MO 420 en 1. |
| Guardado y recarga de batería | Un proceso nuevo, sin cargar estado ni códigos activos, carga el mismo archivo de batería; conserva el inventario nativo y permite reutilizar el Caramelo. |

La trazabilidad tiene límites: 14 registros de resultados archivados no incluyen uno o ambos hashes de núcleo/runner por ejecución y tampoco registran el hash de su estado de entrada. La auditoría calcula los hashes de los archivos de entrada disponibles por separado, sin completar retroactivamente esos registros. Las ejecuciones posteriores de recarga de batería no reciben estado de entrada intencionadamente. Los hashes actuales del runtime se enumeran por separado y no se atribuyen retroactivamente. Diez ejecuciones completadas sí registran ambos hashes. La copia preservada del runner es idéntica byte a byte al instrumento de esta aceptación; las futuras ejecuciones deben registrar sus propios hashes. Los casos de inventario usan fixtures sintéticos y no demuestran progreso normal de campaña.

### Implementación nativa

- El builder comprueba hash de entrada, bytes previos, capacidad de las reservas y lectura posterior. Los objetos 113, 114 y 118 usan registros nuevos de objetos clave que no se pueden tirar.
- El hook de `Bag_TakeItem` en `0x023DEB00` conserva argumentos y prólogo; el retorno normal continúa en `0x02078440`. El menú ocupa 60/64 bytes; recarga, curador y retorno ocupan 86/88 de su bloque registrado.
- Curador de Equipo usa las funciones nativas verificadas del equipo. Recarga MT repone a 99 las MT ya poseídas; las ausentes y las MO deben permanecer iguales.
- El NPC lleva el sprite Rocket masculino 222. Los anchos de comandos y los saltos están validados; los ID de mensaje ocupan 8 bits.
- La aceptación del candidato actual cubre el curador, Caramelo, recarga MT y exclusión de MO según la tabla. Una baya Aranja reutilizable desde la bolsa se demostró en una ejecución anterior del mismo motor, no en esta suite del candidato; usar bayas equipadas en combate sigue siendo otra prueba.

Editar EV/IV/Naturaleza es un estudio de viabilidad separado, no forma parte de este candidato; consulta el [informe EV/IV/Naturaleza](ev-iv-kit-feasibility.md). Editar la naturaleza requiere un override que preserve género, habilidad, variocolor y rasgos de forma derivados del PID; el informe no afirma que ya esté implementado.

La aventura completa, las bayas equipadas en combate, Cuerda Huida en una cueva y los controles físicos siguen pendientes fuera de esta aceptación del kit.
