import {SYSTEM_ID} from "../CONSTANTS.mjs";

/**
 * A mixin that extends a `DocumentSheet`, providing shared logic among system sheet classes
 * @param {(...args: unknown[]) => ActorSheet | ItemSheet} Base a core `DocumentSheet` subclass
 * @returns {BlackFlagSheet} the mixed-in sheet class
 */
const BlackFlagSheetMixin = Base => class BlackFlagSheet extends Base {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, "sheet"],
      width: 520,
      height: 480,
      resizable: true,
      submitOnClose: true,
      submitOnChange: false,
      closeOnSubmit: true
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${this.object.name} ${game.i18n.localize("BlackFlag.Common.Config")}`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    const context = super.getData();
    context.descriptionHTML = await TextEditor.enrichHTML(
      this.object.system.description,
      {async: true, secrets: this.object.isOwner}
    );
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("img[data-edit='img']").click(this._onEditImage.bind(this));
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

  async getForeignDocumentOptions(type, subtype, allowNone=true) {
    return this.constructor.getForeignDocumentOptions(type, subtype, allowNone);
  }

  /* -------------------------------------------- */

  static async getForeignDocumentOptions(type, subtype, allowNone=true) {
    const options = {};
    if ( allowNone ) options[""] = "None";
    let docs = game.collections.get(type).filter(d => d.type === subtype);

    // / Iterate through the Packs, adding them to the list
    for ( let pack of game.packs ) {
      if ( pack.metadata.type !== type ) continue;
      const ids = pack.index.filter(d => d.type === subtype).map(d => d._id);
      for ( const id of ids ) {
        const doc = await pack.getDocument(id);
        if ( doc ) docs.push(doc);
      }
    }

    // Dedupe and sort the list alphabetically
    docs = Array.from(new Set(docs)).sort((a, b) => a.name.localeCompare(b.name));

    for ( let d of docs ) {
      options[d.id] = d.name;
    }
    return options;
  }

  /* -------------------------------------------- */

  /** Provides a slightly cleaner way of calling this for extending classes */
  getOptionsList(choices) {
    return this.constructor.getOptionsList(choices);
  }

  /* -------------------------------------------- */

  static getOptionsList(choices) {
    return Object.entries(choices).reduce((obj, [k, v]) => {
      obj[k] = game.i18n.localize(`BF[${v.label}`);
      return obj;
    }, {});
  }

  /* -------------------------------------------- */

  /** Provides a slightly cleaner way of calling this for extending classes */
  getDatalistOptions(choices, selected) {
    return this.constructor.getDatalistOptions(choices, selected);
  }

  /* -------------------------------------------- */

  /**
   * Turns a choices object into an array of options for a multi-select, with the selected options excluded
   * @param choices
   * @param selected
   * @returns {unknown[]}
   */
  static getDatalistOptions(choices, selected) {
    let set = new Set(Array.from(selected));
    return Object.entries(choices).map(type => {
      // If already selected, skip as a choice
      if ( set.has(type[0]) ) return null;
      return {
        label: type[1].label,
        value: type[0]
      };
    }).filter(type => type !== null);
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
    proficiency.classList.add("manual");
    proficiency.dataset.value = value;
    proficiency.innerText = game.i18n.localize(`BF[${configList[value].label}`);

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
};

export default BlackFlagSheetMixin;
