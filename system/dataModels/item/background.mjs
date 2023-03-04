import BlackFlagItem from "../../documents/item.mjs";
import TraitDataModel from "../trait.mjs";

export default class BackgroundTypeDataModel extends foundry.abstract.DataModel {

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
            talents: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "talent", idOnly: true})),
            numberOfTalents: new fields.NumberField({min: 0, initial: 0, integer: true}),
            talentDescription: new fields.StringField(),
            equipment: new fields.StringField({
                required: true,
                default: ""
            }),
            traits: new fields.ArrayField(new fields.EmbeddedDataField(TraitDataModel), {initial: []}),
        }
    }
}
