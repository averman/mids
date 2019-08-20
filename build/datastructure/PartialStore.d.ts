import KeyedItem from './KeyedItem';
import RangedKey from './RangedKey';
import Serializable from './Serializable';
import { SArray } from './Serializable';
import Key from './IKey';
import Storage from '../store/Storage';
declare class PartialStoreCore<KEY extends Key<KEY>, VALUE extends Serializable<VALUE>> extends KeyedItem<RangedKey<KEY>, SArray<KeyedItem<RangedKey<KEY>, VALUE> | PartialStoreCore<KEY, VALUE>>> {
    id: string;
    density: number;
    _key: KEY;
    _val: VALUE;
    setDeserializer(key: KEY, value: VALUE): void;
    constructor(id: string, density?: number);
    serializerId(): string;
    serialize(): string;
    deserialize(s: string): PartialStoreCore<KEY, VALUE>;
    setKey(key: RangedKey<KEY>): PartialStoreCore<KEY, VALUE>;
    getDensity(): number;
}
declare class PartialStore<KEY extends Key<KEY>, VALUE extends Serializable<VALUE>> extends PartialStoreCore<KEY, VALUE> {
    ideal: number;
    storage: Storage;
    serializerId(): string;
    setDeserializer(key: KEY, value: VALUE): void;
    constructor(manager: Storage, id?: string, value?: SArray<KeyedItem<RangedKey<KEY>, VALUE> | PartialStoreCore<KEY, VALUE>>, idealsize?: number);
    add(item: KeyedItem<KEY, VALUE>): void;
    compact(): void;
    toCore(): PartialStoreCore<KEY, VALUE>;
    serialize(): string;
    deserialize(s: string): PartialStore<KEY, VALUE>;
}
export default PartialStore;
export { PartialStore, PartialStoreCore };
