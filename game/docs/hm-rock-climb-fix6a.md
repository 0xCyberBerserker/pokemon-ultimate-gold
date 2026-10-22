# Rock Climb QA — FIX6a

## English

**Historical limited native-action evidence.** At the exact Route 47 target, FIX6a opened its native Yes/No prompt, displayed “CLEFAIRY used Rock Climb!”, and moved the avatar four tiles north. The test used no codes or directional input, but the copied save retained `PLAYER_STATE_SURFING` (2) throughout. This does not establish a normal approach on foot. See the separate [accepted on-foot test](hm-rock-climb-walk-fix6a.md).

The static target is map 151, target `(89,395)` with behavior `0x4B`, approached from `(89,396)` on ordinary floor. The avatar was visible at the foot of the climbable wall before interaction. Runtime location changed from `(map 151, warp -1, X 89, Z 396, direction 0)` to `(151,-1,89,392,0)`. The runtime MapObject XYZ read changed from `(89,8,396)` to `(89,14,392)`, and runtime `vecY_fx32` changed from `262144` to `458752`. The endpoint's unique exact-ROM BDHC plane is at height 7.0 world units, consistent with the observed Y value.

The test used an isolated DSV copy (`2cd6f7afa2cf083d1e586c97d58bdc189d86185e47d4672f5bab85906a3f66c9`) from a native save. The fixture set the Route 47 position and corrected inherited Dark Cave weather from 11 to the exact MapHeader value 0; camera type was already 0. The earlier dark fixture was invalid and was not used for the action. The original DSV was preserved. No codes were enabled, and the copied DSV did not change during the action.

The active DSV slot passed its CRC check, and all three party records decrypted and passed their Gen-IV checksums. Runtime party bytes matched the encrypted DSV after exact cipher-phase normalization. No party member knew any of the eight HM move IDs, including Rock Climb `431`. The legacy and canonical HM pockets both contained items `420–427`; Bag and the reserved `0x023D7000–0x023D7FFF` region retained the same hashes before and after the action, and all reserve canaries passed.

This verifies the native prompt, move message, and immediate climb movement. Route 47 story access and post-action save/cold-reload persistence remain untested. The avatar was placed synthetically, so this is not evidence of a natural story route.

Evidence, local frame paths and hashes are in [qa-hm-rock-climb-fix6a.json](qa-hm-rock-climb-fix6a.json). Emulator states and captures remain local QA artifacts.

## Español

**Evidencia histórica nativa limitada.** En el objetivo exacto de Route 47 (Ruta 47), FIX6a abrió su aviso Sí/No, mostró «CLEFAIRY used Rock Climb!» y movió al personaje cuatro casillas al norte. No se usaron códigos ni entradas direccionales, pero la copia conservaba `PLAYER_STATE_SURFING` (2) durante toda la prueba. Esto no demuestra una aproximación normal a pie. Consulta la [prueba a pie aceptada](hm-rock-climb-walk-fix6a.md).

El objetivo estático es el mapa 151, tile `(89,395)` con comportamiento `0x4B`, accesible desde `(89,396)` sobre suelo normal. Antes de interactuar, el avatar se veía al pie de la pared escalable. La ubicación en RAM cambió de `(mapa 151, warp -1, X 89, Z 396, dirección 0)` a `(151,-1,89,392,0)`. La lectura XYZ del MapObject en runtime cambió de `(89,8,396)` a `(89,14,392)`, y `vecY_fx32` cambió de `262144` a `458752`. El punto final tiene un único plano BDHC exacto de esta ROM a 7,0 unidades de altura, coherente con la Y observada.

La prueba usó una copia DSV aislada (`2cd6f7afa2cf083d1e586c97d58bdc189d86185e47d4672f5bab85906a3f66c9`) derivada de una partida nativa. El fixture colocó al avatar en la Ruta 47 y corrigió el clima heredado de la Cueva Oscura, de 11 al valor exacto 0 del MapHeader; el tipo de cámara ya era 0. El fixture oscuro anterior era inválido y no se usó para la acción. La DSV original se conservó. No hubo códigos activos y la copia DSV no cambió durante la acción.

El slot activo de la DSV pasó la validación CRC y los tres registros de la party se descifraron y pasaron sus checksums Gen IV. Los bytes de la party runtime coincidieron con la DSV cifrada tras normalizar exactamente la fase del cifrado. Ningún Pokémon conocía los ocho IDs de movimientos MO, incluido Treparrocas `431`. Los bolsillos HM legacy y canónico contenían ambos los objetos `420–427`; los hashes de la Bolsa y de la reserva `0x023D7000–0x023D7FFF` se mantuvieron iguales antes y después, y todos los canarios de reserva pasaron.

Quedan verificados el aviso nativo, el mensaje de la MO y el ascenso inmediato. No se probaron el acceso narrativo a la Ruta 47 ni la persistencia tras guardar y reiniciar en frío. La posición del avatar se preparó sintéticamente, por lo que no demuestra una ruta natural de la historia.

Los hashes, rutas de capturas locales y el resto de la evidencia están en [qa-hm-rock-climb-fix6a.json](qa-hm-rock-climb-fix6a.json). Los estados del emulador y las capturas permanecen como artefactos QA locales.
