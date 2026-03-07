import { ColumnOptions } from 'typeorm';

export const numericColumn = (
  precision: number,
  scale: number,
  nullable = false,
): ColumnOptions => ({
  type: 'numeric',
  precision,
  scale,
  nullable,
});

export const varcharColumn = (
  length: number,
  nullable = false,
): ColumnOptions => ({
  type: 'varchar',
  length,
  nullable,
});
