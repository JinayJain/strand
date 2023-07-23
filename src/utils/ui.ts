export function pluralize(count: number, singular: string, pluralSuffix = "s") {
  return `${count} ${count === 1 ? singular : singular + pluralSuffix}`;
}
