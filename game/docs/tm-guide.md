# Ultimate Gold TM/HM guide

## English

### Technical Machines

The index lists all 92 TMs by game item ID and move name. Locations marked `documented_upstream` come from Drayano's Important Item Locations notes; they are not yet confirmed against this exact Plus ROM. Forty-six TMs have a stated acquisition source; three more entries only say a copy was removed, without naming a replacement source. For the remaining 43, the document says “No change” but does not supply the original pickup or vendor. See the [item location index](item-locations.md) for the evidence policy and full table.

The move mapping is verified against the exact target: its ARM9 contains the unique 100-entry `sTMHMMoves` sequence at file offset `0x1000CC`. Localized move names are joined by move ID from the same-hash target wiki data.

| Item | Move | Item | Move |
|---|---|---|---|
| TM01 | Focus Punch | TM47 | Steel Wing |
| TM02 | Dragon Claw | TM48 | Skill Swap |
| TM03 | Water Pulse | TM49 | Snatch |
| TM04 | Calm Mind | TM50 | Overheat |
| TM05 | Roar | TM51 | Roost |
| TM06 | Toxic | TM52 | Focus Blast |
| TM07 | Hail | TM53 | Energy Ball |
| TM08 | Bulk Up | TM54 | False Swipe |
| TM09 | Bullet Seed | TM55 | Brine |
| TM10 | Hidden Power | TM56 | Fling |
| TM11 | Sunny Day | TM57 | Charge Beam |
| TM12 | Taunt | TM58 | Endure |
| TM13 | Ice Beam | TM59 | Dragon Pulse |
| TM14 | Blizzard | TM60 | Drain Punch |
| TM15 | Hyper Beam | TM61 | Will-O-Wisp |
| TM16 | Light Screen | TM62 | Silver Wind |
| TM17 | Protect | TM63 | Embargo |
| TM18 | Rain Dance | TM64 | Explosion |
| TM19 | Giga Drain | TM65 | Shadow Claw |
| TM20 | Safeguard | TM66 | Payback |
| TM21 | Frustration | TM67 | Recycle |
| TM22 | SolarBeam | TM68 | Giga Impact |
| TM23 | Iron Tail | TM69 | Rock Polish |
| TM24 | Thunderbolt | TM70 | Flash |
| TM25 | Thunder | TM71 | Stone Edge |
| TM26 | Earthquake | TM72 | Avalanche |
| TM27 | Return | TM73 | Thunder Wave |
| TM28 | Dig | TM74 | Gyro Ball |
| TM29 | Psychic | TM75 | Swords Dance |
| TM30 | Shadow Ball | TM76 | Stealth Rock |
| TM31 | Brick Break | TM77 | Psych Up |
| TM32 | Double Team | TM78 | Captivate |
| TM33 | Reflect | TM79 | Dark Pulse |
| TM34 | Shock Wave | TM80 | Rock Slide |
| TM35 | Flamethrower | TM81 | X-Scissor |
| TM36 | Sludge Bomb | TM82 | Sleep Talk |
| TM37 | Sandstorm | TM83 | Natural Gift |
| TM38 | Fire Blast | TM84 | Poison Jab |
| TM39 | Rock Tomb | TM85 | Dream Eater |
| TM40 | Aerial Ace | TM86 | Grass Knot |
| TM41 | Torment | TM87 | Swagger |
| TM42 | Facade | TM88 | Pluck |
| TM43 | Secret Power | TM89 | U-turn |
| TM44 | Rest | TM90 | Substitute |
| TM45 | Attract | TM91 | Flash Cannon |
| TM46 | Thief | TM92 | Trick Room |

Shop entries represent documented availability only. Do not infer that an unchanged TM was added to a shop, or that every quantity is unlimited. Use the in-game shop's displayed stock as the final reference for this ROM.

### Hidden Machines

HM01–HM08 (IDs 420–427) teach Cut, Fly, Surf, Strength, Whirlpool, Rock Smash, Waterfall, and Rock Climb, respectively. Their move mapping is covered by the same target-verified ARM9 sequence above. Their target-ROM acquisition locations have not been verified. This project has not implemented HM field actions without teaching the move: a Pokémon must still know the HM move to use its field action.

### Refill item status

An isolated native-item candidate (`6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`) passed partial acceptance: it refills owned TMs to 99, leaves absent TMs and HMs unchanged, remains reusable, and persists through a normal save and fresh restart without cheats or save states. Its New Bark Town NPC asks before the one-time gift and does not duplicate the item. This acceptance applies to that candidate only; the public browser patcher still produces `fix1` and does not include it until the release manifest is updated.

## Español

### Máquinas Técnicas

El índice recoge las 92 MT por ID de objeto y nombre del movimiento. Las ubicaciones `documented_upstream` proceden de las notas Important Item Locations de Drayano; todavía no están confirmadas en esta ROM Plus exacta. Cuarenta y seis MT tienen una fuente de obtención indicada; otras tres entradas solo dicen que se retiró una copia, sin nombrar una fuente de reemplazo. Para las 43 restantes, el documento dice «No change» pero no especifica la recogida o tienda original. Consulta el [índice de ubicaciones](item-locations.md) para ver la política de evidencia y la tabla completa.

