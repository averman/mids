import * as Assert from 'assert';
import {strcomp,compare,comparable, isString, isNumber} from '../src/datastructure/Comparable';


describe("Comparable package helper functions:",()=>{
    
    describe("caster Functions:",()=>{
        it("isString should be correct",()=>{
            Assert.equal(isString('a'),true);
            Assert.equal(isString(1),false);
        });    
        it("isNumber should be correct",()=>{
            Assert.equal(isNumber('a'),false);
            Assert.equal(isNumber(1),true);
        });
    });
    describe("strcomp Function:",()=>{
        it("should be correct",()=>{
            Assert.equal(strcomp('a','b')<0,true);
            Assert.equal(strcomp('a','a')==0,true);
            Assert.equal(strcomp('bb','ba')>0,true);
            Assert.equal(strcomp('bb','b')>0,true);
        });
    });
    describe("compare Function:",()=>{
        it("should sort number array ascending",()=>{
            let arr: number[] = [5,2,1,3];
            arr.sort(compare);
            Assert.equal(arr[0],1);
            Assert.equal(arr[1],2);
            Assert.equal(arr[2],3);
            Assert.equal(arr[3],5);
        });
        it("should sort comparable object ascending",()=>{
            class A implements comparable<A> {
                v: any[];
                constructor(...p: any[]){
                    this.v = p;
                }
                compareTo(other: A): number {
                    return this.v.length - other.v.length;
                }
            }
            let arr: A[] = [new A(1,2,3), new A(3,6), new A(1,5,2,7), new A(9)];
            arr.sort(compare);
            Assert.equal(arr[0].v.length,1);
            Assert.equal(arr[1].v.length,2);
            Assert.equal(arr[2].v.length,3);
            Assert.equal(arr[3].v.length,4);
        });
        it("should compare primitives correctly",()=>{
            Assert.equal(compare(1,2)<0,true);
            Assert.equal(compare('a','ab')<0,true);
            Assert.equal(compare((x:number)=>x,(y:string)=>y)<0,true);
        });
        it("should compare non-comparable with toString() correctly",()=>{
            let a = {toString:()=>'[a]'};
            let b = {};
            Assert.equal(compare(a,b)<0,true);
        });
        it("should fallback to toString() when types mismatch",()=>{
            let a = {toString:()=>'11'};
            let b = 2;
            Assert.equal(compare(a,b)<0,true);
        });
    });
    
});