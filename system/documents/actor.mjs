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
        for ( let [a, abl] of Object.entries(this.system.abilities) ) {
            this.system.abilities[a] = {
                value: abl,
                mod: Math.floor((abl - 10) / 2)
            }
        }

        // Load Foreign Documents

        if ( CONFIG.SYSTEM.BACKGROUND_DOCUMENTS.size === 0 ) {
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
        if ( this.system.background ) {
            for (const trait of this.system.background.system.traits) {
                trait.source = this.system.background.name;
                trait.sourceId = this.system.background._id;
                this.system.traits.push(trait);
            }
        }
        if ( this.system.heritage ) {
            for (const trait of this.system.heritage.system.traits) {
                trait.source = this.system.heritage.name;
                trait.sourceId = this.system.heritage._id;
                this.system.traits.push(trait);
            }
        }
        if ( this.system.lineage ) {
            for (const trait of this.system.lineage.system.traits) {
                trait.source = this.system.lineage.name;
                trait.sourceId = this.system.lineage._id;
                this.system.traits.push(trait);
            }
        }

        // Setup current values with a source of "chosen"
        this.system.proficiencies = this.system.proficiencies.map(p => {
            let result = {};
            result.source = "Chosen";
            result.value = p;
            result.label = CONFIG.SYSTEM.PROFICIENCY_TYPES[p].label;
            return result;
        });
        this.system.resistances = this.system.resistances.map(r => {
            let result = {};
            result.source = "Chosen";
            result.value = r;
            result.label = CONFIG.SYSTEM.DAMAGE_TYPES[r].label;
            return result;
        });
        this.system.languages = this.system.languages.map(l => {
            let result = {};
            result.source = "Chosen";
            result.value = l;
            result.label = CONFIG.SYSTEM.LANGUAGE_TYPES[l].label;
            return result;
        });
        this.system.saveAdvantages = this.system.saveAdvantages.map(s => {
            let result = {};
            result.source = "Chosen";
            result.value = s;
            result.label = CONFIG.SYSTEM.SAVE_TYPES[s].label;
            return result;
        });

        // Add innate values
        for ( const trait of this.system.traits ) {
            this.system.proficiencies = this.system.proficiencies.concat(trait.innate.proficiencies.map(p => {
                const config = CONFIG.SYSTEM.PROFICIENCY_TYPES[p];
                if ( !config ) {
                    CONFIG.SYSTEM.log(`Unknown proficiency type ${p} in ${trait.source} (${trait.name})`);
                    return;
                }
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = p;
                result.label = config.label;
                return result;
            }));
            this.system.resistances = this.system.resistances.concat(trait.innate.resistances.map(r => {
                const config = CONFIG.SYSTEM.DAMAGE_TYPES[r];
                if ( !config ) {
                    CONFIG.SYSTEM.log(`Unknown proficiency type ${r} in ${trait.source} (${trait.name})`);
                    return;
                }
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = r;
                result.label = config.label;
                return result;
            }));
            this.system.languages = this.system.languages.concat(trait.innate.languages.map(l => {
                const config = CONFIG.SYSTEM.LANGUAGE_TYPES[l];
                if ( !config ) {
                    CONFIG.SYSTEM.log(`Unknown proficiency type ${l} in ${trait.source} (${trait.name})`);
                    return;
                }
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = l;
                result.label = config.label;
                return result;
            }));
            this.system.saveAdvantages = this.system.saveAdvantages.concat(trait.innate.saveAdvantages.map(s => {
                const config = CONFIG.SYSTEM.SAVE_TYPES[s];
                if ( !config ) {
                    CONFIG.SYSTEM.log(`Unknown proficiency type ${s} in ${trait.source} (${trait.name})`);
                    return;
                }
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = s;
                result.label = config.label;
                return result;
            }));
        }

        // Dedupe and sort the lists alphabetically
        this.system.proficiencies = Array.from(new Set(this.system.proficiencies)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.resistances = Array.from(new Set(this.system.resistances)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.languages = Array.from(new Set(this.system.languages)).sort((a, b) => a.label.localeCompare(b.label));
        this.system.saveAdvantages = Array.from(new Set(this.system.saveAdvantages)).sort((a, b) => a.label.localeCompare(b.label));
    }
}
