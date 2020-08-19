
class MetaData {
    constructor(title, id, lang) {
        this.title = title;
        this.id = id;
        this.lang = lang;
    }

    getTitle() {
        return this.title;
    }

    getId() {
        return this.id;
    }

    getLang() {
        return this.lang;
    }
}

module.exports = {
    metadata: function (metadata) {
        let title = metadata['dc:title']['_text'];
        let id = metadata['dc:identifier']['_text'];
        let lang = metadata['dc:language']['_text'];
        return new MetaData(title, id, lang);
    }
};
