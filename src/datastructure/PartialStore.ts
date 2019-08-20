import KeyedItem from './KeyedItem';
import RangedKey from './RangedKey';
import {compare} from './Comparable';
import Serializable from './Serializable';
import {SArray,tob64,fromb64,serializer} from './Serializable';
import Key from './IKey';
import {v4} from 'uuid';
import Storage from '../store/Storage';

class PartialStoreCore<KEY extends Key<KEY>,VALUE extends Serializable<VALUE>> 
extends KeyedItem<RangedKey<KEY>,SArray<KeyedItem<RangedKey<KEY>,VALUE>|PartialStoreCore<KEY,VALUE>>>{
    id: string;
    density: number = 0;
    _key: KEY;
    _val: VALUE;
    setDeserializer(key: KEY, value: VALUE){
        this._key = key;
        this._val = value;
        serializer.register(this);
    }
    constructor(id: string, density?: number){
        super(new RangedKey(), new SArray<KeyedItem<RangedKey<KEY>,VALUE>|PartialStore<KEY,VALUE>>(null));
        this.id = id;
        if(density) this.density = density;
    }
    serializerId(): string {
        return `PSC`;
    }
    //TODO
    serialize():string{
        return this.serializerId()+':@'+this.density+':'+this.id+':'+tob64(this.getKey().serialize());
    }
    //TODO
    deserialize(s: string): PartialStoreCore<KEY,VALUE>{
        let ss = s.substr(1).split(':')
        let res = new PartialStoreCore<KEY,VALUE>(ss[1],Number.parseInt(ss[0]));
        res.getKey().union(serializer.deserialize(fromb64(ss[2])));
        return res;
    }
    setKey(key:RangedKey<KEY>):PartialStoreCore<KEY,VALUE>{
        this.getKey().union(key);
        return this;
    }
    getDensity():number{
        return this.density;
    }
    
}
class PartialStore<KEY extends Key<KEY>,VALUE extends Serializable<VALUE>> 
extends PartialStoreCore<KEY,VALUE>{
    ideal: number;
    storage: Storage;
    serializerId(): string {
        return `PS`;
    }
    setDeserializer(key: KEY, value: VALUE){
        this._key = key;
        this._val = value;
        serializer.register(this);
        let core = this.toCore();
        serializer.register(core);
    }
    constructor(manager:Storage, id?:string ,value?:SArray<KeyedItem<RangedKey<KEY>,VALUE>|PartialStoreCore<KEY,VALUE>>, idealsize?: number){
        super(id||v4());
        this.storage = manager;
        if(value) {
            this.setValue(value);
            for(let x of value.val){
                if(x instanceof PartialStoreCore) this.density += x.getDensity();
                else this.density++;
            }
            for(let x of this.getValue().val){
                if(x instanceof PartialStoreCore){
                    this.getKey().union(x.getKey());
                }else{
                    this.getKey().expand(x.getKey());
                }
            }
        }
        this.ideal = idealsize || 20;
    }
    add(item: KeyedItem<KEY,VALUE>){
        if(!this._key)this._key = item.getKey();
        if(!this._val)this._val = item.getValue();
        this.density++;
        let arr = this.getValue().val;
        for(let x of arr){
            let k = x.getKey();
            if(k instanceof RangedKey && k.includes(item.getKey()) && x instanceof PartialStore){
                x.add(item);
                return;
            }
        }
        arr.push(item);
        arr.sort(compare);
        this.getKey().expand(item.getKey());
        if(arr.length>=this.ideal*this.ideal)
            this.compact();
    }
    compact(){
        while(this.getValue().val.length > this.ideal){
            let arr = this.getValue().val;
            let dArr:number[] = arr.map((x:VALUE|PartialStore<KEY,VALUE>)=>{
                if(x instanceof PartialStoreCore) return x.getDensity();
                else return 1;
            });
            let min = Number.MAX_SAFE_INTEGER;
            let imin = -1;
            let self = this;
            function sum(start: number):number{
                let res = 0;
                for(let i=0; i<self.ideal; i++) res+=dArr[start+i];
                return res;
            }
            for(let i=0; i<=arr.length-this.ideal; i++){
                let d = sum(i);
                if(d<min){
                    min = d;
                    imin = i;
                }
            }
            // console.log('dArr',dArr);
            // console.log("before slicing",this.getValue().val,imin,min)
            let newArr = this.getValue().slice(imin,this.ideal-1);
            newArr.val.push(this.getValue().val[imin])
            let newItem = new PartialStore<KEY,VALUE>(this.storage,v4(),newArr,this.ideal);
            newItem._key = this._key;
            newItem._val = this._val;
            this.storage.markDirty(newItem.id,newItem);
            // console.log("new Item==>",newItem.getKey());
            // console.log("after slicing",this.getValue().val,imin)
            this.getValue().val[imin] = newItem.toCore().setKey(newItem.getKey());
            // console.log("new Item core",this.getValue().val[imin]);
            // console.log("final",this.getValue().val);
            // console.log('\n\n\n\n');
        }
    }
    toCore():PartialStoreCore<KEY,VALUE>{
        let c:PartialStoreCore<KEY,VALUE> = new PartialStoreCore(this.id,this.density);
        c._key = this._key;
        c._val = this._val;
        return c;
    }
    //TODO
    serialize():string{
        let res = this.serializerId()+':'+tob64(super.serialize())+':'
            +this.getValue().val.map((x:Serializable<any>)=>tob64(x.serialize())).join(':');
        // console.log('===>',res);
        return res;
    }
    //TODO
    deserialize(s: string): PartialStore<KEY,VALUE>{
        // if(!(this._key && this._val))throw 'set deserializer first';
        let ss = s.split(':').map((x:string)=>fromb64(x));
        // console.log(ss);
        let head = ss.shift().split(':');
        // console.log(ss);
        let xx = ss.map((x:string)=>{
                if(x.startsWith('@')){
                    return serializer.deserialize(x);
                }else{
                    return serializer.deserialize(x);
                }
        });
        let res = new PartialStore<KEY,VALUE>(this.storage,head[2]);
        res.getValue().val=xx;
        res.density = Number.parseInt(head[1].substr(1));
        for(let x of xx){
            let k = x.getKey();
            // console.log(k);
            if(k instanceof RangedKey)
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
export {PartialStore, PartialStoreCore};