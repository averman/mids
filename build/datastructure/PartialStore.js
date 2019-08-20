import KeyedItem from './KeyedItem';
import RangedKey from './RangedKey';
import { compare } from './Comparable';
import { SArray, tob64, fromb64, serializer } from './Serializable';
import { v4 } from 'uuid';
class PartialStoreCore extends KeyedItem {
    constructor(id, density) {
        super(new RangedKey(), new SArray(null));
        this.density = 0;
        this.id = id;
        if (density)
            this.density = density;
    }
    setDeserializer(key, value) {
        this._key = key;
        this._val = value;
        serializer.register(this);
    }
    serializerId() {
        return `PSC`;
    }
    //TODO
    serialize() {
        return this.serializerId() + ':@' + this.density + ':' + this.id + ':' + tob64(this.getKey().serialize());
    }
    //TODO
    deserialize(s) {
        let ss = s.substr(1).split(':');
        let res = new PartialStoreCore(ss[1], Number.parseInt(ss[0]));
        res.getKey().union(serializer.deserialize(fromb64(ss[2])));
        return res;
    }
    setKey(key) {
        this.getKey().union(key);
        return this;
    }
    getDensity() {
        return this.density;
    }
}
class PartialStore extends PartialStoreCore {
    constructor(manager, id, value, idealsize) {
        super(id || v4());
        this.storage = manager;
        if (value) {
            this.setValue(value);
            for (let x of value.val) {
                if (x instanceof PartialStoreCore)
                    this.density += x.getDensity();
                else
                    this.density++;
            }
            for (let x of this.getValue().val) {
                if (x instanceof PartialStoreCore) {
                    this.getKey().union(x.getKey());
                }
                else {
                    this.getKey().expand(x.getKey());
                }
            }
        }
        this.ideal = idealsize || 20;
    }
    serializerId() {
        return `PS`;
    }
    setDeserializer(key, value) {
        this._key = key;
        this._val = value;
        serializer.register(this);
        let core = this.toCore();
        serializer.register(core);
    }
    add(item) {
        if (!this._key)
            this._key = item.getKey();
        if (!this._val)
            this._val = item.getValue();
        this.density++;
        let arr = this.getValue().val;
        for (let x of arr) {
            let k = x.getKey();
            if (k instanceof RangedKey && k.includes(item.getKey()) && x instanceof PartialStore) {
                x.add(item);
                return;
            }
        }
        arr.push(item);
        arr.sort(compare);
        this.getKey().expand(item.getKey());
        if (arr.length >= this.ideal * this.ideal)
            this.compact();
    }
    compact() {
        while (this.getValue().val.length > this.ideal) {
            let arr = this.getValue().val;
            let dArr = arr.map((x) => {
                if (x instanceof PartialStoreCore)
                    return x.getDensity();
                else
                    return 1;
            });
            let min = Number.MAX_SAFE_INTEGER;
            let imin = -1;
            let self = this;
            function sum(start) {
                let res = 0;
                for (let i = 0; i < self.ideal; i++)
                    res += dArr[start + i];
                return res;
            }
            for (let i = 0; i <= arr.length - this.ideal; i++) {
                let d = sum(i);
                if (d < min) {
                    min = d;
                    imin = i;
                }
            }
            // console.log('dArr',dArr);
            // console.log("before slicing",this.getValue().val,imin,min)
            let newArr = this.getValue().slice(imin, this.ideal - 1);
            newArr.val.push(this.getValue().val[imin]);
            let newItem = new PartialStore(this.storage, v4(), newArr, this.ideal);
            newItem._key = this._key;
            newItem._val = this._val;
            this.storage.markDirty(newItem.id, newItem);
            // console.log("new Item==>",newItem.getKey());
            // console.log("after slicing",this.getValue().val,imin)
            this.getValue().val[imin] = newItem.toCore().setKey(newItem.getKey());
            // console.log("new Item core",this.getValue().val[imin]);
            // console.log("final",this.getValue().val);
            // console.log('\n\n\n\n');
        }
    }
    toCore() {
        let c = new PartialStoreCore(this.id, this.density);
        c._key = this._key;
        c._val = this._val;
        return c;
    }
    //TODO
    serialize() {
        let res = this.serializerId() + ':' + tob64(super.serialize()) + ':'
            + this.getValue().val.map((x) => tob64(x.serialize())).join(':');
        // console.log('===>',res);
        return res;
    }
    //TODO
    deserialize(s) {
        // if(!(this._key && this._val))throw 'set deserializer first';
        let ss = s.split(':').map((x) => fromb64(x));
        // console.log(ss);
        let head = ss.shift().split(':');
        // console.log(ss);
        let xx = ss.map((x) => {
            if (x.startsWith('@')) {
                return serializer.deserialize(x);
            }
            else {
                return serializer.deserialize(x);
            }
        });
        let res = new PartialStore(this.storage, head[2]);
        res.getValue().val = xx;
        res.density = Number.parseInt(head[1].substr(1));
        for (let x of xx) {
            let k = x.getKey();
            // console.log(k);
            if (k instanceof RangedKey)
                res.getKey().union(k);
            else
                res.getKey().expand(k);
        }
        res.getKey().union(serializer.deserialize(fromb64(head[3])));
        // console.log('==>',res);
        return res;
    }
}
export default PartialStore;
export { PartialStore, PartialStoreCore };
