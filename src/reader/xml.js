
const convert = require('xml-js');

class XmlDoc {
    constructor(xml) {
        this.doc = convert.xml2js(xml, { compact: true });
    }

    get(name) {
        return this.doc[name];
    }

    getDoc() {
        return this.doc;
    }


}

module.exports = {
    XmlDoc: XmlDoc
};
