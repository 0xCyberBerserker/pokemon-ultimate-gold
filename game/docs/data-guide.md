# Data guide / Guía de datos

## English

Our tables describe the exact `fdb2fc…` source target behind the current Ultimate Gold alpha 1
output (`6e73ab…`), not an expanded Pokédex. Combat data is read from the ROM; PokeAPI is used only
for names, localisation and reference flavor text.

| Dataset | Content | Confidence |
| --- | --- | --- |
| [493 species](species-493.csv) and [full arrays](species-493.json) | Stats, types, abilities, 7,533 level-up entries and 250 evolution entries | Direct target-ROM readback |
| [Wiki v2 data](wiki-data.json) | 493 species, 467 named moves, 514 items (513 inherited + native TM Refill item 113), 737 unique trainer groups and 2,086 members | Target ROM fields; PokeAPI names/localisation only |
| [Changed moves](moves-final.csv) | Legacy 15 before/after records | Exact bytes; eight legacy names unresolved; not the wiki v2 name table |
| [Trainer teams](trainers-all-final.csv) | 2,086 members across the 738-record trainer archives | Direct target readback; explicit vs implicit moves identified |
| [Affected trainers](trainers-final.csv) | 14 members explicitly using reused move IDs | Direct target readback |
| [Drayano comparison](drayano-derived-493.csv) | 493 rows: 0 stat differences, 21 type differences, 1 ability difference | Exact 1.05 control and target hashes |

`generate_species_table.py` reads the personal, learnset and evolution NARCs. `generate_mod_tables.py` compares all move records and decodes both trainer NARCs directly. Both use Python standard library code, reject the wrong target hash and require external ROM files; they do not need the original manuals or private audit folders. Species names default to our delivered CSV. IDs are retained where a verified name mapping is unavailable; Fairy is type 9. Stats use HP, Attack, Defense, Speed, Special Attack, Special Defense order.

The target contains 142 encounter-map records. Complete species-to-location joins, map names and availability throughout the story have not been accepted. The fixture-assisted Route 29 capture verifies capture/persistence mechanics, not natural encounter distribution. Original manual locations remain historical references.

Evolution entries are static methods/parameters/targets. Alternate-form learnsets and successful evolution followed by PC and normal-save recovery still need testing. See [evolution items and shops](evolution-items-qol.md).

## Español

Nuestras tablas describen el objetivo exacto `fdb2fc…` que alimenta la salida Ultimate Gold alfa 1
(`6e73ab…`), sin ampliar la Pokédex. Los datos de combate proceden de la ROM; PokeAPI sólo aporta
nombres, localización y textos de referencia.

| Datos | Contenido | Confianza |
| --- | --- | --- |
| [493 especies](species-493.csv) y [arrays completos](species-493.json) | Estadísticas, tipos, habilidades, 7.533 entradas de nivel y 250 evoluciones | Lectura directa de la ROM objetivo |
| [Datos wiki v2](wiki-data.json) | 493 especies, 467 movimientos con nombre, 514 objetos (513 heredados + objeto Recarga MT 113), 737 grupos únicos y 2.086 miembros | Campos de ROM; PokeAPI sólo nombres/localización |
| [Movimientos modificados](moves-final.csv) | Exportación legacy de 15 registros antes/después | Bytes exactos; ocho nombres legacy sin resolver; no describe wiki v2 |
| [Equipos](trainers-all-final.csv) | 2.086 miembros de los archivos con 738 registros | Lectura directa; distingue ataques explícitos y por learnset |
| [Entrenadores afectados](trainers-final.csv) | 14 miembros que usan IDs reutilizados | Lectura directa |
| [Comparación Drayano](drayano-derived-493.csv) | 493 filas: 0 cambios de estadísticas, 21 de tipo y 1 de habilidad | Hashes exactos del control 1.05 y target |

`generate_species_table.py` lee los NARC personales, de learnsets y evoluciones. `generate_mod_tables.py` compara todos los movimientos y decodifica ambos NARC de entrenadores. Usan Python estándar, rechazan un target con hash incorrecto y necesitan ROM externas; no dependen de manuales originales ni carpetas privadas de auditoría. Los nombres de especies salen por defecto del CSV entregado. Se mantienen IDs donde no hay un mapeo verificado; Hada es el tipo 9. Orden de estadísticas: PS, Ataque, Defensa, Velocidad, Ataque Especial y Defensa Especial.

Hay 142 registros de mapas de encuentros. No están aceptados el cruce completo especie/ubicación, los nombres de mapas y su disponibilidad durante toda la historia. La captura de Ruta 29 con fixtures comprueba mecánicas y persistencia; no la distribución natural. Las ubicaciones de los manuales siguen siendo referencias históricas.

Las evoluciones son métodos/parámetros/objetivos estáticos. Las formas alternas de learnset y la recuperación tras evolución, PC y guardado normal siguen pendientes. Véase [objetos evolutivos y tiendas](evolution-items-qol.md).
