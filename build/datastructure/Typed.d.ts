export default abstract class Typed<T> {
    abstract getType(): T;
    isTypeOf(x: any): x is Typed<T>;
}
declare abstract class DualTyped<T, U> {
    abstract getType1(): T;
    abstract getType2(): U;
    isTypeOf(x: any): x is DualTyped<T, U>;
}
export { Typed, DualTyped };
