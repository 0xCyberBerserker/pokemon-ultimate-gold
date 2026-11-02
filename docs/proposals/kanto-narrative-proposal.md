# Kanto narrative proposal

**Status:** Proposal for discussion under [issue #35](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/35). The characters, plot, choices, and mission cards below are provisional; they are not canon, a sprint assignment, or implementation approval. No Kanto code, ROM, or save was changed for this proposal. Runtime QA listed below is future work and has not been run.

## English

### Direction

- Preserve the established HeartGold/SoulSilver story in Johto. Any foreshadowing is optional and does not replace its existing resolution.
- After the Johto League, offer an explicit choice to work with a local Team Rocket cell, oppose its local activity, or postpone the decision. Prior play never assigns a route automatically.
- Keep both routes in one shared Kanto. Choices may persist and permanently close optional scenes or allies after an advance warning. The eight Kanto badges, shared main episodes, and Kanto League remain available on either route.
- Give Kanto its own eight badges, Elite Four, and Champion, separate from Johto.
- Treat a missing route choice in an older save as neutral only as a proposal. Compatibility and migration behavior are unverified.

### Provisional characters

| Character | Motivation and tension |
| --- | --- |
| **Nara** | A travelling radio technician from Johto wants communities to retain a reliable emergency channel. She can repair equipment for either side but will not treat repair as consent to control the network. |
| **Ciro** | A local Rocket liaison believes his cell can restore neglected services. His practical case has value, but he minimizes the risks of centralized control and Rocket's coercive history. |
| **Sena** | A community-radio organizer wants residents to decide who broadcasts and when. She opposes coercion, not every person who has worked with Rocket. |
| **Tali** | A volunteer dispatcher in a remote Kanto hamlet needs dependable safety check-ins. The slower community repair costs her an extra trip; the faster Rocket repair exposes courier schedules. |

These are original placeholders, not canon characters or fixed names.

### Shared arc and pilot choice

An optional damaged relay in Johto carries a fragment of a Kanto transmission. After the Johto League, Nara introduces the failing Kanto relay. Ciro and Sena explain their plans; the player may choose either or leave and return. Both routes revisit the same towns, services, main episodes, eight-badge journey, and separate Kanto League. Route state changes contacts, dialogue, and who visibly maintains the relay.

The pilot, **The Quiet Relay**, presents a concrete trade-off before confirmation:

- **Support Ciro:** He offers a replacement transmitter immediately if the player shares the couriers' route-and-time log. This exposes Nara's contacts to pressure. The relay returns sooner and Tali receives her scheduled update, but the couriers stop trusting Nara with their routes; an optional courier-testimony scene closes permanently.
- **Support Sena:** She protects the log and organizes a slower community repair. Nara's contacts keep their privacy, but Tali misses a non-urgent safety update and makes an extra trip. Ciro's optional depot briefing closes permanently after the refusal.
- **Postpone:** No route is selected and the relay stays unresolved. The mission remains available; Tali's check-in is still pending.

The player is told who bears each cost and which optional scene may close before choosing. The relay state and optional-content consequence persist in later shared scenes and after re-entry. Neither outcome affects badges, shared main episodes, or League access. Whether later reconciliation can restore a closed optional scene remains undecided. No forced betrayal is proposed.

### Decision and progression guardrails

| Situation | Proposal | Guardrail |
| --- | --- | --- |
| Older save has no route choice | Read it as neutral without resetting established progress. | A compatibility proposal only; save-format and migration behavior remain unverified. |
| Player postpones | Keep the route neutral and the mission discoverable. | No automatic affiliation or main-route penalty. |
| Player chooses a route | Record the explicit choice and reflect it in later shared scenes. | Optional allies or scenes may close permanently after warning; badges, shared main episodes, and League stay available. |
| Kanto badges and League | Use the same eight-badge path and separate Elite Four/Champion challenge on both routes. | No route flag awards, removes, or gates a badge or League access. |

### First three proposed mission cards

These are future briefs, not approved implementation tasks. No map, script, flag, or mission IDs are assigned.

#### Echoes across Johto

- **Purpose:** Plant optional foreshadowing without changing Johto's established Rocket resolution.
- **Dependencies:** A future static inventory must identify a suitable existing Johto scene and safe return path; EN/ES wording must be aligned.
- **Definition of done:** The clue can be missed without blocking Kanto; re-entry cannot duplicate or trap the player; the two languages convey the same clue. Old-save behavior remains unverified and is not promised.
- **Future runtime QA — not run:** On a disposable save copy, test ordinary save, full emulator/application shutdown, cold load, event re-entry, interruption and re-entry, and any reward exactly once. If an item reward exists, test a full bag and verify the item is neither lost nor duplicated.

#### The Quiet Relay

- **Purpose:** Prototype one explicit, persistent choice with two outcomes.
- **Dependencies:** A future static inventory must confirm one suitable existing Kanto map and event hook; event/text-bank constraints and symbolic route-state semantics must be reviewed.
- **Definition of done:** Both outcomes are reachable; the player sees the disclosed log or service delay, cost-bearer, and optional scene closure before choosing; postponing stays neutral; outcomes persist; badges, shared main episodes, and League remain available; EN/ES wording matches.
- **Future runtime QA — not run:** On a disposable save copy, test ordinary save, full emulator/application shutdown, cold load, event re-entry, interruption and re-entry, and each reward exactly once if any reward exists. If an item reward exists, test a full bag and verify the item is neither lost nor duplicated.

#### The Open Channel

- **Purpose:** Show both routes affecting one shared Kanto episode after the pilot.
- **Dependencies:** The Quiet Relay outcome contract and a suitable existing Kanto scene confirmed by a future static inventory.
- **Definition of done:** The episode can start and complete from either route and neutral; an earlier choice visibly changes dialogue, relationship, or relay stewardship; any permanently closed content is optional and previewed; shared episodes, badges, and League remain available; EN/ES meaning matches.
- **Future runtime QA — not run:** On a disposable save copy, test ordinary save, full emulator/application shutdown, cold load, event re-entry, interruption and re-entry, and any reward exactly once. If an item reward exists, test a full bag and verify the item is neither lost nor duplicated.

### Out of scope

No Kanto implementation, ROM patch, save modification, fixed numeric IDs, forced betrayal, ranks, reputation system, Pokémon theft, or Sevii Islands requirement. Optional permanent consequences remain proposals pending separate review. This document does not claim compatibility with old saves or completed runtime tests.

### Acknowledgement

Special thanks to [DragonsDen and the Pokémon Edición Team Rocket team](https://whackahack.com/foro/threads/30-9-2026-pokemon-edicion-team-rocket-4-regiones-kanto-archi7-johto-y-hoenn.65493/) for inspiring our approach to Kanto's characters and storytelling. The characters and plot proposed here are original.

## Español

### Dirección

- Preservar la historia establecida de HeartGold/SoulSilver en Johto. Los anticipos serán opcionales y no sustituirán su desenlace actual.
- Después de la Liga de Johto, ofrecer una elección explícita entre colaborar con una célula local del Team Rocket, oponerse a su actividad local o posponer la decisión. Las acciones anteriores nunca asignan una ruta automáticamente.
- Mantener ambas rutas en un Kanto compartido. Las decisiones pueden persistir y cerrar permanentemente escenas o aliados opcionales tras una advertencia previa. Las ocho medallas de Kanto, los episodios principales compartidos y la Liga de Kanto siguen disponibles en ambas rutas.
- Dar a Kanto ocho medallas, Alto Mando y Campeón propios, separados de Johto.
- Tratar como propuesta que una partida antigua sin elección de ruta entre en estado neutral. La compatibilidad y la migración no están verificadas.

### Personajes provisionales

| Personaje | Motivación y tensión |
| --- | --- |
| **Nara** | Técnica de radio viajera de Johto que quiere que las comunidades conserven un canal de emergencia fiable. Puede reparar equipos para ambos lados, pero no considera que reparar implique ceder el control de la red. |
| **Ciro** | Enlace Rocket local que cree que su célula puede recuperar servicios descuidados. Su argumento práctico tiene valor, pero minimiza los riesgos del control centralizado y la historia coercitiva de Rocket. |
| **Sena** | Organizadora de una radio comunitaria que quiere que los vecinos decidan quién transmite y cuándo. Se opone a la coerción, no a toda persona que haya trabajado con Rocket. |
| **Tali** | Operadora voluntaria de una aldea remota de Kanto que necesita avisos de seguridad fiables. La reparación comunitaria más lenta le cuesta un viaje adicional; la reparación Rocket más rápida expone los horarios de los mensajeros. |

Son nombres originales provisionales, no personajes canónicos ni nombres definitivos.

### Arco compartido y elección piloto

Un repetidor averiado opcional de Johto capta un fragmento de una transmisión de Kanto. Después de la Liga de Johto, Nara presenta el repetidor averiado de Kanto. Ciro y Sena explican sus planes; el jugador puede elegir uno o marcharse y volver. Ambas rutas visitan los mismos pueblos, servicios, episodios principales, recorrido de ocho medallas y Liga de Kanto independiente. El estado de ruta cambia contactos, diálogos y quién mantiene visiblemente el repetidor.

La misión piloto, **El repetidor silencioso**, presenta un dilema concreto antes de confirmar:

- **Apoyar a Ciro:** Ofrece un transmisor inmediato si el jugador comparte el registro de rutas y horarios de los mensajeros. Esto expone a los contactos de Nara a presiones. El repetidor vuelve antes y Tali recibe su aviso previsto, pero los mensajeros dejan de confiar a Nara sus rutas; se cierra permanentemente una escena opcional de testimonio.
- **Apoyar a Sena:** Protege el registro y organiza una reparación comunitaria más lenta. Los contactos de Nara conservan su privacidad, pero Tali pierde un aviso de seguridad no urgente y hace un viaje adicional. Tras la negativa se cierra permanentemente el informe opcional del depósito de Ciro.
- **Posponer:** No se selecciona ninguna ruta y el repetidor queda sin resolver. La misión sigue disponible; el aviso de Tali queda pendiente.

Antes de elegir, el jugador conoce quién asume cada coste y qué escena opcional puede cerrarse. El estado del repetidor y la consecuencia de contenido opcional persisten en escenas compartidas posteriores y tras volver a entrar. Ningún desenlace afecta las medallas, episodios principales compartidos ni el acceso a la Liga. Sigue sin decidirse si una reconciliación futura puede reabrir una escena opcional cerrada. No se propone una traición forzada.

### Decisiones y protecciones de progresión

| Situación | Propuesta | Protección |
| --- | --- | --- |
| Una partida antigua no tiene elección de ruta | Interpretarla como neutral sin reiniciar el progreso existente. | Solo es una propuesta de compatibilidad; el formato de guardado y la migración siguen sin verificarse. |
| El jugador pospone | Mantener la ruta neutral y la misión disponible. | Sin afiliación automática ni penalización de la ruta principal. |
| El jugador elige una ruta | Registrar la decisión explícita y reflejarla en escenas compartidas posteriores. | Tras una advertencia pueden cerrarse aliados o escenas opcionales; medallas, episodios principales compartidos y Liga siguen disponibles. |
| Medallas y Liga de Kanto | Usar el mismo recorrido de ocho medallas y el desafío propio del Alto Mando y Campeón en ambas rutas. | Ninguna opción de ruta concede, quita o bloquea medallas ni acceso a la Liga. |

### Tres primeras fichas de misión propuestas

Son encargos futuros, no tareas de implementación aprobadas. No se asignan IDs de mapa, script, flag o misión.

#### Ecos desde Johto

- **Objetivo:** Anticipar la historia de forma opcional sin alterar el desenlace Rocket establecido en Johto.
- **Dependencias:** Un inventario estático futuro debe identificar una escena existente adecuada en Johto y una forma segura de volver; el texto EN/ES debe estar alineado.
- **Criterios de finalización:** El indicio se puede perder sin bloquear Kanto; la reentrada no duplica el evento ni atrapa al jugador; ambos idiomas transmiten el mismo indicio. El comportamiento con partidas antiguas sigue sin verificar y no se promete.
- **QA de runtime futuro — no ejecutado:** En una copia desechable de la partida, probar guardado ordinario, cierre total del emulador/aplicación, carga en frío, reentrada al evento, interrupción y reentrada, y cualquier recompensa exactamente una vez. Si hay una recompensa de objeto, probar la bolsa llena y verificar que no se pierda ni se duplique.

#### El repetidor silencioso

- **Objetivo:** Probar una elección explícita y persistente con dos desenlaces.
- **Dependencias:** Un inventario estático futuro debe confirmar un mapa y enganche de evento existentes en Kanto; deben revisarse los límites de eventos/banco de texto y la semántica simbólica del estado de ruta.
- **Criterios de finalización:** Se alcanzan ambos desenlaces; antes de elegir se muestra la divulgación del registro o la demora del servicio, quién asume el coste y qué escena opcional puede cerrarse; posponer mantiene el estado neutral; los desenlaces persisten; medallas, episodios principales compartidos y Liga siguen disponibles; EN/ES coincide.
- **QA de runtime futuro — no ejecutado:** En una copia desechable de la partida, probar guardado ordinario, cierre total del emulador/aplicación, carga en frío, reentrada al evento, interrupción y reentrada, y cada recompensa exactamente una vez si existiera. Si hay una recompensa de objeto, probar la bolsa llena y verificar que no se pierda ni se duplique.

#### El canal abierto

- **Objetivo:** Mostrar cómo ambas rutas afectan a un episodio compartido de Kanto tras la misión piloto.
- **Dependencias:** El contrato de resultados de El repetidor silencioso y una escena existente de Kanto confirmada por un inventario estático futuro.
- **Criterios de finalización:** El episodio puede iniciarse y completarse desde ambas rutas y desde neutral; una decisión previa cambia visiblemente diálogos, relaciones o gestión del repetidor; el contenido cerrado permanentemente es opcional y se anticipa; episodios compartidos, medallas y Liga siguen disponibles; el texto EN/ES mantiene el mismo sentido.
- **QA de runtime futuro — no ejecutado:** En una copia desechable de la partida, probar guardado ordinario, cierre total del emulador/aplicación, carga en frío, reentrada al evento, interrupción y reentrada, y cualquier recompensa exactamente una vez. Si hay una recompensa de objeto, probar la bolsa llena y verificar que no se pierda ni se duplique.

### Fuera de alcance

Sin implementación de Kanto, parche ROM, cambios de partidas, IDs numéricos fijos, traición forzada, rangos, sistema de reputación, robo de Pokémon ni requisito de Islas Sete. Las consecuencias permanentes opcionales siguen siendo propuestas pendientes de revisión separada. Este documento no afirma compatibilidad con partidas antiguas ni pruebas de runtime completadas.

### Agradecimientos

Agradecimiento especial a [DragonsDen y al equipo de Pokémon Edición Team Rocket](https://whackahack.com/foro/threads/30-9-2026-pokemon-edicion-team-rocket-4-regiones-kanto-archi7-johto-y-hoenn.65493/) por inspirar nuestro enfoque de los personajes y la narrativa de Kanto. Los personajes y la trama de esta propuesta son originales.
