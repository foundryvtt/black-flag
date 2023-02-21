export default class TraitDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            id: new fields.StringField({required: true}),
            name: new fields.StringField({required: true}),
            source: new fields.StringField(),
            sourceId: new fields.StringField(),
            img: new fields.FilePathField({categories: ["IMAGE"], initial: () => "icons/skills/social/trading-justice-scale-gold.webp"}),
            description: new fields.HTMLField(),
            builderInfo: new fields.ObjectField(),
            innate: new fields.SchemaField({
                proficiencies: new fields.SetField(new fields.StringField({
                    required: true,
                    choices: CONFIG.SYSTEM.PROFICIENCY_TYPES,
                })),
                resistances: new fields.SetField(new fields.StringField({
                    required: true,
                    choices: CONFIG.SYSTEM.DAMAGE_TYPES,
                })),
                languages: new fields.SetField(new fields.StringField({
                    required: true,
                    choices: CONFIG.SYSTEM.LANGUAGE_TYPES,
                })),
                saveAdvantages: new fields.SetField(new fields.StringField({
                    required: true,
                    choices: CONFIG.SYSTEM.DAMAGE_TYPES,
                })),
            }),
            choices: new fields.SetField(new fields.SchemaField({
                key: new fields.StringField({required: true}),
                values: new fields.SetField(new fields.ObjectField(), {required: true}),
            })),
            missingChoices: new fields.SetField(new fields.SchemaField({
                key: new fields.StringField({required: true}),
                values: new fields.SetField(new fields.ObjectField(), {required: true}),
                amount: new fields.NumberField({min: 0, default: 0, integer: true}),
            })),
            choicesFulfilled: new fields.BooleanField({default: false}),
        }
    }
}