La correspondencia de movimientos está verificada contra el objetivo exacto: su ARM9 contiene la secuencia única de 100 entradas `sTMHMMoves` en el offset de archivo `0x1000CC`. Los nombres localizados se unen por ID de movimiento desde los datos de la wiki generados para ese mismo hash.

| Objeto | Movimiento | Objeto | Movimiento |
|---|---|---|---|
| MT01 | Puño Certero | MT47 | Ala de Acero |
| MT02 | Garra Dragón | MT48 | Intercambio |
| MT03 | Hidropulso | MT49 | Robo |
| MT04 | Paz Mental | MT50 | Sofoco |
| MT05 | Rugido | MT51 | Respiro |
| MT06 | Tóxico | MT52 | Onda Certera |
| MT07 | Granizo | MT53 | Energibola |
| MT08 | Corpulencia | MT54 | Falso Tortazo |
| MT09 | Semilladora | MT55 | Salmuera |
| MT10 | Poder Oculto | MT56 | Lanzamiento |
| MT11 | Día Soleado | MT57 | Rayo Carga |
| MT12 | Mofa | MT58 | Aguante |
| MT13 | Rayo Hielo | MT59 | Pulso Dragón |
| MT14 | Ventisca | MT60 | Puño Drenaje |
| MT15 | Hiperrayo | MT61 | Fuego Fatuo |
| MT16 | Pantalla de Luz | MT62 | Viento Plata |
| MT17 | Protección | MT63 | Embargo |
| MT18 | Danza Lluvia | MT64 | Explosión |
| MT19 | Gigadrenado | MT65 | Garra Umbría |
| MT20 | Velo Sagrado | MT66 | Vendetta |
| MT21 | Frustración | MT67 | Reciclaje |
| MT22 | Rayo Solar | MT68 | Gigaimpacto |
| MT23 | Cola Férrea | MT69 | Pulimento |
| MT24 | Rayo | MT70 | Destello |
| MT25 | Trueno | MT71 | Roca Afilada |
| MT26 | Terremoto | MT72 | Alud |
| MT27 | Retribución | MT73 | Onda Trueno |
| MT28 | Excavar | MT74 | Giro Bola |
| MT29 | Psíquico | MT75 | Danza Espada |
| MT30 | Bola Sombra | MT76 | Trampa Rocas |
| MT31 | Demolición | MT77 | Autosugestión |
| MT32 | Doble Equipo | MT78 | Seducción |
| MT33 | Reflejo | MT79 | Pulso Umbrío |
| MT34 | Onda Voltio | MT80 | Avalancha |
| MT35 | Lanzallamas | MT81 | Tijera X |
| MT36 | Bomba Lodo | MT82 | Sonámbulo |
| MT37 | Tormenta de Arena | MT83 | Don Natural |
| MT38 | Llamarada | MT84 | Puya Nociva |
| MT39 | Tumba Rocas | MT85 | Comesueños |
| MT40 | Golpe Aéreo | MT86 | Hierba Lazo |
| MT41 | Tormento | MT87 | Fanfarronear |
| MT42 | Fachada | MT88 | Picoteo |
| MT43 | Daño Secreto | MT89 | Ida y Vuelta |
| MT44 | Descanso | MT90 | Sustituto |
| MT45 | Atracción | MT91 | Cañón Resplandor |
| MT46 | Ladrón | MT92 | Espacio Raro |

Las tiendas representan disponibilidad documentada. No deduzcas que una MT sin cambios se haya añadido a una tienda ni que tenga existencias ilimitadas. Para esta ROM, comprueba las existencias que muestra la tienda dentro del juego.

### Máquinas Ocultas

Las MO01–MO08 (IDs 420–427) enseñan Corte, Vuelo, Surf, Fuerza, Torbellino, Golpe Roca, Cascada y Treparrocas, respectivamente. Su correspondencia de movimientos queda cubierta por la misma secuencia ARM9 verificada en el objetivo. Sus ubicaciones de obtención aún no se han verificado en la ROM. El proyecto no ha implementado el uso de acciones de campo sin enseñar la MO: un Pokémon debe conocer el movimiento para usar su acción de campo.

### Estado del objeto de reposición

Una candidata aislada del objeto nativo (`6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132`) superó una aceptación parcial: repone a 99 las MT que ya tienes, deja intactas las MT ausentes y las MO, es reutilizable y persiste tras guardar y reiniciar en limpio, sin trucos ni estados de guardado. El NPC de Pueblo Primavera pregunta antes de entregar el objeto una sola vez y no lo duplica. Esta aceptación solo se aplica a esa candidata; el patcher web público sigue generando `fix1` y no incluye el objeto hasta actualizar el manifiesto de release.
