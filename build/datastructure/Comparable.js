function caster(x) { return true; }
;
function isNumber(x) {
    return typeof x === 'number';
}
function isString(x) {
    return typeof x === 'string';
}
function strcomp(a, b) {
    if (a < b)
        return -1;
    if (a === b)
        return 0;
    return 1;
}
function isComparable(x) {
    return typeof x.compareTo == 'function';
}
function compare(a, b) {
    if (typeof a !== typeof b)
        return strcomp(a.toString(), b.toString());
    if (typeof a == 'object' && typeof b == 'object') {
        if (isComparable(a) && isComparable(b) && caster(b))
            return a.compareTo(b);
        else
            return strcomp(a.toString(), b.toString());
    }
    else {
        if (isNumber(a) && isNumber(b))
            return a - b;
        if (isString(a) && isString(b))
            return strcomp(a, b);
        return strcomp(a.toString(), b.toString());
    }
}
export { compare, isComparable, strcomp, isString, isNumber, caster };
