import * as Assert from 'assert';
import {PartialStore} from '../src/datastructure/PartialStore';
import {SNum,SString,serializer} from '../src/datastructure/Serializable';
import KeyedItem from '../src/datastructure/KeyedItem';
import FileStorage from '../src/store/FileStorage';
import * as rmf from 'rimraf';
import * as fs from 'fs';

describe("PartialStore",()=>{
    let store: FileStorage, ps:PartialStore<SNum,SNum>;
    function n(a: number): SNum{
        return new SNum(a);
    }
    before(function(){
        store = new FileStorage('test/temp');
        ps = new PartialStore<SNum,SNum>(store);
        ps.setDeserializer(n(1),n(1));
        ps.ideal = 3;
        for(let i=0; i<21; i++)
            ps.add(new KeyedItem<SNum,SNum>(n(i),n(i)));
    });
    it("compacting correctly",()=>{
        Assert.equal(ps.getDensity(),21);
        Assert.equal(ps.getValue().val.length,3);
        Assert.equal(ps.getValue().val[0].getDensity(),9);
        Assert.equal(ps.getValue().val[2].getDensity(),3);
    });
    it("serde correctly",()=>{
        let ser = ps.serialize();
        let ps2 = serializer.deserialize(ser);
        Assert.equal(ps2.getDensity(),21);
        Assert.equal(ps2.getValue().val.length,3);
        Assert.equal(ps2.getValue().val[0].getDensity(),9);
        Assert.equal(ps2.getValue().val[2].getDensity(),3);
    })
    it("stores correctly",(done)=>{
        store.persistAll().then(()=>{
            let p = store.get(ps.getValue().val[0].id);
            Assert.equal(p.getDensity(),9);
            Assert.equal(p.getValue().val[0].getDensity(),3);
            Assert.equal(p.getValue().val[1].getDensity(),3);
            Assert.equal(p.getValue().val[2].getDensity(),3);
            Assert.equal(p.getKey().start.val,0);
            Assert.equal(p.getKey().end.val,8);
            Assert.equal(p.getValue().val[1].getKey().start.val,3);
            Assert.equal(p.getValue().val[1].getKey().end.val,5);
            let p2 = store.get(ps.getValue().val[2].id);
            Assert.equal(p2.getValue().val[0].getValue().val,18);
            Assert.equal(p2.getValue().val[1].getValue().val,19);
            Assert.equal(p2.getValue().val[2].getValue().val,20);
            done();
        });
    })
    after(function(){
        rmf('test/temp',function(err){
            fs.mkdirSync('test/temp');
        });
    })
});