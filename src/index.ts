import {SNum, SString, fromb64, tob64, Serializable, SArray, serializer, SerializerManager} from './datastructure/Serializable';
import Key from './datastructure/IKey';
import {Typed, DualTyped} from './datastructure/Typed';
import RangedKey from './datastructure/RangedKey';
import {compare, isComparable, strcomp, isString, isNumber, caster, comparable} from './datastructure/Comparable';
import {PartialStore, PartialStoreCore} from './datastructure/PartialStore';



export {SNum, SString, fromb64, tob64, Serializable, SArray, serializer, SerializerManager, 
Key, Typed, DualTyped, RangedKey, compare, isComparable, strcomp, isString, isNumber, caster, comparable};