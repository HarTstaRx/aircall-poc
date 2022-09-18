export interface Option {
  label: string;
  value: string;
}

/**
 * Checks if a string is null, empty or undefined
 *
 * @public
 */
export const isNullOrEmpty = (text?: string | null): boolean =>
  typeof text === 'undefined' || text === null || text.trim().length === 0;

/**
 * Generates a random, alphabetical, and five characters long string
 *
 * @public
 */
export const randomId = (prefix?: string): string =>
  `${prefix ?? ''}${Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5)}`;

export const removeDuplicates = <T>(array: T[]): T[] =>
  array.filter((item, index, self) => self.indexOf(item) === index);

/**
 * Forms a tuple of label and value for each value of an enum
 * @param enumType - Type fo the enum
 * @returns Returns a tuple array for each value of the enum
 *
 * @public
 */
export const getOptionsFromEnum = <T>(enumType: T): Option[] => {
  return Object.entries(
    enumType as unknown as { [s: string]: unknown } | ArrayLike<unknown>
  )
    .filter((entry) => !Number.isInteger(parseInt(entry[0])))
    .map((entry) => {
      return {
        label: entry[0].toString(),
        value: (entry[1] as string).toString(),
      };
    });
};

/**
 * Simplifies a function making the first(s) params fixed
 * @param f - function to execute partially
 * @param headArgs - receives as many arguments as @param f , in the same order
 * @returns Returns @param f without @param headArgs, they are already passed down
 *
 * @public
 */
export const partialCall = <
  Head extends unknown[],
  Tail extends unknown[],
  Result
>(
  f: (...args: [...Head, ...Tail]) => Result,
  ...headArgs: Head
): ((...tailArgs: Tail) => Result) => {
  return (...tailArgs: Tail) => f(...headArgs, ...tailArgs);
};

/**
 * Filters an array by property
 * @param arr - Array to filter
 * @param prop - Property name to filter
 * @param value - Value to filter
 * @returns Returns the array filtered by the value
 *
 * @public
 */
export const getBy = <T, P extends keyof T>(
  arr: T[],
  prop: P,
  value: T[P]
): T[] | null => {
  return arr.filter((item: T) => item[prop] === value) ?? null;
};
