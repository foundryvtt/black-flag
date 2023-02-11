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
import ForeignDocumentSet from "../templates/webcomponents/foreignDocumentSet.mjs";


export function init() {
    console.log("Black Flag 🏴 | Initializing Black Flag System")

    CONFIG.SYSTEM = SYSTEM;

    registerDataModels();
    registerDocumentSheets();
    registerDocumentClasses();
    registerWebComponents();
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
}

/* -------------------------------------------- */

function registerWebComponents() {
    customElements.define("foreign-document-set", ForeignDocumentSet);
}
