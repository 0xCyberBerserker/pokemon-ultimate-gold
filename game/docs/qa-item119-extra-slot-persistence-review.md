# Expanded Stat Editor gift: root persistence review

## English

Status: PASS_BOUNDED_SAVE_AND_COLD_WITH_DECLARED_TRACE_LIMIT.

Root independently read frozen DSV copies and the four RAM snapshots for scan, native save completion, new cold boot and post-cold Bag UI. Both MAIN CRCs are valid; active counter advances10→11. The complete saved Party block (1,460 bytes) remains byte-exact. The full 2,376-byte BPAC cache is identical across all four snapshots; each has valid magic/current SaveData/projection links and item119×1 in canonical slot584. The cold result specifies no state input and no cheats. Native post-cold UI was reported separately.

Source frozen DSV SHA: `3ad0dd9f5155962a11819af3ad62d9a410cb9d3e2b7fc343ef2a2898967930d0`.
Saved frozen DSV SHA: `0a0a2e3348050e6625e3db7cef5715f188e7727106ff147a1c168d3ec11ad254`.
Acceptance report SHA: `f3f76482e22d5db6e5856cc5e6d17bd9c3ec39dba751741969ffc575f5074062`.

The short intermediate close-Bag run lacks a battery sidecar. Its recorded DSV hash agrees with adjacent frozen evidence; no retrospective sidecar was fabricated. This limits that transition's trace, not the independently verified saved-file/cold-cache observations. No replay was required. This review does not establish a fresh recipient, actual60-slot refusal, EV/IV/Nature editing or campaign acceptance.

## Español

Estado: PASS_BOUNDED_SAVE_AND_COLD_WITH_DECLARED_TRACE_LIMIT.

Root comprobó las DSV congeladas y cuatro capturas RAM. Ambos CRC MAIN son válidos; el contador activo pasa10→11. El bloque completo de equipo de1.460 bytes coincide exactamente. Los2.376 bytes de caché BPAC se conservan durante guardado y arranque frío; identidad y vínculos son válidos, con119×1 en el hueco584. El arranque nuevo declara ausencia de savestate y trucos. Los hashes completos figuran arriba.

Falta el sidecar del paso intermedio de cerrar la Bolsa. Su hash registrado coincide con evidencias congeladas adyacentes; no se fabricó una copia retrospectiva ni se repitió la prueba. Se limita la trazabilidad de ese paso; se conservan las comprobaciones directas de archivo guardado y caché tras frío. No acredita receptor nuevo, rechazo con60 huecos, edición de estadísticas/naturaleza ni campaña completa.
