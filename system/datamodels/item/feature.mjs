export default class FeatureTypeDataModel extends foundry.abstract.DataModel {

    /** @inheritdoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField({required: false, nullable: false}),
            color: new fields.ColorField({required: true, nullable: false,
                initial: () => Color.fromHSV([Math.random(), 0.8, 0.8]).css
            }),
            level: new fields.NumberField({min: 1, initial: 1, max: 20, integer: true}),
            source: new fields.DocumentIdField({required: true, type: "source", idOnly: true}),
            builderInfo: new fields.ObjectField(),
            powers: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "power", idOnly: true})),
        };
    }
}
