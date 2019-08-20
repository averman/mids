import {comparable} from './Comparable';
import Typed from './Typed';
import {Serializable,fromb64,tob64,serializer} from './Serializable';
import Key from './IKey';
export default class RangedKey<KEY extends Key<KEY>> extends Typed<KEY> 
implements Key<RangedKey<KEY>>{
    serializerId(): string {
        return `RK`;
    }
    serialize(): string {
        let sa = tob64(this.start.serialize());
        let sb = tob64(this.end.serialize());
        return this.serializerId()+':'+sa+':'+sb;
    }
    deserialize(s: string): RangedKey<KEY> {
        let ss = s.split(':');
        let oa = serializer.deserialize(fromb64(ss[0]));
        let ob = serializer.deserialize(fromb64(ss[1]));
        return new RangedKey<KEY>(oa,ob);
    }
    start: KEY;
    end: KEY;
    getType(): KEY {
        return this.start;
    }
    constructor(start?: KEY, end?: KEY){
        super();
        this.start = start;
        this.end = end;
    }
    compareTo(other: RangedKey<KEY>|KEY): number {
        if(typeof this.start == 'undefined') return -1;
        if(other instanceof RangedKey){
            if(this.start.compareTo(other.start) == 0){
                return this.end.compareTo(other.end)
            }else return this.start.compareTo(other.start);
        }else{
            if(this.start.compareTo(other)>0) return this.start.compareTo(other);
            if(this.end.compareTo(other)<0) return this.end.compareTo(other);
            return 0;
        }
    }
    intersect(other: RangedKey<KEY>): RangedKey<KEY>{
        let a,b: RangedKey<KEY>;
        if(this.start.compareTo(other.start)<=0){
            a = this;
            b = other;
        }else{
            a = other;
            b = this;
        }
        if(a.end.compareTo(b.start) < 0)
            return null;
        if(a.end.compareTo(b.end)<0)
            return new RangedKey<KEY>(b.start,a.end);
        return new RangedKey<KEY>(b.start,b.end);
    }
    includes(key: KEY): boolean{
        return key.compareTo(this.start)>=0 && key.compareTo(this.end)<=0;
    }
    expand(key: KEY){
        if(typeof this.start == "undefined"){
            this.start = key;
            this.end = key;
            return;
        }
        if(key.compareTo(this.start)<0)this.start=key;
        if(key.compareTo(this.end)>0)this.end=key;
    }
    union(range: RangedKey<KEY>){
        if(typeof this.start == "undefined"){
            this.start = range.start;
            this.end = range.end;
            return;
        }
        if(range.start.compareTo(this.start)<0)this.start=range.start;
        if(range.end.compareTo(this.end)>0)this.end=range.end;
    }
}