import {SYSTEM_ID} from "./CONSTANTS.mjs";
import {init} from "./hooks/init.mjs";
import {renderSettings} from "./hooks/renderSettings.mjs";

Hooks.once("init", init);
Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(SYSTEM_ID));
Hooks.on("renderSettings", renderSettings);
