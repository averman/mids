import storage from './Storage';
import {resolve} from 'path'
import {readFileSync, writeFile} from 'fs';
import Serializable from '../datastructure/Serializable';

export default class FileStorage extends storage{
    path: string;
    constructor(path?:string){
        super();
        this.path = path || '';
    }
    _put(key: string, value: string): Promise<boolean> {
        return new Promise((v,j)=>writeFile(resolve(this.path,key),value,err=>{
           if(err)j(false);
           v(true);
        }));
    }    
    _get(key: string): string {
        return readFileSync(resolve(this.path,key)).toString();
    }

}