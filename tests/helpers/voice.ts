export const BANNED: RegExp[] = [
  /\beasiest\b/i, /\bBS\b/, /\bslapped\b/i, /invisible online/i, /\bsolutions?\b/i,
  /\bleverage\b/i, /\bsynerg/i, /cutting[- ]edge/i, /game[- ]chang/i, /\brevolutionary\b/i,
  /\bunlock/i, /\bempower/i, /\bseamless/i, /\belevate/i, /—/, /!/, /\[gap/i,
];

export const PLACES: RegExp[] = [
  /Western Sydney/i, /Parramatta/i, /Blacktown/i, /Penrith/i, /Liverpool/i, /Campbelltown/i, /Castle Hill/i,
];

/** Every string value inside a nested object or array. */
export function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

/** Returns "rule :: string" for each string that breaks a rule. Empty means clean. */
export function findViolations(strings: string[], rules: RegExp[]): string[] {
  const hits: string[] = [];
  for (const s of strings) {
    for (const r of rules) {
      if (r.test(s)) hits.push(`${r} :: ${s}`);
    }
  }
  return hits;
}

/** A Dorza headline: short, declarative, ends in a full stop or question mark. */
export function isHeadline(s: string): boolean {
  return /[.?]$/.test(s) && s.split(/\s+/).length <= 8;
}
