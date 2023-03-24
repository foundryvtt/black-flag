import { SYSTEM_ID } from "../../CONSTANTS.mjs";
import BlackFlagSheetMixin from "../black-flag-sheet.mjs";

export default class ItemDocumentSheet extends BlackFlagSheetMixin(ItemSheet) {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, "sheet", "item"],
      width: 520,
      height: 480
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    return `systems/${SYSTEM_ID}/system/templates/items/${this.object.type}-config.hbs`;
  }
}
