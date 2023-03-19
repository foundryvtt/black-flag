import BlackFlagItem from "../../documents/item.mjs";

export default class ClassTypeDataModel extends foundry.abstract.DataModel {

  /** @inheritdoc */
  static _enableV10Validation = true;

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
      hitDie: new fields.StringField({ choices: CONFIG.SYSTEM.HIT_DIE_TYPES }),
      hpAbility: new fields.StringField({ choices: CONFIG.SYSTEM.ABILITY_TYPES }),
      startingHP: new fields.NumberField({min: 0, initial: 0, integer: true}),
      keyAbilities: new fields.SetField(new fields.StringField({ choices: CONFIG.SYSTEM.ABILITY_TYPES })),
      saveProficiencies: new fields.SetField(new fields.StringField({ choices: CONFIG.SYSTEM.ABILITY_TYPES })),
      equipmentProficiencies: new fields.StringField(), // TODO: This will likely get more complex
      startingEquipment: new fields.StringField({
        required: true,
        default: ""
      }),
      subclasses: new fields.SetField(new fields.StringField()),
      progressionChart: new fields.HTMLField(),
      progression: new fields.SetField(new fields.ForeignDocumentField(BlackFlagItem, {required: true, type: "feature", idOnly: true}))
    };
  }
}
