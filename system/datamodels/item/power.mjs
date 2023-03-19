export default class PowerDataTypeModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField({required: false, nullable: false}),
            prerequisites: new fields.StringField({required: false, nullable: false}),
            cost: new fields.StringField({required: false, nullable: false}),
            level: new fields.NumberField({min: 1, initial: 1, max: 20, integer: true}),
            source: new fields.DocumentIdField({required: true, type: "source", idOnly: true}),
        };
    }
}
