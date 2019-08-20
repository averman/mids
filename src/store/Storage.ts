import {Serializable,serializer} from "../datastructure/Serializable";

function caster<T>(x:any):x is T{return true};

export default abstract class Storage{
    abstract async _put(key: string, value: string): Promise<boolean>;
    abstract _get(key: string): string;
    get(key: string):any{
        let d = this.dirty[key]
        if( d){
            return d;
        }else{
            let s:string = this._get(key);
            return serializer.deserialize(s);
        }
    }
    dirty: {[key:string]:Serializable<any>} = {};
    markDirty(key: string, obj: Serializable<any>){
        this.dirty[key]=obj;
    }
    async persistAll():Promise<boolean>{
        let res = [];
        for(let key of Object.keys(this.dirty)){
            res.push(this._put(key,this.dirty[key].serialize()));
            delete this.dirty[key];
        }
        return Promise.all(res).then(res=>res.reduce((p,c)=>p&&c));
    }
}