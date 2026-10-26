# Kris Rocket-Costume QA — Bounded Results

## English

### Scope

This record summarizes three bounded native cases on issue [#33](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33). Each case has an independent-review PASS only for the actions and observations listed below.

### Reviewed cases

- **Nurse Joy healing:** One observed healing cycle with Kris in the Team Rocket costume restored HP/PP, returned to the costume and restored normal movement. This bounded healing-component PASS was observed in the second combined private test attempt, which later stopped during Save. The reviewed profile, Bag and party data were preserved; the walking-related friendship change was separated and explained. [Issue receipt](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429009342)
- **Ordinary Save:** One normal menu Save while wearing the costume completed, preserved the reviewed profile, Bag and party data, and exited cleanly. This case did not include healing or cold Continue. [Issue receipt](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429391240)
- **Cold Continue:** Continue loaded a copy of the accepted Rocket-costume save, retained the reviewed costume, profile, Bag and party, and restored field control. Input and output save copies were identical; no save occurred during this test, and the session exited cleanly. [Issue receipt](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429556418)

The cold test crossed in-game midnight. Three tracked daily variables changed as documented, and the walking-related friendship change was accounted for separately. The result does not claim that every daily variable remained unchanged.

### Earlier partial attempts

An earlier combined healing/Save attempt stopped during the expected healing animation before reaching the Save menu. A later partial Save diagnostic exited with code 1 after the menu opened; no save completed, the input/output save copies remained identical, cold Continue was not tested, and no traceback was preserved. These partials do not change the bounded healing-component PASS or establish a clean completed Save session. The diagnostic does not attribute a fault to the ROM. The ordinary Save and cold Continue PASSes above are distinct later cases. [Attempt history](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6428771994); [Save diagnostic](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429147288).

### Limits and current status

These are single bounded cases. They do not establish repeated reliability, other save families, all Rocket contexts, all 15 field-state pairs, every applicable K01–K12 regression, complete Kris integration, or release acceptance. Alpha 2 and patcher defaults are unchanged. Dev is preparing one possible bounded ladder round-trip; this remains preparation only, and no new native Core run is admitted. See the [current project status](project-status.md) and the [Kris feasibility boundary](kris-feasibility.md).

## Español

### Alcance

Este registro resume tres casos nativos acotados de la issue [#33](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33). Cada caso tiene un PASS de revisión independiente limitado a las acciones y observaciones indicadas.

### Casos revisados

- **Curación con Enfermera Joy:** Un ciclo de curación observado con Kris y el uniforme del Team Rocket recuperó PS/PP, devolvió el uniforme y restableció el movimiento normal. Este PASS del componente de curación, acotado, se observó en el segundo intento combinado privado, que después se detuvo durante Guardar. Se conservaron los datos revisados de perfil, Bolsa y equipo; el cambio de amistad por caminar se separó y explicó. [Recibo de la issue](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429009342)
- **Guardado ordinario:** Un guardado normal desde el menú con el uniforme completó el ciclo, conservó los datos revisados de perfil, Bolsa y equipo y terminó con una salida limpia. Este caso no incluyó curación ni Continue en frío. [Recibo de la issue](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429391240)
- **Continue en frío:** Continue cargó una copia del guardado aceptado con uniforme Rocket, conservó el uniforme y los datos revisados de perfil, Bolsa y equipo, y devolvió el control del campo. Las copias de guardado de entrada y salida eran idénticas; no se guardó durante esta prueba y la sesión terminó limpiamente. [Recibo de la issue](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429556418)

La prueba en frío cruzó la medianoche del juego. Tres variables diarias controladas cambiaron conforme a lo documentado y el cambio de amistad por caminar se contabilizó aparte. El resultado no afirma que todas las variables diarias permanecieran iguales.

### Intentos parciales anteriores

Un intento combinado anterior de curación/Guardar se detuvo durante la animación esperada de curación, antes de llegar al menú Guardar. Un diagnóstico parcial posterior de Guardar terminó con código 1 después de abrir el menú; no se completó el guardado, las copias de entrada y salida permanecieron idénticas, no se probó Continue en frío y no se conservó el traceback. Estos parciales no cambian el PASS acotado del componente de curación ni acreditan una sesión de Guardar completada limpiamente. El diagnóstico no atribuye un fallo a la ROM. Los PASS de Guardar ordinario y Continue en frío anteriores son casos posteriores y distintos. [Historial de intentos](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6428771994); [diagnóstico de Guardar](https://github.com/0xCyberBerserker/pokemon-ultimate-gold/issues/33#issuecomment-6429147288).

### Límites y estado actual

Son casos individuales y acotados. No demuestran fiabilidad repetida, otras familias de guardado, todos los contextos Rocket, los 15 pares de estado de campo, todas las regresiones K01–K12 aplicables, la integración completa de Kris ni la aceptación de una release. Alfa 2 y los valores predeterminados del parcheador no cambian. Dev prepara una posible ida y vuelta acotada por escalera; sigue únicamente en preparación y no se admite otra ejecución nativa de Core. Véanse el [estado actual del proyecto](project-status.md) y el [límite de viabilidad de Kris](kris-feasibility.md).
