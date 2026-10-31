# Trainer team data audit

## English

### Result

The Alpha 2 trainer data matches all **2,086 trainer/member positions** in the exact target records and the legacy source table. No mismatched positions, species, forms, levels, items, explicit move slots, invalid move IDs, or duplicate resolved moves were found. This is a static data audit; it does not confirm battle behavior.

### Method and evidence

From `game/`, run:

```sh
CLEAN_ROM="/path/to/your/clean/HeartGold-USA.nds"
node tools/audit_trainer_team_data.cjs --source "$CLEAN_ROM"
```

Set `CLEAN_ROM` locally to the already available clean ROM path. The tool reads it and the pinned delta, reconstructs the target in memory, and writes only the JSON audit result to stdout. It refuses source, delta, target, trainer NARC, legacy-table, or Alpha 1-to-Alpha 2 provenance hash mismatches. It compares trainer ID and slot one-to-one, including the raw party kind, species, form, level, item, and stored move slots. It compares every one of the 493 wiki species learnset arrays entry-by-entry with the learnset NARC extracted from exact Alpha 2, then derives implicit base-form moves from those target records. It checks the 2,086 wiki member `move_ids` and mode arrays against explicit party slots or those exact target learnsets, subject to the unresolved alternate forms noted below. The derivation applies the four-move ordering, duplicate-skip, and last-four rule used by the project data builder.

| Evidence | SHA-256 |
| --- | --- |
| Clean HeartGold USA source | `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105` |
| Alpha 2 delta | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` |
| Reconstructed Alpha 2 target | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` |
| Alpha 2 trainer headers NARC `a/0/5/5` | `ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142` |
| Alpha 2 trainer parties NARC `a/0/5/6` | `114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc` |
| Alpha 2 personal data NARC `a/0/0/2` | `5f193d2eacddf0ffef9daf7acebd35dcdb21c30f59ab497759c3b7cc335f2d40` |
| Extracted Alpha 2 learnset NARC `a/0/3/3`; also reported byte-identical between Alpha 1 and Alpha 2 | `d22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b` |
| Pinned Alpha 1/Alpha 2 build comparison report | `12f76a7c3afff0942ea7bc920fda4c0c45341c162d80f60627b8bba5787301a3` |
| Legacy trainer table `docs/trainers-all-final.json` | `ffab530d1da7789a0c00254ca1b5e1011cb12f8b4cf19421c75b8b04c121b6ce` |
| Audited wiki data `docs/wiki-data.json` | `461c3671db3babfa672623cc511593f2b46f83ae17a73326373d557af485868c` |

The legacy species and trainer exports originate from target `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`. The pinned build report compares its named Alpha 1 target (`6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`) with Alpha 2 and records their trainer header, trainer party, and learnset NARCs as byte-identical. It does **not** establish that the `fdb2…` exports came from that Alpha 1 target. Their field-by-field match to Alpha 2 comes from this audit's direct 2,086-position comparison against the reconstructed Alpha 2 trainer NARCs. Separately, this audit extracts Alpha 2's own learnset NARC and confirms all 493 wiki learnset arrays against it; it does not rely on the build report for the legacy `fdb2…` learnset lineage.

### Counts

- **2,086/2,086** trainer/member positions matched the raw Alpha 2 records and legacy table; all 737 trainers with members are represented.
- **493/493** wiki species learnset arrays match the exact Alpha 2 learnset NARC entry-by-entry; **0** learnset-array mismatches.
- **733 Pokémon members** have explicit move records: 2,932 raw move slots checked. Seven members have four zero slots; those records remain listed as explicit-empty, with no combat behavior inferred.
- **1,353 members** use implicit moves. Of these, 1,345 base-form records match the learnset-derived move IDs and order. The remaining **8 alternate-form records** remain unresolved in the wiki data: Pinsir form 1, Wormadam forms 1–2, and Rotom forms 1–5.
- No repeated moves, invalid move IDs, or over-four-move results were found in checked data. 679 normal/Plus move lists differ because the modes use different levels; this is expected data, not a mismatch.
- Nine party members use an alternate form in total; one is explicit and the eight implicit cases above remain unresolved.

### Abilities and runtime limits

The exact Alpha 2 trainer override bytes and personal data yield a **derived ability slot for all 2,086 members** under the existing upstream-engine rule reference: 1,973 select slot 1 and 113 select slot 2; one requested slot 2 falls back to slot 1 because that species has no second standard ability. Slot-source counts are 1,948 class defaults, 109 party-forced slot 2, 24 party-forced slot 1, and 5 gender-override cases. Every derived ability ID exists in the local ability catalog.

The wiki currently has no per-trainer-member ability fields. These values are derivations from exact ROM records plus a referenced engine rule, **not Alpha 2 runtime-confirmed behavior**. No exact-target battle execution or local engine-routine inspection was performed. Likewise, the 1,345 implicit moves are learnset-derived and algorithm-checked, not confirmed in battle. The eight alternate-form moves and combat interpretation of the seven all-zero explicit records are left open.

### Checks

`node --test tests/test_trainer_team_data.cjs tests/test_trainer_ability_analysis.cjs`: **11 passed**. The full mass audit returned **0 discrepancies**. `git diff --check` passed.

## Español

### Resultado

Los datos de equipos de Alfa 2 coinciden con las **2.086 posiciones entrenador/miembro** de los registros del target exacto y de la tabla de origen heredada. No aparecieron diferencias de posición, especie, forma, nivel, objeto, huecos de movimientos explícitos, IDs de movimiento inválidos ni movimientos resueltos duplicados. Es una auditoría estática; no confirma el comportamiento en combate.

### Método y evidencia

Desde `game/`, ejecutar:

