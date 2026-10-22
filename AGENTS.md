# Repository instructions

## English

- This checkout initially manages Pokémon Ultimate Gold. Do not present it as the imported game source until issue #1 is accepted.
- The import review branch stages the scoped technical snapshot under `game/`. Read `game/AGENTS.md` and `game/CONTRIBUTING.md` before changing that subtree; run its build/tests from `game/`. Preserve root management files and the distinction between sanitized exports and original evidence. Experimental editor/Kris engine sources are not included.
- GitHub Issues and Projects are the operational source of truth. The existing game chat owns technical sprint planning; this chat owns tracking. Record proposals as proposals until confirmed.
- Each task needs one accountable role, an outcome, acceptance criteria, evidence and blockers. Limit technical work in progress to three items. Workers are temporary assignments, not fictional employees or GitHub accounts.
- Mirror the current state in issue labels (`Pendiente`, `En curso`, `Revisión`, and other existing board states when needed). Projects had intermittent load failures during setup: keep issue tracking usable, and verify a fresh board load before declaring the UI reliable. Do not repeatedly re-add existing cards; check issue membership first.
- Never close playable acceptance on the strength of static checks alone. Preserve exact build hashes and distinguish automated checks, native gameplay and human acceptance.
- Do not commit ROMs, saves, emulator states, archives, secrets or personal information. Review files explicitly; never stage all active game work from another chat.
- Use English for code/comments and English followed by Spanish for documentation. Keep human-facing issue titles and board labels in plain Spanish.
- Validate documentation links and run `git diff --check`. After code edits, run relevant tests and Argot only if installed and `.argot/scorer-config.json` exists; do not initialize Argot automatically.
- Communications: use GitHub for project status. External messaging requires explicit user authorization.
- TODO: add build/test commands when the technical source is imported. No application dependencies are needed for this initial documentation.

### Coordination and completion

- Reuse the existing issue or proposal ID for every handoff. Record the owner, source revision, expected outcome and acceptance criteria. An acknowledgement must identify the receiving chat/agent and its state; sending a message alone means `sent`, not `accepted` or `started`. Report model/reasoning only when verified, otherwise mark them unverified.
- Distinguish queued, accepted, running, review, completed and blocked work; map these to existing board labels without creating a second tracker. Completion needs the artifact, checked revision/build hash, relevant verification and remaining limitations. Record skipped checks and keep automated, native and human acceptance separate. Substantial changes need independent review before integration.
- Keep at most three technical tasks in progress and two active direct children per supervisor, within the runtime's actual concurrency/depth limits. Studies and future-sprint proposals remain separate from the playable delivery. Check quota before expanding delegation or escalating; define a finite task scope and retain resources for verification/handoff. Quota thresholds guide admission, not a guaranteed spending cap or an automatic model switch.
- On request, refresh the coordination tree from live chat/agent states and include the observation time, functions, counts and unverified facts. Keep routine worker acknowledgements internal; notify the user about meaningful milestones, blockers or one required decision at a time. Evaluate the process using real handoff receipts, acceptance evidence and reopened defects; do not self-certify a numerical quality score.

## Español

El chat técnico define los sprints; este chat mantiene el seguimiento. Cada tarea necesita responsable, resultado verificable, evidencia y bloqueos. Máximo tres tareas técnicas activas. La persona revisora revisa la experiencia jugable; no confundir una prueba parcial con aceptación de release. Mantener privado el repo y el tablero hasta la auditoría previa a publicación. Usar GitHub para el estado del proyecto; la mensajería externa requiere autorización explícita.

### Coordinación y cierre

- Reutilizar el identificador de la issue o propuesta en cada traspaso. Registrar responsable, revisión de origen, resultado esperado y aceptación. El acuse debe identificar al chat/agente receptor y su estado; enviar un mensaje significa «enviado», no «aceptado» ni «iniciado». Indicar modelo/reasoning sólo si están verificados; en caso contrario, marcarlos como no verificados.
- Distinguir trabajo en cola, aceptado, en curso, en revisión, completado y bloqueado; reflejarlo con las etiquetas existentes, sin otro sistema de seguimiento. El cierre requiere artefacto, revisión/hash de build comprobado, verificación pertinente y límites pendientes. Registrar pruebas omitidas y separar aceptación automatizada, nativa y humana. Los cambios sustanciales necesitan revisión independiente antes de integrarse.
- Máximo tres tareas técnicas en curso y dos hijos directos activos por supervisor, dentro de los límites reales de concurrencia/profundidad. Separar estudios y propuestas futuras de la entrega jugable. Consultar cuota antes de ampliar delegación o escalar; acotar el encargo y reservar recursos para verificar y entregar. Los umbrales de cuota orientan la admisión: no garantizan un límite de gasto ni cambian automáticamente el modelo.
- Al pedirlo, actualizar el árbol con estados reales de chats/agentes, hora de observación, funciones, recuentos y datos sin verificar. Mantener internos los acuses rutinarios; comunicar hitos relevantes, bloqueos o una decisión necesaria cada vez. Evaluar el método con recibos reales de traspaso, evidencias de aceptación y defectos reabiertos; no autoasignarse una nota de calidad.
