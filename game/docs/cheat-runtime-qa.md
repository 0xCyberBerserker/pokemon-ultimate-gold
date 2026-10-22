# Cheat runtime QA

## English

**Result:** `PASS_EMULATED_MEMORY_EFFECTS_CODE_OFF_RELOAD_NOT_BATTERY_PERSISTENCE` on the accepted Alpha1 ROM `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`. This is a bounded DeSmuME Action Replay test for Nintendo DS, not a GameShark test.

The source-pinned catalog contains 2,110 entries from XML SHA-256 `c0a0f0710060271c652577866806491125b2a7d82d40c3b4c46348b7e7a002fe` at upstream commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. Its target hash matches the ROM used here. The catalog marks both selected entries `static_only`; their effects were not previously runtime-tested. The source XML is represented by the generated catalog and its provenance metadata in this workspace.

### Money 999999 (catalog `00-006`)

Activation: press **Select** in game. Code SHA-256: `eaf6a22ed8c1838df2eceba45ca16ecf889c750946bdbbc2b1060b912ad910d1`.

```text
94000130 FFFB0000
6211186C 00000000
B211186C 00000000
0000D068 000F423F
D2000000 00000000
```

The runtime Action Replay base pointer was `0x0226f22c`. The code's target `base + 0xD068` resolved to the canonical `SaveData + 0x88` money field. Baseline money was `3000`; the code produced exactly `999999`. The bag-pocket hashes matched the baseline. The cheat was disabled at frame `120` and the value remained after a new process loaded the captured emulator state with no cheats.

QA use: A deterministic smoke check for the Action Replay trigger and canonical money-field mapping; it does not test economy balance.

### Rare Candy through All medicine ×999 (catalog `80-002`)

There is no Rare-Candy-only catalog entry. This broader code includes Rare Candy as item ID 50. Activation: press **Select + Up** while the Bag is closed. Code SHA-256: `93df73591cd53bbd4cf5f6d2e5b02f250da3df43fce8eb15ab4775f19cc2852c`.

```text
94000130 FFBB0000
6211186C 00000000
B211186C 00000000
D5000000 03E70011
C0000000 00000025
D6000000 0000DB54
D4000000 00000001
D2000000 00000000
```

The verified native medicine projection starts at `SaveArray base + 0xDB54` and has 40 slots. The code writes 38 consecutive 32-bit entries, item IDs `17–54`, quantity `999`, within slots 0–37. Rare Candy item 50 moved from quantity 20 to 999 in slot 33. The expanded canonical Bag has a separate 42-slot Medicine pocket at `0x023ddb04`: slots 0–37 matched the code writes, slots 38–41 stayed unchanged, and all other canonical pockets were byte-identical to baseline. The effect remained after the code-off process loaded the captured state. These canonical checks use the RAM captures listed in the machine-readable report.

QA use: A broad medicine-pocket write test for SaveArray mapping; because it replaces many medicines, it is unsuitable for isolated Rare Candy testing.

### Scope and limits

Each run used a fresh copy of the Alpha1 DSV; the golden DSV stayed byte-identical. Both codes were disabled after frame 120. The no-cheat process loaded a serialized emulator state, so this proves RAM effects after code removal, not persistence to a saved battery file. No real player save, manual save, consumption of a Rare Candy, level-up effect, or trainer capture was tested. Trainer-capture code `30-004` remains **NOT_TESTED** because it requires a battle.

Run evidence: `@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/cheat-runtime-alpha1-20261022`. Machine-readable results: [`qa-cheat-runtime.json`](qa-cheat-runtime.json).

## Español

**Resultado:** `PASS_EMULATED_MEMORY_EFFECTS_CODE_OFF_RELOAD_NOT_BATTERY_PERSISTENCE` con la ROM Alpha1 aceptada `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`. Es una prueba acotada de Action Replay para Nintendo DS con DeSmuME; no es una prueba de GameShark.

El catálogo vinculado a una fuente contiene 2.110 entradas del XML con SHA-256 `c0a0f0710060271c652577866806491125b2a7d82d40c3b4c46348b7e7a002fe`, en el commit upstream `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. El hash objetivo coincide con la ROM probada. El catálogo marca las dos entradas como `static_only`; sus efectos aún no tenían prueba en runtime. En este workspace están el catálogo generado y sus metadatos de procedencia, no el XML original.

### Money 999999 (entrada `00-006`)

Activación: pulsa **Select** durante el juego. SHA-256 del código: `eaf6a22ed8c1838df2eceba45ca16ecf889c750946bdbbc2b1060b912ad910d1`.

```text
94000130 FFFB0000
6211186C 00000000
B211186C 00000000
0000D068 000F423F
D2000000 00000000
```

El puntero base de SaveArray en runtime fue `0x0226f22c`. El destino `base + 0xD068` coincide con el campo canónico de dinero `SaveData + 0x88`. El dinero inicial era `3000` y el código lo dejó exactamente en `999999`. Los hashes de las bolsas coincidieron con el baseline. El truco se desactivó en el frame `120` y el valor siguió presente al abrir otro proceso sin códigos activos y cargar el estado del emulador.

Uso en QA: Comprobación determinista del disparador Action Replay y del campo canónico de dinero; no prueba el equilibrio de la economía.

### Caramelo Raro mediante All medicine ×999 (entrada `80-002`)

El catálogo no contiene una entrada exclusiva para el Caramelo Raro. Este código más amplio lo incluye como objeto 50. Activación: pulsa **Select + Up** con la Bolsa cerrada. SHA-256 del código: `93df73591cd53bbd4cf5f6d2e5b02f250da3df43fce8eb15ab4775f19cc2852c`.

```text
94000130 FFBB0000
6211186C 00000000
B211186C 00000000
D5000000 03E70011
C0000000 00000025
D6000000 0000DB54
D4000000 00000001
D2000000 00000000
```

La proyección nativa verificada de medicinas empieza en `base de SaveArray + 0xDB54` y tiene 40 posiciones. El código escribe 38 entradas consecutivas de 32 bits, objetos `17–54` con cantidad `999`, en las posiciones 0–37. El Caramelo Raro 50 pasó de cantidad 20 a 999 en la posición 33. La bolsa canónica ampliada tiene una bolsa de Medicinas separada de 42 posiciones en `0x023ddb04`: las posiciones 0–37 coincidieron con las escrituras del código, las 38–41 no cambiaron y todas las demás bolsas canónicas fueron idénticas byte a byte al baseline. El efecto siguió presente tras abrir el proceso sin código con el estado capturado. Estas comprobaciones canónicas usan las capturas RAM enumeradas en el informe legible por máquina.

Uso en QA: Prueba de escritura amplia de la bolsa de medicinas y del mapeo SaveArray; como reemplaza muchas medicinas, no sirve para probar el Caramelo Raro de forma aislada.

### Alcance y límites

Cada ejecución usó una copia nueva del DSV Alpha1; el DSV dorado quedó idéntico byte por byte. Los dos códigos se desactivaron después del frame 120. El proceso sin códigos cargó un estado serializado del emulador: esto demuestra efectos en RAM tras quitar el código, no persistencia en un archivo de batería guardado. No se probaron partidas reales, guardado manual, consumo del Caramelo Raro, subida de nivel ni captura de entrenadores. El código de captura `30-004` sigue **SIN PROBAR** porque requiere un combate.

Evidencia: `@HOME@/Games/Sacred-Gold/night-sprint/qa/runs/cheat-runtime-alpha1-20261022`. Resultados legibles por máquina: [`qa-cheat-runtime.json`](qa-cheat-runtime.json).
