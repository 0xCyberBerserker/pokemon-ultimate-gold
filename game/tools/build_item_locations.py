#!/usr/bin/env python3
"""Build the bilingual TM/HM acquisition index from pinned local evidence."""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import sys

EXPECTED_TARGET = "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"
SOURCE_URL = "https://gbatemp.net/threads/pokemon-sacred-gold-storm-silver.327567/"
ITEM_GUIDE_URL = "https://seatgem.com/2018/09/pokemon-sacred-gold-storm-silver-important-item-locations.html"
TMHM_MOVE_IDS = [264,337,352,347,46,92,258,339,331,237,241,269,58,59,63,113,182,240,202,219,218,76,231,85,87,89,216,91,94,247,280,104,115,351,53,188,201,126,317,332,259,263,290,156,213,168,211,285,289,315,355,411,412,206,362,374,451,203,406,409,261,318,373,153,421,371,278,416,397,148,444,419,86,360,14,446,244,445,399,157,404,214,363,398,138,447,207,365,369,164,430,433,15,19,57,70,250,249,127,431]
REMOVED_ONLY_TMS = {12, 57, 83}

CATEGORIES = {
    3: {"en": "Evolution item", "es": "Objeto evolutivo"},
    4: {"en": "Key item", "es": "Objeto clave"},
    5: {"en": "Fossil", "es": "Fósil"},
    6: {"en": "Other item", "es": "Otro objeto"},
}

