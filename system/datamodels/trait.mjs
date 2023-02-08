export default class TraitDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({required: true}),
            description: new fields.HTMLField(),
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
        }
    }
}
