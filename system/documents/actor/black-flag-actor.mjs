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
}
