import {SYSTEM} from "../CONSTANTS.mjs";
import PlayerCharacterTypeDataModel from "../datamodels/actor/player-character.mjs";
import BackgroundTypeDataModel from "../datamodels/item/background.mjs";
import EquipmentTypeDataModel from "../datamodels/item/equipment.mjs";
import HeritageTypeDataModel from "../datamodels/item/heritage.mjs";
import RaceTypeDataModel from "../datamodels/item/race.mjs";
import TalentTypeDataModel from "../datamodels/item/talent.mjs";


export function init() {
    console.log("Black Flag 🏴 | Initializing Black Flag System")

    CONFIG.SYSTEM = SYSTEM;

    registerDatamodels();
}

function registerDatamodels() {
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