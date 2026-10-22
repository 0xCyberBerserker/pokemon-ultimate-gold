# Integrated Nature editor: root static review

## English

Status: PASS_STATIC_BYTE_UNION; native phase 1 passed within the scope below. Further integrated QA remains pending.

Candidate: `2eaf226677be97b95175035917cb96aa47b761cd993aa5a1bdb0eb2619dbf43f`. Parent: Rocket grant `08e1d4e51599dc459600f1eff44e7915acbbaa111d74321be22a4800af629fcf`. Nature donor: `9e01938d9b27d453ec7a901c72d4f23a6d761a7a74b360deeb23ccdd56057636`.

Root independently loaded the actual serialized ROMs with ndspy. Candidate SHA matches. ARM7, entry/load/settings metadata, both overlay tables, FNT names and every filesystem file outside the two permitted NARCs are exact. Script NARC changes only member3; message NARC changes only member40. All other members, including Rocket842 and original text542, are exact.

Every ARM9 section's metadata and length is unchanged. Actual byte deltas are limited to main ARM9 (9 bytes within the count/getter hook), table section (9 bytes within used-size/entries857–858), and core section (586 bytes within the four reviewed Nature payload ranges). Each Nature payload is byte-exact to the accepted donor. Launcher remains2072; dispatch count is859. No probe2073/2074 is imported.

Root also reproduced the four builder host tests before output, and reviewed the append-only message/entry72 retarget logic. Cancellation, Save/cold, PC and broader consumers still require their own evidence. No download or default patch changes.

**Native phase 1:** root independently reproduced the [frozen 17-run report](qa-nature-integrated-native.json) exactly, SHA-256 `01563b8f21087dd89d698e9a29aee53942bde64709b4640eda911aceea1012eb`. Native Rocket grant → USE → Party slot0 → Nature → Lonely → Yes succeeds in candidate2eaf. Field114 becomes `0x0004`; Clefairy's stats match the Timid→Lonely formula, with PID/EV/IV, peers and both Bag stores preserved. The page title requires normal WaitAB acknowledgement before its choice list. No integrated Save/cold or reset acceptance follows from this phase.

**Frozen replay correction:** root also reproduced [auditor v3](qa-nature-integrated-native-v3.json) byte for byte, SHA-256 `005e72d5d79724ad19e2f9fad43000a85fc33ff5fc7dbaba827cdbf2f96ea144`. It explicitly checks three Party members in the source and every RAM snapshot, and uses frozen battery sidecars instead of requiring the live profile to remain unchanged after Save. The [historical v2 report](qa-nature-integrated-native-v2.json) is retained. This corrects the audit tooling; it adds no native gameplay acceptance.

## Español

Estado: PASS_STATIC_BYTE_UNION; fase nativa 1 aceptada dentro del alcance indicado. Quedan pruebas del conjunto pendientes.

Root comparó las ROM serializadas reales: el hash coincide; ARM7, metadatos de carga, tablas de overlays, FNT y archivos ajenos a los dos NARC permitidos siguen exactos. Solo cambian el miembro3 de guiones y el40 de mensajes; Rocket842 y textos originales542 se conservan.

Las secciones ARM9 conservan metadatos y tamaño. Sus diferencias reales quedan dentro de los rangos previstos: nueve bytes de main, nueve de tabla y586 del código Nature. Los cuatro bloques Nature coinciden exactamente con el donante aceptado. Launcher2072 y contador859 son correctos; no se importan las sondas2073/2074.

Las cuatro pruebas host del constructor también pasan en la reproducción de root. Falta comprobar cancelación, guardado/frío, PC y demás consumidores del conjunto. Las descargas y el parche predeterminado no cambian.

**Fase nativa 1:** root reprodujo exactamente el [informe congelado de 17 ejecuciones](qa-nature-integrated-native.json), con el hash indicado arriba. En la candidata2eaf funciona entrega Rocket → USE → posición0 del equipo → Nature → Lonely → Sí. El campo114 pasa a `0x0004`; las estadísticas de Clefairy coinciden con la fórmula Timid→Lonely, conservando PID, EV, IV, otros miembros y ambos almacenes de Bolsa. El título de página requiere un acuse WaitAB normal antes de mostrar las opciones. Esta fase no acredita Save/frío integrado ni reinicio.

**Corrección de reproducción:** root reprodujo también el [auditor v3](qa-nature-integrated-native-v3.json) byte a byte, con el hash indicado arriba. Comprueba explícitamente tres miembros del equipo en origen y en cada captura de RAM; utiliza los DSV congelados de cada ejecución y permite que el perfil activo cambie tras guardar. Se conserva el [informe histórico v2](qa-nature-integrated-native-v2.json). Corrige la herramienta de auditoría y no añade pruebas nativas de juego.
