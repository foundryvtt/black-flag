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

    _preparePcDerivedData() {

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
        this.system.backgroundId = this._source.system.background;
        this.system.background = game.items.get(this._source.system.background);
        this.system.heritageId = this._source.system.heritage;
        this.system.heritage = game.items.get(this._source.system.heritage);
        this.system.lineageId = this._source.system.lineage;
        this.system.lineage = game.items.get(this._source.system.lineage);

        // Load Traits
        this.system.traits = [];
        for ( const trait of this.system.background.system.traits ) {
            trait.source = this.system.background.name;
            trait.sourceId = this.system.background._id;
            this.system.traits.push(trait);
        }
        for ( const trait of this.system.heritage.system.traits ) {
            trait.source = this.system.heritage.name;
            trait.sourceId = this.system.heritage._id;
            this.system.traits.push(trait);
        }
        for ( const trait of this.system.lineage.system.traits ) {
            trait.source = this.system.lineage.name;
            trait.sourceId = this.system.lineage._id;
            this.system.traits.push(trait);
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
            result.label = CONFIG.SYSTEM.ABILITIES[s].label;
            return result;
        });

        // Add innate values
        for ( const trait of this.system.traits ) {
            console.dir(trait);
            this.system.proficiencies = this.system.proficiencies.concat(trait.innate.proficiencies.map(p => {
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = p;
                result.label = CONFIG.SYSTEM.PROFICIENCY_TYPES[p].label;
                return result;
            }));
            this.system.resistances = this.system.resistances.concat(trait.innate.resistances.map(r => {
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = r;
                result.label = CONFIG.SYSTEM.DAMAGE_TYPES[r].label;
                return result;
            }));
            this.system.languages = this.system.languages.concat(trait.innate.languages.map(l => {
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = l;
                result.label = CONFIG.SYSTEM.LANGUAGE_TYPES[l].label;
                return result;
            }));
            this.system.saveAdvantages = this.system.saveAdvantages.concat(trait.innate.saveAdvantages.map(s => {
                let result = {};
                result.source = trait.source + " (" + trait.name + ")";
                result.value = s;
                result.label = CONFIG.SYSTEM.ABILITIES[s].label;
                return result;
            }));
        }
    }
}
