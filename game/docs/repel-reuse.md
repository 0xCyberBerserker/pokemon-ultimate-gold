# Reusable Repels / Repelentes reutilizables

## English

**Status: experimental, partial native QA. This feature is outside the downloadable Alpha 1 patch.**

With the optional Cheat Kit marker, the intended behavior is to reuse Repels while keeping their normal duration.

The first prototype missed the Bag's direct consumption path. Its corrected revision, **fix6a**, used Max Repel with no active codes: the duration changed from 0 to 250 steps and quantity stayed at 1. All 594 canonical inventory slots and the complete 4 KiB feature reserve remained unchanged.

The [QA report](qa-repel-reuse.json) records the rejected prototype and corrected run separately. [View the native use message and retained item](../assets/locations/repel-fix6a-use.png).

Native saving and a fresh-process reload preserved quantity 1 and the active 250-step counter. A separate marker-absent test consumed Max Repel normally: quantity 1→0, duration 0→250, with other inventory unchanged. Its one-frame preparation removed only the marker; no codes were active during item use.

The [remaining native QA](repel-remaining-qa.md) also passed Super Repel (200 steps), Repel (100 steps), and Max Repel reuse after expiry. The expiry fixture reduced the counter to one before a native land step; it did not walk all 250 steps. All three retained quantity 1 with the kit marker. These are bounded emulated tests, outside the Alpha 1 download and full-game acceptance. Candidate SHA-256: `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`.

## Español

**Estado: experimental, QA nativo parcial. Esta función queda fuera del parche descargable Alfa 1.**

Con el marcador opcional Cheat Kit, el comportamiento previsto es reutilizar los repelentes manteniendo su duración normal.

El primer prototipo no cubría la vía de consumo directo de la Bolsa. La revisión corregida, **fix6a**, usó Max Repel (Repelente Máximo) sin códigos activos: la duración pasó de 0 a 250 pasos y la cantidad se mantuvo en 1. Los 594 espacios canónicos del inventario y los 4 KiB completos de reserva de funciones quedaron intactos.

El [informe de QA](qa-repel-reuse.json) separa el prototipo rechazado de la prueba corregida. [Ver el mensaje de uso nativo y el objeto conservado](../assets/locations/repel-fix6a-use.png).

El guardado nativo y una recarga en un proceso nuevo conservaron la cantidad 1 y el contador activo de 250 pasos. Una prueba separada sin marcador consumió Max Repel normalmente: cantidad 1→0, duración 0→250 y resto del inventario intacto. Su preparación de un fotograma retiró únicamente el marcador; no había códigos activos al usar el objeto.

El [QA nativo restante](repel-remaining-qa.md) también superó Super Repel (Superrepelente, 200 pasos), Repel (Repelente, 100 pasos) y la reutilización de Max Repel al caducar. La preparación redujo el contador a uno antes de un paso terrestre nativo; no se caminaron los 250 pasos completos. Los tres conservaron cantidad 1 con el marcador del kit. Son pruebas emuladas acotadas, fuera de la descarga Alfa 1 y de la aceptación del juego completo. SHA-256 de la candidata: `24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`.

Made with 🖤 in Barcelona City 🇪🇸
