export const transformArrayStringToNumber : (arr: string, delimiter?: string) => Array<number> = (arr: string, delimiter = ','): Array<number> =>
  arr.split(delimiter).map((el) => Number(el))
export const createArray : (arr: number) => Array<number> = (arr: number): Array<number> => [...Array(arr).keys()]
export const capitalize : (s: string) => string = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export const hasEmptyDataObject : (obj: Object) => boolean = (obj: Object): boolean => Object.values(obj).some((el) => !el.trim())