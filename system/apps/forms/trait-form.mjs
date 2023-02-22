import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import BlackFlagSheet from "../../sheets/black-flag-sheet.mjs";

export default class TraitForm extends FormApplication {

    constructor(parent, object, options) {
        super(object, options);
        this.parent = parent;
        this.hasAceEditor = game.modules.get("acelib")?.active ?? false;
    }

    /* -------------------------------------------- */

    /**
     * Indicates whether the Ace editor is available for use.
     * @type {boolean}
     */
    hasAceEditor = false;

    /**
     * An Ace editor instance for the builderInfo JSON field. Only present when AceLib is enabled.
     */
    editor;

    /* -------------------------------------------- */

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "item", "trait"],
            title: "Trait Form",
            height: 600,
            width: 500,
            template: "systems/black-flag/system/templates/forms/trait-form.hbs",
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "summary"}],
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
        context.PROFICIENCY_TYPES = BlackFlagSheet.getDatalistOptions(CONFIG.SYSTEM.PROFICIENCY_TYPES, this.object.innate.proficiencies);
        context.LANGUAGE_TYPES = BlackFlagSheet.getDatalistOptions(CONFIG.SYSTEM.LANGUAGE_TYPES, this.object.innate.languages);
        context.RESISTANCE_TYPES = BlackFlagSheet.getDatalistOptions(CONFIG.SYSTEM.DAMAGE_TYPES, this.object.innate.resistances);
        context.SAVE_ADVANTAGE_TYPES = BlackFlagSheet.getDatalistOptions(CONFIG.SYSTEM.SAVE_TYPES, this.object.innate.saveAdvantages);
        context.descriptionHTML = await TextEditor.enrichHTML(this.object.description, {async: true});
        context.builderInfoJson = JSON.stringify(this.object.builderInfo, null, 2);
        context.hasAceEditor = this.hasAceEditor;
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    _getSubmitData(updateData = {}) {
        let update = super._getSubmitData(updateData);

        // Get the list of div.proficiency and add them to the update
        const proficiencies = this.element.find("div.proficiency");
        update["innate.proficiencies"] = Array.from(proficiencies.map((i, proficiency) => proficiency.dataset.value));

        // Get the list of div.language and add them to the update
        const languages = this.element.find("div.language");
        update["innate.languages"] = Array.from(languages.map((i, language) => language.dataset.value));

        // Get the list of div.resistance and add them to the update
        const resistances = this.element.find("div.resistance");
        update["innate.resistances"] = Array.from(resistances.map((i, resistance) => resistance.dataset.value));

        // Get the list of div.saveAdvantage and add them to the update
        const saveAdvantages = this.element.find("div.saveAdvantage");
        update["innate.saveAdvantages"] = Array.from(saveAdvantages.map((i, saveAdvantage) => saveAdvantage.dataset.value));

        return update;
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        if ( this.editor ) {
            formData.builderInfo = JSON.parse(this.editor.getValue());
        }
        const trait = {
            id: this.object.id,
            name: formData.name,
            img: formData.img,
            description: formData.description,
            builderInfo: formData.builderInfo,
            innate: {
                proficiencies: formData["innate.proficiencies"],
                languages: formData["innate.languages"],
                resistances: formData["innate.resistances"],
                saveAdvantages: formData["innate.saveAdvantages"],
            }
        };
        this.parent.object.system.traits = this.parent.object.system.traits.map(t => {
            if ( t.id === trait.id ) {
                return trait;
            } else {
                return t;
            }
        });
        await this.parent.object.update({"system.traits": this.parent.object.system.traits});
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("img[data-edit='img']").click(this._onEditImage.bind(this));
        html.find("input[name='innate.proficiencies']").on('input', (event) => this._onTagInputChange(event, "proficiency", CONFIG.SYSTEM.PROFICIENCY_TYPES));
        html.find("input[name='innate.languages']").on('input', (event) => this._onTagInputChange(event, "language", CONFIG.SYSTEM.LANGUAGE_TYPES));
        html.find("input[name='innate.resistances']").on('input', (event) => this._onTagInputChange(event, "resistance", CONFIG.SYSTEM.DAMAGE_TYPES));
        html.find("input[name='innate.saveAdvantages']").on('input', (event) => this._onTagInputChange(event, "saveAdvantage", CONFIG.SYSTEM.SAVE_TYPES));
        html.find(`[data-action="delete"]`).click(this._onDeleteDatasetItem.bind(this));

        // Activate Ace Editor
        if ( this.hasAceEditor ) {
            const editorElement = html.find("div[name='builderInfo']");
            this.editor = ace.edit(editorElement[0]);
            this.editor.setTheme("ace/theme/monokai");
            this.editor.session.setMode("ace/mode/json");
            this.editor.setOptions({
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
            });
        }
    }

    /* -------------------------------------------- */

    async _onEditImage(event) {
        const attr = event.currentTarget.dataset.edit;
        const current = foundry.utils.getProperty(this.item, attr);
        const fp = new FilePicker({
            type: "image",
            current: current,
            callback: path => {
                event.currentTarget.src = path;
                if ( this.options.submitOnChange ) {
                    this._onSubmit(event);
                }
            },
            top: this.position.top + 40,
            left: this.position.left + 10
        });
        return fp.browse();
    }

    /* -------------------------------------------- */

    /**
     * Deletes an element's parent from the dom, readding the value to the dataset options
     * @param {Event} event
     * @protected
     */
    _onDeleteDatasetItem(event) {
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
     * If the input changes to match a value from the given CONFIG list, add it to the list
     * @param {Event} event
     * @protected
     */
    _onTagInputChange(event, tagClass, configList) {
        const value = event.currentTarget.value;

        // If the current value is not a value from the config list, return
        if ( !Object.keys(configList).includes(value) ) return;

        // Otherwise, insert the value into the list
        const proficiency = document.createElement("div");
        proficiency.classList.add(tagClass);
        proficiency.classList.add("tag");
        proficiency.dataset.value = value;
        proficiency.innerText = game.i18n.localize(configList[value].label);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas");
        deleteIcon.classList.add("fa-delete-left");
        deleteIcon.dataset.action = "delete";
        deleteIcon.addEventListener("click", this._onDeleteDatasetItem.bind(this));
        proficiency.appendChild(deleteIcon);

        event.currentTarget.parentElement.querySelector(".tag-list").append(proficiency);
        event.currentTarget.value = "";
        event.currentTarget.parentElement.querySelector(`option[value="${value}"]`).remove();
    }
}
