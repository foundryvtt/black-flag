export default class ForeignDocumentSet extends HTMLElement {
    constructor() {
        const self = super();

        const shadow = this.attachShadow({mode: 'open'});

        // Create a containing div
        const container = document.createElement('div');
        container.classList.add('flexcol');
        container.classList.add('foreign-document-set');
        container.classList.add(this.getAttribute('class') ?? '');

        // Find all the contained divs and add them to the container
        const children = Array.from(self.querySelectorAll('div'));
        for ( const child of children ) {
            child.querySelector('a.content-link').addEventListener('click', event => this.onClickContentLink(event));
            child.querySelector('[data-action="delete"]').addEventListener('click', event => this._onDelete(event));
            container.appendChild(child);
        }

        // Create an input
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = this.getAttribute("placeholder") ?? 'Search';
        input.setAttribute('list', 'search-options');
        input.name = this.getAttribute('name') ?? 'foreign-document-set';
        input.addEventListener('input', event => this.onInputChange(event));
        container.appendChild(input);

        // Create a datalist
        const datalist = document.createElement('datalist');
        datalist.id = 'search-options';

        const options = this.searchDocuments('', this.getAttribute('type'), this.getAttribute('subtype'));
        for (const option of options) {
            const optionElement = document.createElement('option');
            optionElement.dataset.uuid = option.uuid;
            optionElement.value = option.entry.id;
            optionElement.label = option.entry.name;
            datalist.appendChild(optionElement);
        }
        container.appendChild(datalist);

        // Create link to external css
        const foundryStyle = document.createElement('link');
        foundryStyle.setAttribute('rel', 'stylesheet');
        foundryStyle.setAttribute('href', 'css/style.css');

        // Create link to Font Awesome
        const fontAwesomeStyle = document.createElement('link');
        fontAwesomeStyle.setAttribute('rel', 'stylesheet');
        fontAwesomeStyle.setAttribute('href', 'fonts/fontawesome/css/all.min.css');

        // Create link to Black Flag css
        const blackFlagStyle = document.createElement('link');
        blackFlagStyle.setAttribute('rel', 'stylesheet');
        blackFlagStyle.setAttribute('href', 'systems/black-flag/css/black-flag.css');

        // Component CSS
        const componentStyle = document.createElement('style');
        componentStyle.textContent = this.css();

        // Add to shadow dom
        shadow.appendChild(foundryStyle);
        shadow.appendChild(fontAwesomeStyle);
        shadow.appendChild(blackFlagStyle);
        shadow.appendChild(componentStyle);
        shadow.appendChild(container);
    }

    /* -------------------------------------------- */

    css() {
        // language=CSS
        return `
            .foreign-document {
                padding-bottom: 5px;
            }
            [data-action="delete"] {
                flex: none;
                margin-left: 5px;
                padding-top: 2px;
                cursor: pointer;
            }
        `
    }

    /* -------------------------------------------- */

    searchDocuments(search, type, subtype) {
        let results = [];
        if ( type ) {
            results = Object.values(game.documentIndex.lookup(search.toLowerCase(), {documentTypes: [type]}))
                .flatMap(_ => _);
        }
        else {
            results = Object.values(game.documentIndex.lookup(search.toLowerCase()).flatMap(_ => _));
        }
        if ( subtype ) return results.filter(t => t.entry.type === subtype);
        return results;
    }

    /* -------------------------------------------- */

    onInputChange(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.currentTarget.value += event.value;
        const doc = game.collections.get(this.getAttribute('type')).get(event.currentTarget.value);
        if ( !doc ) return;

        // Otherwise, insert the document into the list
        const documentLink = document.createElement("a");
        documentLink.classList.add("content-link");
        documentLink.dataset.id = doc.id;
        documentLink.dataset.uuid = doc.uuid;
        documentLink.dataset.type = "Item";
        documentLink.dataset.tooltip = "Item";
        documentLink.innerHTML = `<i class="fas fa-suitcase"></i> ${doc.name}`;
        documentLink.draggable = true;
        documentLink.addEventListener("click", this.onClickContentLink.bind(this));

        const documentRow = document.createElement("div");
        documentRow.classList.add("flexrow");
        documentRow.classList.add("foreign-document");
        documentRow.appendChild(documentLink);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas");
        deleteIcon.classList.add("fa-delete-left");
        deleteIcon.dataset.action = "delete";
        deleteIcon.addEventListener("click", this._onDelete.bind(this));
        documentRow.appendChild(deleteIcon);

        event.currentTarget.parentElement.insertBefore(documentRow, event.currentTarget);
        event.currentTarget.value = "";
    }

    /* -------------------------------------------- */

    /**
     * Handles deleting a document from the set
     * @param {Event} event
     * @private
     */
    _onDelete(event) {
        event.currentTarget.parentElement.remove();
    }

    /* -------------------------------------------- */

    /**
     * Handles opening a Content link
     * @param {Event} event
     * @returns {Promise<*>}
     * @private
     */
    async onClickContentLink(event) {
        event.preventDefault();
        const doc = await fromUuid(event.currentTarget.dataset.uuid);
        return doc?._onClickDocumentLink(event);
    }
}
