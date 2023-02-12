import {SYSTEM, SYSTEM_ID} from "../CONSTANTS.mjs";
import PlayerCharacterTypeDataModel from "../datamodels/actor/player-character.mjs";
import BackgroundTypeDataModel from "../datamodels/item/background.mjs";
import EquipmentTypeDataModel from "../datamodels/item/equipment.mjs";
import HeritageTypeDataModel from "../datamodels/item/heritage.mjs";
import RaceTypeDataModel from "../datamodels/item/race.mjs";
import TalentTypeDataModel from "../datamodels/item/talent.mjs";
import BlackFlagActor from "../documents/actor.mjs";
import Item from "../documents/item.mjs";
import TalentConfig from "../sheets/items/talent-config.mjs";
import BackgroundConfig from "../sheets/items/background-config.mjs";
import HeritageConfig from "../sheets/items/heritage-config.mjs";


export function init() {
    console.log("Black Flag 🏴 | Initializing Black Flag System")

    CONFIG.SYSTEM = SYSTEM;

    registerDataModels();
    registerDocumentSheets();
    registerDocumentClasses();
    registerHandlebarsHelpers();
}

/* -------------------------------------------- */

function registerDataModels() {
    CONFIG.Actor.dataModels = {
        pc: PlayerCharacterTypeDataModel,
    }

    CONFIG.Item.dataModels = {
        background: BackgroundTypeDataModel,
        equipment: EquipmentTypeDataModel,
        heritage: HeritageTypeDataModel,
        race: RaceTypeDataModel,
        talent: TalentTypeDataModel
    }
}

/* -------------------------------------------- */

function registerDocumentClasses() {
    CONFIG.Actor.documentClass = BlackFlagActor;
    CONFIG.Item.documentClass = Item;
}

/* -------------------------------------------- */

function registerDocumentSheets() {
    //Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet(SYSTEM_ID, TalentConfig, {types: ["talent"], makeDefault: true});
    Items.registerSheet(SYSTEM_ID, BackgroundConfig, {types: ["background"], makeDefault: true});
    Items.registerSheet(SYSTEM_ID, HeritageConfig, {types: ["heritage"], makeDefault: true});
}

/* -------------------------------------------- */

function registerHandlebarsHelpers() {

    // Convert a type and value to a localized label
    Handlebars.registerHelper('typeLabel', (type, value) => {
        return game.i18n.localize(CONFIG.SYSTEM[type][value]?.label);
    });

    // Truncate a string to a certain length with an ellipsis
    Handlebars.registerHelper('truncate', (str, len) => {
        if (str.length > len) {
            return str.slice(0, len) + "...";
        }
        return str;
    });
}