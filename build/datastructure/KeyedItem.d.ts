import { DualTyped } from './Typed';
import { comparable } from './Comparable';
import { Serializable } from './Serializable';
import Key from './IKey';
export default class KeyedItem<KEY extends Key<KEY>, VALUE extends Serializable<VALUE>> extends DualTyped<KEY, VALUE> implements Serializable<KeyedItem<KEY, VALUE>>, comparable<KeyedItem<KEY, VALUE>> {
    serializerId(): string;
    compareTo(other: KeyedItem<KEY, VALUE> | KEY): number;
    private key;
    private value;
    constructor(key: KEY, value: VALUE);
    getKey(): KEY;
    getType1(): KEY;
    getType2(): VALUE;
    getValue(): any;
    setValue(value: VALUE): void;
    serialize(): string;
    deserialize(s: string): KeyedItem<KEY, VALUE>;
}
