/**
 * Data model template for a Duration, as may be used by Powers
 *
 * @property {string} type
 * @mixin
 */
export default class DurationDataModel extends foundry.abstract.DataModel {

  /** @inheritdoc */
  static _enableV10Validation = true;

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      type: new fields.StringField({
        required: true,
        choices: ["instantaneous", "time", "permanent", "special"],
        initial: "instantaneous"
      }),

      // Store duration internally as rounds, translating into human readable on the fly
      rounds: new fields.NumberField({
        required: false
      }),

      // Describes when during a round an effect might end
      // e.g. "end of target's turn" or "end of caster's turn"
      special: new fields.StringField({
        required: false
      })
    };
  }
}
