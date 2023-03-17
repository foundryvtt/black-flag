export default class ClassTypeDataModel extends foundry.abstract.DataModel {

  /** @inheritdoc */
  static _enableV10Validation = true;

  // TODO: This was just an example shim done on stream. It's not complete.

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({required: false, nullable: false}),
      color: new fields.ColorField({required: false, nullable: false,
        initial: () => Color.fromHSV([Math.random(), 0.8, 0.8]).css
      }),
      weapons: new fields.SetField(new fields.StringField({
        choices: CONFIG.SYSTEM.WEAPON_TYPES
      }), {
        required: false,
        nullable: false
      }),
      usesMagic: new fields.BooleanField({required: false, nullable: false, initial: false})
    };
  }
}
