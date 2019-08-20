import * as Assert from 'assert';
import KeyedItem from '../src/datastructure/KeyedItem';
import { SString, serializer} from '../src/datastructure/Serializable';

describe("KeyedItem",()=>{
    it("should SerDe correctly",()=>{
        let a = new KeyedItem<SString,SString>(new SString('a'),new SString('b'));
        serializer.register(a);
        let b = a.serialize();
        let c = serializer.deserialize(b);
        Assert.equal(a.getKey().val,c.getKey().val);
        Assert.equal(a.getValue().val,c.getValue().val);
        Assert.equal(a.getType1().val,c.getKey().val);
        Assert.equal(a.getType2().val,c.getValue().val);
    });
    it("should compare correctly",()=>{
        let a = new KeyedItem<SString,SString>(new SString('a'),new SString('a'));
        let b = new KeyedItem<SString,SString>(new SString('a'),new SString('b'));
        let c = new KeyedItem<SString,SString>(new SString('c'),new SString('b'));
        Assert.equal(a.compareTo(b),0);
        Assert.equal(a.compareTo(c)<0,true);
        Assert.equal(b.compareTo(c)<0,true);
    });
    
});