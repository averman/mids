import * as Assert from 'assert';
import RangedKey from '../src/datastructure/RangedKey';
import { SString, serializer } from '../src/datastructure/Serializable';

describe("RangedKey",()=>{
    let a : RangedKey<SString> = new RangedKey<SString>(new SString('a'), new SString('b'));
    serializer.register(a);
    it("should do SerDe correctly",()=>{
        let b:string = a.serialize();
        let c = serializer.deserialize(b);
        Assert.equal(a.start.val, c.start.val);
        Assert.equal(a.getType().val, c.start.val);
        Assert.equal(a.end.val, c.end.val);
    });
    let b : RangedKey<SString> = new RangedKey<SString>(new SString('aa'), new SString('d'));
    let c : RangedKey<SString> = new RangedKey<SString>(new SString('a'), new SString('c'));
    let d : RangedKey<SString> = new RangedKey<SString>(new SString('e'), new SString('f'));
    it("should do compare correctly",()=>{
        Assert.equal(a.compareTo(b)<0, true);
        Assert.equal(a.compareTo(c)<0, true);
    });
    it("should intersect correctly",()=>{
        let i1 = a.intersect(b);
        Assert.equal(i1.start.val, 'aa');
        Assert.equal(i1.end.val, 'b');
        let i2 = b.intersect(c);
        Assert.equal(i2.start.val, 'aa');
        Assert.equal(i2.end.val, 'c');
        let i3 = c.intersect(a);
        Assert.equal(i3.start.val, 'a');
        Assert.equal(i3.end.val, 'b');
        let i4 = c.intersect(d);
        Assert.equal(i4, null);
    });
    it("should caculate includes correctly",()=>{
        Assert.equal(a.includes(new SString('aa')), true);
        Assert.equal(b.includes(new SString('a')), false);
        Assert.equal(b.includes(new SString('aa')), true);
        Assert.equal(b.includes(new SString('d')), true);
        Assert.equal(b.includes(new SString('da')), false);
    });
    it("should expand correctly",()=>{
        let a1 : RangedKey<SString> = new RangedKey<SString>(new SString('aa'), new SString('b'));
        a1.expand(new SString('c'));
        Assert.equal(a1.start.val,'aa');
        Assert.equal(a1.end.val,'c');
        a1.expand(new SString('a'));
        Assert.equal(a1.start.val,'a');
        Assert.equal(a1.end.val,'c');
        a1.expand(new SString('b'));
        Assert.equal(a1.start.val,'a');
        Assert.equal(a1.end.val,'c');
        
    });
});