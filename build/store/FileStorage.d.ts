import storage from './Storage';
export default class FileStorage extends storage {
    path: string;
    constructor(path?: string);
    _put(key: string, value: string): Promise<boolean>;
    _get(key: string): string;
}
