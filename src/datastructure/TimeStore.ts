import { TimeSeries, timeEvent, Event, Time, TimeRange, Key } from "pondjs";
import {Map} from "immutable";
import * as uuid from "uuid";
type TimeStoreItem = Event<Time> | TimeStore;
function isTimeStore(x: any): x is TimeStore{
    if(!x)return false;
    return typeof x.type == 'function' && x.type() == 'TimeStore';
}
function tob64(data:string):string{
    let buff = new Buffer(data);
    return buff.toString('base64');
}

export default class TimeStore{
    constructor() {
        this.uuid = uuid.v4();
    }
    uuid: string;
    type(): string{
        return 'TimeStore';
    }
    begin(): Date {
        return this.events[0].begin();
    }
    end(): Date {
        return this.events[this.events.length-1].end();
    }
    getData(): Map<string,any>{
        return Map({events: this.events});
    }
    serialize(): string{
        let evts: string[] = [];
        for(let e of this.events){
            let s: string;
            if(isTimeStore(e)){
                s = '@ts:'+e.uuid+':'+e.begin().valueOf()+':'+e.end().valueOf();
            }else{
                s = tob64(`{key:${e.getKey().valueOf()},data:${JSON.stringify(e.getData())}}`);
            }
            evts.push(s);
        }
        let sevts = tob64(JSON.stringify(evts));
        return JSON.stringify({type: "timestore", begin: this.begin().valueOf(), end: this.end().valueOf(), events: evts});
    };
    serializeAll(): Map<string, string>{
        let res:any=[];
        res.push([this.uuid,this.serialize()]);
        let queue = Array.from(this.events);
        while(queue.length>0){
            let ts = queue.shift();
            if(isTimeStore(ts)){
                res.push([ts.uuid,ts.serialize()]);
                queue.concat(ts.events);
            }
        }
        let x = Map<string,any>(res);
        return x;
    }
    merge(){
        let min, mini;
        for(let i=0; i<this.events.length-1; i++){
            if(!min){
                min=this.mergeScore(i); mini=i;
            }else{
                let score = this.mergeScore(i);
                if(score<min){
                    min=score; mini=i;
                }
            }
        }
        let a = this.events[mini];
        let b = this.events[mini+1];
        if(isTimeStore(a)){
            a.add(b);
        }else{
            if(isTimeStore(b)){   
                b.add(a);
                this.events[mini] = b;
            }else{
                let x = new TimeStore();
                x.add(a);
                x.add(b);
                this.events[mini] = x;
            }
        }
        for(let i=mini+2; i<this.events.length; i++){
            this.events[i-1]=this.events[i];
        }
        this.events.pop();
    }
    density():number{
        let d = this.events.reduce((p,c)=>{
            if(isTimeStore(c))
                return p+c.density();
            else
                return p+1; 
        },0);
        return d;
        // return 1;
    }
    mergeScore(i: number):number{
        let j = i+1;
        let a = this.events[i];
        let b = this.events[j];
        let duration = b.end().valueOf() - a.begin().valueOf();
        // console.log(i,a,duration);
        let density = 0;
        if(isTimeStore(a)) density+=a.density(); else density++;
        if(isTimeStore(b)) density+=b.density(); else density++;
        return density*1000*3600*24 + duration;
    }
    events: TimeStoreItem[] = [];
    add(event:TimeStoreItem){
        if(isTimeStore(event)){
        }else{
            let before = this.before(event.getKey());
            if(before == -1 || !isTimeStore(this.events[before]))
                this.events.push(event);
        }
        this.sort();
    };
    sort(){
        this.events.sort((a,b)=>a.begin().valueOf() - b.begin().valueOf());
    }
    before(time: Time):number{
        for(let i=0; i<this.events.length; i++){
            if(this.events[i].begin().valueOf() > time.valueOf()){
                return i-1;
            }
        }
    }
    after(time: Time):number{
        for(let i=this.events.length-1; i>=0; i--){
            if(this.events[i].begin().valueOf() < time.valueOf()){
                return i==this.events.length-1?-1:i+1;
            }
        }
    }
}