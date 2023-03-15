import TraitDataModel from "./trait.mjs";

export default class TraitChoiceDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...TraitDataModel.defineSchema(),
            choices: new fields.ArrayField(new fields.SchemaField({
                key: new fields.StringField({required: true}),
                label: new fields.StringField({required: true}),
                category: new fields.StringField(),
                options: new fields.SetField(new fields.StringField()),
                chosenValues: new fields.SetField(new fields.StringField()),
                amount: new fields.NumberField({min: 0, initial: 0, integer: true}),
            })),
            choicesFulfilled: new fields.BooleanField({initial: false}),
        }
    }
}
