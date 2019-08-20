import Key from './IKey';
declare function tob64(data: string): string;
declare function fromb64(data: string): string;
export default interface Serializable<T> {
    serializerId(): string;
    serialize(): string;
    deserialize(s: string): T;
}
declare class SString implements Key<SString> {
    serializerId: () => string;
    val: string;
    constructor(s: string);
    compareTo(other: SString): number;
    serialize(): string;
    deserialize(s: string): SString;
}
declare class SNum implements Key<SNum> {
    serializerId: () => string;
    val: number;
    constructor(s: number);
    compareTo(other: SNum): number;
    serialize(): string;
    deserialize(s: string): SNum;
}
declare class SArray<VALUE extends Serializable<VALUE>> implements Serializable<SArray<VALUE>> {
    serializerId: () => string;
    val: VALUE[];
    cons: VALUE;
    constructor(val?: VALUE[]);
    slice(start: number, length: number): SArray<VALUE>;
    serialize(): string;
    deserialize(s: string): SArray<VALUE>;
}
declare class SerializerManager {
    items: {
        [classname: string]: Serializable<any>;
    };
    register(item: Serializable<any>): void;
    deserialize(s: string): any;
}
declare let serializer: SerializerManager;
export { SNum, SString, fromb64, tob64, Serializable, SArray, serializer, SerializerManager };
