import { HELPERS } from "./helpers/HELPERS.mjs";

export const SYSTEM_ID = "black-flag";
export const SYSTEM_NAME = "Black Flag 🏴";

/**
 * The expected distance units.
 * @type {{label: string}}
 */
const DISTANCE_UNITS = {
  ft: {label: "ft"},
  mi: {label: "mi"}
};

/**
 * The expected power area of effect types.
 * @type {{label: string}}
 */
const AREA_OF_EFFECT_TYPES = {
  sphere: {label: "sphere"},
  cylinder: {label: "cylinder"},
  cone: {label: "cone"},
  square: {label: "square"},
  cube: {label: "cube"},
  line: {label: "line"}
};

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
  animalHandling: {label: "Animal Handling"},
  athletics: {label: "Athletics"},
  medicine: {label: "Medicine"}
};

/**
 * The supported tool types.
 * @type {{label: string}}
 */
const TOOL_TYPES = {
  glassblower: {label: "Glassblower's Tools"},
  smith: {label: "Smith's Tools"},
  brewer: {label: "Brewer's Supplies"},
  mason: {label: "Mason's Tools"}
};

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
  shortbow: {label: "Shortbow"}
};

/**
 * The supported vehicle types.
 * @type {{label: string}}
 */
const VEHICLE_TYPES = {
  water: {label: "Water Vehicles"},
  land: {label: "Land Vehicles"}
};

/**
 * The supported armor types.
 * @type {{label: string}}
 */
const ARMOR_TYPES = {
  light: {label: "Light Armor"},
  medium: {label: "Medium Armor"},
  heavy: {label: "Heavy Armor"}
};

/**
 * The supported proficiency types.
 * @enum {{label: string}}
 */
const PROFICIENCY_TYPES = {
  ...SKILL_TYPES,
  ...TOOL_TYPES,
  ...WEAPON_TYPES,
  ...VEHICLE_TYPES,
  ...ARMOR_TYPES
};

/**
 * The supported damage types that target a defense.
 * @enum {{label: string}}
 */
const DAMAGE_TYPES = {
  bludgeoning: {label: "Bludgeoning"},
  poison: {label: "Poison"},
  fire: {label: "Fire"}
};

/**
 * The supported save types.
 * @type {{label: string}}
 */
const SAVE_TYPES = {
  ...DAMAGE_TYPES,
  charm: {label: "Charm"}
};

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
  draconic: {label: "Draconic"}
};

/**
 * The supported race size types.
 * @type {{label: string}}
 */
const RACE_SIZE_TYPES = {
  small: {label: "Small"},
  medium: {label: "Medium"}
};

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
  chaoticEvil: {label: "Chaotic Evil"}
};

/**
 * The supported equipment sizes.
 * @type {{label: string}}
 */
const EQUIPMENT_SIZES = {
  small: {label: "[EXAMPLE] Small"}
};

/**
 * The supported Talent Categories.
 * @type {{label: string}}
 */
const TALENT_CATEGORIES = {
  magic: {label: "Magic"},
  martial: {label: "Martial"},
  technical: {label: "Technical"}
};

/**
 * The supported hit die types.
 * @type {{label: string}}
 */
const HIT_DIE_TYPES = {
  d6: {label: "d6"},
  d10: {label: "d10"}
};

/**
 * The supported ability types.
 * @type {{label: string, shorthand: string}} */
const ABILITY_TYPES = {
  strength: {label: "Strength", shorthand: "STR"},
  dexterity: {label: "Dexterity", shorthand: "DEX"},
  constitution: {label: "Constitution", shorthand: "CON"},
  intelligence: {label: "Intelligence", shorthand: "INT"},
  wisdom: {label: "Wisdom", shorthand: "WIS"},
  charisma: {label: "Charisma", shorthand: "CHA"}
};

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
  ALL: {label: "All"},
  ANY: {label: "Any"},
  CHOOSE_ONE: {label: "Choose One"}
};

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  ...HELPERS,
  id: SYSTEM_ID,
  name: SYSTEM_NAME,
  TOOL_TYPES,
  SKILL_TYPES,
  PROFICIENCY_TYPES,
  VEHICLE_TYPES,
  DAMAGE_TYPES,
  LANGUAGE_TYPES,
  RACE_SIZE_TYPES,
  ALIGNMENT_TYPES,
  EQUIPMENT_SIZES,
  DISTANCE_UNITS,
  AREA_OF_EFFECT_TYPES,
  TALENT_CATEGORIES,
  BACKGROUND_DOCUMENTS: new Collection(),
  HERITAGE_DOCUMENTS: new Collection(),
  LINEAGE_DOCUMENTS: new Collection(),
  SAVE_TYPES,
  XP_TABLE,
  CHARACTER_BUILDER_MODES,
  HIT_DIE_TYPES,
  ABILITY_TYPES
};
