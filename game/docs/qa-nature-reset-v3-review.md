# Nature reset v3: independent coverage review

## English

**PASS within the recorded scope.** An independent reviewer reproduced the [v3 report](qa-nature-integrated-reset-save-cold-v3.json) byte for byte and checked the four captured 2,376-byte Bag regions separately. All share SHA-256 `17fd4dffd4e37b9bc96a7bec33bf63257d027f6f569085addc17e400620464a1`.

The auditor explicitly asserts equality against the seed and validates BPAC identity, SaveData/SaveArray3 links and the 1,952-byte native projection. This closes `AUDIT-GUARD-01`, the missing explicit equality assertion identified in the [historical v2 review](qa-nature-integrated-reset-review.md).

The frozen source battery remains `8c3…`, MAIN counter 11; the saved and cold-loaded battery remains `e574…`, counter 12. Both MAIN CRCs validate, and the cold battery matches the saved one byte for byte. No emulator rerun or evidence mutation was needed. The private independent review has SHA-256 `e47f6c8958d88ed0c73ad4809934bb0b199109949c34ed2bdc2f853f65f59cac`.

This verifies the recorded Reset/Save/cold and Bag-preservation case only. PC transfers, broader Nature consumers and full release acceptance remain outside its scope.

## Español

**PASS dentro del alcance registrado.** Un revisor independiente reprodujo el [informe v3](qa-nature-integrated-reset-save-cold-v3.json) byte a byte y comprobó por separado las cuatro regiones de Bolsa de 2.376 bytes: todas coinciden con el hash completo indicado arriba.

El auditor exige igualdad frente al origen y valida la identidad BPAC, los enlaces SaveData/SaveArray3 y la proyección nativa de 1.952 bytes. Queda cerrada `AUDIT-GUARD-01`, la ausencia de una comprobación explícita de igualdad detectada en la [revisión histórica de v2](qa-nature-integrated-reset-review.md).

La batería congelada de origen sigue siendo `8c3…`, contador MAIN 11; la guardada y cargada en frío sigue siendo `e574…`, contador 12. Sus CRC MAIN son válidos y la batería tras arrancar en frío coincide byte a byte con la guardada. No se repitió la emulación ni se modificó la evidencia. El hash del informe privado independiente figura arriba.

Solo se verifica el caso registrado de Reset/Save/frío y conservación de Bolsa. Quedan fuera las transferencias al PC, los demás consumidores de naturaleza y la aceptación de toda la release.
