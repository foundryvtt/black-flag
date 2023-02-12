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

    /** Provides a slightly cleaner way of calling this for extending classes */
    getDatalistOptions(choices, selected) {
        return this.constructor.getDatalistOptions(choices, selected);
    }

    /* -------------------------------------------- */

    /**
     * Turns a choices object into an array of options for a multi-select, with the selected options excluded
     * @param choices
     * @param selected
     * @returns {unknown[]}
     */
    static getDatalistOptions(choices, selected) {
        return Object.entries(choices).map(type => {
            // If already selected, skip as a choice
            if ( selected.has(type[0]) ) return null;
            return {
                label: type[1].label,
                value: type[0]
            }
        }).filter(type => type !== null);
    }
}
