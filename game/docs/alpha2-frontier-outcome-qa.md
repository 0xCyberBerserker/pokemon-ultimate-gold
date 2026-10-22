# Alpha2 Battle Tower: first-match outcome

## English

**Result: one native Single match ended and returned to the Battle Tower lobby; native save and cold reload passed.** The opponent was Remoraid Lv. 50. The three selected Pokémon were Clefairy, Chikorita, and Machop. Legal touch/controller inputs selected Pound, Low Kick, and Tackle across three turns. The interface showed the first two Pokémon fainting, then presented the post-match Battle Video prompt and returned to the lobby. The defeat is inferred from the match ending after all three selected Pokémon were used; no explicit win/loss result screen or hidden outcome flag was captured.

After the return, the native lobby displayed “Thank you for playing!” and saved. The post-save DSV has valid CRCs in both slots, counters 8 and 7, and SHA-256 `a15f0c19a0ca7fd491b253650c304ff79f54c656b24b094a0374bab1d2c9e3a5`. Exact battery snapshots are frozen under `night-sprint/qa/runs/alpha2-frontier-outcome-postbattle-savewait/battery-evidence/` and `night-sprint/qa/runs/alpha2-frontier-outcome-cold-reload-corrected/battery-evidence/`; their manifests are hashed in the JSON report. On cold reload, the game returned to the lobby challenge menu. SaveArray2 (party) and SaveArray3 (Bag) match byte-for-byte between the post-match RAM, cold RAM, and selected saved DSV. All three Pokémon had full HP and no status condition after the return and reload. `VAR404B` remained 118.

The bounded machine-readable evidence, including ROM/core/runner hashes, run records, and screenshot hashes, is in [qa-alpha2-frontier-outcome.json](qa-alpha2-frontier-outcome.json). Screenshots, RAM dumps, states, and DSV files are retained locally under `night-sprint/qa/runs/alpha2-frontier-outcome-*`; these files are not included in the website repository.

This first-match case does not claim a victory, reward, seven-match streak, additional facility, or rejection/full-party behavior. Its own evidence does not cover repeat entry; the separate bounded re-entry case below covers only its stated endpoint. The first 1,000-frame cold-start attempt did not reach its scheduled Continue inputs and is excluded; the corrected 5,500-frame Continue sequence is the one audited.

### Repeat entry (separate bounded case)

On the same FIX6a build, a separate run started from the previously accepted post-match lobby and its existing same-ROM cold-loaded state. The player selected another Single challenge, registered the party, completed the native save, re-entered the Battle Room, and reached the next command menu against Hiker Raiden’s Shieldon Lv. 50. It used 12 runner invocations, no cheats, and no battle turns. The settled DSV has valid headers and CRCs in both slots, with counters 8 and 9. A snapshot captured while the screen still showed “Saving…” has an invalid secondary-slot CRC; it is transitional and excluded. This run did not perform a new cold boot.

Provenance: FIX6a ROM SHA-256 `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`; core SHA-256 `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`; runner SHA-256 `0f2ca19bbfb6505baa4c35ee497b2c0cba15881bd7379def6a382ad44413cc26`; acceptance JSON SHA-256 `19dd7f604c2b7677dca68d052b669ac997b1f659d15e09e08187661f6a4df153`; source QA note SHA-256 `74f47ab153d4a1d0071894e80f1dd27d5d9305bd9268fbb3c616e76e88317ed3`; independent review SHA-256 `cf96173907ee1e6326a4d85cd3d45bc46bcff624b455b31e3a2b5d431fb266b1`.

This endpoint does not establish a victory, rewards, streak outcome, match completion, another facility, story-mode access, or an additional cold reload.

## Español

