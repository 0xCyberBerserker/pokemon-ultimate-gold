# Stat Editor EV caps / Topes EV del Stat Editor — QA acotada

## English

The private `bd50` candidate passes two independently reviewed native boundary cases. These results cover one per-stat cap and one total-EV cap; they do not establish general editor or gameplay acceptance.

| Boundary | Native result | Rejection check |
| --- | --- | --- |
| Per-stat, Chikorita in Party slot 1 | HP EV `252 + 4` previewed and stored as `255` | Repeat at the cap made no change; Party and BPAC matched the post-confirm baseline byte-for-byte. |
| Total, synthetic Chikorita in Party slot 1 | Defense EV `8 + 4` previewed and stored as `10`; total EVs `508 → 510` | Repeat was rejected at the total cap although Defense remained below `255`; Party matched the confirmed state. |

Both cases used ROM SHA-256 `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`, core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, runner SHA-256 `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8`, and no active cheats. The per-stat auditor reports 11 completed runs out of 14 authorized invocations; the total-cap auditor reports 12 completed runs. Each independent review reproduced its frozen report and inspected the relevant preview, rejection, and visible field-return captures.

Evidence is retained outside this project repository. Per-stat auditor `qa/stat_editor_ev_cap_per_stat_bd50_acceptance.py` SHA-256 `987294c963137a41379dfb39c04fd9bfdf406ec17305c2a47a53e6d75982e85c`; acceptance JSON `qa/runs/stat-editor-ev-cap-per-stat-bd50-audit-20261022-01/acceptance.json` SHA-256 `b6e322185b4951381a44b395c6050c26a7111e172d9b3c3f3a79ad18c16ac559`; independent review `internal/ev-cap-per-stat-independent-20261022.md` SHA-256 `3d14e97c209af4f12674d723c190bca27f7d951c8b6042f7725a175f6502fba7`.

Total-cap auditor `qa/rocket_stat_editor_total_ev_limit_bd50_acceptance.py` SHA-256 `5f90b168e65c541c8a15b5e0211da8d8d30f3061b2b75586d7e444dca13b317a`; acceptance JSON `qa/runs/stat-editor-ev-limit-total-bd50-native-20261022-01/acceptance.json` SHA-256 `4134e104ced18b7391ba3b191ad3cecef9847146bedb02f793eaaee1a843ab63`; independent review `internal/ev-cap-total-independent-20261022.md` SHA-256 `b7cbeac0245a75d5525eee506680d2af2d94dbc3b4b0354507d185f4f3232871`.

Neither case includes native Save/cold persistence or battle/stat-formula validation. The fixtures carry inherited party-tail stats, so observed tail bytes are not evidence of formula correctness. Results remain experimental and do not change the downloadable Alpha 2 build. Other boundary inputs/species, normal-operation No behavior, wider Party↔PC coverage, and overall editor/gameplay acceptance remain open.

## Español

La candidata privada `bd50` pasa dos casos nativos de límite con revisión independiente. Cubren un tope por estadística y otro de EV totales; no acreditan la aceptación general del editor ni del juego.

| Límite | Resultado nativo | Comprobación de rechazo |
| --- | --- | --- |
| Por estadística, Chikorita en el espacio 1 del equipo | El EV de PS `252 + 4` mostró y almacenó `255` | Repeat en el tope no cambió nada; Party y BPAC coincidieron byte a byte con la referencia posterior a la confirmación. |
| Total, fixture sintética de Chikorita en el espacio 1 | Defensa `8 + 4` mostró y almacenó `10`; el total pasó de `508 → 510` | Repeat se rechazó al alcanzar el total máximo aunque Defensa seguía por debajo de `255`; Party coincidió con el estado confirmado. |

Ambos casos usaron la ROM SHA-256 `bd50a9d18ebc4397316a58595710ed7ed205dea839af4666af975a0373bf3164`, el core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`, el runner SHA-256 `a16d1937c267614ad88ed43fe8360f9586ca1206fd253f258a7b3ff5c86d8db8` y ningún código activo. El auditor del límite individual registra 11 ejecuciones completas de 14 invocaciones autorizadas; el auditor del límite total registra 12 ejecuciones completas. Cada revisión independiente reprodujo su informe congelado e inspeccionó la vista previa, el rechazo y el regreso visible al campo.

La evidencia se conserva fuera de este repositorio. Auditor individual `qa/stat_editor_ev_cap_per_stat_bd50_acceptance.py`, SHA-256 `987294c963137a41379dfb39c04fd9bfdf406ec17305c2a47a53e6d75982e85c`; JSON de aceptación `qa/runs/stat-editor-ev-cap-per-stat-bd50-audit-20261022-01/acceptance.json`, SHA-256 `b6e322185b4951381a44b395c6050c26a7111e172d9b3c3f3a79ad18c16ac559`; revisión independiente `internal/ev-cap-per-stat-independent-20261022.md`, SHA-256 `3d14e97c209af4f12674d723c190bca27f7d951c8b6042f7725a175f6502fba7`.

Auditor del límite total `qa/rocket_stat_editor_total_ev_limit_bd50_acceptance.py`, SHA-256 `5f90b168e65c541c8a15b5e0211da8d8d30f3061b2b75586d7e444dca13b317a`; JSON de aceptación `qa/runs/stat-editor-ev-limit-total-bd50-native-20261022-01/acceptance.json`, SHA-256 `4134e104ced18b7391ba3b191ad3cecef9847146bedb02f793eaaee1a843ab63`; revisión independiente `internal/ev-cap-total-independent-20261022.md`, SHA-256 `b7cbeac0245a75d5525eee506680d2af2d94dbc3b4b0354507d185f4f3232871`.

Ningún caso incluye persistencia mediante Save/carga fría ni validación de combate o fórmula de estadísticas. Las fixtures conservan estadísticas de cola heredadas; esos bytes observados no prueban la fórmula. Los resultados siguen siendo experimentales y no cambian la descarga de Alpha 2. Siguen abiertos otros valores/especies, la rama No de operaciones normales, una cobertura más amplia de Party↔PC y la aceptación general del editor/juego.
