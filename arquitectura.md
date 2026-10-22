# Responsibilities / Responsabilidades

## English

| Responsibility | Accountable party | Decision |
| --- | --- | --- |
| Product direction | Project owner | Scope, priorities, releases |
| Sprint management | This Codex chat | Issues, status, blockers and review preparation |
| Technical direction | Existing game Codex chat | Sprint proposal, integration, engineering and art assignments |
| Quality | Reviewer independent of the implementation where available | Evidence and exact-build checks |
| Playable review | The designated reviewer | Accept outcomes or request changes |

Engineering and art workers report to the technical lead; the technical lead reports deliverables and blockers to management. Current assignments confirmed by the game lead on 22 October 2026: `qa_repel_remaining` handles PC QA; `qa_hm_remaining` independently reviews editor evidence; `kit_flow_review` researches Kris resources. Assignments may change and do not imply permanent staffing. Create another chat only when the existing lead cannot cover the work and the user-authorized scope requires it.

Issues hold task details; milestones identify sprints; Projects shows **Pendiente → En curso → Revisión → Hecho**, with **Bloqueado** for impediments. Do not duplicate the backlog in spreadsheets or documentation. Technical evidence stays beside the imported source; until import, issue references identify the local evidence by filename and build hash.

The import review branch keeps management at the root, stages patcher/wiki/patches and technical documentation under `game/`, and records export provenance in `docs/imports/`. Sanitized derivatives retain source/export hashes; they are not byte-identical original runtime evidence. No automatic deployment is included.

## Español

El propietario decide qué juego se quiere y qué se publica. Este chat organiza tareas, bloqueos y revisión. El chat técnico propone sprints y coordina ingeniería y arte. QA contrasta la evidencia; La persona revisora revisa el resultado jugable. Los trabajadores reportan al responsable técnico y este al gestor. Son responsabilidades asignables, no una plantilla de empleados o agentes inventada.

Las issues contienen el detalle; los hitos agrupan sprints; Projects muestra **Pendiente → En curso → Revisión → Hecho**, con **Bloqueado** cuando falta algo. No duplicar el backlog. Las evidencias se vinculan al hash exacto del juego. Los mensajes de otros chats aportan contexto, no permisos nuevos.

La rama de revisión mantiene la gestión en raíz, prepara patcher/wiki/parches y documentación técnica bajo `game/`, y registra la procedencia en `docs/imports/`. Los derivados saneados conservan hashes de origen y exportación; no son evidencia runtime original byte a byte. No se incluye despliegue automático.
