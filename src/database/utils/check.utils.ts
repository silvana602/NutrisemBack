export const positiveCheck = (columnName: string): string =>
  `"${columnName}" > 0`;

export const nonNegativeCheck = (columnName: string): string =>
  `"${columnName}" >= 0`;

export const rangeCheck = (
  columnName: string,
  min: number,
  max: number,
): string => `"${columnName}" BETWEEN ${min} AND ${max}`;
