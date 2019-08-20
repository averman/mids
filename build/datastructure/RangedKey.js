import Typed from './Typed';
import { fromb64, tob64, serializer } from './Serializable';
export default class RangedKey extends Typed {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
    serializerId() {
        return `RK`;
    }
    serialize() {
        let sa = tob64(this.start.serialize());
        let sb = tob64(this.end.serialize());
        return this.serializerId() + ':' + sa + ':' + sb;
    }
    deserialize(s) {
        let ss = s.split(':');
        let oa = serializer.deserialize(fromb64(ss[0]));
        let ob = serializer.deserialize(fromb64(ss[1]));
        return new RangedKey(oa, ob);
    }
    getType() {
        return this.start;
    }
    compareTo(other) {
        if (typeof this.start == 'undefined')
            return -1;
        if (other instanceof RangedKey) {
            if (this.start.compareTo(other.start) == 0) {
                return this.end.compareTo(other.end);
            }
            else
                return this.start.compareTo(other.start);
        }
        else {
            if (this.start.compareTo(other) > 0)
                return this.start.compareTo(other);
            if (this.end.compareTo(other) < 0)
                return this.end.compareTo(other);
            return 0;
        }
    }
    intersect(other) {
        let a, b;
        if (this.start.compareTo(other.start) <= 0) {
            a = this;
            b = other;
        }
        else {
            a = other;
            b = this;
        }
        if (a.end.compareTo(b.start) < 0)
            return null;
        if (a.end.compareTo(b.end) < 0)
            return new RangedKey(b.start, a.end);
        return new RangedKey(b.start, b.end);
    }
    includes(key) {
        return key.compareTo(this.start) >= 0 && key.compareTo(this.end) <= 0;
    }
    expand(key) {
        if (typeof this.start == "undefined") {
            this.start = key;
            this.end = key;
            return;
        }
        if (key.compareTo(this.start) < 0)
            this.start = key;
        if (key.compareTo(this.end) > 0)
            this.end = key;
    }
    union(range) {
        if (typeof this.start == "undefined") {
            this.start = range.start;
            this.end = range.end;
            return;
        }
        if (range.start.compareTo(this.start) < 0)
            this.start = range.start;
        if (range.end.compareTo(this.end) > 0)
            this.end = range.end;
    }
}
