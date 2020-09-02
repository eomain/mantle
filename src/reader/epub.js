
const zip = require('../util/zip');
const tmp = require('tmp');
const path = require('path');
const { read } = require('../util/fs');
const { Container } = require('./container/container');
const { Package } = require('./package/package');

class Epub {
    constructor(path) {
        this.path = path;
    }

    async load() {
        await new Promise((resolve, reject) => {
            tmp.dir({ unsafeCleanup: true }, (err, dir, clean) => {
                if (err) throw err;
                this.dir = dir;
                this.clean = clean;
                resolve();
            });
        });

        await zip.open(this.path, this.dir);
        let data = await this.read(path.join('META-INF', 'container.xml'));
        this.container = new Container(data);
        this.packages = [];
        for (var root of this.container.getRootfiles()) {
            let rootpath = root.getPath();
            let data = await this.read(rootpath);
            this.packages.push([rootpath, new Package(data)]);
        }
    }

    async read(rel) {
        let data = await read(path.join(this.dir, rel));
        return String(data);
    }

    async readPackage(rel) {
        let data = await read(path.join(this.getPackagePath(), rel));
        return String(data);
    }

    getPackage() {
        return this.packages[0][1];
    }

    getPackages() {
        return this.packages.map(p => p[1]);
    }

    getPackagePath() {
        let rootpath = this.packages[0][0];
        return path.join(this.dir, path.dirname(rootpath));
    }

    getPath() {
        return this.path;
    }

    getDir() {
        return this.dir;
    }

    cleanUp() {
        if (this.clean !== undefined)
            this.clean();
    }
}

module.exports = {
    Epub: Epub
};
