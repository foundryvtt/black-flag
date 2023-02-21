import BlackFlagItem from "../../documents/item.mjs";
import TraitDataModel from "../trait.mjs";

export default class PlayerCharacterTypeDataModel extends foundry.abstract.DataModel {

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
            // features: new fields.SetField({default: [], type: TraitDataModel.defineSchema()}), // TODO: Define features (although aren't these talents now?)
            proficiencies: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.PROFICIENCY_TYPES,
            })),
            proficiencyBonus: new fields.NumberField({min: 0, default: 0, integer: true}), // TODO: Also figure out this
            resistances: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.DAMAGE_TYPES,
            })),
            saveAdvantages: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.DAMAGE_TYPES,
            })),
            abilities: new fields.SchemaField({
                strength: new fields.NumberField({min: 0, default: 0, integer: true}),
                dexterity: new fields.NumberField({min: 0, default: 0, integer: true}),
                constitution: new fields.NumberField({min: 0, default: 0, integer: true}),
                intelligence: new fields.NumberField({min: 0, default: 0, integer: true}),
                wisdom: new fields.NumberField({min: 0, default: 0, integer: true}),
                charisma: new fields.NumberField({min: 0, default: 0, integer: true})
            }),
            class: new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "class", idOnly: true}),
            lineage: new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "lineage", idOnly: true}),
            heritage: new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "heritage", idOnly: true}),
            backgrounds: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "background", idOnly: true})),
            talents: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "talent", idOnly: true})),
            equipment: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "equipment", idOnly: true})),
            traits: new fields.SetField(TraitDataModel.defineSchema(), {default: []})
        }
    }
}
