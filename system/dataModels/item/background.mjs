import BlackFlagItem from "../../documents/item.mjs";
import TraitDataModel from "../trait.mjs";

export default class BackgroundTypeDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            proficiencies: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.PROFICIENCY_TYPES,
            })),
            talents: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "talent", idOnly: true})),
            numberOfTalents: new fields.NumberField({min: 0, default: 0, integer: true}),
            languages: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.LANGUAGE_TYPES,
            })),
            equipment: new fields.StringField({
                required: true,
                default: ""
            }),
            traits: new fields.ArrayField(new fields.EmbeddedDataField(TraitDataModel), {default: []}),
        }
    }
}
