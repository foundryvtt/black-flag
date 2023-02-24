import {SYSTEM_ID} from "./CONSTANTS.mjs";
import {init} from "./hooks/init.mjs";
import {renderSettings} from "./hooks/renderSettings.mjs";
import CharacterBuilderForm from "./apps/forms/character-builder.mjs";

Hooks.once("init", init);
Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(SYSTEM_ID));
Hooks.on("renderSettings", renderSettings);

Hooks.on("ready", () => {
    if ( !CONFIG.SYSTEM.isDebugging() ) return;
    CONFIG.SYSTEM.log("Opening Character Builder Form");
    const actor = game.actors.get("fPh04RmCw7dWhGgq");
    new CharacterBuilderForm(actor).render(true);
});