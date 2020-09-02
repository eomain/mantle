
const fs = require('fs');

function mkdir(path) {
    return fs.promises.mkdir(path, { recursive: true });
}

module.exports = {
    read: function (path) {
        return fs.promises.readFile(path);
    },

    write: function (path, content) {
        return fs.promises.writeFile(path, content);
    },

    mkdir: mkdir,

    ckdir: async function (path) {
        try {
            await fs.promises.access(path);
        } catch (e) {
            await mkdir(path);
        }
    }
};
