
const fs = require('fs');
const tmp = require('tmp');
const path = require('path');
const { Container } = require('./container/container');
const { Package } = require('./package/package');
const JSZip = require('jszip');

function writeFile(path, content) {
    return fs.promises.writeFile(path, content);
}

function readFile(path) {
    return fs.promises.readFile(path);
}

async function writeFolder(path, callback) {
    await fs.promises.mkdir(path, { recursive: true });
}

async function writeZipFile(file, path) {
    let content = await file.async('nodebuffer');
    return await writeFile(path, content);
}

function readZipFile(file, callback) {
    file.async('string').then(callback);
}

async function writeZipFolder(folder, root, dir, callback) {
    writeFolder(dir, () => {
        let files = [];
        folder.forEach((rel, file) => {
            files.push(writeZipFile(file, path.join(root, file.name)));
        });
        Promise.all(files).then(values => {
            callback();
        });
    });
}

async function writeZip(zip, dir) {
    let files = zip.files;
    let promises = [];
    let dirs = new Set();

    for (var name in files) {
        let file = files[name];
        let p = path.join(dir, file.name);
        let dirname = path.dirname(p);
        if (!dirs.has(dirname)) {
            dirs.add(dirname);
            try {
                await fs.promises.access(dirname);
            } catch (e) {
                await writeFolder(dirname);
            }
        }
        if (file.dir)
            await writeFolder(p);
        else
            promises.push(writeZipFile(zip.file(file.name), p));
    }

    return await Promise.all(promises);
}

async function openEpub(epub, dir) {
    let data = await readFile(epub);
    let jzip = new JSZip();
    let zip = await jzip.loadAsync(data);
    await writeZip(zip, dir);
}

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

        await openEpub(this.path, this.dir);
        let data = await this.read(path.join('META-INF', 'container.xml'));
        this.container = new Container(String(data));
        this.packages = [];
        for (var root of this.container.getRootfiles()) {
            let p = root.getPath();
            let data = await readFile(path.join(this.dir, p));
            this.packages.push([ p, new Package(String(data))]);
        }
    }

    async read(rel) {
        let data = await readFile(path.join(this.dir, rel));
        return String(data);
    }

    async readPackage(rel) {
        let data = await readFile(path.join(this.getPackagePath(), rel));
        return String(data);
    }

    getPackage() {
        return this.packages[0][1];
    }

    getPackages() {
        return this.packages.map(p => p[1]);
    }

    getPackagePath() {
        let pack = this.packages[0][0];
        return path.join(this.dir, path.dirname(pack));
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