**Resultado: un combate Individual nativo terminó y volvió al vestíbulo de Battle Tower; el guardado nativo y la recarga en frío pasaron.** El rival fue Remoraid Nv. 50. El equipo seleccionado fue Clefairy, Chikorita y Machop. Con entradas táctiles y de mando válidas se eligieron Pound, Low Kick y Tackle durante tres turnos. La interfaz mostró la derrota de los dos primeros Pokémon y, después, el aviso para guardar el vídeo del combate; luego volvió al vestíbulo. Se infiere la derrota porque el combate terminó tras usar los tres Pokémon seleccionados; no se capturó una pantalla explícita de victoria/derrota ni una bandera interna del resultado.

Al volver, el vestíbulo mostró «Thank you for playing!» y guardó de forma nativa. El DSV posterior al guardado tiene CRC válido en ambas ranuras, contadores 8 y 7, y SHA-256 `a15f0c19a0ca7fd491b253650c304ff79f54c656b24b094a0374bab1d2c9e3a5`. Las copias exactas del DSV están congeladas en `night-sprint/qa/runs/alpha2-frontier-outcome-postbattle-savewait/battery-evidence/` y `night-sprint/qa/runs/alpha2-frontier-outcome-cold-reload-corrected/battery-evidence/`; el JSON registra el hash de cada manifiesto. La recarga en frío volvió al menú de desafío del vestíbulo. SaveArray2 (equipo) y SaveArray3 (Bolsa) coinciden byte por byte entre la RAM tras el combate, la RAM en frío y la ranura seleccionada del DSV. Los tres Pokémon tenían todos sus PS y ningún problema de estado tras volver y recargar. `VAR404B` permaneció en 118.

La evidencia legible por máquina —con hashes de ROM, core, runner, ejecuciones y capturas— está en [qa-alpha2-frontier-outcome.json](qa-alpha2-frontier-outcome.json). Las capturas, volcados de RAM, estados y DSV se conservan localmente en `night-sprint/qa/runs/alpha2-frontier-outcome-*`; estos archivos no se incluyen en el repositorio del sitio.

Este caso del primer combate no afirma una victoria, recompensa, racha de siete combates, otra instalación ni rechazo/equipo lleno. Su propia evidencia no cubre la reentrada; el caso separado y acotado de abajo solo cubre el punto final indicado. El primer arranque en frío de 1.000 fotogramas no alcanzó sus entradas Continue programadas y queda excluido; se audita la secuencia corregida de Continue de 5.500 fotogramas.

### Reentrada (caso acotado separado)

En la misma build FIX6a, otra ejecución partió del vestíbulo posterior al combate ya aceptado y de su estado existente, cargado en frío con la misma ROM. El jugador eligió otro reto Single, registró el equipo, completó el guardado nativo, volvió a entrar en la Sala de Combate y llegó al menú de órdenes del siguiente combate contra el Shieldon Nv. 50 de Hiker Raiden. Usó 12 invocaciones del runner, sin trucos y sin jugar turnos. La DSV asentada tiene cabeceras y CRC válidos en ambas ranuras, con contadores 8 y 9. Una captura hecha mientras la pantalla aún mostraba «Saving…» tiene inválido el CRC de la segunda ranura; es transitoria y queda excluida. Esta ejecución no hizo un nuevo arranque en frío.

Procedencia: SHA-256 de la ROM FIX6a `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`; núcleo `d9a441d965216c4ad7350e6c34549e9ae211ca92618855d5a282acc89c82fe89`; runner `0f2ca19bbfb6505baa4c35ee497b2c0cba15881bd7379def6a382ad44413cc26`; JSON de aceptación `19dd7f604c2b7677dca68d052b669ac997b1f659d15e09e08187661f6a4df153`; nota QA fuente `74f47ab153d4a1d0071894e80f1dd27d5d9305bd9268fbb3c616e76e88317ed3`; revisión independiente `cf96173907ee1e6326a4d85cd3d45bc46bcff624b455b31e3a2b5d431fb266b1`.

Este punto final no demuestra victoria, recompensas, resultado de racha, finalización del combate, otra instalación, acceso desde la historia ni una recarga adicional en frío.
