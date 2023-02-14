export default class EquipmentTypeDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            size: new fields.StringField({
                required: true,
                initial: "small",
                choices: CONFIG.SYSTEM.EQUIPMENT_SIZES,
            })
        }
    }
}
