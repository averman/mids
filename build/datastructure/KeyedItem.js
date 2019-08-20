import { DualTyped } from './Typed';
import { fromb64, tob64, serializer } from './Serializable';
export default class KeyedItem extends DualTyped {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
    serializerId() {
        return `KI`;
    }
    compareTo(other) {
        if (other instanceof KeyedItem)
            return this.getKey().compareTo(other.getKey());
        else
            return this.getKey().compareTo(other);
    }
    getKey() {
        return this.key;
    }
    getType1() {
        return this.getKey();
    }
    getType2() {
        return this.getValue();
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    serialize() {
        return this.serializerId() + ':' + tob64(this.getKey().serialize()) + ':' + tob64(this.getValue().serialize());
    }
    deserialize(s) {
        let a = s.split(':');
        let key = serializer.deserialize(fromb64(a[0]));
        let value = serializer.deserialize(fromb64(a[1]));
        return new KeyedItem(key, value);
    }
}
