function caster<T>(x:any):x is T{return true};

export default abstract class Typed<T>{
    abstract getType():T;
    isTypeOf(x: any): x is Typed<T>{
        if(!x)return false;
        if(typeof x !== 'object')return false;
        if(!(x instanceof this.constructor)) return false;
        /* istanbul ignore else*/
        if(caster<Typed<T>>(x)){
            let a:T = this.getType();
            if(a instanceof Typed || a instanceof DualTyped){
                return a.isTypeOf(x.getType());
            }else{
                if(typeof a !== 'object') return typeof a === typeof x.getType();
                return a instanceof x.getType().constructor;
            }
        }
    }
}

abstract class DualTyped<T,U>{
    abstract getType1():T;
    abstract getType2():U;
    isTypeOf(x: any): x is DualTyped<T,U>{
        if(!x)return false;
        if(typeof x !== 'object')return false;
        if(!(x instanceof this.constructor)) return false;
        /* istanbul ignore else*/
        if(caster<DualTyped<T,U>>(x)){
            let a:T = this.getType1();
            let b:U = this.getType2();
            let flag1 = false;
            let flag2 = false;
            if(a instanceof Typed || a instanceof DualTyped){
                flag1 = a.isTypeOf(x.getType1());
            }else{
                if(typeof a !== 'object') 
                    flag1 = typeof a === typeof x.getType1();
                else
                    flag1 = a instanceof x.getType1().constructor;
            }
            if(b instanceof Typed || b instanceof DualTyped){
                flag2 = b.isTypeOf(x.getType2());
            }else{
                if(typeof b !== 'object') 
                    flag2 = typeof b === typeof x.getType2();
                else
                    flag2 = b instanceof x.getType2().constructor;
            }
            return flag1 && flag2;
        }
    }
}

export {Typed, DualTyped};