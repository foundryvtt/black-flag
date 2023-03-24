import { SYSTEM_ID } from "../../CONSTANTS.mjs";
import BlackFlagSheetMixin from "../black-flag-sheet.mjs";

export default class ActorDocumentSheet extends BlackFlagSheetMixin(ActorSheet) {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, "sheet", "actor"],
      width: 800,
      height: 800
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    return `systems/${SYSTEM_ID}/system/templates/actors/${this.object.type}-config.hbs`;
  }
}
