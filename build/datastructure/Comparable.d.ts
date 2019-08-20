declare function caster<T>(x: any): x is T;
declare function isNumber(x: any): x is number;
declare function isString(x: any): x is string;
declare function strcomp(a: string, b: string): number;
interface comparable<KEY> {
    compareTo(other: KEY): number;
}
declare function isComparable<T>(x: any): x is comparable<T>;
declare function compare<KEY>(a: any, b: any): number;
export { compare, isComparable, strcomp, isString, isNumber, caster, comparable };
