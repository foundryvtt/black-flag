import HeritageTypeDataModel from "../item/heritage.mjs";
import RaceTypeDataModel from "../item/race.mjs";
import BackgroundTypeDataModel from "../item/background.mjs";
import TalentTypeDataModel from "../item/talent.mjs";
import EquipmentTypeDataModel from "../item/equipment.mjs";

export default class PlayerCharacterTypeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            level: new fields.NumberField({min: 1, default: 1, max: 20, integer: true}),
            experience: new fields.NumberField({min: 0, default: 0, max: 355000, integer: true}),
            milestones: new fields.NumberField({min: 0, default: 0, integer: true}), // TODO: How do milestones work?
            alignment: new fields.StringField({default: "neutral", choices: CONFIG.SYSTEM.ALIGNMENT_TYPES}),
            hp: new fields.SchemaField({
                max: new fields.NumberField({min: 0, default: 0, integer: true}),
                current: new fields.NumberField({default: 0, integer: true}),
                temp: new fields.NumberField({min: 0, default: 0, integer: true}),
            }),
            luck: new fields.NumberField({min: 0, default: 0, integer: true}), // TODO: Is there a Max? Is this inspiration?
            age: new fields.NumberField({min: 0, default: 0, integer: true}),
            size: new fields.StringField({default: "medium", choices: CONFIG.SYSTEM.RACE_SIZE_TYPES}),
            languages: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.LANGUAGE_TYPES,
            })),
            // features: new fields.SetField({default: [], type: TraitDataModel.defineSchema()}), // TODO: Define features (although aren't these traits now?)
            proficiencies: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.PROFICIENCY_TYPES,
            })),
            proficiencyBonus: new fields.NumberField({min: 0, default: 0, integer: true}), // TODO: Also figure out this
            abilities: new fields.SchemaField({
                strength: new fields.NumberField({min: 0, default: 0, integer: true}),
                dexterity: new fields.NumberField({min: 0, default: 0, integer: true}),
                constitution: new fields.NumberField({min: 0, default: 0, integer: true}),
                intelligence: new fields.NumberField({min: 0, default: 0, integer: true}),
                wisdom: new fields.NumberField({min: 0, default: 0, integer: true}),
                charisma: new fields.NumberField({min: 0, default: 0, integer: true})
            }),
            //class: new fields.ForeignDocumentField({required: true, type: "ClassTypeDataModel"}),
            //race: new fields.ForeignDocumentField(RaceTypeDataModel, {idOnly: true}),
            //heritage: new fields.ForeignDocumentField(HeritageTypeDataModel, {idOnly: true}),
            // backgrounds: new fields.SetField(BackgroundTypeDataModel, {default: []}),
            // talents: new fields.SetField(TalentTypeDataModel, {default: []}),
            //equipment: fields.EmbeddedCollectionField(EquipmentTypeDataModel),
        }
    }
}
