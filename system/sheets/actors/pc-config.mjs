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
        context.SIZE_TYPES = this.getOptionsList(CONFIG.SYSTEM.RACE_SIZE_TYPES);
        context.ALIGNMENT_TYPES = this.getOptionsList(CONFIG.SYSTEM.ALIGNMENT_TYPES);
        context.LINEAGE_TYPES = game.items.filter(i => i.type === "lineage").reduce((obj, i) => {
            obj[i.id] = i.name;
            return obj;
        }, {});
        context.lineageInfo = game.items.get(this.object.system.lineage);
        context.HERITAGE_TYPES = game.items.filter(i => i.type === "heritage").reduce((obj, i) => {
            obj[i.id] = i.name;
            return obj;
        }, {});
        context.heritageInfo = game.items.get(this.object.system.heritage);
        context.BACKGROUND_TYPES = game.items.filter(i => i.type === "background").reduce((obj, i) => {
            obj[i.id] = i.name;
            return obj;
        }, {});
        context.backgroundInfo = game.items.get(this.object.system.background);
        context.PROFICIENCY_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.PROFICIENCY_TYPES, this.object.system.proficiencies);
        context.LANGUAGE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.LANGUAGE_TYPES, this.object.system.languages);
        context.RESISTANCE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.DAMAGE_TYPES, this.object.system.resistances);
        context.SAVE_ADVANTAGE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.DAMAGE_TYPES, this.object.system.saveAdvantages);
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        const update = super._getSubmitData(updateData);

        // Get the list of div.proficiency and add them to the update
        const proficiencies = this.element.find("div.proficiency");
        update["system.proficiencies"] = Array.from(proficiencies.map((i, proficiency) => proficiency.dataset.value));

        // Get the list of div.language and add them to the update
        const languages = this.element.find("div.language");
        update["system.languages"] = Array.from(languages.map((i, language) => language.dataset.value));

        // Get the list of div.resistance and add them to the update
        const resistances = this.element.find("div.resistance");
        update["system.resistances"] = Array.from(resistances.map((i, resistance) => resistance.dataset.value));

        // Get the list of div.saveAdvantage and add them to the update
        const saveAdvantages = this.element.find("div.saveAdvantage");
        update["system.saveAdvantages"] = Array.from(saveAdvantages.map((i, saveAdvantage) => saveAdvantage.dataset.value));

        return update;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("input[name='system.proficiencies']").on('input', (event) => this._onTagInputChange(event, "proficiency", CONFIG.SYSTEM.PROFICIENCY_TYPES));
        html.find("input[name='system.languages']").on('input', (event) => this._onTagInputChange(event, "language", CONFIG.SYSTEM.LANGUAGE_TYPES));
        html.find("input[name='system.resistances']").on('input', (event) => this._onTagInputChange(event, "resistance", CONFIG.SYSTEM.DAMAGE_TYPES));
        html.find("input[name='system.saveAdvantages']").on('input', (event) => this._onTagInputChange(event, "saveAdvantage", CONFIG.SYSTEM.DAMAGE_TYPES));
        html.find(`[data-action="delete"]`).click(this._onDeleteDatasetItem.bind(this));
    }
}
