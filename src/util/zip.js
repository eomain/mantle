
const path = require('path');
const { read, write, mkdir, ckdir } = require('./fs');
const JSZip = require('jszip');

async function writeZipFile(file, path) {
    let content = await file.async('nodebuffer');
    return await write(path, content);
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
            await ckdir(dirname);
        }
        if (file.dir)
            await mkdir(p);
        else
            promises.push(writeZipFile(zip.file(file.name), p));
    }

    return await Promise.all(promises);
}

module.exports = {
    open: async function (epub, dir) {
        let data = await read(epub);
        let jzip = new JSZip();
        let zip = await jzip.loadAsync(data);
        await writeZip(zip, dir);
    }
};
