/**
 * Name Randomizer — generates cute, silly monster names.
 *
 * Format: [Adjective] + [Noun/Suffix]
 * Style: kawaii, playful, slightly goofy — matches the app's warm tone.
 */

const PREFIXES = [
  'Fluffy',
  'Snuggly',
  'Wiggly',
  'Sparkle',
  'Fuzzy',
  'Bubbly',
  'Squishy',
  'Twinkle',
  'Giggly',
  'Wobbly',
  'Bouncy',
  'Sleepy',
  'Cheeky',
  'Dizzy',
  'Grumpy',
  'Pudgy',
  'Zippy',
  'Doofy',
  'Cozy',
  'Gloopy',
  'Noodle',
  'Mochi',
  'Bloop',
  'Sprout',
  'Pickle',
  'Dumpling',
  'Tofu',
  'Waffle',
  'Nugget',
  'Pebble',
  'Marshy',
  'Cloudy',
  'Starry',
  'Mossy',
  'Minty',
  'Dusty',
  'Misty',
  'Stormy',
  'Sunny',
  'Moony',
];

const SUFFIXES = [
  'puff',
  'bean',
  'munch',
  'boop',
  'flop',
  'squish',
  'plop',
  'chunk',
  'sprout',
  'nubs',
  'toes',
  'snoot',
  'belly',
  'cheeks',
  'whiskers',
  'fuzz',
  'tail',
  'paws',
  'snore',
  'burp',
  'nom',
  'chomp',
  'wobble',
  'tumble',
  'doodle',
  'bubble',
  'puddle',
  'crumb',
  'fluff',
  'muffin',
  'biscuit',
  'pickle',
  'noodle',
  'dumpling',
  'nugget',
  'waffle',
  'pancake',
  'cupcake',
  'truffle',
  'bonbon',
];

/**
 * Generate a random monster name.
 * Returns a name like "Fluffy Boop" or "Mochi Wobble".
 */
export function generateRandomName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  // Capitalize the suffix
  const capitalSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
  return `${prefix} ${capitalSuffix}`;
}

/**
 * Generate multiple unique random names for the user to pick from.
 */
export function generateNameOptions(count: number = 5): string[] {
  const names = new Set<string>();
  let attempts = 0;
  while (names.size < count && attempts < 100) {
    names.add(generateRandomName());
    attempts++;
  }
  return Array.from(names);
}
