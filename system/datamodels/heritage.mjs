import TraitDataModel from "./trait.mjs";

export default class HeritageDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({required: true}),
            description: new fields.StringField(),
            traits: new fields.ArrayField({default: [], type: TraitDataModel.defineSchema()}),
        }
    }
}
