export const SYSTEM_ID = "black-flag";
export const SYSTEM_NAME = "Black Flag 🏴";

function log(...args) {
    const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(SYSTEM_ID);
    if ( isDebugging ) console.log(`${SYSTEM_NAME} |`, ...args);
}

/**
 * The supported skill types.
 * @type {{label: string}}
 */
const SKILL_TYPES = {
    arcana: {label: "Arcana"},
    nature: {label: "Nature"},
    religion: {label: "Religion"},
}

/**
 * The supported tool types.
 * @type {{label: string}}
 */
const TOOL_TYPES = {
    alchemist: {label: "[EXAMPLE] Alchemist's Supplies"},
}

/**
 * The supported weapon types.
 * @type {{label: string}}
 */
const WEAPON_TYPES = {
    battleaxe: {label: "Battleaxe"},
    handaxe: {label: "Handaxe"},
    lightHammer: {label: "Light Hammer"},
    warhammer: {label: "Warhammer"},
}

/**
 * The supported vehicle types.
 * @type {{label: string}}
 */
const VEHICLE_TYPES = {
    boat: {label: "[EXAMPLE] Boat"},
}

/**
 * The supported proficiency types.
 * @enum {{label: string}}
 */
const PROFICIENCY_TYPES = {
    ...SKILL_TYPES,
    ...TOOL_TYPES,
    ...WEAPON_TYPES,
    ...VEHICLE_TYPES,
}

/**
 * The supported damage types that target a defense.
 * @enum {{label: string}}
 */
const DAMAGE_TYPES = {
    bludgeoning: {label: "Bludgeoning"},
    poison: {label: "Poison"},
}

/**
 * The supported language types.
 * @enum {{label: string}}
 */
const LANGUAGE_TYPES = {
    common: {label: "Common"},
    trade: {label: "Trade"},
}

/**
 * The supported race size types.
 * @type {{label: string}}
 */
const RACE_SIZE_TYPES = {
    small: {label: "Small"},
    medium: {label: "Medium"},
}

/**
 * The supported alignment types.
 * @type {{label: string}}
 */
const ALIGNMENT_TYPES = {
    lawfulGood: {label: "Lawful Good"},
    neutralGood: {label: "Neutral Good"},
    chaoticGood: {label: "Chaotic Good"},

    lawfulNeutral: {label: "Lawful Neutral"},
    neutral: {label: "Neutral"},
    chaoticNeutral: {label: "Chaotic Neutral"},

    lawfulEvil: {label: "Lawful Evil"},
    neutralEvil: {label: "Neutral Evil"},
    chaoticEvil: {label: "Chaotic Evil"},
}

/**
 * The supported equipment sizes.
 */
const EQUIPMENT_SIZES = {
    small: {label: "[EXAMPLE] Small"},
}

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
    id: SYSTEM_ID,
    name: SYSTEM_NAME,
    log,
    PROFICIENCY_TYPES,
    DAMAGE_TYPES,
    LANGUAGE_TYPES,
    RACE_SIZE_TYPES,
    ALIGNMENT_TYPES,
    EQUIPMENT_SIZES,
};
