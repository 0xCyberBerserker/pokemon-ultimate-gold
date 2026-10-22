# Wiki data sources / Fuentes de datos de la wiki

## English

The current encyclopedia targets **Ultimate Gold Alpha 2**, SHA-256
`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`:
493 species, 467 moves, 516 items, 100 TMs/HMs and 737 trainer groups with 2,086 members.
Catalog coverage does not establish complete gameplay acceptance.

### Records and translations

`tools/build_wiki_data.py` reads the exact target's combat records, trainer parties, standard
ability slots, TM/HM assignments and English names. The Normal/Plus selector reflects documented
native level scaling, not invented EV spreads or hidden abilities.

The Pokédex's Alpha 2 stat filter compares the six base stats in the exact clean HeartGold USA
ROM (`65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`) and Alpha 2 FIX6a
(`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`). It labels a species
“boosted” only when its base-stat total rises; same-total changes appear separately as
redistributions. Individual decreases remain visible as trade-offs. Type, ability and move changes
are outside this score. The derived comparison is hash-pinned in
[`species-stat-comparison.json`](species-stat-comparison.json).

The PokeAPI cache is pinned to commit `2bf639e5572812a67d2b94903fdcb9d095f5aeb2`.
English/Spanish language IDs are 9/7; HGSS is version group 10. Generation-4 item joins check
indices against names and explicit old-name aliases. Spanish combines matched references and
project translations, correcting later-generation healing quantities, battle items, flutes,
Exp. Share and Soul Dew. TM/HM descriptions follow the actual linked move. The
[text review](item-description-audit.json) records coverage, corrections and limits; it does not
guarantee every translation or establish native effects.

**Confirmed text-bank bug:** Alpha 2 custom items 113, 114 and 118 have empty native Bag
descriptions in bank 221. Their intended project text was patched into bank 223 instead.
Wiki English text for these items uses those project strings, with its own Spanish translation;
it is not their actual Bag description. Names come from bank 222. The
[exact-target audit](qa-alpha2-item-description-bank.json) records the getter instruction and
entries. The integration candidate must correct this without overwriting the frozen Alpha 2.

### Locations, artwork and verification

Acquisitions distinguish upstream documentation, HGSS references, exact-target stock, static
event/script comparisons and native actions. A missing location means insufficient joined evidence,
not that an item is unobtainable. [HGSS comparisons](qa-item-basegame-compare-batch1.json) do not
prove pickups or captures; stock and price alone do not prove a completed purchase.

Artwork is local and provenance-tracked. Custom icons use supported ROM mappings; question marks
remain explicitly identified placeholders. Captures identify their ROM and test scope. Private
Kris source art is not redistributed in this wiki.

`tools/build_site.py` applies the report-pinned acquisition overlay and exports guides and evidence.
Thus `docs/wiki-data.json` is source data, while `web/data/wiki-data.json` is the generated website
dataset. Assets and links use relative paths for static hosting. The browser patcher neither
includes nor uploads ROMs. Guides link bounded native cases; full adventure, editor, nature,
Kris and release acceptance remain pending.

## Español

La enciclopedia actual corresponde a **Ultimate Gold Alpha 2**, SHA-256
`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`:
493 especies, 467 movimientos, 516 objetos, 100 MT/MO y 737 grupos de entrenadores con 2.086
miembros. Cubrir el catálogo no demuestra aceptación de toda la aventura.

### Registros y traducciones

`tools/build_wiki_data.py` lee registros de combate, equipos, espacios de habilidades estándar,
asignaciones MT/MO y nombres ingleses del objetivo exacto. Normal/Plus refleja el escalado nativo
documentado; no inventa repartos EV ni habilidades ocultas.

El filtro de estadísticas de la Pokédex compara las seis estadísticas base de la ROM limpia
HeartGold USA (`65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105`) y Alpha 2
FIX6a (`24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6`). Solo etiqueta una
especie como “mejorada” si aumenta el total base; los cambios con el mismo total aparecen aparte
como redistribuciones. Las bajadas individuales siguen visibles como compensaciones. Tipos,
habilidades y movimientos no forman parte de esta puntuación. La comparación derivada conserva su
hash en [`species-stat-comparison.json`](species-stat-comparison.json).

La caché PokeAPI está fijada al commit `2bf639e5572812a67d2b94903fdcb9d095f5aeb2`.
Los idiomas English/Español usan IDs 9/7 y HGSS es el grupo de versiones 10. Los objetos se
cruzan por índices Gen4, nombres y aliases explícitos de nombres antiguos. El español combina
referencias y traducciones propias, corrigiendo cantidades de curación, objetos de combate,
flautas, Exp. Share y Soul Dew de generaciones posteriores. Las MT/MO describen su movimiento
real. La [revisión textual](item-description-audit.json) registra cobertura, correcciones y
límites; no garantiza cada traducción ni prueba efectos nativos.

**Fallo confirmado de bancos:** en Alpha 2 están vacías las descripciones nativas de Bolsa de
los objetos custom 113, 114 y 118, en el banco 221. Sus textos previstos se escribieron en el
223. La wiki usa esos textos del proyecto y su traducción española; no son sus descripciones
reales de Bolsa. Los nombres proceden del banco 222. La
[auditoría exacta](qa-alpha2-item-description-bank.json) conserva instrucción del getter y entradas.
La candidata de integración debe corregirlo sin sobrescribir Alpha 2.

### Ubicaciones, gráficos y pruebas

Las adquisiciones distinguen documentación upstream, referencias HGSS, stock exacto, eventos o
guiones comparados y acciones nativas. Una ubicación ausente indica falta de evidencia en el
catálogo, no que el objeto sea imposible de obtener. Los
[contrastes HGSS](qa-item-basegame-compare-batch1.json) no prueban recogidas ni capturas;
stock y precio tampoco demuestran una compra completada.

Los gráficos son locales y conservan su procedencia. Los iconos custom usan mapeos de ROM
contrastados; los interrogantes siguen identificados como placeholders. Las capturas señalan ROM
y alcance de prueba. El arte privado de Kris no se redistribuye en esta wiki.

`tools/build_site.py` aplica el cruce de adquisiciones fijado al informe y exporta guías y pruebas.
`docs/wiki-data.json` es el origen; `web/data/wiki-data.json`, la salida para la web. Enlaces y
assets son relativos para alojamiento estático. El parcheador no incluye ni sube ROMs.
Las guías enlazan casos nativos acotados; faltan aceptación completa de aventura, editor,
naturalezas, Kris y release.

Made with 🖤 in Barcelona City 🇪🇸
