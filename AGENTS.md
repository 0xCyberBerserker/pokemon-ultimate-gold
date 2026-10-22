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

## Español

El chat técnico define los sprints; este chat mantiene el seguimiento. Cada tarea necesita responsable, resultado verificable, evidencia y bloqueos. Máximo tres tareas técnicas activas. La persona revisora revisa la experiencia jugable; no confundir una prueba parcial con aceptación de release. Mantener privado el repo y el tablero hasta la auditoría previa a publicación. Usar GitHub para el estado del proyecto; la mensajería externa requiere autorización explícita.
