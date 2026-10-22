# Optional convenience kit audit / Auditoría del kit opcional

## English

This is an inventory, not an implementation request. It separates reusable native behavior
already documented from a future optional kit. No cheat phrase, new NPC script, or ROM change was
created here.

| Feature | Item ID / range | Evidence | Current status |
|---|---:|---|---|
| Rare Candy reuse | 50 | Sacred Gold Plus source `features/caramelle`; party-menu hook; selector remains available while quantity is greater than zero and rejects level 100 | reusable while stock remains; not infinite |
| Repel | 79; Super Repel 76; Max Repel 77 | Plus source has a repel re-arm/fix verifier and native field logic | reusable behavior documented; no infinite distribution found |
| Healing party | Potion 17, Full Heal 27, Full Restore 23, Max Potion 24, Revive 28, Max Revive 29 | item constants only in the inspected local sources | no native infinite-heal NPC/tool found |
| Berries | 149–212 (`CHERI_BERRY`…`ROWAP_BERRY`) | `constants/items.h`; item-ball/gift references include ordinary berries | no global/infinite berry source found |
| TM refill | 113 in isolated candidate `6e73ab1b…` | `docs/qa-native-tm.json`: native use, repeat, NPC gift, save/restart partial pass | isolated candidate only; not claimed in public `fix1` |

The 1.2 Plus build order explicitly includes Rare Candy reuse and capped gifts. The capped-gifts
code changes the behavior when a reward cannot fit; it does not establish an infinite source for
Rare Candy, Repels, healing items, or berries. A normal item gift and a reusable inventory item
must remain separate claims.

Team Rocket portrait joins were verified from the target assets: male Rocket sprite `M222` and
female Rocket sprite `W221`; Giovanni uses trainer class 124. These are portrait facts; they do
not prove a new event NPC or an optional kit.
Most Rocket IDs have one mapped location in the trainer-location audit; IDs 221, 229 and 262 had
no stable location join in that pass.

The isolated candidate is present locally at
`night-sprint/internal/tm-refill-item/tm-refill-npc-candidate.nds`, SHA-256
`6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`. Its documented TM refill
gift is one-time; this audit does not classify it as an infinite kit.

Bounded negative result: the inspected Plus source, local documentation and current project
reports contain no designated optional-kit NPC phrase or verified distribution table for an
infinite party heal, infinite Rare Candy, infinite Repel or infinite berries. This is “not found
in local inspected sources”, not a claim about every upstream/community document.

## Español

Esto es un inventario, no una implementación. Separa funciones nativas ya documentadas de un kit
opcional futuro. Aquí no se creó una frase de cheat, NPC nuevo ni cambio de ROM.

| Función | ID / rango | Evidencia | Estado actual |
|---|---:|---|---|
| Reutilizar Caramelo Raro | 50 | Fuente Plus `features/caramelle`; hook del menú de equipo y contrato de pruebas | función heredada de Plus; no es regalo infinito |
| Repelente | 79; Super 76; Máximo 77 | Fuente Plus con reactivación y verificador de campo | comportamiento reutilizable documentado; no hay distribución infinita encontrada |
| Curar equipo | Poción 17, Cura Total 27, Restaurar Todo 23, Máxima 24, Revivir 28, Máximo Revivir 29 | constantes locales inspeccionadas | no se encontró herramienta/NPC nativo infinito |
| Bayas | 149–212 (`CHERI_BERRY`…`ROWAP_BERRY`) | `constants/items.h` y regalos/objetos normales | no se encontró fuente global/infinita |
| Recarga de MT | 113 en candidata aislada `6e73ab1b…` | `docs/qa-native-tm.json`: uso, repetición, NPC y guardado parcial superados | sólo candidata aislada; no se afirma en `fix1` |

Resultado negativo acotado: no apareció una frase de NPC ni tabla de distribución verificada para
curación, Caramelo Raro, Repelente o bayas infinitos. Significa «no encontrado en las fuentes
locales inspeccionadas», no inexistencia global.

### Sources / Fuentes

- Plus source pin: commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`.
- `night-sprint/sources/sacred-gold-plus/source/features/caramelle/sorgenti/caramelle.c`.
- `night-sprint/sources/sacred-gold-plus/source/features/borsa/sorgenti/borsa.c`.
- `night-sprint/engine/upstream/pokeheartgold/include/constants/items.h`.
- `night-sprint/engine/upstream/pokeheartgold/include/constants/trainers.h`.
- `project/docs/qa-native-tm.json` and `project/patches/manifest.json`.
