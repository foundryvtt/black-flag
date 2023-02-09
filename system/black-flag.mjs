import { init } from "./hooks/init.mjs";
import {SYSTEM_ID} from "./CONSTANTS.mjs";

Hooks.once("init", init);
Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(SYSTEM_ID));