# Entries are transcribed from the same Drayano item-location guide as TM_NOTES.
# Multiple rows preserve the guide's distinct acquisition methods.
OBJECT_ACQUISITIONS = {
    438: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("route-42", "Route 42", "Ruta 42", "Found in an item ball.", "Está en una Poké Ball.")]),
    439: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("ice-path", "Ice Path", "Cueva Helada", "Found in an item ball.", "Está en una Poké Ball.")]),
    467: (3, [("in-game-trade", "Any in-game trade", "Cualquier intercambio del juego", "Automatically received after completing any in-game trade.", "Se recibe automáticamente al completar cualquier intercambio del juego.")]),
    227: (3, [("route-47-embedded-tower-beach", "Route 47 beach, near the Embedded Tower", "Playa de la Ruta 47, cerca de la Torre Oculta", "Found hidden on the beach, closer to the Embedded Tower entrance.", "Está oculta en la playa, más cerca de la entrada de la Torre Oculta.")]),
    226: (3, [("route-47-cliff-cave-beach", "Route 47 beach, near the Cliff Cave exit", "Playa de la Ruta 47, cerca de la salida de la Cueva Acantilado", "Found hidden on the beach, closer to the Cliff Cave exit.", "Está oculta en la playa, más cerca de la salida de la Cueva Acantilado.")]),
    235: (3, [("blackthorn-pokemon-center", "Blackthorn City Pokémon Center", "Centro Pokémon de Ciudad Endrino", "Gift from a person in the Pokémon Center.", "La entrega una persona del Centro Pokémon.")]),
    324: (3, [("team-rocket-hideout", "Team Rocket's Hideout", "Escondite Rocket", "Moved to this location.", "Se trasladó a este lugar.")]),
    322: (3, [("route-44", "Route 44", "Ruta 44", "Found on Route 44.", "Está en la Ruta 44.")]),
    221: (3, [("mahogany-pokemon-center", "Mahogany Town Pokémon Center", "Centro Pokémon de Pueblo Caoba", "Gift from a man in the Pokémon Center.", "La entrega un hombre del Centro Pokémon.")]),
    323: (3, [("ice-path-top-floor", "Ice Path, top floor", "Cueva Helada, planta superior", "Found on the top floor.", "Está en la planta superior.")]),
    233: (3, [("olivine-house", "House in Olivine City", "Casa de Ciudad Olivo", "Gift from a man in a house.", "La entrega un hombre en una casa.")]),
    110: (3, [("route-34", "Route 34", "Ruta 34", "Found in an item ball.", "Está en una Poké Ball.")]),
    321: (3, [("victory-road-first-room", "Victory Road, first room", "Calle Victoria, primera sala", "Found in the first room.", "Está en la primera sala.")]),
    326: (3, [("cianwood-house", "House in Cianwood City", "Casa de Ciudad Orquídea", "Gift from a man in a house.", "La entrega un hombre en una casa.")]),
    327: (3, [("cianwood-house", "House in Cianwood City", "Casa de Ciudad Orquídea", "Gift from a man in a house.", "La entrega un hombre en una casa.")]),
    325: (3, [("dark-cave-blackthorn-entrance", "Dark Cave, Blackthorn entrance", "Cueva Oscura, entrada de Ciudad Endrino", "Found when entering Dark Cave from the Blackthorn side.", "Está al entrar en la Cueva Oscura desde el lado de Ciudad Endrino.")]),
    436: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("ruins-of-alph-light-wall", "Ruins of Alph, behind the LIGHT wall", "Ruinas Alfa, tras el muro LIGHT", "Found in an item ball behind the LIGHT wall.", "Está en una Poké Ball tras el muro LIGHT.")]),
    252: (3, [("ruins-of-alph-unown-14", "Ruins of Alph", "Ruinas Alfa", "Reward for catching 14 Unown.", "Recompensa por capturar 14 Unown."), ("safari-zone-pokemon-center", "Safari Zone Pokémon Center", "Centro Pokémon de la Zona Safari", "Gift from a man after the Rocket invasion has ended.", "La entrega un hombre cuando termina la invasión Rocket.")]),
    454: (3, [("route-42-apricorn-trees", "Route 42, by the Apricorn trees", "Ruta 42, junto a los árboles de Bonguri", "Found by the Apricorn trees.", "Está junto a los árboles de Bonguri."), ("route-27-whirlpool", "Route 27", "Ruta 27", "Found past the whirlpool.", "Está al otro lado del remolino.")]),
    433: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("ilex-forest", "Ilex Forest", "Bosque Encinar", "Found in an item ball.", "Está en una Poké Ball.")]),
    109: (3, [("route-35", "Route 35", "Ruta 35", "Found in an item ball.", "Está en una Poké Ball."), ("blackthorn-shop", "Blackthorn City shop", "Tienda de Ciudad Endrino", "Available for purchase.", "Se puede comprar.")]),
    108: (3, [("mt-mortar-second-room", "Mt. Mortar, second room", "Monte Mortero, segunda sala", "Found in the second room.", "Está en la segunda sala."), ("blackthorn-shop", "Blackthorn City shop", "Tienda de Ciudad Endrino", "Available for purchase.", "Se puede comprar.")]),
    82: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("goldenrod-shop", "Goldenrod City shop", "Tienda de Ciudad Trigal", "Available for purchase.", "Se puede comprar.")]),
    85: (3, [("goldenrod-shop", "Goldenrod City shop", "Tienda de Ciudad Trigal", "Available for purchase.", "Se puede comprar.")]),
    81: (3, [("olivine-city-night", "Olivine City", "Ciudad Olivo", "Once per day, a man gives it to you during nighttime hours.", "Un hombre la entrega una vez al día durante la noche.")]),
    107: (3, [("battle-frontier-entrance", "Battle Frontier entrance", "Entrada del Frente Batalla", "Found at the entrance; the guide says access opens after earning the Mineral Badge.", "Está en la entrada; la guía indica que se accede tras obtener la Medalla Mineral."), ("blackthorn-shop", "Blackthorn City shop", "Tienda de Ciudad Endrino", "Available for purchase.", "Se puede comprar.")]),
    80: (3, [("olivine-city-day", "Olivine City", "Ciudad Olivo", "Once per day, a man gives it to you during daylight hours.", "Un hombre la entrega una vez al día durante el día.")]),
    83: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("goldenrod-shop", "Goldenrod City shop", "Tienda de Ciudad Trigal", "Available for purchase.", "Se puede comprar.")]),
    84: (3, [("sprout-tower", "Sprout Tower", "Torre Bellsprout", "Gift from the head sage.", "La entrega el sabio principal."), ("goldenrod-shop", "Goldenrod City shop", "Tienda de Ciudad Trigal", "Available for purchase.", "Se puede comprar.")]),
    99: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    100: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    101: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    102: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    104: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    105: (5, [("goldenrod-archaeological-center", "Goldenrod Archaeological Center", "Centro Arqueológico de Ciudad Trigal", "One fossil of this kind is given by a man; fossils can be revived in Goldenrod.", "Un hombre entrega un fósil de este tipo; los fósiles se pueden revivir en Ciudad Trigal.")]),
    103: (5, [("location-unspecified", "Location not specified by the guide", "Lugar no especificado en la guía", "The guide says Old Amber must be found normally but does not identify a specific location.", "La guía indica que el Ámbar Viejo se encuentra de forma normal, pero no especifica el lugar.")]),
    445: (4, [("cherrygrove-guide-gent", "Cherrygrove City", "Ciudad Cerezo", "Given by the Guide Gent.", "La entrega el señor guía.")]),
    446: (4, [("olivine-diner", "Olivine City diner", "Restaurante de Ciudad Olivo", "Given by a Fisherman.", "La entrega un pescador.")]),
    447: (4, [("blackthorn-city", "Blackthorn City", "Ciudad Endrino", "Given by a Fisherman.", "La entrega un pescador.")]),
    450: (4, [("new-bark-town-home", "Player's home in New Bark Town", "Casa del jugador en Pueblo Primavera", "Given by your mother at the start of the game.", "La entrega tu madre al inicio del juego.")]),
    502: (4, [("new-bark-town-home", "Player's home in New Bark Town", "Casa del jugador en Pueblo Primavera", "Given by your mother at the start of the game.", "La entrega tu madre al inicio del juego.")]),
    216: (6, [("violet-pokemon-center", "Violet City Pokémon Center", "Centro Pokémon de Ciudad Malva", "Given by a Scientist in the Pokémon Center.", "La entrega un científico del Centro Pokémon.")]),
    231: (6, [("mr-pokemon-red-scale", "Mr. Pokémon's house", "Casa del Sr. Pokémon", "Given in exchange for the Red Scale; also a reward for catching 21 Unown from a man in the Ruins of Alph.", "La entrega a cambio de la Escama Roja; también la da un hombre en las Ruinas Alfa por capturar 21 Unown.")]),
    258: (6, [("goldenrod-magnet-train-station", "Goldenrod Magnet Train station", "Estación del Magnetotrén de Ciudad Trigal", "A woman gives it when you show her a Cubone or Marowak in the party.", "Una mujer la entrega si le enseñas un Cubone o Marowak en el equipo.")]),
    236: (6, [("goldenrod-magnet-train-station", "Goldenrod Magnet Train station", "Estación del Magnetotrén de Ciudad Trigal", "A woman gives it when you show her the corresponding Pokémon; the guide gives Light Ball as an example.", "Una mujer la entrega si le enseñas el Pokémon correspondiente; la guía pone Bola Luminosa como ejemplo.")]),
    259: (6, [("goldenrod-magnet-train-station", "Goldenrod Magnet Train station", "Estación del Magnetotrén de Ciudad Trigal", "A woman gives it when you show her the corresponding Pokémon; the guide gives Stick as an example.", "Una mujer lo entrega si le enseñas el Pokémon correspondiente; la guía pone Stick como ejemplo.")]),
}

