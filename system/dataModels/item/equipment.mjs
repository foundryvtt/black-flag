export default class EquipmentTypeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            size: new fields.StringField({
                required: true,
                choices: CONFIG.SYSTEM.EQUIPMENT_SIZES,
            })
        }
    }
}
