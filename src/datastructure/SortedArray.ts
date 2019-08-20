import KeyedItem from './KeyedItem';
import Key from './IKey';
import {Serializable,fromb64,tob64} from './Serializable';

export default class KeyedItems<KEY extends Key<KEY>, VALUE extends Serializable<VALUE>> 
extends KeyedItem<KEY,VALUE>{
    
}