# Drayano's Item Locations document, transcribed from the publicly visible
# text mirror; only claims marked "No change" are retained as inherited notes.
TM_NOTES = {
 1:("Saffron City", "Ciudad Azafrán", "Also purchasable in Saffron City.", "También se puede comprar en Ciudad Azafrán."),
 2:("Goldenrod City lottery", "Lotería de Ciudad Trigal", "The Route 26 copy was removed; the guide lists the Goldenrod lottery as the remaining source.", "Se retiró la copia de la Ruta 26; la guía indica la lotería de Ciudad Trigal como fuente restante."),
 3:("Route 32 Pokémon Center", "Centro Pokémon de la Ruta 32", "Also received from a Fisherman in the Pokémon Center.", "También la entrega un pescador del Centro Pokémon."),
 4:("Goldenrod City Pokémon Center", "Centro Pokémon de Ciudad Trigal", "Received from a man in the Pokémon Center.", "La entrega un hombre del Centro Pokémon."),
 6:("Cliff Cave", "Cueva Acantilado", "Automatically obtained after defeating Petrel.", "Se obtiene automáticamente al derrotar a Petrel."),
 7:("Mahogany Town shop", "Tienda de Pueblo Caoba", "Also sold at the shop.", "También se vende en la tienda."),
 8:("Goldenrod City Pokémon Center", "Centro Pokémon de Ciudad Trigal", "Received from a man in the Pokémon Center.", "La entrega un hombre del Centro Pokémon."),
 10:("Ruins of Alph", "Ruinas Alfa", "Reward for capturing seven different types of Unown.", "Recompensa por capturar siete tipos distintos de Unown."),
 11:("Mahogany Town shop", "Tienda de Pueblo Caoba", "Also sold at the shop.", "También se vende en la tienda."),
12:("Burned Tower (removed copy)", "Torre Quemada (copia retirada)", "The guide says the Burned Tower copy was removed and gives no replacement source; current availability is unresolved.", "La guía indica que se retiró la copia de la Torre Quemada y no ofrece otra fuente; la disponibilidad actual queda sin resolver."),
 13:("Ice Path; Goldenrod Game Corner", "Cueva Helada; casino de Ciudad Trigal", "Also found in Ice Path; Game Corner price reduced to 4,000 coins.", "También está en la Cueva Helada; el precio del casino baja a 4.000 monedas."),
 18:("Mahogany Town shop", "Tienda de Pueblo Caoba", "Also sold at the shop.", "También se vende en la tienda."),
 19:("Route 39", "Ruta 39", "Also in an item ball on Route 39.", "También está en una Poké Ball de la Ruta 39."),
 23:("Pewter City", "Ciudad Plateada", "Also purchasable in Pewter City.", "También se puede comprar en Ciudad Plateada."),
 24:("Olivine Lighthouse; Goldenrod Game Corner", "Faro de Ciudad Olivo; casino de Ciudad Trigal", "Also on the shore east of Olivine Lighthouse; Game Corner price reduced to 4,000 coins.", "También está en la orilla al este del Faro de Ciudad Olivo; el precio del casino baja a 4.000 monedas."),
 26:("Celadon City", "Ciudad Azulona", "Purchasable in Celadon City.", "Se puede comprar en Ciudad Azulona."),
 28:("Goldenrod City", "Ciudad Trigal", "Removed from Celadon City; purchasable in Goldenrod City.", "Se retiró de Ciudad Azulona; se puede comprar en Ciudad Trigal."),
 29:("Ruins of Alph", "Ruinas Alfa", "Found at the bottom-right of the Ruins of Alph.", "Está en la zona inferior derecha de las Ruinas Alfa."),
 30:("Lavender Town", "Pueblo Lavanda", "Also purchasable in Lavender Town.", "También se puede comprar en Pueblo Lavanda."),
 31:("Route 36", "Ruta 36", "Received from a man on Route 36.", "La entrega un hombre de la Ruta 36."),
 34:("Azalea Town Pokémon Center", "Centro Pokémon de Pueblo Azalea", "Received from a man in the Pokémon Center.", "La entrega un hombre del Centro Pokémon."),
 35:("Bellchime Trail; Goldenrod Game Corner", "Sendero Campana; casino de Ciudad Trigal", "Also found on Bellchime Trail; Game Corner price reduced to 4,000 coins.", "También está en el Sendero Campana; el precio del casino baja a 4.000 monedas."),
 37:("Mahogany Town shop", "Tienda de Pueblo Caoba", "Also sold at the shop.", "También se vende en la tienda."),
 40:("Route 34", "Ruta 34", "Also obtainable on Route 34.", "También se puede obtener en la Ruta 34."),
 45:("Vermilion City", "Ciudad Carmín", "Also purchasable in Vermilion City.", "También se puede comprar en Ciudad Carmín."),
 46:("Azalea Town", "Pueblo Azalea", "The Rocket Hideout copy was removed; a man in Azalea Town gives it.", "Se retiró la copia del Escondite Rocket; la entrega un hombre de Pueblo Azalea."),
 47:("Olivine Lighthouse", "Faro de Ciudad Olivo", "Found in an item ball.", "Está en una Poké Ball."),
 48:("Mahogany Town shop", "Tienda de Pueblo Caoba", "Also sold at the shop.", "También se vende en la tienda."),
 50:("Burned Tower basement", "Sótano de la Torre Quemada", "Also obtainable in the basement.", "También se puede obtener en el sótano."),
 51:("Goldenrod City", "Ciudad Trigal", "Also purchasable in Goldenrod City.", "También se puede comprar en Ciudad Trigal."),
 53:("Route 39; Celadon City", "Ruta 39; Ciudad Azulona", "Gift from a girl on Route 39; also sold in Celadon City.", "Regalo de una chica de la Ruta 39; también se vende en Ciudad Azulona."),
 55:("Goldenrod City Department Store", "Centro Comercial de Ciudad Trigal", "Removed from Celadon Mart; sold in Goldenrod Department Store.", "Se retiró del Centro Comercial de Ciudad Azulona; se vende en el de Ciudad Trigal."),
57:("Olivine City (removed copy)", "Ciudad Olivo (copia retirada)", "The guide says the Olivine City copy was removed and gives no replacement source; current availability is unresolved.", "La guía indica que se retiró la copia de Ciudad Olivo y no ofrece otra fuente; la disponibilidad actual queda sin resolver."),
 59:("Cerulean City", "Ciudad Celeste", "Also purchasable in Cerulean City.", "También se puede comprar en Ciudad Celeste."),
 61:("Ecruteak City Mart", "Tienda de Ciudad Iris", "Obtained from Fantina at the Mart.", "La entrega Fantina en la tienda."),
 62:("Route 39", "Ruta 39", "Found on Route 39.", "Está en la Ruta 39."),
 63:("Route 40", "Ruta 40", "Moved to Route 40.", "Se trasladó a la Ruta 40."),
 65:("Ecruteak City", "Ciudad Iris", "Moved to Ecruteak City.", "Se trasladó a Ciudad Iris."),
 70:("Route 10 Pokémon Center", "Centro Pokémon de la Ruta 10", "Removed from Goldenrod; given as a free gift at the Pokémon Center.", "Se retiró de Ciudad Trigal; se entrega gratis en el Centro Pokémon."),
 71:("Indigo Plateau; Celadon City", "Meseta Añil; Ciudad Azulona", "Received from a man at Indigo Plateau; also sold in Celadon City.", "La entrega un hombre de la Meseta Añil; también se vende en Ciudad Azulona."),
 73:("Olivine Lighthouse", "Faro de Ciudad Olivo", "Obtained from Volkner.", "La entrega Lectro."),
 76:("Mt. Mortar", "Monte Mortero", "On the ground at the middle entrance.", "En el suelo de la entrada central."),
 80:("Ruins of Alph", "Ruinas Alfa", "Behind the LIGHT door.", "Tras la puerta LIGHT."),
 81:("Ilex Forest; Celadon City", "Bosque Encinar; Ciudad Azulona", "Received from a Bug Catcher in Ilex Forest; also sold in Celadon City.", "La entrega un Cazabichos del Bosque Encinar; también se vende en Ciudad Azulona."),
83:("Goldenrod City Department Store (removed stock)", "Centro Comercial de Ciudad Trigal (existencias retiradas)", "The guide says it was removed from Goldenrod Mart and gives no replacement source; current availability is unresolved.", "La guía indica que se retiró del Centro Comercial de Ciudad Trigal y no ofrece otra fuente; la disponibilidad actual queda sin resolver."),
 84:("Route 47", "Ruta 47", "Automatically obtained after battling Ariana.", "Se obtiene automáticamente tras combatir con Ariana."),
 86:("Ilex Forest; Goldenrod City Department Store", "Bosque Encinar; Centro Comercial de Ciudad Trigal", "Obtainable from Gardenia in Ilex Forest; also sold at the Department Store.", "La entrega Gardenia en el Bosque Encinar; también se vende en el Centro Comercial."),
 89:("Viridian City", "Ciudad Verde", "Also sold in Viridian City.", "También se vende en Ciudad Verde."),
 92:("Ecruteak City", "Ciudad Iris", "Also obtainable from a clown in Ecruteak City.", "También se puede obtener de un payaso en Ciudad Iris."),
}