```sh
CLEAN_ROM="/path/to/your/clean/HeartGold-USA.nds"
node tools/audit_trainer_team_data.cjs --source "$CLEAN_ROM"
```

Define localmente `CLEAN_ROM` con la ruta de la ROM limpia que ya tengas disponible. La herramienta la lee junto al delta fijado, reconstruye el target en memoria y escribe únicamente el JSON de auditoría por stdout. Rechaza discrepancias en los hashes de fuente, delta, target, NARC de entrenadores, tabla heredada o informe de Alfa 1 → Alfa 2. Compara uno a uno ID de entrenador y posición, incluidos tipo del equipo, especie, forma, nivel, objeto y huecos de movimientos almacenados. Compara entrada por entrada los 493 arrays de learnset de la wiki con el NARC extraído del Alfa 2 exacto; después deriva los movimientos implícitos de forma base desde esos registros del target. Contrasta los `move_ids` y arrays por modo de los 2.086 miembros de la wiki con los huecos explícitos o learnsets exactos, con las formas alternativas pendientes indicadas más abajo. La derivación aplica orden, omisión de duplicados y conservación de los cuatro últimos movimientos, como el generador de datos del proyecto.

| Evidencia | SHA-256 |
| --- | --- |
| Fuente HeartGold USA limpia | `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105` |
| Delta Alfa 2 | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` |
| Target Alfa 2 reconstruido | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` |
| NARC de cabeceras `a/0/5/5` de Alfa 2 | `ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142` |
| NARC de equipos `a/0/5/6` de Alfa 2 | `114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc` |
| NARC de datos personales `a/0/0/2` de Alfa 2 | `5f193d2eacddf0ffef9daf7acebd35dcdb21c30f59ab497759c3b7cc335f2d40` |
| NARC de learnsets `a/0/3/3` extraído de Alfa 2; también consta idéntico entre Alfa 1 y Alfa 2 | `d22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b` |
| Informe fijado de comparación Alfa 1/Alfa 2 | `12f76a7c3afff0942ea7bc920fda4c0c45341c162d80f60627b8bba5787301a3` |
| Tabla heredada `docs/trainers-all-final.json` | `ffab530d1da7789a0c00254ca1b5e1011cb12f8b4cf19421c75b8b04c121b6ce` |
| Datos de wiki auditados `docs/wiki-data.json` | `461c3671db3babfa672623cc511593f2b46f83ae17a73326373d557af485868c` |

Las exportaciones heredadas de especies y entrenadores proceden del target `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`. El informe de build fijado compara el target Alfa 1 que identifica (`6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`) con Alfa 2 e indica que sus NARC de cabeceras, equipos y learnsets son idénticos byte a byte. **No** prueba que las exportaciones `fdb2…` procedan de ese target Alfa 1. La coincidencia campo a campo de la tabla `fdb2…` con Alfa 2 se obtiene aquí mediante comparación directa de las 2.086 posiciones con los NARC reconstruidos de Alfa 2. Además, esta auditoría extrae el NARC de learnsets del propio Alfa 2 y confirma los 493 arrays de la wiki contra él; no depende del informe para la procedencia de los learnsets heredados `fdb2…`.

### Recuentos

- **2.086/2.086** posiciones entrenador/miembro coinciden con los registros crudos de Alfa 2 y la tabla heredada; están representados los 737 entrenadores con miembros.
- **493/493** arrays de learnset de la wiki coinciden entrada por entrada con el NARC exacto de Alfa 2; hubo **0** diferencias.
- **733 Pokémon** tienen registros de movimientos explícitos: se comprobaron 2.932 huecos crudos. Siete miembros tienen los cuatro huecos a cero; se mantienen como explícitos vacíos, sin inferir su comportamiento en combate.
- **1.353 miembros** usan movimientos implícitos. De ellos, 1.345 registros de forma base coinciden en IDs y orden con los movimientos derivados del learnset. Los otros **8 registros de forma alternativa** siguen sin resolver en la wiki: Pinsir forma 1, Wormadam formas 1–2 y Rotom formas 1–5.
- No se encontraron movimientos repetidos, IDs inválidos ni resultados con más de cuatro movimientos en los datos comprobados. 679 listas normal/Plus difieren porque los modos usan niveles distintos; es un resultado esperado, no una discrepancia.
- Nueve miembros del equipo usan alguna forma alternativa; uno tiene movimientos explícitos y los ocho casos implícitos anteriores siguen pendientes.

### Habilidades y límites de runtime

Los bytes exactos de override de Alfa 2 y los datos personales producen una **habilidad derivada para cada uno de los 2.086 miembros** según la regla de motor referenciada por el extractor: 1.973 eligen el hueco 1 y 113 el hueco 2; una selección solicitada del hueco 2 recae en el hueco 1 porque la especie carece de segunda habilidad estándar. El origen del hueco es: 1.948 valores predeterminados de clase, 109 forzados al hueco 2, 24 forzados al hueco 1 y 5 casos de override de género. Todos los IDs derivados existen en el catálogo local.

La wiki no tiene campos de habilidad por miembro. Estos valores se derivan de registros exactos de ROM y una regla de motor referenciada; **no están confirmados en runtime de Alfa 2**. No se ejecutaron combates sobre el target exacto ni se inspeccionó localmente la rutina del motor. Del mismo modo, los 1.345 movimientos implícitos son derivados del learnset y comprobados por algoritmo, no confirmados en combate. Quedan pendientes los movimientos de ocho formas alternativas y la interpretación en combate de los siete registros explícitos con todos los huecos a cero.

### Comprobaciones

`node --test tests/test_trainer_team_data.cjs tests/test_trainer_ability_analysis.cjs`: **11 aprobadas**. La auditoría masiva terminó con **0 discrepancias**. `git diff --check` pasó.
