# Roadmap

## English

The live backlog is in [Projects](https://github.com/users/0xCyberBerserker/projects/4); this file contains only the delivery gates.

- Import reviewed game source and evidence without disrupting active development.
- Sprint 0, confirmed with the game lead: **Integrated editor and reproducible evidence**. Track the active editor/PC/Kris work without invented deadlines.
- Complete bounded tests, then prepare a short playable review for The designated reviewer.
- Release remains gated on gameplay, provenance/licensing and human acceptance. Kris remains incomplete. In a bounded 2,200-frame emulator run (Core93), independent comparison confirmed that the left-edge residual is absent in three sampled exit frames; six entry, pause and Ethan control captures matched the reference pixel-for-pixel. Thirty sampled I/O records differed only in W1 bit A, but the full trace also contains eight early divergences and an earlier-run comparison showed prior variability; those differences cannot be attributed to W1 and full-run equality remains unproven. K11's adapter has 52 passing synthetic tests; its bounded driver remains in preparation and no donor pass has been demonstrated. Nothing has been integrated into an atlas or ROM. This limited intro check is not hardware or full-game acceptance. See [issue #33](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33) for scope and limitations. Asset provenance remains a gate; the editor prototype is separate from downloadable Alpha 2. PWT remains outside current scope.

### Future platform proposals — UG-PORTS-20261023

The initial architectural assessment is a hypothesis, not a code audit, executed PoC or compatibility result. Technical ownership is **Dev**; **ScrumMaster** tracks the proposals. Both initiatives remain **Pendiente**, outside Sprint 0, with no implementation, installation, patcher integration or release authorized. Research priorities and duration estimates in the assessment are uncalibrated suggestions, not commitments. Reuse the already planned platform investigation rather than duplicating or advancing it.

- [Hybrid PC target — #21](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/21): compare A0, a standalone executable bundling emulation as contingency, with A1, ARM9 recompilation retaining DS compatibility services. Standalone does not mean fully native. The assessment names [ssrecomp](https://github.com/ClickingMaster/ssrecomp) and [pokeheartgold-single-screen](https://github.com/ClickingMaster/pokeheartgold-single-screen) as candidates; their status, licenses, Windows support and exact-build compatibility remain unverified.
- [Fully native PC engine — #22](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/22): investigate reuse of HGSS logic while replacing DS dependencies. Audit ARM9/ARM7, NitroSDK, overlays, graphics/audio, memory, DMA, interrupts, 32-bit pointers, packing, timing and saves. Decompilation alone does not establish portability.

| Logical task | Proposed outcome | Gate before execution |
| --- | --- | --- |
| UG-PC-001 | Exact-fork/build/hash and dependency compatibility audit. | Approved research scope; primary-source verification. |
| UG-PC-002 | Linux hybrid PoC: original reference, then exact Ultimate Gold build. | Accepted UG-PC-001 and separate PoC authorization. |
| UG-PC-003 | Real-Windows build, controls and persistence validation. | Accepted UG-PC-002 and validation authorization. |
| UG-NATIVE-001 | Engine/platform dependency audit. | Exact source baseline and approved research scope. |
| UG-NATIVE-002 | Real deterministic native module with reference-result parity. | Accepted UG-NATIVE-001, chosen module and authorized experiment. |

The logical IDs are not additional GitHub issues or active assignments. Compare architectures conceptually; develop sequentially if approved. A future hybrid PoC must pin source/tool hashes, boot Ultimate Gold, create a game, enter a map, complete a battle, save normally, close fully and reload with state comparison against the exact reference. Original SoulSilver running does not prove Ultimate Gold compatibility. Wine does not accept Windows; save states do not prove normal-save interoperability. Native module parity precedes any proposed playable vertical slice, which would still not accept the full game.

Before distribution, review licenses and permissions for dependencies and generated code. Require the user's own ROM; do not distribute ROMs, proprietary SDKs or protected resources. Human scope decisions and independent evidence review remain gates. Game translation is a separate proposal from platform research and [public-text editorial review #19](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/19). The original assessment stays internal; this section is its sanitized canonical planning summary.

## Español

El backlog vigente está en [Projects](https://github.com/users/0xCyberBerserker/projects/4); aquí solo quedan los criterios de entrega.

- Importar fuentes y evidencias revisadas sin interrumpir el trabajo activo.
- Sprint 0 confirmado con el chat técnico: **Editor integrado y evidencia reproducible**. Seguimiento del editor, PC y Kris sin inventar fechas.
- Completar las pruebas acotadas y preparar una revisión jugable breve para La persona revisora.
- La release sigue condicionada a juego, procedencia/licencias y aceptación humana. Kris continúa incompleta. En una ejecución acotada de emulador de 2.200 fotogramas (Core93), la comparación independiente confirmó que el residuo del borde izquierdo ya no aparece en tres fotogramas de salida muestreados; seis capturas de control de entrada, pausa y Ethan coincidieron píxel a píxel con la referencia. Treinta registros de E/S muestreados solo difirieron en el bit A de W1, pero la traza completa también contiene ocho divergencias tempranas y la comparación con una ejecución anterior mostró variabilidad previa; esas diferencias no se pueden atribuir a W1 y no se ha demostrado igualdad de toda la ejecución. El adaptador K11 tiene 52 pruebas sintéticas superadas; su driver acotado sigue en preparación y aún no se ha demostrado una pasada con el donante. No se integró nada en un atlas ni en una ROM. Esta comprobación limitada de la intro no acepta hardware ni el juego completo. Consulta el alcance y sus límites en la [issue #33](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33). La procedencia de recursos sigue siendo un gate; el prototipo del editor permanece separado de Alpha 2 descargable. PWT sigue fuera del alcance actual.

### Propuestas futuras de plataformas — UG-PORTS-20261023

La valoración arquitectónica inicial es una hipótesis, no una auditoría del código, PoC ejecutada ni resultado de compatibilidad. **Dev** es responsable técnico y **ScrumMaster** mantiene el seguimiento. Ambas iniciativas quedan **Pendiente**, fuera del Sprint 0, sin autorizar implementación, instalaciones, integración con el parcheador ni release. Las prioridades y duraciones del estudio son sugerencias sin calibrar, no compromisos. Reutilizar la investigación de plataformas ya prevista, sin duplicarla ni adelantarla.

- [Destino PC híbrido — #21](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/21): comparar A0, ejecutable autónomo con emulación incorporada como contingencia, con A1, recompilación ARM9 que conserva servicios de compatibilidad DS. Autónomo no significa completamente nativo. El estudio menciona los dos repositorios enlazados arriba como candidatos; siguen pendientes su estado, licencias, soporte Windows y compatibilidad con nuestro build exacto.
- [Motor PC completamente nativo — #22](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/22): investigar reutilización de lógica HGSS sustituyendo dependencias DS. Auditar ARM9/ARM7, NitroSDK, overlays, gráficos/audio, memoria, DMA, interrupciones, punteros de 32 bits, packing, temporización y guardados. La decompilación por sí sola no acredita portabilidad.

| Tarea lógica | Resultado propuesto | Requisito antes de ejecutar |
| --- | --- | --- |
| UG-PC-001 | Auditoría de fork/build/hashes exactos, dependencias y compatibilidad. | Alcance de investigación aprobado y fuentes primarias contrastadas. |
| UG-PC-002 | PoC híbrida Linux: referencia original y después Ultimate Gold exacto. | UG-PC-001 aceptada y autorización separada de la PoC. |
| UG-PC-003 | Compilación, controles y persistencia en Windows real. | UG-PC-002 aceptada y autorización de validación. |
| UG-NATIVE-001 | Auditoría de dependencias del motor y plataforma. | Fuente exacta y alcance de investigación aprobado. |
| UG-NATIVE-002 | Módulo nativo real determinista con paridad frente a la referencia. | UG-NATIVE-001 aceptada, módulo elegido y experimento autorizado. |

Los IDs lógicos no son issues adicionales ni encargos activos. Comparar las arquitecturas conceptualmente y desarrollar de forma secuencial si se aprueba. Una futura PoC híbrida debe fijar hashes de fuente y herramientas, arrancar Ultimate Gold, crear partida, llegar a mapa, completar un combate, guardar normalmente, cerrar por completo y cargar comparando estado con la referencia exacta. SoulSilver original funcionando no acredita Ultimate Gold. Wine no acepta Windows y los save states no demuestran compatibilidad de partidas normales. La paridad del módulo nativo precede a cualquier propuesta de vertical slice jugable, que tampoco aceptaría el juego completo.

Antes de distribuir, revisar licencias y permisos de dependencias y código generado. Requerir la ROM propia del usuario; no distribuir ROMs, SDK propietario ni recursos protegidos. Siguen pendientes las decisiones humanas de alcance y la revisión independiente de evidencias. La traducción del juego es otra propuesta, distinta de plataformas y de la [revisión editorial pública #19](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/19). El estudio original permanece interno; esta sección es su síntesis canónica saneada de planificación.
