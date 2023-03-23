
export function isDebugging() {
  return game.modules.get("_dev-mode")?.api?.getPackageDebugValue(SYSTEM_ID);
}

export function log(...args) {
  if ( isDebugging() ) console.log(`${SYSTEM_NAME} |`, ...args);
}

