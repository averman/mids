import Serializable from './Serializable';
import {comparable} from './Comparable';

export default interface Key<KEY> extends Serializable<KEY>, comparable<KEY>{
    
}