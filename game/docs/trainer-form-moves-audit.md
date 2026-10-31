# Alternate-form trainer moves audit

## English

### Finding

The eight implicit alternate-form trainer members currently have empty wiki `move_ids`. Their exact Alpha 2 base and mapped-form learnset records all produce four-move candidates at the trainer level, so the empty arrays differ from every candidate. Six mapped form records have the same learnset as their base species. The two Wormadam mapped form records differ from the base record in the fourth move.

These are **data candidates, not confirmed battle movesets**. The local reference used by the project maps forms through `ResolveMonForm` and states that the trainer form is set after `CreateMon`. The exact `CreateMon`/trainer move-initialization routine for this target is not present in the checkout, and no exact-target battle was run. If move initialization occurs inside `CreateMon` before the form setter, the base candidate is the relevant hypothesis; if it uses the mapped personal record after resolving form, the mapped-form candidate is the hypothesis. The local evidence does not decide between them.

### Reproducible method

From `game/`, set `CLEAN_ROM` to the already available clean source and run:

```sh
CLEAN_ROM="/path/to/your/clean/HeartGold-USA.nds"
node tools/audit_trainer_forms_moves.cjs --source "$CLEAN_ROM"
```

The tool checks source, delta, target, trainer-party, trainer-header, learnset, and wiki-data hashes before consuming those datasets; reconstructs Alpha 2 in memory; decodes `a/0/3/3`; and joins each of the eight raw trainer positions to the wiki entry. It rejects absent or malformed Plus levels (must be an integer from 1 to 100 and at least the normal level), and missing/malformed localized move catalog entries. It applies the project’s ordered learnset rule (ignore level entries above the trainer level, skip repeated move IDs, keep the latest four). It writes the JSON audit only to stdout.

| Evidence | SHA-256 |
| --- | --- |
| Clean HeartGold USA source | `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105` |
| Alpha 2 delta | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` |
| Reconstructed Alpha 2 target | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` |
| Trainer headers NARC `a/0/5/5` | `ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142` |
| Trainer parties NARC `a/0/5/6` | `114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc` |
| Learnset NARC `a/0/3/3` | `d22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b` |
| Wiki data `docs/wiki-data.json` | `461c3671db3babfa672623cc511593f2b46f83ae17a73326373d557af485868c` |

### Member-by-member candidates

Move names below come from the exact Alpha 2 wiki move catalog. `Wiki moves` is empty for every row; `base` and `mapped` show distinct static candidates, not selected runtime results. Normal and Plus lists are shown separately where they differ.

| Trainer / slot | Pokémon form; level (Plus) | Learnset record | Base candidate | Mapped-form candidate |
| --- | --- | ---: | --- | --- |
| Mickey / 0 | Pinsir 1; 20 (22) | 127 (resolver fallback to base) | Normal: 20 Bind, 69 Seismic Toss, 106 Harden, 279 Revenge. Plus: 69 Seismic Toss, 106 Harden, 279 Revenge, 280 Brick Break. | Same as base: resolver maps form 1 to record 127. |
| Ed / 1 | Wormadam 1; 53 (59) | 499 | 175 Flail, 213 Attract, 94 Psychic, 437 Leaf Storm. | 175 Flail, 213 Attract, 94 Psychic, 90 Fissure. |
| Ed / 2 | Wormadam 2; 53 (59) | 500 | 175 Flail, 213 Attract, 94 Psychic, 437 Leaf Storm. | 175 Flail, 213 Attract, 94 Psychic, 442 Iron Head. |
| Horton / 0 | Rotom 1; 57 (63) | 503 | 466 Ominous Wind, 164 Substitute, 268 Charge, 435 Discharge. | Same as base. |
| Horton / 1 | Rotom 2; 57 (63) | 504 | 466 Ominous Wind, 164 Substitute, 268 Charge, 435 Discharge. | Same as base. |
| Horton / 2 | Rotom 3; 57 (63) | 505 | 466 Ominous Wind, 164 Substitute, 268 Charge, 435 Discharge. | Same as base. |
| Horton / 3 | Rotom 4; 57 (63) | 506 | 466 Ominous Wind, 164 Substitute, 268 Charge, 435 Discharge. | Same as base. |
| Horton / 4 | Rotom 5; 57 (63) | 507 | 466 Ominous Wind, 164 Substitute, 268 Charge, 435 Discharge. | Same as base. |

The existing form resolver maps Wormadam forms 1–2 to personal records 499–500 and Rotom forms 1–5 to records 503–507. Pinsir form 1 falls back to record 127. Alpha 2 contains all mapped records in the exact NARC. Comparing the full records shows Pinsir and all five Rotom records equal their base record; Wormadam records 499 and 500 are distinct and yield the alternate fourth moves shown above.

### Limits

- 8/8 wiki entries are still `alternate_form_pending` with empty move arrays; this audit does not modify them.
- Static candidates differ from the displayed empty arrays, but the target routine’s choice of base versus mapped-form learnset is unverified.
- Runtime behavior of the seven separate explicit records containing four zero move slots remains unresolved. This report does not close those cases or accept all trainer movesets.

## Español

### Hallazgo

Los ocho miembros de entrenadores con forma alternativa y movimientos implícitos tienen ahora `move_ids` vacío en la wiki. Los learnsets exactos de Alfa 2, tanto el de especie base como el de la forma mapeada, producen candidatos de cuatro movimientos al nivel del entrenador; por eso los arrays vacíos difieren de todos los candidatos. Seis registros de forma mapeada tienen el mismo learnset que la especie base. Los dos registros de Wormadam sí difieren en el cuarto movimiento.

