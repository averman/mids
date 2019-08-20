import {comparable,strcomp} from './Comparable';
import Key from './IKey';

function tob64(data:string):string{
    let buff = new Buffer(data);
    return buff.toString('base64');
}
function fromb64(data:string):string{
    let buff = new Buffer(data, 'base64');
    return buff.toString('ascii');
}

export default interface Serializable<T>{
    serializerId(): string;
    serialize():string;
    deserialize(s: string):T;
}

class SString implements Key<SString>{
    serializerId = ()=>'SStr';
    val: string;
    constructor(s: string){this.val = s};
    compareTo(other: SString): number {
        return strcomp(this.val,other.val);
    }
    serialize(): string {
        return 'SStr:'+this.val;
    }; 
    deserialize(s: string): SString {
        return new SString(s);
    }
}

class SNum implements Key<SNum>{
    serializerId = ()=>'SNum';
    val: number;
    constructor(s: number){this.val = s};
    compareTo(other: SNum): number {
        return this.val - other.val;
    }
    serialize(): string {
        return 'SNum:'+this.val.toString();
    }; 
    deserialize(s: string): SNum {
        return new SNum(Number.parseFloat(s));
    }
}

class SArray<VALUE extends Serializable<VALUE>> implements Serializable<SArray<VALUE>>{
    serializerId = ()=>`SArr<${this.cons.serializerId()}>`;
    val: VALUE[];
    cons: VALUE;
    constructor(val?: VALUE[]){
        if(val) this.val=val;
        else this.val = [];
    };
    slice(start: number,length: number):SArray<VALUE>{
        let a: VALUE[] = [];
        let b: VALUE[] = [];
        for(let i=0; i<this.val.length; i++){
            if(i<start || i>=start+length) a.push(this.val[i]);
            else b.push(this.val[i]);
        }
        this.val = a;
        return new SArray<VALUE>(b);
    }
    serialize(): string {
        let res: string = '';
        for(let s =0; s<this.val.length; s++){
            res+=tob64(this.val[s].serialize());
            if(s!=this.val.length-1)
                res+=':';
        }
        return res;
    };
    deserialize(s: string): SArray<VALUE> {
        let self = this;
        let arr = s.split(':').map(x=>serializer.deserialize(fromb64(x)));
        return new SArray<VALUE>(arr);
    }
}

class SerializerManager{
    items: {[classname:string]:Serializable<any>} = {};
    register(item:Serializable<any>){
        this.items[item.serializerId()] = item;
    }
    deserialize(s: string): any{
        let n = s.indexOf(':');
        let body = s.substr(n+1);
        let head = s.substr(0,n);
        if(!this.items[head]) throw 'unregistered serializable item: '+head+' --- '+s;
        // console.log('deserializing',s,'using',this.items[head]);
        let res = this.items[head].deserialize(body);
        // console.log('result',res);
        return res;
    }
}

let serializer = new SerializerManager();
serializer.register(new SNum(1));
serializer.register(new SString(''));

export {SNum, SString, fromb64, tob64, Serializable, SArray, serializer, SerializerManager};