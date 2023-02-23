/**
 * Extend the basic ActorSheet with some shared behaviors
 */
export default class BlackFlagActor extends Actor {


    /**
     * Is this Actor currently in the active Combat encounter?
     * @type {boolean}
     */
    get inCombat() {
        if ( this.isToken ) return !!game.combat?.combatants.find(c => c.tokenId === this.token.id);
        return !!game.combat?.combatants.find(c => c.actorId === this.id);
    }

    /* -------------------------------------------- */

    prepareDerivedData() {
        switch ( this.type ) {
            case "pc": return this._preparePcDerivedData();
        }
    }


    /* -------------------------------------------- */

    async loadForeignDocuments() {

        async function getForeignDocuments(type, subtype) {
            let docs = game.collections.get(type).filter(d => d.type === subtype);

            /// Iterate through the Packs, adding them to the list
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
            const collection = new Collection();
            for ( let d of docs ) {
                collection.set(d.id, d);
            }
            return collection;
        }

        CONFIG.SYSTEM.LINEAGE_DOCUMENTS = await getForeignDocuments("Item", "lineage");
        CONFIG.SYSTEM.HERITAGE_DOCUMENTS = await getForeignDocuments("Item", "heritage");
        CONFIG.SYSTEM.BACKGROUND_DOCUMENTS = await getForeignDocuments("Item", "background");
        CONFIG.SYSTEM.TALENT_DOCUMENTS = await getForeignDocuments("Item", "talent");
    }

    /* -------------------------------------------- */

    async _preparePcDerivedData() {

        console.log("Black Flag 🏴 | Preparing PC Derived Data");

        this.prepareAbilityScoreMods();
        await this.prepareForeignDocumentData();
        this.prepareCharacterBuilderData();
        this.prepareAdvantages();
    }

    /* -------------------------------------------- */

    prepareAbilityScoreMods() {
        // For each ability score, determine the modifier
        /**
         * 1 = -5
         * 2-3 = -4
         * 4-5 = -3
         * 6-7 = -2
         * 8-9 = -1
         * 10-11 = 0
         * 12-13 = +1
         * 14-15 = +2
         * 16-17 = +3
         * 18-19 = +4
         * 20-21 = +5
         */
        for (let [a, abl] of Object.entries(this.system.abilities)) {
            this.system.abilities[a] = {
                value: abl,
                mod: Math.floor((abl - 10) / 2)
            }
        }
    }

    /* -------------------------------------------- */

    async prepareForeignDocumentData() {
        if (CONFIG.SYSTEM.BACKGROUND_DOCUMENTS.size === 0) {
            await this.loadForeignDocuments();
        }

        this.system.backgroundId = this._source.system.background;
        this.system.background = CONFIG.SYSTEM.BACKGROUND_DOCUMENTS.get(this._source.system.background);
        this.system.heritageId = this._source.system.heritage;
        this.system.heritage = CONFIG.SYSTEM.HERITAGE_DOCUMENTS.get(this._source.system.heritage);
        this.system.lineageId = this._source.system.lineage;
        this.system.lineage = CONFIG.SYSTEM.LINEAGE_DOCUMENTS.get(this._source.system.lineage);

        // Load Traits
        this.system.traits = [];
        if (this.system.background) {
            for (const trait of this.system.background.system.traits) {
                const data = foundry.utils.duplicate(trait);
                data.source = this.system.background.name;
                data.sourceId = this.system.background._id;
                this.system.traits.push(data);
            }
        }
        if (this.system.heritage) {
            for (const trait of this.system.heritage.system.traits) {
                const data = foundry.utils.duplicate(trait);
                data.source = this.system.heritage.name;
                data.sourceId = this.system.heritage._id;
                this.system.traits.push(data);
            }
        }
        if (this.system.lineage) {
            for (const trait of this.system.lineage.system.traits) {
                const data = foundry.utils.duplicate(trait);
                data.source = this.system.lineage.name;
                data.sourceId = this.system.lineage._id;
                this.system.traits.push(trait);
            }
        }

        // If the actor doesn't have traitChoices for some traits, add them
        if ( foundry.utils.isEmpty(this.system.traitChoices) ) this.system.traitChoices = [];
        for ( const trait of this.system.traits ) {
            if ( !trait.id ) continue;
            if ( !this.system.traitChoices.find(t => t.id === trait.id) ) {
                this.system.traitChoices.push(foundry.utils.mergeObject(foundry.utils.duplicate(trait), {
                    choices: [],
                    choicesFulfilled: false
                }));
            }
        }
    }

    /* -------------------------------------------- */

