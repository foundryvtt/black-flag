import {SYSTEM_ID} from "../CONSTANTS.mjs";

export default class BlackFlagSheet extends DocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet"],
            width: 520,
            height: 480,
            resizable: true,
            submitOnClose: true,
            submitOnChange: false,
            closeOnSubmit: true,
        });
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

    /* -------------------------------------------- */

    getMultiSelectOptions(choices, selected) {
        return Object.entries(choices).map(type => {
            // If already selected, skip as a choice
            if ( selected.has(type[0]) ) return null;
            return {
                label: type[1].label,
                value: type[0],
                selected: selected.has(type[0]),
            }
        }).filter(type => type !== null);
    }
}