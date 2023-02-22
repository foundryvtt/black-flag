import TraitDataModel from "./trait.mjs";

export default class TraitChoiceDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...TraitDataModel.defineSchema(),
            choices: new fields.SetField(new fields.SchemaField({
                key: new fields.StringField({required: true}),
                label: new fields.StringField({required: true}),
                category: new fields.StringField(),
                options: new fields.SetField(new fields.ObjectField(), {required: true}),
                chosenValues: new fields.SetField(new fields.ObjectField(), {required: true}),
                amount: new fields.NumberField({min: 0, default: 0, integer: true}),
            }), {default: []}),
            choicesFulfilled: new fields.BooleanField({default: false}),
        }
    }
}