def build(target: pathlib.Path, reference_dir: pathlib.Path, wiki_data_path: pathlib.Path) -> dict:
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    if digest != EXPECTED_TARGET:
        raise ValueError(f"target hash mismatch: {digest}")
    if not reference_dir.is_dir() or not (reference_dir / "SOURCE_STATUS.md").is_file():
        raise ValueError("reference directory must contain its SOURCE_STATUS.md provenance record")
    wiki_data = json.loads(wiki_data_path.read_text(encoding="utf-8"))
    if wiki_data.get("inherited_data_sha256", wiki_data.get("target_sha256")) != digest:
        raise ValueError("wiki data does not use this verified inherited-data ROM")
    if len(TMHM_MOVE_IDS) != 100:
        raise ValueError("internal TM/HM move table must have 100 entries")
    items = {}
    for item_id in range(328, 428):
        is_tm = item_id < 420
        number = item_id - (328 if is_tm else 420) + 1
        prefix = "TM" if is_tm else "HM"
        name_en, name_es = f"{prefix}{number:02d}", ("MT" if is_tm else "MO") + f"{number:02d}"
        category = {"en": "Technical Machine" if is_tm else "Hidden Machine", "es": "Máquina Técnica" if is_tm else "Máquina Oculta"}
        row = {"id": item_id, "name": {"en": name_en, "es": name_es}, "category_id": 1 if is_tm else 2, "category": category, "acquisition": []}
        move_id = TMHM_MOVE_IDS[item_id - 328]
        move = wiki_data["moves"].get(str(move_id))
        if move is None:
            raise ValueError(f"target wiki data is missing move {move_id}")
        row["move_id"] = move_id
        row["move"] = move["name"]
        row["move_source"] = {"status": "verified_target", "arm9_file_offset": "0x1000CC", "method": "Unique 100-entry sTMHMMoves sequence matched in target ARM9; localized names joined by move ID from same-hash target wiki data."}
        if is_tm and number in TM_NOTES:
            loc_en, loc_es, method_en, method_es = TM_NOTES[number]
            row["acquisition"].append({
                "location": {"id": f"tm{number:02d}-documented", "name": {"en": loc_en, "es": loc_es}},
                "method": {"en": method_en, "es": method_es},
                "status": "documented_upstream",
                "source": {"title": "Drayano, Important Item Locations (secondary text mirror)", "author_reference": SOURCE_URL, "transcription": ITEM_GUIDE_URL, "claim": "Upstream documentation; not verified in this target ROM."}
            })
        elif is_tm:
            row["acquisition"].append({
                "location": {"id": "unchanged-from-heartgold", "name": {"en": "HeartGold base-game location (unchanged)", "es": "Ubicación original de HeartGold (sin cambios)"}},
                "method": {"en": "Drayano's guide says this TM's location did not change; it does not name the original pickup or vendor. Consult a HeartGold-specific location guide.", "es": "La guía de Drayano indica que la ubicación de esta MT no cambió; no especifica la recogida o tienda original. Consulta una guía de ubicaciones de HeartGold."},
                "status": "documented_upstream",
                "source": {"title": "Drayano, Important Item Locations (secondary text mirror)", "author_reference": SOURCE_URL, "transcription": ITEM_GUIDE_URL, "claim": "The guide explicitly says no location change; exact base-game spot not transcribed."}
            })
        items[str(item_id)] = row
    for item_id, (category_id, acquisitions) in OBJECT_ACQUISITIONS.items():
        item = wiki_data["items"].get(str(item_id))
        if item is None:
            raise ValueError(f"target wiki data is missing item {item_id}")
        rows = []
        for location_id, location_en, location_es, method_en, method_es in acquisitions:
            rows.append({
                "location": {"id": location_id, "name": {"en": location_en, "es": location_es}},
                "method": {"en": method_en, "es": method_es},
                "status": "documented_upstream",
                "source": {"title": "Drayano, Important Item Locations (secondary text mirror)", "author_reference": SOURCE_URL, "transcription": ITEM_GUIDE_URL, "claim": "Upstream documentation; not verified in this target ROM."}
            })
        items[str(item_id)] = {
            "id": item_id,
            "name": item["name"],
            "category_id": category_id,
            "category": CATEGORIES[category_id],
            "acquisition": rows,
        }
    return {"schema": "ultimate-gold-item-locations/v1", "target_sha256": digest, "items": items}

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", type=pathlib.Path, required=True, help="Exact target ROM used for this index")
    parser.add_argument("--reference-dir", type=pathlib.Path, required=True, help="Directory containing source provenance records")
    parser.add_argument("--wiki-data", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[1] / "docs" / "wiki-data.json", help="Same-target move-name table")
    parser.add_argument("--output", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[1] / "docs" / "item-locations.json")
    args = parser.parse_args()
    try:
        data = build(args.target, args.reference_dir, args.wiki_data)
    except (OSError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"target_sha256": data["target_sha256"], "items": len(data["items"]), "tm_entries_with_upstream_note": sum(bool(data["items"][str(i)]["acquisition"]) for i in range(328,420)), "tm_with_availability_claim": sum(bool(data["items"][str(i)]["acquisition"]) and i-327 not in REMOVED_ONLY_TMS and data["items"][str(i)]["acquisition"][0]["location"]["id"]!="unchanged-from-heartgold" for i in range(328,420)), "tm_removed_only": len(REMOVED_ONLY_TMS), "tm_unchanged_without_spot": sum(bool(data["items"][str(i)]["acquisition"]) and data["items"][str(i)]["acquisition"][0]["location"]["id"]=="unchanged-from-heartgold" for i in range(328,420)), "hm_without_location": sum(not data["items"][str(i)]["acquisition"] for i in range(420,428)), "other_items_with_acquisition": len(OBJECT_ACQUISITIONS), "output": str(args.output)}, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
