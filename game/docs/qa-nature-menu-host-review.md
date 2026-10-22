# Nature menu: root host review

## English

Status: PASS_HOST_ONLY; no integrated ROM or native menu acceptance.

Root independently ran `qa/test_stat_editor_nature_menu_script.py` and `qa/test_stat_editor_menu_script.py` with the existing engine virtual environment. Both passed. The extended script is 19,325 bytes, SHA-256 `25d356c9cfa352a3d89c214e6ea6486573e6ab3071539f423874a1976d155b5e`; it has seven Nature pages and 72 catalog messages. The unchanged legacy generator still emits 17,594 bytes, SHA-256 `de457ad35f9ea352091db4de66992fb348e599cd1071f2fd724130180b8e3d94`.

Root source review covered the family branch to the appended command-aligned block, Set/Reset confirmations, encoded selection preservation in `0x8005`, selected Party slot restoration `0x8000 → 0x800C`, status initialization to `0xFFFF`, opcode 858's three exact operands, and the exact `status == 0` success gate. The local model exercises all 25 values, paging, reset, No/cancel, failure statuses, and EV/IV Back/cancel paths including the moved family Exit value 3. These are host control-flow tests, not screenshots or actual game execution.

Integration must preserve text IDs 117–151, append only Nature IDs 152–193, retain launcher 2072, and install the reviewed opcode-858 recalculator. Native item flow, rendering, cancellation, mutation and Save/cold acceptance remain required.

## Español

Estado: PASS_HOST_ONLY; todavía sin ROM integrada ni aceptación del menú nativo.

Root ejecutó independientemente las pruebas del menú extendido y del generador anterior: ambas pasan. El guion nuevo tiene 19.325 bytes y siete páginas de naturalezas; el generador anterior conserva exactamente sus 17.594 bytes. Los hashes completos figuran arriba.

La revisión cubre el salto al bloque añadido, confirmaciones, conservación del valor elegido, restauración de la posición del equipo, estado inicial, operandos y éxito únicamente con estado cero. El modelo recorre las 25 opciones, páginas, reinicio, No/cancelación, errores y regreso de EV/IV. Son pruebas locales de flujo, no ejecución dentro del juego.

La integración debe conservar textos 117–151, añadir naturalezas en 152–193, mantener launcher 2072 e instalar el recalculador 858 revisado. Faltan menú, presentación, cancelación, mutación y persistencia Save/frío nativos del conjunto.
