import {SYSTEM_ID} from "../../CONSTANTS.mjs";
import BlackFlagSheet from "../../sheets/black-flag-sheet.mjs";

export default class CharacterBuilderForm extends FormApplication {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, "sheet", "actor", "characterBuilder"],
      title: "Character Builder",
      height: 1000,
      width: "auto",
      template: "systems/black-flag/system/templates/forms/character-builder-form.hbs",
      resizable: false,
      submitOnClose: true,
      submitOnChange: true,
      closeOnSubmit: false
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
    if ( this.object.system.class ) {
      context.classCompleted = true;
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    CONFIG.SYSTEM.log(formData);
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".lineages").click(async event => await this._onStepChange(event, "lineage"));
    html.find(".heritages").click(async event => await this._onStepChange(event, "heritage"));
    html.find(".backgrounds").click(async event => await this._onStepChange(event, "background"));
    html.find(".classes").click(async event => await this._onStepChange(event, "class"));

    // Things that might be created later
    html.on("click", "button", async event => await this._onButtonClick(event));
    html.on("click", "a.content-link", async event => await this._onClickContentLink(event));
    html.on("input", "input[name='system.talents']", event => this._onTalentInputChange(event));

    // Adds Horizonal Scrolling to the section .options part of the sheet by default for users
    const scrollContainer = document.querySelector(".options");
    scrollContainer.addEventListener("wheel", event => {

      // Check if the mouse is over an element with the "info" class
      if ( event.target.closest(".info") !== null ) return;

      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    });
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
      case "heritage": templateData = this._getHeritageData(stepOptions); break;
      case "background": templateData = this._getBackgroundData(stepOptions); break;
      case "class": templateData = this._getClassData(stepOptions); break;
      default: templateData = {options: stepOptions}; break;
    }
    console.dir(templateData);
    const html = await renderTemplate(template, templateData);

    // Replace the current step's options with the new ones
    const stepOptionsContainer = this.element.find(".options");
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

  _getHeritageData(heritages) {
    const data = {
      options: heritages,
      alignmentOptions: BlackFlagSheet.getOptionsList(CONFIG.SYSTEM.ALIGNMENT_TYPES)
    };

    return data;
  }

  /* -------------------------------------------- */

  _getBackgroundData(backgrounds) {
    const data = {
      options: backgrounds
    };

    // For each background description, enhance the HTML
    for ( let background of data.options ) {
      background.system.description =
        TextEditor.enrichHTML(background.system.description, {secrets: this.object.owner});
    }

    // For each background, get the list of Talents to choose from
    for ( let background of data.options ) {
      background.allTalents = background.system.talents.map(talent => {
        return CONFIG.SYSTEM.TALENT_DOCUMENTS.get(talent);
      });
    }

    return data;
  }

  /* -------------------------------------------- */

  _getClassData(classes) {
    const data = {
      options: classes
    };

    // For each class description, enhance the HTML
    for ( let classData of data.options ) {
      classData.system.description = TextEditor.enrichHTML(classData.system.description, {secrets: this.object.owner});
    }

    return data;
  }

  /* -------------------------------------------- */

  async _onButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const action = button.dataset.action;
    switch ( action ) {
      case "done": await this.close(); break;
      case "choose": await this._onChoose(button); break;
    }
  }

  /* -------------------------------------------- */

  async _onChoose(button) {
    const type = button.dataset.type;

    switch ( type ) {
      case "lineage": await this._submitLineageChange(button); break;
      case "heritage": await this._submitHeritageChange(button); break;
      case "background": await this._submitBackgroundChange(button); break;
      case "class": await this._submitClassChange(button); break;
    }
    this.render(true);
  }

  /* -------------------------------------------- */

  async _submitLineageChange(button) {
    const id = button.dataset.id;
    const updateData = {"system.lineage": id};

    let formData = this._getSubmitData();

    // Find the index of this lineage in the lineages array, then reduce the formData arrays to only include the values
    // for this lineage
    const lineageIndex = Array.from(CONFIG.SYSTEM.LINEAGE_DOCUMENTS).findIndex(l => l.id === id);
    const age = formData["system.age"][lineageIndex];
    const size = formData["system.size"][lineageIndex];

    // Attach to updateData
    updateData["system.age"] = age;
    updateData["system.size"] = size;

    try {
      await this.object.update(updateData);
    }
    catch(e) {
      console.error(e);
    }
  }

  /* -------------------------------------------- */

  async _submitHeritageChange(button) {
    const id = button.dataset.id;
    const updateData = {"system.heritage": id};

    let formData = this._getSubmitData();

    // Find the index of this heritage in the heritages array, then reduce the formData arrays to only include the
    // values for this heritage
    const heritageIndex = Array.from(CONFIG.SYSTEM.HERITAGE_DOCUMENTS).findIndex(l => l.id === id);
    const alignment = formData["system.alignment"][heritageIndex];

    // Attach to updateData
    updateData["system.alignment"] = alignment;

    try {
      await this.object.update(updateData);
    }
    catch(e) {
      console.error(e);
    }
  }

  /* -------------------------------------------- */

  async _submitBackgroundChange(button) {
    const id = button.dataset.id;
    const updateData = {"system.background": id};

    // Get the list of a.talent-link and add them to the update
    const talentLinks = this.element.find("a.talent-link");
    updateData["system.talents"] = Array.from(talentLinks.map((i, link) => link.dataset.id));

    try {
      await this.object.update(updateData);
    }
    catch(e) {
      console.error(e);
    }
  }

  /* -------------------------------------------- */

  async _submitClassChange(button) {
    const id = button.dataset.id;
    const updateData = {"system.class": id};

    try {
      await this.object.update(updateData);
    }
    catch(e) {
      console.error(e);
    }
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

    // Clear out any existing .talent-link elements
    const existingTalents = event.currentTarget.parentElement.querySelectorAll(".talent");
    for ( let existingTalent of existingTalents ) {
      existingTalent.remove();
    }

    // Add the new talent
    event.currentTarget.parentElement.insertBefore(talentRow, event.currentTarget);
    event.currentTarget.value = "";
  }
}
