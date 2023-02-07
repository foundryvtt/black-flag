export default class TraitDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({required: true}),
            description: new fields.StringField(),
            proficiencies: new fields.ArrayField({default: [], type: new fields.StringField()}),
            resistances: new fields.ArrayField({default: [], type: new fields.StringField()}),
            languages: new fields.ArrayField({default: [], type: new fields.StringField()}),
            saveAdvantages: new fields.ArrayField({default: [], type: new fields.StringField()}),
        }
    }
}
