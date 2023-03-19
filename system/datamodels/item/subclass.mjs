import BlackFlagItem from "../../documents/item.mjs";

export default class SubclassTypeDataModel extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField({required: false, nullable: false}),
            color: new fields.ColorField({required: false, nullable: false,
                initial: () => Color.fromHSV([Math.random(), 0.8, 0.8]).css
            }),
            baseClass: new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "class", idOnly: true}),
            progressionChart: new fields.HTMLField(),
            progression: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "feature", idOnly: true}))
        };
    }
}
