import { strcomp } from './Comparable';
function tob64(data) {
    let buff = new Buffer(data);
    return buff.toString('base64');
}
function fromb64(data) {
    let buff = new Buffer(data, 'base64');
    return buff.toString('ascii');
}
class SString {
    constructor(s) {
        this.serializerId = () => 'SStr';
        this.val = s;
    }
    ;
    compareTo(other) {
        return strcomp(this.val, other.val);
    }
    serialize() {
        return 'SStr:' + this.val;
    }
    ;
    deserialize(s) {
        return new SString(s);
    }
}
class SNum {
    constructor(s) {
        this.serializerId = () => 'SNum';
        this.val = s;
    }
    ;
    compareTo(other) {
        return this.val - other.val;
    }
    serialize() {
        return 'SNum:' + this.val.toString();
    }
    ;
    deserialize(s) {
        return new SNum(Number.parseFloat(s));
    }
}
class SArray {
    constructor(val) {
        this.serializerId = () => `SArr<${this.cons.serializerId()}>`;
        if (val)
            this.val = val;
        else
            this.val = [];
    }
    ;
    slice(start, length) {
        let a = [];
        let b = [];
        for (let i = 0; i < this.val.length; i++) {
            if (i < start || i >= start + length)
                a.push(this.val[i]);
            else
                b.push(this.val[i]);
        }
        this.val = a;
        return new SArray(b);
    }
    serialize() {
        let res = '';
        for (let s = 0; s < this.val.length; s++) {
            res += tob64(this.val[s].serialize());
            if (s != this.val.length - 1)
                res += ':';
        }
        return res;
    }
    ;
    deserialize(s) {
        let self = this;
        let arr = s.split(':').map(x => serializer.deserialize(fromb64(x)));
        return new SArray(arr);
    }
}
class SerializerManager {
    constructor() {
        this.items = {};
    }
    register(item) {
        this.items[item.serializerId()] = item;
    }
    deserialize(s) {
        let n = s.indexOf(':');
        let body = s.substr(n + 1);
        let head = s.substr(0, n);
        if (!this.items[head])
            throw 'unregistered serializable item: ' + head + ' --- ' + s;
        // console.log('deserializing',s,'using',this.items[head]);
        let res = this.items[head].deserialize(body);
        // console.log('result',res);
        return res;
    }
}
let serializer = new SerializerManager();
serializer.register(new SNum(1));
serializer.register(new SString(''));
export { SNum, SString, fromb64, tob64, SArray, serializer, SerializerManager };
