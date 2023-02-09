export default class BackgroundTypeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            proficiencies: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.PROFICIENCY_TYPES,
            })),
            // talents: new fields.SetField(new fields.ForeignDocumentField(Talent, {
            //     required: true,
            // })),
            languages: new fields.SetField(new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.LANGUAGE_TYPES,
            })),
            equipment: new fields.SetField(new fields.StringField({
                required: true,
                default: ""
                })),
            }
    }
}
