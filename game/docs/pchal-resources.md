# Public trainer-sheet resources / Recursos públicos de hojas

## English

This page records public leads only. It does not reproduce commissioned sheets or imply their authorship.

| Resource | What was verified | Use in this project |
| --- | --- | --- |
| [Dynamic-Calc](https://github.com/hzla/Dynamic-Calc) | Public MIT project; README documents Mastersheet mode, trainer previews and external data loading. The inspected checkout contains no Sacred Gold XLS/XLSX. | Format/context reference only; no data imported. |
| [DRAYANO companion](https://github.com/alex4woodcc/DRAYANO) | Public companion describing Pokédex, encounters and trainer views. The repository uses an external Supabase data service and does not publish the Sacred Gold sheet. | Public implementation reference only; no external service queried. |
| [pChal discussion](https://www.reddit.com/r/pchaltv/comments/1kuezj3/where_do_i_get_the_fancy-docs-pchal-uses/) | Community replies describe newer documents as commissioned for pChal's Drayano Gauntlet and pinned in a Drayano Hacks Discord channel. | Provenance lead marked pending; Discord not accessed and no author attribution asserted. |

Our useful wiki tables are therefore ROM-derived: `moves-final` contains all 15 changed active records with before/after bytes; `trainers-final` contains the 14 affected explicit members; `trainers-all-final` contains all 2086 decoded members. Members without four explicit move fields retain `move_source=implicit_learnset`; no moves are invented. Runtime battle legality remains pending.

## Español

Esta página registra sólo pistas públicas. No copia hojas encargadas ni atribuye autoría sin una fuente verificable. Dynamic-Calc documenta un modo Mastersheet y carga externa, pero no contiene un XLS/XLSX de Sacred Gold. El companion DRAYANO usa un servicio Supabase externo y tampoco publica la hoja. La discusión de Reddit remite a documentos encargados para el Drayano Gauntlet y fijados en un canal Discord; no se accedió a Discord.

Las tablas propias proceden directamente de NARC de la ROM candidata y del control Drayano: 15 registros de movimientos, 14 miembros afectados y 2086 miembros completos. Los registros sin cuatro movimientos explícitos conservan `move_source=implicit_learnset`; no se inventan ataques. La legalidad en combate sigue pendiente.
