
const { XmlDoc } = require('../xml');
const { metadata } = require('./metadata');
const { manifest } = require('./manifest');
const { spine } = require('./spine');

class Package extends XmlDoc {
    constructor(xml) {
        super(xml);

        let pack = this.get('package');
        this.metadata = metadata(pack['metadata']);
        this.manifest = manifest(pack['manifest']);
        this.spine = spine(pack['spine']);
    }

    getMetadata() {
        return this.metadata;
    }

    getManifest() {
        return this.manifest;
    }

    getSpine() {
        return this.spine;
    }
}

module.exports = {
    Package: Package
};
