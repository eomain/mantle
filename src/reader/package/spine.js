
class Itemref {
    constructor(idref) {
        this.idref = idref;
    }

    get() {
        return this.idref;
    }
}

function toItemref(item) {
    let attr = item['_attributes'];
    let idref = attr['idref'];
    return new Itemref(idref);
}


class Spine {
    constructor(itemrefs) {
        this.itemrefs = [];
        this.urls = new Map();

        let page = 1;
        if (Array.isArray(itemrefs)) {
            for (var itemref of itemrefs) {
                let i = toItemref(itemref);
                this.itemrefs.push(i);
                this.urls.set(i, page);
                page += 1;
            }
        } else {
            let i = toItemref(itemref);
            this.itemrefs.push(i);
            this.urls.set(i, page);
        }
    }

    get() {
        return this.itemrefs;
    }

    first() {
        return this.itemrefs[0];
    }

    nth(n) {
        return this.itemrefs[n];
    }

    length() {
        return this.itemrefs.length;
    }
}

module.exports = {
    spine: function (spine) {
        let itemrefs = spine['itemref'];
        return new Spine(itemrefs);
    }
};
