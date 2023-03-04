import ActorDocumentSheet from "./actor-config.mjs";
import ChoicesForm from "../../apps/forms/choices-form.mjs";
import CharacterBuilderForm from "../../apps/forms/character-builder.mjs";

export default class PcConfig extends ActorDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["black-flag", "sheet", "actor", "pc"],
            tabs: [{navSelector: ".tabs", contentSelector: ".tabs-container", initial: "traits"}],
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: true,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.SIZE_TYPES = this.getOptionsList(CONFIG.SYSTEM.RACE_SIZE_TYPES);
        context.ALIGNMENT_TYPES = this.getOptionsList(CONFIG.SYSTEM.ALIGNMENT_TYPES);
        context.LINEAGE_TYPES = await this.getForeignDocumentOptions("Item", "lineage");
        context.lineageInfo = game.items.get(this.object.system.lineage);
        context.HERITAGE_TYPES = await this.getForeignDocumentOptions("Item", "heritage");
        context.heritageInfo = game.items.get(this.object.system.heritage);
        context.BACKGROUND_TYPES = await this.getForeignDocumentOptions("Item", "background");
        context.backgroundInfo = game.items.get(this.object.system.background);
        context.PROFICIENCY_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.PROFICIENCY_TYPES, this.object.system.proficiencies);
        context.LANGUAGE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.LANGUAGE_TYPES, this.object.system.languages);
        context.RESISTANCE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.DAMAGE_TYPES, this.object.system.resistances);
        context.SAVE_ADVANTAGE_TYPES = this.getDatalistOptions(CONFIG.SYSTEM.DAMAGE_TYPES, this.object.system.saveAdvantages);
        context.nextLevelXP = CONFIG.SYSTEM.XP_TABLE.get(this.object.system.level + 1);
        context.document.system.talents = Array.from(context.document._source.system.talents.map(talent => CONFIG.SYSTEM.TALENT_DOCUMENTS.get(talent)));
        context.allTalents = Array.from(CONFIG.SYSTEM.TALENT_DOCUMENTS.values());

        // Mark values as innate
        context.document.system.proficiencies.forEach(p => {
            p.canDelete = ["manual"].includes(p.sourceType);
        });
        context.document.system.resistances.forEach(r => {
            r.canDelete = ["manual"].includes(r.sourceType);
        });
        context.document.system.languages.forEach(l => {
            l.canDelete = ["manual"].includes(l.sourceType);
        });
        context.document.system.saveAdvantages.forEach(s => {
            s.canDelete = ["manual"].includes(s.sourceType);
        });

        // Mark traits that have missingChoices as unfulfilled
        context.document.system.traitChoices.forEach(t => {
            t.hasChoices = t.choices.length > 0;
            for ( const choice of t.choices ) {
                choice.values = choice.options.map(v => {
                   return {
                      value: v,
                      selected: choice.chosenValues.has(v),
                      disabled: (!choice.chosenValues.has(v)) && t.choicesFulfilled
                   }
                });
            }
        });

        CONFIG.SYSTEM.log("PC Config Data", context)

        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        const update = super._getSubmitData(updateData);

        // Get the list of div.proficiency and add them to the update
        const proficiencies = this.element.find("div.proficiency.manual");
        update["system.proficiencies"] = Array.from(proficiencies.map((i, proficiency) => proficiency.dataset.value));

        // Get the list of div.language and add them to the update
        const languages = this.element.find("div.language.manual");
        update["system.languages"] = Array.from(languages.map((i, language) => language.dataset.value));

        // Get the list of div.resistance and add them to the update
        const resistances = this.element.find("div.resistance.manual");
        update["system.resistances"] = Array.from(resistances.map((i, resistance) => resistance.dataset.value));

        // Get the list of div.saveAdvantage and add them to the update
        const saveAdvantages = this.element.find("div.saveAdvantage.manual");
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
        html.find("a[data-action='roll-ability']").on('click', this._onRollAbility.bind(this));
        html.find("a[data-action='important-info']").on('click', this._onImportantInfo.bind(this));
        html.find(".choices-icon").on('click', this._onChoicesIconClick.bind(this));
        html.find(".character-builder").on('click', this._onCharacterBuilderClick.bind(this));
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
     * If the input changes to match a talent ID, add it to the list
     * @param {Event} event
     * @private
     */
    _onTalentInputChange(event) {
        const talent = CONFIG.SYSTEM.TALENT_DOCUMENTS.get(event.currentTarget.value);

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

        event.currentTarget.parentNode.querySelector(".talents").insertBefore(talentRow, null);
        event.currentTarget.value = "";
    }

    /* -------------------------------------------- */

    /**
     * Roll ability scores for the character and send results to a chat message.
     * @param {Event} event
     * @private
     */
    _onRollAbility(event) {
        const expandRoll = foundry.utils.debounce((result) => {
            const message = document.querySelector(`[data-message-id="${result.id}"] .dice-tooltip`);
            message.classList.add("expanded");
            message.scrollIntoView();
        }, 50);

        new Dialog({
            title: "How do you want to do this?",
            content: ``,
            buttons: {
                roll: {
                    label: game.i18n.localize("Roll"),
                    callback: async () => { 
                        const result = await new Roll("{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}").toMessage({flavor: "Your ability score rolls:"});
                        expandRoll(result);        
                    },
                    icon: '<i class="fa-solid fa-dice"></i>'
                },
                pointBuy: {
                    label: game.i18n.localize("Point Buy"),
                    callback: async () => { 
                        const j = await fromUuid("Compendium.black-flag.playtest-1-packet.bHbtZZkt9UyEMu2r");
                        j.sheet.render(true, {pageId: "goMWEmijPIYdsdTt", anchor: "point-buy"});
                    },
                    icon: `<i class="fa-solid fa-cart-shopping"></i>`
                },
                standard: {
                    label: game.i18n.localize("Standard Array"),
                    callback: () => {return new Dialog({title: "Standard Array", content: "<p>Assign one of the following numbers to each ability score: 16, 15, 13, 12, 10, and 8.</p>", buttons: {}}).render(true)},
                    icon: `<i class="fa-solid fa-standard-definition"></i>`
                }
            }
        }, {width: 450}).render(true);
    }
    
    /* -------------------------------------------- */

    /**
     * Alert users to basic information about the playtest in their character sheet.
     * @param {Event} event
     * @private
     */
    _onImportantInfo(event) {
        event.currentTarget.nextElementSibling.classList.toggle("collapsed");
        event.currentTarget.nextElementSibling.classList.toggle("expanded");
    }

    /* -------------------------------------------- */

    _onChoicesIconClick(event) {
        event.preventDefault();
        const traitId = event.currentTarget.closest(".trait");
        const trait = this.object.system.traitChoices.find(t => t.id === traitId.dataset.id);
        new ChoicesForm(this, trait).render(true);
    }

    /* -------------------------------------------- */

    _onCharacterBuilderClick(event) {
        event.preventDefault();
        const builder = new CharacterBuilderForm(this.object);
        builder.render(true);
    }
}
