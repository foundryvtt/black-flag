import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import BlackFlagSheet from "../black-flag-sheet.mjs";

export default class ActorDocumentSheet extends BlackFlagSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "actor"],
            width: 1000,
            height: 1000,
            submitOnClose: true,
            submitOnChange: true,
            closeOnSubmit: false,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get template() {
        return `systems/${SYSTEM_ID}/system/templates/actors/${this.object.type}-config.hbs`;
    }
}
