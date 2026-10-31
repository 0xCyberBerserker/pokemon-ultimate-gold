# Type-chart static audit / Auditoría estática de la tabla de tipos

## English

The clean HeartGold USA source SHA-256 is `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`. The audit reconstructs both targets in memory, then reads the type-chart pointer at `0x0225204C` and chart data in overlay 18.

| Target | Target SHA-256 | Delta SHA-256 | Unique pairs | Static reference differences |
|---|---|---|---:|---:|
| Alpha 2 | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` | 324 | 0 |
| Kris Sprint 2 | `fc0bf04ec57fa30121fdb50a4da3a94c300fc0abe171c96b3e60bc2e674baff4` | `8b99a32c572469985158690ee00251d842e43f1fdb4cb69777e3c6ccd1aa3f99` | 324 | 0 |

The ordered streams match. Pair values have zero differences from the pinned Pokémon Showdown reference (commit `7777a7949138885a6242f828b155036ad5768068`; its SHA-256 is recorded in the JSON report).

The stream contains `FE FE 00` at record index 322, followed by `(0, 7, 0)` and `(1, 7, 0)` before the `[FF, FF, FF]` terminator at record index 325 (stream byte offset 975). The extractor preserves all records in order. The exact meaning of `FE FE 00` in this HGSS consumer is **unverified**; the two later values are present in the static stream, but their applicability to ordinary battles is also **unverified**. The comparison does not establish battle behavior.

Reproduce from the `game/` directory with the same hash-pinned inputs:

```sh
node tools/extract_typechart.cjs --source <clean-HeartGold-USA.nds> --reference <pinned-typechart.ts>
```

The complete sanitized streams, decoded pairs, hashes, and differences are in [`typechart-static-audit.json`](typechart-static-audit.json). The check used the existing vendored VCDIFF engine and wrote no reconstructed ROM. No emulator or gameplay was used.

## Español

El SHA-256 de la ROM limpia HeartGold USA es `65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`. La auditoría reconstruye ambos destinos solo en memoria y lee el puntero de la tabla en `0x0225204C` junto con los datos del overlay 18.

| Destino | SHA-256 del destino | SHA-256 del delta | Parejas únicas | Diferencias estáticas |
|---|---|---|---:|---:|
| Alfa 2 | `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6` | `1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045` | 324 | 0 |
| Kris Sprint 2 | `fc0bf04ec57fa30121fdb50a4da3a94c300fc0abe171c96b3e60bc2e674baff4` | `8b99a32c572469985158690ee00251d842e43f1fdb4cb69777e3c6ccd1aa3f99` | 324 | 0 |

Los streams ordenados coinciden. Los valores de las parejas no presentan diferencias frente a la referencia fijada de Pokémon Showdown (commit `7777a7949138885a6242f828b155036ad5768068`; el JSON registra su SHA-256).

El stream contiene `FE FE 00` en el índice 322, seguido de `(0, 7, 0)` y `(1, 7, 0)` antes del terminador `[FF, FF, FF]` en el índice 325 (offset 975 del stream). El extractor conserva todos los registros en orden. El significado exacto de `FE FE 00` en este consumidor de HGSS queda **sin verificar**; los dos valores posteriores aparecen en el stream estático, pero tampoco se ha verificado su aplicación en combates ordinarios. La comparación no demuestra el comportamiento del combate.

Para reproducir desde `game/`, usa las mismas fuentes verificadas por hash:

```sh
node tools/extract_typechart.cjs --source <clean-HeartGold-USA.nds> --reference <pinned-typechart.ts>
```

El JSON incluye los streams sanitizados completos, las parejas decodificadas, los hashes y las diferencias. Se usó el motor VCDIFF ya incluido y no se escribió ninguna ROM reconstruida. No se usaron emulador ni gameplay.
