import { Serializable } from "../datastructure/Serializable";
export default abstract class Storage {
    abstract _put(key: string, value: string): Promise<boolean>;
    abstract _get(key: string): string;
    get(key: string): any;
    dirty: {
        [key: string]: Serializable<any>;
    };
    markDirty(key: string, obj: Serializable<any>): void;
    persistAll(): Promise<boolean>;
}
