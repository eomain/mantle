
const { XmlDoc } = require('../xml');
const { rootfile } = require('./rootfile');

class Container extends XmlDoc {
    constructor(xml) {
        super(xml);

        let container = this.get('container');
        if (!container)
            throw new Error('Not a container');
        if (!container.rootfiles)
            throw new Error('Expected rootfiles');
        let root = container.rootfiles.rootfile;
        if (!root)
            throw new Error('Expected rootfile');
        this.rootfiles = [];

        if (Array.isArray(rootfile)) {
            for (var r of root)
                this.rootfiles.push(rootfile(r));
        } else {
            this.rootfiles.push(rootfile(root));
        }
    }

    getRootfile() {
        return this.rootfiles[0];
    }

    getRootfiles() {
        return this.rootfiles;
    }
}

module.exports = {
    Container: Container
};
