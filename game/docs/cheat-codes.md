# Cheat codes / Códigos de trucos

## English

Status: **2,110 complete codes in the [searchable web catalog](../web/wiki/#/cheats)**, across 67 source folders and seven categories. Players choose their own experience. The catalog includes trainer capture, full code blocks, copy buttons, detected button conditions, source instructions and exact-target static status. Its data loads only when the catalog is opened.

The supplied [owned-TM refill profile](../config/cheats/DeSmuME/Sacred-Gold-Plus-Drayano-QoL-fix1.cht) is tested for teaching TM04, refilling obtained TMs to 99 and preserving HM01. It is an emulator runtime profile, separate from the ROM patch.

Categories cover system/speed, player/progression, party/training, battles/capture, wild encounters, appearance and bag/gifts. UI and authored instructions have an EN/ES selector. Original titles and source instructions are retained where no authored translation exists. Add one complete block as one Action Replay entry in a compatible emulator; start disabled, enable it for its required scene, then disable and restart to discard code patches. Saved changes remain in that save. The web catalog never activates a code or uploads a save.

The current extraction targets alpha1 SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`: all 2,110 entries pass syntax decoding; six have unmatched ROM equality guards and are marked separately. Static matching does not prove an effect, overlay lifetime, or save persistence. No entry inherits runtime acceptance from upstream. The species picker requires its custom melonDS wrapper; the page marks this requirement.

A bounded Alpha1 runtime test covers `00-006` (999,999 money) and `80-002` (all medicines ×999, including Rare Candy). It confirms emulated-memory effects that remained after disabling the codes and loading a captured state in a new process; it does not test battery-save persistence or normal player use. `30-004` remains untested. See the [runtime QA report](cheat-runtime-qa.md) and its [machine-readable results](qa-cheat-runtime.json).

Trainer capture is entry `30-004`:

```text
9224670A 00002101
1224670A 00002100
D2000000 00000000
```

Its advertised effect, party/PC retention and save/restart persistence remain untested on our build. Use a separate test save. Do not combine overlapping codes, or assume a code improves an already native Rocket item or speed feature.

Source: [Umberto-DEV and contributors, Plus catalog](https://github.com/Umberto-DEV/sacred-gold-plus), pinned commit `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. Imported XML SHA-256 `c0a0f0710060271c652577866806491125b2a7d82d40c3b4c46348b7e7a002fe`. Our generated [catalog and check summary](cheat-catalog.json) preserve the pin and auditor fingerprint; original manuals and XML are not copied into this repository.

## Español

Estado: **2.110 códigos completos en el [catálogo web con búsqueda](../web/wiki/#/cheats)**, repartidos entre 67 carpetas de origen y siete categorías. Incluye capturar Pokémon de entrenadores, bloques completos, botón de copiar, condiciones de botones detectadas, instrucciones de origen y estado estático ligado a la ROM. Los datos sólo se cargan al abrir el catálogo.

El [perfil de reposición de MT](../config/cheats/DeSmuME/Sacred-Gold-Plus-Drayano-QoL-fix1.cht) está probado enseñando la MT04, reponiendo MT conseguidas a 99 y conservando la MO01. Es un perfil de runtime del emulador, separado del parche ROM.

Las categorías cubren sistema/velocidad, jugador/progreso, equipo/entrenamiento, combates/captura, encuentros salvajes, apariencia y bolsa/regalos. La interfaz y las instrucciones propias usan selector EN/ES. Se conservan títulos e instrucciones originales cuando falta traducción propia. Añade un bloque completo como un único código Action Replay en un emulador compatible, empieza desactivado y actívalo en su escena. Después desactívalo y reinicia para descartar los parches de código. Los cambios guardados permanecen en esa partida. La web no activa códigos ni sube partidas.

La extracción actual comprueba alpha1, SHA-256 `6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`: las 2.110 entradas pasan la decodificación sintáctica; seis tienen condiciones de igualdad incompatibles con los bytes de ROM y quedan señaladas. Coincidir estáticamente no demuestra efecto, vida de un overlay ni persistencia. Ninguna entrada hereda aceptación en ejecución de upstream. El selector de especies necesita su wrapper propio de melonDS; la ficha lo indica.

Una prueba acotada en Alpha1 cubre `00-006` (999.999 de dinero) y `80-002` (todas las medicinas ×999, incluido el Caramelo Raro). Confirma efectos en memoria del emulador que continuaron tras desactivar los códigos y cargar un estado capturado en otro proceso; no prueba persistencia en la batería ni el uso normal por parte del jugador. `30-004` sigue sin probar. Consulta el [informe de QA en runtime](cheat-runtime-qa.md) y sus [resultados legibles por máquina](qa-cheat-runtime.json).

Capturar Pokémon de entrenadores es la entrada `30-004`:

```text
9224670A 00002101
1224670A 00002100
D2000000 00000000
```

El efecto, la conservación en equipo/PC y la persistencia tras guardar/reiniciar siguen sin probar en nuestro build. Usa una partida de prueba separada. No combines códigos que alteren la misma función ni presupongas que mejoran una comodidad Rocket o de velocidad ya nativa.

Fuente: [catálogo Plus de Umberto-DEV y colaboradores](https://github.com/Umberto-DEV/sacred-gold-plus), commit fijado `5b90a788ac3c7d1e4733b4d175a97811cc6745a3`. SHA-256 del XML importado: `c0a0f0710060271c652577866806491125b2a7d82d40c3b4c46348b7e7a002fe`. El [catálogo y resumen propios](cheat-catalog.json) conservan el pin y la huella del auditor; no se copian los manuales ni el XML originales al repo.
