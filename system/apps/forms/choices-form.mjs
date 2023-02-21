import {SYSTEM_ID} from "../../CONSTANTS.mjs";

export default class ChoicesForm extends FormApplication {

    constructor(parent, object, options) {
        super(object, options);
        this.parent = parent;
    }

    /* -------------------------------------------- */

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "trait", "choices"],
            title: "Trait Choices Form",
            height: 600,
            width: 500,
            template: "systems/black-flag/system/templates/forms/choices-form.hbs",
            resizable: true,
            submitOnClose: true,
            submitOnChange: false,
            closeOnSubmit: true,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.document = this.object;
        console.dir(context);
        return context;
    }
}
