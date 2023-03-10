import {SYSTEM, SYSTEM_ID, SYSTEM_NAME} from "../CONSTANTS.mjs";
import PlayerCharacterTypeDataModel from "../datamodels/actor/player-character.mjs";
import BackgroundTypeDataModel from "../datamodels/item/background.mjs";
import EquipmentTypeDataModel from "../datamodels/item/equipment.mjs";
import HeritageTypeDataModel from "../datamodels/item/heritage.mjs";
import LineageTypeDataModel from "../datamodels/item/lineage.mjs";
import TalentTypeDataModel from "../datamodels/item/talent.mjs";
import BlackFlagActor from "../documents/actor.mjs";
import TalentConfig from "../sheets/items/talent-config.mjs";
import BackgroundConfig from "../sheets/items/background-config.mjs";
import HeritageConfig from "../sheets/items/heritage-config.mjs";
import LineageConfig from "../sheets/items/lineage-config.mjs";
import PcConfig from "../sheets/actors/pc-config.mjs";
import BlackFlagItem from "../documents/item.mjs";

export function init() {
    console.log(`${SYSTEM_NAME} | Initializing  System`)

    CONFIG.SYSTEM = SYSTEM;

    registerDataModels();
    registerDocumentSheets();
    registerDocumentClasses();
    registerHandlebarsHelpers();
}

/* -------------------------------------------- */

function registerDataModels() {
    CONFIG.Actor.systemDataModels = {
        pc: PlayerCharacterTypeDataModel,
    }

    CONFIG.Item.systemDataModels = {
        background: BackgroundTypeDataModel,
        equipment: EquipmentTypeDataModel,
        heritage: HeritageTypeDataModel,
        lineage: LineageTypeDataModel,
        talent: TalentTypeDataModel
    }
}

/* -------------------------------------------- */

function registerDocumentClasses() {
    CONFIG.Actor.documentClass = BlackFlagActor;
    CONFIG.Item.documentClass = BlackFlagItem;
}

/* -------------------------------------------- */

function registerDocumentSheets() {
    if ( !CONFIG.SYSTEM.isDebugging() ){
        Actors.unregisterSheet("core", ActorSheet);
        Items.unregisterSheet("core", ItemSheet);
    }

    // Actors
    Actors.registerSheet(SYSTEM_ID, PcConfig, {types: ["pc"], makeDefault: true});

    // Items
    Items.registerSheet(SYSTEM_ID, TalentConfig, {types: ["talent"], makeDefault: true});
    Items.registerSheet(SYSTEM_ID, BackgroundConfig, {types: ["background"], makeDefault: true});
    Items.registerSheet(SYSTEM_ID, HeritageConfig, {types: ["heritage"], makeDefault: true});
    Items.registerSheet(SYSTEM_ID, LineageConfig, {types: ["lineage"], makeDefault: true});
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
