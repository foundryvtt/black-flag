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
            height: 'auto',
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
        switch ( this.object.builderInfo.mode ) {
            case "ALL": context.document.mode = ""; break;
            case "ANY": context.document.mode = "Choose any of the following sections"; break;
            case "CHOOSE_ONE": context.document.mode = "Choose one of the following sections"; break;
        }
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        let update = super._getSubmitData(updateData);
        delete update["img"];
        delete update["name"];
        return update;
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        const trait = foundry.utils.mergeObject(this.object, {
            choices: Object.entries(formData).reduce( (choices, [c, chosen]) => {
                const [key, value] = c.split(".");
                const traitChoice = choices.find(x => x.key === key);
                if ( chosen && !traitChoice.chosenValues.includes(value) ) traitChoice.chosenValues.push(value);
                traitChoice.values.find(v => v.value === value).selected = chosen;
                return choices;
            }, this.object.choices),
        });
        trait.choicesFulfilled = trait.choices.every(c => c.chosenValues.length === c.amount);
        console.dir(trait);
        this.parent.object.system.traitChoices = this.parent.object.system.traitChoices.map(t => {
            if ( t.id === trait.id ) {
                return trait;
            } else {
                return t;
            }
        });
        await this.parent.object.update({"system.traitChoices": this.parent.object.system.traitChoices});
    }
}
