import TraitDataModel from "./trait.mjs";

export default class RaceDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({required: true}),
            description: new fields.StringField(),
            age: new fields.StringField(),
            size: new fields.SchemaField({
                description: new fields.StringField(),
                type: new fields.StringField({default: "medium", choices: ["small", "medium"]}),
            }),
            speed: new fields.NumberField({min: 0, default: 30}),
            sight: new fields.SchemaField({
                description: new fields.StringField(),
                dim: new fields.NumberField({min: 0, default: 0}),
                dark: new fields.NumberField({min: 0, default: 0}),
                bright: new fields.NumberField({min: 0, default: 30}),
            }),
            traits: new fields.ArrayField({default: [], type: TraitDataModel.defineSchema()}),
        }
    }
}
