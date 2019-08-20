import storage from './Storage';
import { resolve } from 'path';
import { readFileSync, writeFile } from 'fs';
export default class FileStorage extends storage {
    constructor(path) {
        super();
        this.path = path || '';
    }
    _put(key, value) {
        return new Promise((v, j) => writeFile(resolve(this.path, key), value, err => {
            if (err)
                j(false);
            v(true);
        }));
    }
    _get(key) {
        return readFileSync(resolve(this.path, key)).toString();
    }
}
