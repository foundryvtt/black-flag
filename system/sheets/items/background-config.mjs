import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import ItemDocumentSheet from "./item-config.mjs";
import TraitDataModel from "../../dataModels/trait.mjs";
import TraitForm from "../../apps/forms/trait-form.mjs";

export default class BackgroundConfig extends ItemDocumentSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "background"],
            width: 600,
            height: 700,
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const context = await super.getData();
        context.document.system.talents = Array.from(context.document._source.system.talents.map(talent => CONFIG.SYSTEM.TALENT_DOCUMENTS.get(talent)));
        context.allTalents = Array.from(CONFIG.SYSTEM.TALENT_DOCUMENTS.values());
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        let update = super._getSubmitData(updateData);

        // Get the list of a.talent-link and add them to the update
        const talentLinks = this.element.find("a.talent-link");
        update["system.talents"] = Array.from(talentLinks.map((i, link) => link.dataset.id));

        return update;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("a.content-link").click(this._onClickContentLink.bind(this));
        html.find("input[name='system.talents']").on('input', this._onTalentInputChange.bind(this));
        html.find(`[data-action="delete"]`).click(this._onDeleteDatasetItem.bind(this));
        html.find(".trait-create").click(this._onTraitCreate.bind(this));
        html.find(".trait-edit").click(this._onTraitEdit.bind(this));
        html.find(".trait-delete").click(this._onTraitDelete.bind(this));
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
     * Deletes an element's parent from the dom, readding the value to the dataset options
     * @param {Event} event
     * @private
     */
    _onDeleteItem(event) {
        const parent = event.currentTarget.parentElement;
        const options = parent.parentElement.parentElement.querySelector("datalist");
        const option = document.createElement("option");
        option.value = parent.dataset.value;
        option.label = parent.innerText;
        options.appendChild(option);
        parent.remove();
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

        event.currentTarget.parentElement.insertBefore(talentRow, event.currentTarget);
        event.currentTarget.value = "";
    }

    /* -------------------------------------------- */

    async _onTraitCreate(event) {
        event.preventDefault();
        const trait = new TraitDataModel({
            id: foundry.utils.randomID(),
            name: "New Trait",
            description: "New Trait Description"
        });
        this.object.system.traits.push(trait);

        // Grab any other pending updates
        const update = this._getSubmitData();
        update["system.traits"] = this.object.system.traits;
        await this.object.update(update);
    }

    /* -------------------------------------------- */

    async _onTraitEdit(event) {
        event.preventDefault();
        const traitId = event.currentTarget.closest(".trait").dataset.traitId;
        const trait = this.object.system.traits.find(t => t.id === traitId);
        const traitForm = new TraitForm(this, trait, {});
        traitForm.render(true);
    }

    /* -------------------------------------------- */

    async _onTraitDelete(event) {
        event.preventDefault();
        const traitId = event.currentTarget.closest(".trait").dataset.traitId;
        this.object.system.traits = this.object.system.traits.filter(t => t.id !== traitId);

        // Grab any other pending updates
        const update = this._getSubmitData();
        update["system.traits"] = this.object.system.traits;
        await this.object.update(update);
    }
}
