# Compatibility / Compatibilidad

## English

The audited Plus intermediate build is `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`; the Ultimate Gold Alpha 1 output is `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`, status **TESTED_PARTIAL**. Its [versioned manifest](../patches/manifest-alpha1.json) pins the clean HeartGold USA input and delta. The older player build `3e405d…` is preserved locally.

The selectable experimental Alpha 2 target is `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, with its own [manifest](../patches/manifest-alpha2.json). It adds the Rocket kit, evolution-shop stock and owned-HM actions. [Current evidence](project-status.md) is exact-target and bounded; historical Alpha 1 gameplay tests are not automatically inherited. Neither build contains the stat editor or Kris.

| Component | Verification | Limit |
| --- | --- | --- |
| Plus 1.2.3 | Commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`; original 493 scope | Whole-game acceptance pending |
| Drayano trainer data | Both trainer NARCs equal the original 1.05 control; 738 records, 2,086 members | Reused move IDs change 14 explicit members' semantics |
| Plus moves | 15 changed records; combat fields read from ROM; wiki v2 resolves 467 names from bank 750 | Legacy `moves-final` still labels eight names unresolved; alternate-form learnsets pending |
| Native Speed-Up | 18 guarded ARM9 bytes; real field/battle/save paths run | Audio tempo and perceived timing not measured |
| Typechart fix1 | Two corrected bytes, 324/324 static pairs; ARM9 and 128 other overlays preserved | Those two Ghost matchups still need dedicated live battles |
| Owned-TM refill | Native TM Refill item 113; actual teaching/refill path is documented; no cheat is required | Full story and broader item/shop acceptance pending |

The real Fairy attack, capture, party reload and TM tests are recorded in [QA results](qa-493.md). They are bounded fixture-assisted tests, not full adventure acceptance.

Do not stack other whole-ROM patches onto this output. HG Engine, HeartGold Generations and additional species are outside this build. New features must use a new target hash and rerun patch and runtime checks.

## Español

El build intermedio auditado de Plus es `fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e`; la salida de Ultimate Gold alfa 1 es `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`, estado **TESTED_PARTIAL**. Su [manifiesto propio](../patches/manifest-alpha1.json) fija HeartGold USA limpia como entrada y su delta. La versión anterior `3e405d…` se conserva localmente.

El objetivo experimental seleccionable alfa 2 es `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`, con [manifiesto propio](../patches/manifest-alpha2.json). Añade kit Rocket, inventario evolutivo y acciones de MO sin enseñar movimientos. Las [pruebas actuales](project-status.md) son acotadas y del hash exacto; las de alfa 1 no se heredan automáticamente. Ninguna versión incluye editor de estadísticas ni Kris.

| Componente | Verificación | Límite |
| --- | --- | --- |
| Plus 1.2.3 | Commit fijado arriba; 493 especies originales | Historia completa pendiente |
| Entrenadores Drayano | Ambos NARC iguales al control 1.05; 738 registros y 2.086 miembros | Los IDs reutilizados afectan a 14 miembros explícitos |
| Movimientos Plus | 15 registros distintos; campos de combate desde ROM; wiki v2 resuelve 467 nombres del banco 750 | El CSV legacy `moves-final` conserva ocho nombres sin resolver; learnsets de formas alternas pendientes |
| Speed-Up nativo | 18 bytes ARM9 comprobados; funcionan rutas reales de campo, combate y guardado | Ritmo musical y percepción sin medir |
| Tabla fix1 | Dos bytes corregidos, 324/324 pares; ARM9 y otros 128 overlays conservados | Faltan combates dedicados de esos dos cruces Fantasma |
| Reposición MT | Objeto nativo Recarga MT 113; ruta real de enseñanza/reposición documentada; no requiere cheat | Pendientes la historia completa y la aceptación amplia de objetos/tiendas |

Los [resultados QA](qa-493.md) registran ataque Hada, captura, recarga de equipo y MT. Son pruebas acotadas con fixtures; no aceptan la aventura completa.

No apiles otros parches de ROM completa. HG Engine, HeartGold Generations y nuevas especies quedan fuera. Una función nueva debe generar otro hash objetivo y repetir sus comprobaciones de parche y runtime.
