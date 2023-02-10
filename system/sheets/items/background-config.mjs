import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import ItemDocumentSheet from "./item-config.mjs";

export default class BackgroundConfig extends ItemDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "background"],
            height: 570,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.PROFICIENCY_TYPES = this.getMultiSelectOptions(CONFIG.SYSTEM.PROFICIENCY_TYPES, context.document.system.proficiencies);
        context.LANGUAGE_TYPES = this.getMultiSelectOptions(CONFIG.SYSTEM.LANGUAGE_TYPES, context.document.system.languages);
        context.document.system.talents = context.document.system.talents.map(talent => game.items.get(talent));
        context.allTalents = this._searchTalents("");
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        let update = super._getSubmitData(updateData);

        // Get the list of a.talent-link and add them to the update
        const talentLinks = this.element.find("a.talent-link");
        update["system.talents"] = talentLinks.map((i, link) => link.dataset.id);

        return update;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("a.content-link").click(this._onClickContentLink.bind(this));
        html.find("input[name='system.talents']").on('input', this._onTalentInputChange.bind(this));
        html.find(`.talent > [data-action="delete"]`).click(this._onTalentDelete.bind(this));
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
        return Object.values(game.documentIndex.lookup(search.toLowerCase(), {documentTypes: ['Item']}))
            .flatMap(_ => _).filter(t => t.entry.type === "talent");
    }

    /* -------------------------------------------- */

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
        talentRow.classList.add("talent");
        talentRow.classList.add("flexrow");
        talentRow.appendChild(talentLink);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas");
        deleteIcon.classList.add("fa-delete-left");
        deleteIcon.dataset.action = "delete";
        deleteIcon.addEventListener("click", this._onTalentDelete.bind(this));
        talentRow.appendChild(deleteIcon);

        event.currentTarget.parentElement.insertBefore(talentRow, event.currentTarget);
        event.currentTarget.value = "";
    }

    /* -------------------------------------------- */

    _onTalentDelete(event) {
        event.currentTarget.parentElement.remove();
    }
}
