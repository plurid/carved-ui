/**
 * A seeded random number generator (mulberry32). Generated data is then the same on the
 * server, which prerenders the page, and in the browser, which hydrates it.
 */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export type Random = ReturnType<typeof seeded>;

/** One of a list, chosen at random. */
export const pick = <T>(random: Random, list: readonly T[]): T =>
  list[Math.floor(random() * list.length)]!;

/** A whole number from `min` to `max`, inclusive. */
export const between = (random: Random, min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));

/** People from many places, for the apps' sample data. */
export const people = [
  'Amara Okafor',
  'Kenji Sato',
  'Lena Fischer',
  'Mateo García',
  'Priya Nair',
  'Sofia Rossi',
  'Émile Dubois',
  'Zhang Wei',
  'Nadia Haddad',
  'Lars Eriksen',
  'Ana Lima',
  'Tomás Novák',
  'Aiko Tanaka',
  'Yusuf Demir',
  'Ingrid Berg',
  'Kwame Mensah',
  'Elena Petrova',
  'Diego Morales',
  'Hana Kim',
  'Oliver Hughes',
  'Fatima Zahra',
  'Mikael Laine',
  'Chiara Bianchi',
  'Arjun Mehta',
] as const;

/** An email address for a person, at a domain. */
export const emailOf = (name: string, domain: string) =>
  `${name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')}@${domain}`;

/** The apps' fixed "now", so what they show is the same wherever and whenever they render. */
export const NOW = Date.UTC(2026, 2, 10, 9, 41);
