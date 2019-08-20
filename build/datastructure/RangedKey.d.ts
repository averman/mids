import Typed from './Typed';
import Key from './IKey';
export default class RangedKey<KEY extends Key<KEY>> extends Typed<KEY> implements Key<RangedKey<KEY>> {
    serializerId(): string;
    serialize(): string;
    deserialize(s: string): RangedKey<KEY>;
    start: KEY;
    end: KEY;
    getType(): KEY;
    constructor(start?: KEY, end?: KEY);
    compareTo(other: RangedKey<KEY> | KEY): number;
    intersect(other: RangedKey<KEY>): RangedKey<KEY>;
    includes(key: KEY): boolean;
    expand(key: KEY): void;
    union(range: RangedKey<KEY>): void;
}
