import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import ItemDocumentSheet from "./item-config.mjs";
import TraitDataModel from "../../datamodels/trait.mjs";
import TraitForm from "../../apps/forms/trait-form.mjs";

export default class LineageConfig extends ItemDocumentSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, "sheet", "item", "lineage"],
      width: 725,
      height: 900
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    const context = await super.getData();
    context.SIZE_TYPES = Object.entries(CONFIG.SYSTEM.RACE_SIZE_TYPES).reduce((obj, [k, v]) => {
      obj[k] = game.i18n.localize(`BF[${v.label}`);
      return obj;
    }, {});
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".trait-create").click(this._onTraitCreate.bind(this));
    html.find(".trait-edit").click(this._onTraitEdit.bind(this));
    html.find(".trait-delete").click(this._onTraitDelete.bind(this));
  }

  /* -------------------------------------------- */

  async _onTraitCreate(event) {
    event.preventDefault();
    const trait = new TraitDataModel({
      id: foundry.utils.randomID(),
      name: "New Trait",
      description: "New Trait Description"
    });
    this.object.system.traits.push(trait);

    // Grab any other pending updates
    const update = this._getSubmitData();
    update["system.traits"] = this.object.system.traits;
    await this.object.update(update);
  }

  /* -------------------------------------------- */

  async _onTraitEdit(event) {
    event.preventDefault();
    const traitId = event.currentTarget.closest(".trait").dataset.traitId;
    const trait = this.object.system.traits.find(t => t.id === traitId);
    const traitForm = new TraitForm(this, trait, {});
    traitForm.render(true);
  }

  /* -------------------------------------------- */

  async _onTraitDelete(event) {
    event.preventDefault();
    const traitId = event.currentTarget.closest(".trait").dataset.traitId;
    this.object.system.traits = this.object.system.traits.filter(t => t.id !== traitId);

    // Grab any other pending updates
    const update = this._getSubmitData();
    update["system.traits"] = this.object.system.traits;
    await this.object.update(update);
  }
}
