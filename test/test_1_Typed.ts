import * as Assert from 'assert';
import {Typed, DualTyped} from '../src/datastructure/Typed';

describe("Typed",()=>{
    describe("should check type",()=>{
        class A<T> extends Typed<T> {
            v: T;
            constructor(x: T){
                super();
                this.v = x;
            }
            getType(): T {
                return this.v;
            }
        }
        let a:A<string> = new A<string>('a');
        let b:A<number> = new A<number>(1);
        let c:A<A<string>> = new A<A<string>>(a);
        let d:A<A<number>> = new A<A<number>>(b);
        let e:A<Object> = new A<Object>(new Object());
        it("with undefined",()=>{
            Assert.equal(a.isTypeOf(undefined),false);
        });
        it("with different generics",()=>{
            Assert.equal(a.isTypeOf(b),false);
        });
        it("with different generics of typed",()=>{
            Assert.equal(c.isTypeOf(a),false);
            Assert.equal(c.isTypeOf(d),false);
        });
        it("with non generics object",()=>{
            Assert.equal(c.isTypeOf(new Object()),false);
            Assert.equal(e.isTypeOf(a),false);
        });
    });
});
describe("DualTyped",()=>{
    describe("should check type",()=>{
        class A<T,U> extends DualTyped<T,U> {
            v: T;
            w: U;
            constructor(x: T, y:U){
                super();
                this.v = x;
                this.w = y;
            }
            getType1(): T {
                return this.v;
            }
            getType2(): U {
                return this.w;
            }
        }
        let a:A<string,string> = new A<string,string>('a','b');
        let b:A<number,string> = new A<number,string>(1,'b');
        let c:A<A<string,string>,A<number,string>> = new A<A<string,string>,A<number,string>>(a,b);
        let d:A<number,A<number,string>> = new A<number,A<number,string>>(2,b);
        let e:A<A<string,string>,number> = new A<A<string,string>,number>(a,1);
        let f:A<Object,number> = new A<Object,number>(new Object(),1);
        let g:A<number,Object> = new A<number,Object>(1,new Object());
        it("with undefined",()=>{
            Assert.equal(a.isTypeOf(undefined),false);
        });
        it("with different generics",()=>{
            Assert.equal(a.isTypeOf(b),false);
        });
        it("with different generics of typed",()=>{
            Assert.equal(c.isTypeOf(a),false);
            Assert.equal(c.isTypeOf(d),false);
            Assert.equal(d.isTypeOf(e),false);
            Assert.equal(f.isTypeOf(d),false);
        });
        it("with non generics object",()=>{
            Assert.equal(c.isTypeOf(new Object()),false);
            Assert.equal(g.isTypeOf(c),false);
        });
    });
});