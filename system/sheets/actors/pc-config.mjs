import ActorDocumentSheet from "./actor-config.mjs";

export default class PcConfig extends ActorDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["black-flag", "sheet", "actor", "pc"]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        return context;
    }
}
