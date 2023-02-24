import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import BlackFlagSheet from "../../sheets/black-flag-sheet.mjs";

export default class CharacterBuilderForm extends FormApplication {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "actor", "characterBuilder"],
            title: "Character Builder",
            height: 1000,
            width: 'auto',
            template: "systems/black-flag/system/templates/forms/character-builder-form.hbs",
            resizable: false,
            submitOnClose: true,
            submitOnChange: true,
            closeOnSubmit: false,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.document = this.object;

        // Determine what steps are already completed
        if ( this.object.system.lineage ) {
            context.lineageCompleted = true;
        }
        if ( this.object.system.heritage ) {
            context.heritageCompleted = true;
        }
        if ( this.object.system.background ) {
            context.backgroundCompleted = true;
        }

        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        console.dir(formData);
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".lineages").click(async (event) => await this._onStepChange(event, "lineage"));
        html.find(".heritages").click(async (event) => await this._onStepChange(event, "heritage"));
        html.find(".backgrounds").click(async (event) => await this._onStepChange(event, "background"));

        // Bind to any buttons that might be created later
        html.on("click", "button", async (event) => await this._onButtonClick(event));
    }

    /* -------------------------------------------- */

    /**
     * When the current Character Builder step changes, replace all the section.options with the new step's options
     * @param {Event} event     The originating click event
     * @param {string} step     The new step to change to
     * @private
     */
    async _onStepChange(event, step) {
        event.preventDefault();

        // Build the new step's options
        const stepOptions = CONFIG.SYSTEM[`${step.toUpperCase()}_DOCUMENTS`];

        // Use the template to build the new options
        const template = `systems/black-flag/system/templates/forms/character-builder-${step}-option.hbs`;
        let templateData;
        switch ( step ) {
            case "lineage": templateData = this._getLineageData(stepOptions); break;
            default: templateData = {options: stepOptions}; break;
        }
        console.dir(templateData);
        const html = await renderTemplate(template, templateData);

        // Replace the current step's options with the new ones
        const stepOptionsContainer = this.element.find(`.options`);
        stepOptionsContainer.empty();
        stepOptionsContainer.append(html);

        // Update the form's width to 'auto' to allow the new options to be displayed
        this.element.css("width", "auto");

        // Shift the form left to keep it centered
        const formWidth = this.element.width();
        const windowWidth = $(window).width();
        const shift = (windowWidth - formWidth) / 2;
        this.element.css("left", shift);

        // Set this step as the active step
        this.element.find(".step").removeClass("active");
        event.currentTarget.classList.add("active");
    }

    /* -------------------------------------------- */

    _getLineageData(lineages) {
        const data = {
            options: lineages,
            sizeOptions: BlackFlagSheet.getOptionsList(CONFIG.SYSTEM.RACE_SIZE_TYPES)
        };

        return data;
    }

    /* -------------------------------------------- */

    async _onButtonClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const action = button.dataset.action;
        switch ( action ) {
            case "done": await this.close(); break;
            case "choose": await this._onChoose(event); break;
        }
    }

    /* -------------------------------------------- */

    async _onChoose(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;
        const id = button.dataset.id;

        switch ( type ) {
            case "lineage": await this.object.update({"system.lineage": id}); break;
            case "heritage": await this.object.update({"system.heritage": id}); break;
            case "background": await this.object.update({"system.background": id}); break;
        }
        this.render(true);
    }
}

