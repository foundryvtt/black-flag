import {SYSTEM_ID} from "../../CONSTANTS.mjs";

export default class TraitForm extends FormApplication {

    constructor(parent, object, options) {
        super(object, options);
        this.parent = parent;
    }

    /* -------------------------------------------- */

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "heritage"],
            height: 400,
            template: "systems/black-flag/system/templates/forms/trait-form.hbs",
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "summary"}],
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.document = this.object;
        context.descriptionHTML = await TextEditor.enrichHTML(this.object.description, {async: true});
        context.builderInfoJson = JSON.stringify(this.object.builderInfo, null, 2);
        console.dir(context);
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        const trait = {
            id: this.object.id,
            name: formData.name,
            img: formData.img,
            description: formData.description,
            builderInfo: foundry.utils.isEmpty(formData.builderInfoJson) ? {} : JSON.parse(formData.builderInfoJson),
        };
        this.parent.object.system.traits = this.parent.object.system.traits.map(t => {
            if ( t.id === trait.id ) {
                return trait;
            } else {
                return t;
            }
        });
        await this.parent.object.update({"system.traits": this.parent.object.system.traits});
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("img[data-edit='img']").click(this._onEditImage.bind(this));
        //html.find(".builder-info").change(this._onBuilderInfoChange.bind(this));
    }

    /* -------------------------------------------- */

    async _onEditImage(event) {
        const attr = event.currentTarget.dataset.edit;
        const current = foundry.utils.getProperty(this.item, attr);
        const fp = new FilePicker({
            type: "image",
            current: current,
            callback: path => {
                event.currentTarget.src = path;
                if ( this.options.submitOnChange ) {
                    this._onSubmit(event);
                }
            },
            top: this.position.top + 40,
            left: this.position.left + 10
        });
        return fp.browse();
    }
}
