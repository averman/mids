function caster<T>(x:any):x is T{return true};
function isNumber(x: any): x is number{
    return typeof x === 'number';
}
function isString(x: any): x is string{
    return typeof x === 'string';
}
function strcomp(a: string, b:string): number{
    if(a<b)return -1;
    if(a === b) return 0;
    return 1;
}
interface comparable<KEY>{
    compareTo(other: KEY):number;
}
function isComparable<T>(x: any): x is comparable<T>{
    return typeof x.compareTo == 'function';
}
function compare<KEY>(a: any, b: any): number{
    if(typeof a !== typeof b) 
        return strcomp(a.toString(),b.toString());
    if(typeof a== 'object' && typeof b== 'object'){
        if(isComparable<KEY>(a) && isComparable<KEY>(b) && caster<KEY>(b))
            return a.compareTo(b);
        else 
            return strcomp(a.toString(), b.toString());
    }else{
        if(isNumber(a) && isNumber(b))
            return a-b;
        if(isString(a) && isString(b))
            return strcomp(a,b);
        return strcomp(a.toString(), b.toString());
    }
}

export {compare, isComparable, strcomp, isString, isNumber, caster, comparable};