/**
 * Formats rounds for human readable display
 *
 * 1 round is nominally a "turn"
 * 10 rounds is a minute
 * 600 rounds is an hour
 * 14400 rounds is a day
 * 1008000 is a week
 * 4032000 is a month
 * 48384000 is a year
 *
 * @param {number} rounds
 * @returns {{number: number, unit: string}}
 */
export function formatRounds(rounds) {
  if (rounds < 10) {
    return {
      number: rounds,
      unit: "turns"
    };
  }

  if (rounds < 600) {
    return {
      number: Math.floor(rounds / 10),
      unit: "minutes"
    };
  }

  if (rounds < 14400) {
    return {
      number: Math.floor(rounds / 600),
      unit: "hours"
    };
  }

  if (rounds < 1008000) {
    return {
      number: Math.floor(rounds / 14400),
      unit: "days"
    };
  }

  if (rounds < 4032000) {
    return {
      number: Math.floor(rounds / 1008000),
      unit: "weeks"
    };
  }

  if (rounds < 48384000) {
    return {
      number: Math.floor(rounds / 4032000),
      unit: "months"
    };
  }

  return {
    number: Math.floor(rounds / 48384000),
    unit: "years"
  };
}

/**
 * Converts an object of number and unit into a number of rounds
 * @param {number} number
 * @param {string} unit
 * @returns {number} - a number of rounds
 */
export function convertToRounds(number, unit) {
  switch (unit) {
    case "turns":
      return number;
    case "minutes":
      return number * 10;
    case "hours":
      return number * 600;
    case "days":
      return number * 14400;
    case "weeks":
      return number * 1008000;
    case "months":
      return number * 4032000;
    case "years":
      return number * 48384000;
  }
}
