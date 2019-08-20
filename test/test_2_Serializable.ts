import * as Assert from 'assert';
import {SString, SNum, tob64, fromb64,SArray,serializer} from '../src/datastructure/Serializable';

describe("Serializable package:",()=>{
    describe("SString",()=>{
        it("should SerDe correctly",()=>{
            let s1 = new SString('test');
            let ser = s1.serialize();
            Assert.equal(ser,'SStr:test');
            Assert.equal(s1.compareTo(serializer.deserialize(ser)),0);
        }); 
        it("should compare correctly",()=>{
            let s1 = new SString('test1');
            let s2 = new SString('a');
            let s3 = new SString('test');
            Assert.equal(s1.compareTo(s2)>0,true);
            Assert.equal(s1.compareTo(s3)>0,true);
            Assert.equal(s2.compareTo(s3)<0,true);
        });
    });
    describe("SNum",()=>{
        it("should SerDe correctly",()=>{
            let s1 = new SNum(1234);
            let ser = s1.serialize();
            Assert.equal(ser,'SNum:1234');
            Assert.equal(s1.compareTo(serializer.deserialize(ser)),0);
        });
        it("should compare correctly",()=>{
            let s1 = new SNum(1234);
            let s2 = new SNum(3);
            let s3 = new SNum(12);
            Assert.equal(s1.compareTo(s2)>0,true);
            Assert.equal(s1.compareTo(s3)>0,true);
            Assert.equal(s2.compareTo(s3)<0,true);
        });
    });
    describe("SArray",()=>{
        it("should SerDe correctly",()=>{
            let s1 = new SArray<SNum>();
            s1.val.push(new SNum(1));
            s1.val.push(new SNum(2));
            s1.val.push(new SNum(3));
            let s2 = s1.serialize();
            let s3 = s1.deserialize(s2);
            Assert.equal(s3.val[0].val,s1.val[0].val);
            Assert.equal(s3.val[1].val,s1.val[1].val);
            Assert.equal(s3.val[2].val,s1.val[2].val);
        });
    });
    describe("base 64 helper functions:",()=>{
        it("tob64 should be correct",()=>{
            Assert.equal(tob64('test123'),'dGVzdDEyMw==');
        });
        it("fromb64 should be correct",()=>{
            Assert.equal(fromb64('dGVzdDEyMw=='),'test123');
        });
    });
});