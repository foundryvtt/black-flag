import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import ItemDocumentSheet from "./item-config.mjs";

export default class TalentConfig extends ItemDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "talent"],
            height: 400,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = super.getData();
        return context;
    }
}