    /**
     * Character Builder JSON is of the form:
     * ```json
     * {
     *     "mode": "ALL",  // Default is "ALL"
     *     "options": {
     *       "additionalLanguage": {
     *         "amount": 1,   // Default is 1
     *         "category": "LANGUAGE_TYPES"
     *       }
     *     }
     * }
     * ```
     */
    prepareCharacterBuilderData() {

        // For each trait, parse the character builder data
        for ( const trait of this.system.traitChoices ) {
            if ( foundry.utils.isEmpty(trait.choices) ) trait.choices = [];
            if ( !trait.builderInfo?.options ) {
                trait.choicesFulfilled = true;
                continue;
            }

            const mode = trait.builderInfo.mode || "all";
            trait.builderInfo.mode = mode;
            let choicesMade = 0;

            // Determine what, if any, choices are missing
            for ( const [key, option] of Object.entries(trait.builderInfo.options) ) {
                const amount = option.amount ?? 1;

                // Build the list of choices
                let values = option.values ?? [];

                // If a category is specified and values is empty, add all the values from that category
                if ( option.category && (values.length === 0) ) {
                    const category = CONFIG.SYSTEM[option.category];
                    if ( !category ) continue;
                    values = values.concat(Object.keys(category));
                }

                const currentChoice = trait.choices.find(c => c.key === key);
                if ( currentChoice ) {
                    currentChoice.category = option.category;
                    currentChoice.label = option.label ?? key;
                    currentChoice.category = option.category;
                    currentChoice.options = values;
                    currentChoice.amount = amount;
                    if ( currentChoice.chosenValues.length === amount ) choicesMade++;
                }
                else {
                    trait.choices.push({
                        key: key,
                        label: option.label ?? key,
                        category: option.category,
                        options: values,
                        chosenValues: [],
                        amount: amount
                    });
                }
            }

            // Determine if all choices have been made
            switch ( mode ) {
                case "ALL": {
                    trait.choicesFulfilled = (choicesMade === Object.keys(trait.builderInfo.options).length);
                    break;
                }
                case "ANY": {
                    trait.choicesFulfilled = (choicesMade > 0);
                    break;
                }
                case "CHOOSE_ONE": {
                    trait.choicesFulfilled = (choicesMade === 1);
                    break;
                }
            }
        }
    }

    /* -------------------------------------------- */

    prepareAdvantages() {

        // Setup current values with a source of "Manual"
        function mapManualData(types, value) {
            let result = {};
            result.source = "Manual";
            result.sourceType = "manual";
            result.value = value;
            result.label = types[value].label;
            return result;
        }
        this.system.proficiencies = this.system.proficiencies.map(p => mapManualData(CONFIG.SYSTEM.PROFICIENCY_TYPES, p));
        this.system.resistances = this.system.resistances.map(r => mapManualData(CONFIG.SYSTEM.DAMAGE_TYPES, r));
        this.system.languages = this.system.languages.map(l => mapManualData(CONFIG.SYSTEM.LANGUAGE_TYPES, l));
        this.system.saveAdvantages = this.system.saveAdvantages.map(s => mapManualData(CONFIG.SYSTEM.SAVE_TYPES, s));

        // Add innate values
        function mapInnate(trait, types, innate) {
            const config = types[innate];
            if (!config) {
                CONFIG.SYSTEM.log(`Unknown type ${innate} in ${trait.source} (${trait.name})`);
                return;
            }
            let result = {};
            result.source = trait.source + " (" + trait.name + ")";
            result.sourceType = "innate";
            result.value = innate;
            result.label = config.label;
            return result;
        }
        for (const trait of this.system.traits) {
            this.system.proficiencies = this.system.proficiencies.concat(trait.innate.proficiencies
                .map(p => mapInnate(trait, CONFIG.SYSTEM.PROFICIENCY_TYPES, p)));

            this.system.resistances = this.system.resistances.concat(trait.innate.resistances
                .map(r => mapInnate(trait, CONFIG.SYSTEM.DAMAGE_TYPES, r)));

            this.system.languages = this.system.languages.concat(trait.innate.languages
                .map(l => mapInnate(trait, CONFIG.SYSTEM.LANGUAGE_TYPES, l)));

            this.system.saveAdvantages = this.system.saveAdvantages.concat(trait.innate.saveAdvantages
                .map(s => mapInnate(trait, CONFIG.SYSTEM.SAVE_TYPES, s)));
        }

        // Add trait choices
        function reduceTraitChoice(trait, category, choice, advantages) {
            if ( choice.category !== category) return advantages;
            for ( const value of choice.chosenValues ) {
                const config = CONFIG.SYSTEM[category][value];
                if (!config) {
                    CONFIG.SYSTEM.log(`Unknown type ${value} in ${trait.source} (${trait.name})`);
                    continue;
                }
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.sourceType = "choice";
                result.value = value;
                result.label = config.label;
                advantages.push(result);
            }
            return advantages;
        }
        for (const trait of this.system.traitChoices) {
            this.system.proficiencies = this.system.proficiencies.concat(trait.choices
                .reduce( (advantages, p) => reduceTraitChoice(trait, "PROFICIENCY_TYPES", p, advantages), []));
            this.system.resistances = this.system.resistances.concat(trait.choices
                .reduce( (advantages, r) => reduceTraitChoice(trait, "DAMAGE_TYPES", r, advantages), []));
            this.system.languages = this.system.languages.concat(trait.choices
                .reduce( (advantages, l) => reduceTraitChoice(trait, "LANGUAGE_TYPES", l, advantages), []));
            this.system.saveAdvantages = this.system.saveAdvantages.concat(trait.choices
                .reduce( (advantages, s) => reduceTraitChoice(trait, "SAVE_TYPES", s, advantages), []));
        }

        // Dedupe and sort the lists alphabetically
        this.system.proficiencies = Array.from(new Set(this.system.proficiencies)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.resistances = Array.from(new Set(this.system.resistances)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.languages = Array.from(new Set(this.system.languages)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.saveAdvantages = Array.from(new Set(this.system.saveAdvantages)).sort((a, b) => a.label.localeCompare(b.label));

    }
}
