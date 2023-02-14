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
        context.nextLevelXP = CONFIG.SYSTEM.XP_TABLE.get(this.object.system.level + 1);
        context.document.system.talents = Array.from(context.document._source.system.talents.map(talent => game.items.get(talent)));
        context.allTalents = this._searchTalents("");
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

        // Get the list of a.talent-link and add them to the update
        const talentLinks = this.element.find("a.talent-link");
        update["system.talents"] = Array.from(talentLinks.map((i, link) => link.dataset.id));

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
        html.find(`input[name="system.hp.current"]`).on('input', (event) => this._onProgressValueInputChange(event));
        html.find(`input[name="system.experience"]`).on('input', (event) => this._onProgressValueInputChange(event));
        html.find("a.content-link").click(this._onClickContentLink.bind(this));
        html.find("input[name='system.talents']").on('input', this._onTalentInputChange.bind(this));
    }

    /* -------------------------------------------- */

    _onProgressValueInputChange(event) {
        const input = event.currentTarget;
        const value = parseInt(input.value);
        const max = parseInt(input.max);
        if (value > max) {
            input.value = max;
        }

        // Update progress bar
        const progress = input.closest("fieldset").querySelector("progress");
        progress.value = value;
    }

    /* -------------------------------------------- */

    /**
     * Handles opening a Content link
     * @param {Event} event
     * @returns {Promise<*>}
     * @private
     */
    async _onClickContentLink(event) {
        event.preventDefault();
        const doc = await fromUuid(event.currentTarget.dataset.uuid);
        return doc?._onClickDocumentLink(event);
    }

    /* -------------------------------------------- */

    /**
     * Returns a list of talents that match the search term using a prefix
     * @param search
     * @returns {unknown[]}
     * @private
     */
    _searchTalents(search) {
        return Object.values(game.documentIndex.lookup(search.toLowerCase(),
            {documentTypes: ['Item'], limit: 100}))
            .flatMap(_ => _).filter(t => t.entry.type === "talent");
    }

    /* -------------------------------------------- */

    /**
     * If the input changes to match a talent ID, add it to the list
     * @param {Event} event
     * @private
     */
    _onTalentInputChange(event) {
        const talent = game.items.get(event.currentTarget.value);

        // If the current value is not a talent ID, return
        if ( !talent ) return;

        // Otherwise, insert the talent into the list
        const talentLink = document.createElement("a");
        talentLink.classList.add("content-link");
        talentLink.classList.add("talent-link");
        talentLink.dataset.id = talent.id;
        talentLink.dataset.uuid = talent.uuid;
        talentLink.dataset.type = "Item";
        talentLink.dataset.tooltip = "Item";
        talentLink.innerHTML = `<i class="fas fa-suitcase"></i> ${talent.name}`;
        talentLink.draggable = true;
        talentLink.addEventListener("click", this._onClickContentLink.bind(this));

        const talentRow = document.createElement("div");
        talentRow.classList.add("foreign-document");
        talentRow.classList.add("talent");
        talentRow.classList.add("flexrow");
        talentRow.appendChild(talentLink);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas");
        deleteIcon.classList.add("fa-delete-left");
        deleteIcon.dataset.action = "delete";
        deleteIcon.addEventListener("click", this._onDeleteDatasetItem.bind(this));
        talentRow.appendChild(deleteIcon);

        event.currentTarget.parentElement.insertBefore(talentRow, event.currentTarget);
        event.currentTarget.value = "";
    }
}
