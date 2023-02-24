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

        // Constants
        context.SIZES = CONFIG.SYSTEM.RACE_SIZE_TYPES;
        context.ALIGNMENTS = CONFIG.SYSTEM.ALIGNMENT_TYPES;
        context.PROFICIENCIES = CONFIG.SYSTEM.PROFICIENCY_TYPES;
        context.LANGUAGES = CONFIG.SYSTEM.LANGUAGE_TYPES;
        context.RESISTANCES = CONFIG.SYSTEM.DAMAGE_TYPES;
        context.SAVE_ADVANTAGES = CONFIG.SYSTEM.DAMAGE_TYPES;

        // Documents
        context.LINEAGES = CONFIG.SYSTEM.LINEAGE_DOCUMENTS;
        context.HERITAGES = CONFIG.SYSTEM.HERITAGE_DOCUMENTS;
        context.BACKGROUNDS = CONFIG.SYSTEM.BACKGROUND_DOCUMENTS;
        context.TALENTS = CONFIG.SYSTEM.TALENT_DOCUMENTS;
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".lineages").click(async (event) => await this._onStepChange(event, "lineage"));
        html.find(".heritages").click(async (event) => await this._onStepChange(event, "heritage"));
        html.find(".backgrounds").click(async (event) => await this._onStepChange(event, "background"));
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
}

