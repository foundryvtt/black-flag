export default class TalentTypeDataModel extends foundry.abstract.DataModel {

  /** @inheritDoc */
  static _enableV10Validation = true;

  /** @inheritDoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
      prerequisite: new fields.StringField({ initial: "" }),
      category: new fields.StringField({ initial: "technical", choices: CONFIG.SYSTEM.TALENT_CATEGORIES })
    };
  }
}
