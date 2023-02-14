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
    }
}
