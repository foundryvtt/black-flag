import {SYSTEM_ID} from "../../CONSTANTS.mjs";

export default class ItemDocumentSheet extends DocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "talent"],
            width: 520,
            height: 480,
            resizable: true,
            submitOnChange: true,
            submitOnClose: true,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get template() {
        return `systems/${SYSTEM_ID}/system/templates/items/${this.object.type}-config.hbs`;
    }

    /* -------------------------------------------- */

    /** @override */
    get title() {
        return `${this.object.name} ${game.i18n.localize("Config")}`;
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = super.getData();
        context.descriptionHTML = await TextEditor.enrichHTML(this.object.system.description, {async: true, secrets: this.object.isOwner});
        return context;
    }
}
