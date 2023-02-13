import TraitDataModel from "../trait.mjs";

export default class LineageTypeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            age: new fields.StringField(),
            size: new fields.SchemaField({
                description: new fields.StringField(),
                type: new fields.StringField({default: "medium", choices: CONFIG.SYSTEM.RACE_SIZE_TYPES}),
            }),
            speed: new fields.NumberField({min: 0, default: 30, integer: true}),
            sight: new fields.SchemaField({
                description: new fields.StringField(),
                dim: new fields.NumberField({min: 0, default: 0, integer: true}),
                dark: new fields.NumberField({min: 0, default: 0, integer: true}),
                bright: new fields.NumberField({min: 0, default: 30, integer: true}),
            }),
            traits: new fields.ArrayField(new fields.EmbeddedDataField(TraitDataModel), {default: []}),
        }
    }
}