Son **candidatos de datos, no movimientos confirmados en combate**. La referencia local que usa el proyecto mapea las formas mediante `ResolveMonForm` e indica que la forma del entrenador se asigna después de `CreateMon`. El checkout no contiene la rutina exacta de creación/inicialización de movimientos de este target y no se ejecutó un combate con Alfa 2. Si la inicialización sucede dentro de `CreateMon`, antes de asignar la forma, la hipótesis pertinente es el candidato base; si usa el registro personal mapeado tras resolver la forma, la hipótesis es el candidato de forma. La evidencia local no permite decidir entre ambos.

### Método reproducible

Desde `game/`, define `CLEAN_ROM` con la ruta de la fuente limpia ya disponible y ejecuta:

```sh
CLEAN_ROM="/path/to/your/clean/HeartGold-USA.nds"
node tools/audit_trainer_forms_moves.cjs --source "$CLEAN_ROM"
```

La herramienta comprueba los hashes de fuente, delta, target, equipos, cabeceras, learnsets y datos de wiki antes de consumir esos datasets; reconstruye Alfa 2 en memoria; decodifica `a/0/3/3`; y enlaza cada una de las ocho posiciones crudas del entrenador con su entrada de la wiki. Rechaza niveles Plus ausentes o malformados (entero entre 1 y 100 y no menor al nivel normal), así como entradas de movimientos localizadas ausentes o malformadas. Aplica la regla ordenada del proyecto: descarta entradas por encima del nivel, omite IDs repetidos y conserva los cuatro últimos movimientos. Solo escribe el JSON de auditoría por stdout.

| Evidencia | SHA-256 |
| --- | --- |
| Fuente HeartGold USA limpia | `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105` |
| Delta Alfa 2 | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` |
| Target Alfa 2 reconstruido | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` |
| NARC de cabeceras `a/0/5/5` | `ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142` |
| NARC de equipos `a/0/5/6` | `114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc` |
| NARC de learnsets `a/0/3/3` | `d22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b` |
| Datos de wiki `docs/wiki-data.json` | `461c3671db3babfa672623cc511593f2b46f83ae17a73326373d557af485868c` |

### Candidatos por miembro

Los nombres siguientes proceden del catálogo de movimientos exacto de Alfa 2. `Movimientos en wiki` está vacío en todas las filas; `base` y `forma mapeada` son candidatos estáticos distintos, no resultados elegidos en runtime. Se separan normal y Plus cuando difieren.

| Entrenador / slot | Pokémon, forma; nivel (Plus) | Registro learnset | Candidato base | Candidato de forma mapeada |
| --- | --- | ---: | --- | --- |
| Mickey / 0 | Pinsir 1; 20 (22) | 127 (fallback del resolver a base) | Normal: 20 Atadura, 69 Sísmico, 106 Fortaleza, 279 Desquite. Plus: 69 Sísmico, 106 Fortaleza, 279 Desquite, 280 Demolición. | Igual a base: el resolver asigna la forma 1 al registro 127. |
| Ed / 1 | Wormadam 1; 53 (59) | 499 | 175 Azote, 213 Atracción, 94 Psíquico, 437 Lluevehojas. | 175 Azote, 213 Atracción, 94 Psíquico, 90 Fisura. |
| Ed / 2 | Wormadam 2; 53 (59) | 500 | 175 Azote, 213 Atracción, 94 Psíquico, 437 Lluevehojas. | 175 Azote, 213 Atracción, 94 Psíquico, 442 Cabeza de Hierro. |
| Horton / 0 | Rotom 1; 57 (63) | 503 | 466 Viento Aciago, 164 Sustituto, 268 Carga, 435 Chispazo. | Igual a base. |
| Horton / 1 | Rotom 2; 57 (63) | 504 | 466 Viento Aciago, 164 Sustituto, 268 Carga, 435 Chispazo. | Igual a base. |
| Horton / 2 | Rotom 3; 57 (63) | 505 | 466 Viento Aciago, 164 Sustituto, 268 Carga, 435 Chispazo. | Igual a base. |
| Horton / 3 | Rotom 4; 57 (63) | 506 | 466 Viento Aciago, 164 Sustituto, 268 Carga, 435 Chispazo. | Igual a base. |
| Horton / 4 | Rotom 5; 57 (63) | 507 | 466 Viento Aciago, 164 Sustituto, 268 Carga, 435 Chispazo. | Igual a base. |

El resolver existente asigna Wormadam formas 1–2 a los registros personales 499–500 y Rotom formas 1–5 a 503–507. Pinsir forma 1 recae en el registro 127. Alfa 2 contiene todos esos registros en el NARC exacto. La comparación completa muestra que Pinsir y los cinco registros Rotom son idénticos al registro base; los registros 499 y 500 de Wormadam son distintos y producen los cuartos movimientos alternativos indicados.

### Límites

- Las 8 entradas de la wiki siguen como `alternate_form_pending` y con arrays vacíos; esta auditoría no las modifica.
- Los candidatos estáticos difieren de los arrays vacíos mostrados, pero no está verificado qué learnset elige la rutina del target: base o forma mapeada.
- Sigue sin resolverse el comportamiento en runtime de los siete registros explícitos separados que guardan cuatro huecos de movimiento a cero. Este informe no los cierra ni acepta todos los movimientos de entrenadores.
