import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import ItemDocumentSheet from "./item-config.mjs";
import TraitDataModel from "../../datamodels/trait.mjs";
import TraitForm from "../../apps/forms/trait-form.mjs";

export default class ClassConfig extends ItemDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "class"],
            width: 725,
            height: 650,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = super.getData();
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
