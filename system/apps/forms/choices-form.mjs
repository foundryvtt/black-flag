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
        // Update choices chosenValues to empty for now
        this.object.choices.forEach(c => c.chosenValues = []);
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

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("input[type=checkbox]").change(this._onCheckboxChange.bind(this));
    }

    /* -------------------------------------------- */

    /**
     * When a checkbox changes, evaluate the fieldset to see if other checkboxes should be disabled.
     * @param event
     * @private
     */
    _onCheckboxChange(event) {
        const checkbox = event.currentTarget;
        const fieldset = checkbox.closest("fieldset");
        const checkboxes = fieldset.querySelectorAll("input[type=checkbox]");
        const checked = Array.from(checkboxes).filter(c => c.checked);
        if ( checked.length >= fieldset.dataset.amount ) {
            Array.from(checkboxes).filter(c => !c.checked).forEach(c => c.disabled = true);
        } else {
            Array.from(checkboxes).filter(c => c.disabled).forEach(c => c.disabled = false);
        }

        // Check other fieldsets to see if they should be disabled
        const fieldsets = checkbox.closest("form").querySelectorAll("fieldset");
        const fieldsetsWithChoicesMade = Array.from(fieldsets).filter(f => {
            const checkboxes = f.querySelectorAll("input[type=checkbox]");
            const checked = Array.from(checkboxes).filter(c => c.checked);
            return checked.length > 0;
        });

        let disableOtherFieldsets = false;
        switch ( this.object.builderInfo.mode ) {
            case "ANY": disableOtherFieldsets = fieldsetsWithChoicesMade.length > 0; break;
            case "CHOOSE_ONE": disableOtherFieldsets = fieldsetsWithChoicesMade.length === 1; break;
        }

        if ( disableOtherFieldsets ) {
            Array.from(fieldsets).filter(f => !fieldsetsWithChoicesMade.includes(f)).forEach(f => {
                const checkboxes = f.querySelectorAll("input[type=checkbox]");
                Array.from(checkboxes).filter(c => !c.checked).forEach(c => c.disabled = true);
            });
        }
        else {
            Array.from(fieldsets).forEach(f => {
                const checkboxes = f.querySelectorAll("input[type=checkbox]");
                Array.from(checkboxes).filter(c => c.disabled).forEach(c => c.disabled = false);
            });
        }
    }
}
