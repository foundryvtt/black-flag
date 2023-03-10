import TraitDataModel from "../trait.mjs";

export default class HeritageTypeDataModel extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            color: new fields.ColorField({required: true, nullable: false,
                initial: () => Color.fromHSV([Math.random(), 0.8, 0.8]).css
            }),
            alignment: new fields.StringField(),
            traits: new fields.ArrayField(new fields.EmbeddedDataField(TraitDataModel), {default: []}),
        }
    }
}
