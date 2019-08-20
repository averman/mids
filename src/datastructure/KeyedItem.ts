import {DualTyped} from './Typed';
import {comparable, compare} from './Comparable';
import {Serializable,fromb64,tob64,serializer} from './Serializable';
import Key from './IKey';

export default class KeyedItem<KEY extends Key<KEY>, VALUE extends Serializable<VALUE>> 
extends DualTyped<KEY,VALUE> implements Serializable<KeyedItem<KEY, VALUE>>, comparable<KeyedItem<KEY, VALUE>>{
    serializerId(): string {
        return `KI`;
    }
    compareTo(other: KeyedItem<KEY, VALUE>|KEY): number {
        if(other instanceof KeyedItem)
            return this.getKey().compareTo(other.getKey());
        else return this.getKey().compareTo(other);
    }
    private key: KEY;
    private value: VALUE;
    constructor(key: KEY, value: VALUE){
        super();
        this.key = key;
        this.value = value;
    }
    getKey():KEY{
        return this.key;
    }
    getType1(): KEY {
        return this.getKey();
    }
    getType2(): VALUE {
        return this.getValue();
    }
    getValue():any{
        return this.value;
    }
    setValue(value: VALUE){
        this.value = value;
    }
    serialize():string{
        return this.serializerId()+':'+tob64(this.getKey().serialize())+':'+tob64(this.getValue().serialize());
    }
    deserialize(s: string): KeyedItem<KEY,VALUE>{
        let a = s.split(':');
        let key = serializer.deserialize(fromb64(a[0]));
        let value = serializer.deserialize(fromb64(a[1]));
        return new KeyedItem<KEY,VALUE>(key,value);
    }
}