export const SYSTEM_ID = "black-flag";
export const SYSTEM_NAME = "Black Flag 🏴";

function isDebugging() {
    return game.modules.get('_dev-mode')?.api?.getPackageDebugValue(SYSTEM_ID);
}

function log(...args) {
    if ( isDebugging() ) console.log(`${SYSTEM_NAME} |`, ...args);
}

/**
 * The supported skill types.
 * @type {{label: string}}
 */
const SKILL_TYPES = {
    arcana: {label: "Arcana"},
    history: {label: "History"},
    nature: {label: "Nature"},
    religion: {label: "Religion"},
    survival: {label: "Survival"},
    perception: {label: "Perception"},
}

/**
 * The supported tool types.
 * @type {{label: string}}
 */
const TOOL_TYPES = {
    glassblower: {label: "Glassblower's Tools"},
    smith: {label: "Smith's Tools"},
    brewer: {label: "Brewer's Supplies"},
    mason: {label: "Mason's Tools"},
}

/**
 * The supported weapon types.
 * @type {{label: string}}
 */
const WEAPON_TYPES = {

    // Axes
    battleaxe: {label: "Battleaxe"},
    handaxe: {label: "Handaxe"},

    // Hammers
    lightHammer: {label: "Light Hammer"},
    warhammer: {label: "Warhammer"},

    // Swords
    longsword: {label: "Longsword"},
    shortsword: {label: "Shortsword"},

    // Bows
    longbow: {label: "Longbow"},
    shortbow: {label: "Shortbow"},
}

/**
 * The supported vehicle types.
 * @type {{label: string}}
 */
const VEHICLE_TYPES = {
    boat: {label: "[EXAMPLE] Boat"},
}

/**
 * The supported armor types.
 * @type {{label: string}}
 */
const ARMOR_TYPES = {
    light: {label: "Light Armor"},
    medium: {label: "Medium Armor"},
    heavy: {label: "Heavy Armor"},
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
    ...ARMOR_TYPES,
}

/**
 * The supported damage types that target a defense.
 * @enum {{label: string}}
 */
const DAMAGE_TYPES = {
    bludgeoning: {label: "Bludgeoning"},
    poison: {label: "Poison"},
    fire: {label: "Fire"},
}

/**
 * The supported save types.
 * @type {{label: string}}
 */
const SAVE_TYPES = {
    ...DAMAGE_TYPES,
    charm: {label: "Charm"},
}

/**
 * The supported language types.
 * @enum {{label: string}}
 */
const LANGUAGE_TYPES = {
    common: {label: "Common"},
    trade: {label: "Trade"},
    ignan: {label: "Ignan"},
    dwarvish: {label: "Dwarvish"},
    elvish: {label: "Elvish"},
    draconic: {label: "Draconic"},
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
 * @type {{label: string}}
 */
const EQUIPMENT_SIZES = {
    small: {label: "[EXAMPLE] Small"},
}

/**
 * The supported Talent Categories.
 * @type {{label: string}}
 */
const TALENT_CATEGORIES = {
    magic: {label: "Magic"},
    martial: {label: "Martial"},
    technical: {label: "Technical"},
}

/**
 * Given a level, return the XP required to the level.
 * @type {Map<int, int>}
 */
const XP_TABLE = new Map([
    [1, 0],
    [2, 300],
    [3, 2700],
    [4, 6500],
    [5, 6500],
    [6, 14000],
    [7, 23000],
    [8, 34000],
    [9, 48000],
    [10, 64000],
    [11, 85000],
    [12, 100000],
    [13, 120000],
    [14, 140000],
    [15, 165000],
    [16, 195000],
    [17, 225000],
    [18, 265000],
    [19, 305000],
    [20, 355000]
]);

/**
 * The supported character builder modes.
 * @type {{label: string}}
 */
const CHARACTER_BUILDER_MODES = {
    all: {label: "All"},
    any: {label: "Any"},
    chooseOne: {label: "Choose One"},
}

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
    id: SYSTEM_ID,
    name: SYSTEM_NAME,
    log,
    isDebugging,
    TOOL_TYPES,
    SKILL_TYPES,
    PROFICIENCY_TYPES,
    VEHICLE_TYPES,
    DAMAGE_TYPES,
    LANGUAGE_TYPES,
    RACE_SIZE_TYPES,
    ALIGNMENT_TYPES,
    EQUIPMENT_SIZES,
    TALENT_CATEGORIES,
    BACKGROUND_DOCUMENTS: new Collection(),
    HERITAGE_DOCUMENTS: new Collection(),
    LINEAGE_DOCUMENTS: new Collection(),
    SAVE_TYPES,
    XP_TABLE,
    CHARACTER_BUILDER_MODES,
};
