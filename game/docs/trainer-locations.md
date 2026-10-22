# Trainer locations / Ubicaciones de entrenadores

## English

[`trainer-locations.json`](trainer-locations.json) groups all 737 trainer IDs from the target
archives. It confirms 538 IDs: 148 with literal `TrainerBattle`/`MultiBattle` commands in script
NARC `a/0/1/2`, plus 390 standard NPC object events in event NARC `a/0/3/2`. Object `scriptId`
values use the documented `std_trainer`/`std_trainer_2` encodings (`trainer + 2999`/`trainer +
4999`) and are joined through the target ARM9 map-header table (`0xF6BE0`, 0x18-byte entries).
The remaining 199 IDs are explicitly unverified because variable/rematch paths have no stable map
join here. No route is inferred from trainer ID order.

Map labels use the source identifiers in `constants/maps.h`; route, New Bark and Pallet names have
explicit English/Spanish labels. Any remaining source code retains its provenance and is not
presented as an invented route name.

Each location also records `map_section`, read as the `u8 MapHeader.mapsec` field at target ARM9
header offset `+0x12`. Guard values are New Bark map 60 → 126, Route 29 map 33 → 177, and Azalea
Gym map 180 → 129. PokeAPI's pinned Generation 4 index was checked, but names replace local
labels only when a matching English and Spanish pair exists; unresolved indices retain the local
source label.

The trainer header NARC `a/0/5/5` byte 1 is the trainer class ID. It joins all 737 groups to the
matching extracted `web/sprites/trainers/{class_id:03d}.png` file; each portrait and class ID is
recorded in the JSON and hashed in the sprite manifest. Rematches and variable trainer IDs remain
pending. Runtime is `NOT_RUN`.

## Español

[`trainer-locations.json`](trainer-locations.json) agrupa los 737 IDs de entrenador de los archivos
objetivo. Se confirman 538 IDs: 148 por comandos literales `TrainerBattle`/`MultiBattle` en el
NARC de scripts `a/0/1/2` y 390 por objetos NPC estándar del NARC de eventos `a/0/3/2`. El
`scriptId` del objeto usa las macros `std_trainer`/`std_trainer_2` (`entrenador + 2999`/`entrenador
+ 4999`) y se enlaza con la tabla de cabeceras ARM9 objetivo (`0xF6BE0`, entradas de 0x18 bytes).
Los otros 199 quedan explícitamente sin verificar porque las revanchas y variables no tienen una
unión estable al mapa. No se deducen rutas ordenando los IDs.

Las etiquetas usan los identificadores de `constants/maps.h`; las rutas, Pueblo Primavera y Pueblo
Paleta tienen etiquetas EN/ES explícitas. Los códigos restantes conservan su procedencia y no se
presentan como nombres inventados.

Cada ubicación incluye `map_section`, leído como el campo `u8 MapHeader.mapsec` en `+0x12` de la
cabecera ARM9 objetivo. Valores de control: Pueblo Primavera mapa 60 → 126, Ruta 29 mapa 33 → 177
y Gimnasio de Azalea mapa 180 → 129. Se comprobó el índice de cuarta generación fijado de PokeAPI;
sólo se sustituye una etiqueta cuando existe pareja inglesa y española coincidente. Si no, se
conserva la etiqueta local y su procedencia.

El byte 1 de cada cabecera en `a/0/5/5` es el ID de clase. Así se unen los 737 grupos con
`web/sprites/trainers/{class_id:03d}.png`; cada retrato, clase y hash figura en el manifiesto.
Las revanchas y los IDs variables siguen pendientes; runtime: `NOT_RUN`.
