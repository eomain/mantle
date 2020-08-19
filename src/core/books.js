
const path = require('path');
const uuid = require('uuid/v4');

class Books {
    constructor() {
        this.epubs = new Map();
    }

    add(epub) {
        let id = uuid();
        this.epubs.set(id, epub);
        this.recent = id;
        return id;
    }

    remove(id) {
        let epub = this.epubs.get(id);
        if (!epub)
            return;
        epub.cleanUp();
        this.epubs.delete(id);
    }

    count() {
        return this.epubs.size;
    }

    titles() {
        return Array.from(this.epubs.values()).map(epub => {
            let data = epub.getPackage().getMetadata();
            return data.getTitle();
        });
    }

    last() {
        let ids = Array.from(this.epubs.keys());
        if (ids.length > 0)
            return ids[ids.length - 1];
    }

    entries() {
        return Array.from(this.epubs.entries()).map(([id, epub]) => {
            let data = epub.getPackage().getMetadata();
            return [id, data.getTitle()];
        });
    }

    bookStat(id) {
        let epub = this.epubs.get(id);
        if (!epub)
            return;
        let spine = epub.getPackage().getSpine();

        return {
            id: id,
            page: 1,
            max: spine.length()
        };
    }

    bookPage(id, page) {
        let epub = this.epubs.get(id);
        if (!epub)
            return;
        let spine = epub.getPackage().getSpine();
        let manifest = epub.getPackage().getManifest();
        let itemref = spine.nth(page - 1);
        let item = manifest.getItem(itemref.get());

        return {
            id: id,
            page: page,
            xhtml: path.join(epub.getPackagePath(), item.href)
        };
    }

    clear() {
        for (var [id, epub] of this.epubs)
            epub.cleanUp();
        this.epubs.clear();
    }
}

module.exports = {
    books: new Books()
};
