/**
 * Type partial used for defining the entities.
 * This is used for abstract domain entities
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends number | string | boolean | undefined
  ? T[P] | undefined
  : T[P] extends Date
  ? Date | string | undefined
  : T[P] extends any[]
  ? (DeepPartial<T[P][number]> | null | undefined)[]
  : DeepPartial<T[P]>;
};  