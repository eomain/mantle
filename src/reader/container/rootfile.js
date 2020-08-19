
class Rootfile {
    constructor(path, media) {
        this.path = path;
        this.media = media;
    }

    getPath() {
        return this.path;
    }

    getMedia() {
        return this.media;
    }
}

module.exports = {
    rootfile: function (root) {
        let attr = root['_attributes'];
        return new Rootfile(attr['full-path'], attr['media-type']);
    }
}
