/**
 * Data model template for a Target, as may be used by Powers
 *
 * @property {string} type
 *
 * @property {object} range
 * @property {string} range.type
 * @property {string} range.unit
 * @property {number} range.value
 *
 * @property {object} areaOfEffect
 * @property {number} areaOfEffect.primaryDimension
 * @property {number} areaOfEffect.secondaryDimension
 * @property {string} areaOfEffect.type
 * @property {string} areaOfEffect.unit
 *
 * @property {object} targets
 * @property {boolean} areaOfEffect.affectsObjects
 * @property {string} areaOfEffect.creatures
 * @property {number} areaOfEffect.numberOfChoices
 *
 * @mixin
 */
export default class TargetDataModel extends foundry.abstract.DataModel {

  /** @inheritdoc */
  static _enableV10Validation = true;

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Required if type === 'aoe'
      areaOfEffect: new fields.SchemaField({
        primaryDimension: new fields.NumberField(),
        secondaryDimension: new fields.NumberField(),
        type: new fields.StringField({
          choices: CONFIG.SYSTEM.AREA_OF_EFFECT_TYPES
        }),
        unit: new fields.StringField({
          choices: CONFIG.SYSTEM.DISTANCE_UNITS,
          initial: "ft"
        })
      }),

      // Required if type !== 'self'
      range: new fields.SchemaField({
        type: new fields.StringField({
          initial: "distance",
          choices: ["distance" | "touch" | "unlimited"]
        }),
        // Required if type === 'distance'
        unit: new fields.StringField({
          choices: CONFIG.SYSTEM.DISTANCE_UNITS,
          initial: "ft"
        }),
        // Required if type === 'distance'
        value: new fields.NumberField()
      }),

      // Required if type !== 'self'
      targets: new fields.SchemaField({
        affectsObjects: new fields.BooleanField({
          required: true,
          initial: false
        }),
        creatures: new fields.StringField({
          choices: ["all", "allies", "enemies", "choice", "none"]
        }),
        // Required if creatures === 'choice'
        numberOfChoices: new fields.NumberField()
      }),

      type: new fields.StringField({
        required: true,
        choices: ["self", "within-range", "aoe"]
      })
    };
  }
}
