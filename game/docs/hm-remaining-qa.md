# Remaining HM native QA — FIX5

## English

**Status: PARTIAL. No remaining HM action was verified.** The emulator runner completed four FIX5 processes, but each reports `gameplay_acceptance: NOT_ASSESSED`; the captures do not show an HM action result. No HM failure is attributed.

| Action | Status | Evidence |
|---|---|---|
| Cut | PARTIAL | Native Route29 re-entry rendered the field, but the player did not reach a visible Cut object. A same-build short follow-up produced no displacement from cached position (626,402). |
| Rock Smash | PARTIAL | Native Union Cave → Route32 re-entry worked; navigation triggered a badge dialogue and a Starly battle before reaching the breakable rock. |
| Strength | PENDING | Offline source-checked fixture only; no native action run. |
| Whirlpool, Waterfall, Rock Climb | PENDING | No target fixture or native action run in this lane. |

The candidate ROM is [FIX5](<@HOME@/Games/Sacred-Gold/experiments/owned-hm/qa-kit-shop-owned-hm-paged-fix5.nds>) with SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Each run used the hash-pinned FIX5 runner (`2de6eec7…`) and DeSmuME core (`d9a441d9…`), an isolated save directory, and no runtime codes. The prepared source DSV was `e2366b6e…`; its golden source `fc9dcfa6…` remained unchanged. All generated states belong to FIX5; one same-build state was used for the short Cut follow-up.

The Cut, Rock Smash, and Strength target/entry contracts were checked against local vanilla decomp event files. They were **not** compared with the FIX5 ROM’s EVENT NARC, so exact target geometry in this candidate remains unverified. The cached `LocalFieldData.currentPosition` value is not a live actor-coordinate read. No story-access claim is made.

Key captures: [Cut re-entry](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-reentry/native_warp_arrival.png>), [Cut corrected approach](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-reentry-corrected/cut_target_approach.png>), [Cut short follow-up](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-short-approach/cut_target_preaction.png>), [Rock Smash route diversion](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-rock-smash-r32-reentry/rock_smash_action_result.png>). The JSON report records run, state, RAM, script, DSV, and screenshot hashes.

## Español

**Estado: PARCIAL. No se verificó ninguna acción MO restante.** El runner completó cuatro procesos FIX5, pero todos indican `gameplay_acceptance: NOT_ASSESSED`; las capturas no muestran el resultado de una acción MO. No se atribuye ningún fallo a las MO.

| Acción | Estado | Evidencia |
|---|---|---|
| Corte | PARCIAL | La reentrada nativa a Ruta 29 mostró el campo, pero el jugador no llegó a un objeto de Corte visible. El seguimiento corto con state del mismo build no produjo desplazamiento desde la posición guardada (626,402). |
| Golpe Roca | PARCIAL | Funcionó la reentrada nativa de Cueva Unión a Ruta 32; la navegación activó un diálogo de medalla y un combate contra Starly antes de alcanzar la roca rompible. |
| Fuerza | PENDIENTE | Sólo hay un fixture offline contrastado con la fuente local; no se ejecutó la acción nativa. |
| Torbellino, Cascada, Treparrocas | PENDIENTE | Esta lane no preparó un objetivo/fixture ni ejecutó acciones nativas para estas MO. |

La ROM candidata es [FIX5](<@HOME@/Games/Sacred-Gold/experiments/owned-hm/qa-kit-shop-owned-hm-paged-fix5.nds>), SHA-256 `2a1b5acac2e98e3bc0d18f600b7d91eb1e8298fdd436d132706e175bebf97c7f`. Cada ejecución usó el runner FIX5 fijado por hash (`2de6eec7…`) y el core DeSmuME (`d9a441d9…`), un directorio de guardado aislado y ningún código runtime. El DSV fuente preparado tenía hash `e2366b6e…`; el DSV dorado de origen `fc9dcfa6…` no cambió. Todos los estados pertenecen a FIX5; para el seguimiento corto de Corte se usó un estado del mismo build.

Los contratos de objetivo y entrada de Corte, Golpe Roca y Fuerza se comprobaron contra eventos del decomp local vanilla. **No** se compararon con el EVENT NARC de FIX5, por lo que la geometría exacta de esos objetivos en esta candidata sigue sin verificarse. `LocalFieldData.currentPosition` es una posición guardada en caché, no una lectura de coordenadas vivas del actor. No se afirma acceso natural a la historia.

Capturas clave: [reentrada de Corte](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-reentry/native_warp_arrival.png>), [aproximación corregida de Corte](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-reentry-corrected/cut_target_approach.png>), [seguimiento corto de Corte](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-cut-r29-short-approach/cut_target_preaction.png>), [desvío de Golpe Roca](<@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/hm-remaining-rock-smash-r32-reentry/rock_smash_action_result.png>). El informe JSON conserva los hashes de ejecución, estado, RAM, script, DSV y capturas.
