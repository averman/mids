var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { serializer } from "../datastructure/Serializable";
function caster(x) { return true; }
;
export default class Storage {
    constructor() {
        this.dirty = {};
    }
    get(key) {
        let d = this.dirty[key];
        if (d) {
            return d;
        }
        else {
            let s = this._get(key);
            return serializer.deserialize(s);
        }
    }
    markDirty(key, obj) {
        this.dirty[key] = obj;
    }
    persistAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            for (let key of Object.keys(this.dirty)) {
                res.push(this._put(key, this.dirty[key].serialize()));
                delete this.dirty[key];
            }
            return Promise.all(res).then(res => res.reduce((p, c) => p && c));
        });
    }
}
