import {SYSTEM_ID} from "../../CONSTANTS.mjs";

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
}
