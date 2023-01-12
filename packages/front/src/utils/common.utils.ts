export const nonNullable = <T = any>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;
