
class Item {
    constructor(href, id, media) {
        this.href = href;
        this.id = id;
        this.media = media;
    }
}

function toItem(item) {
    let attr = item['_attributes'];
    let href = attr['href'];
    let id = attr['id'];
    let media = attr['media-type'];
    return new Item(href, id, media);
}

class Manifest {
    constructor(items) {
        this.items = new Map();
        this.itemrefs = new Map();

        if (Array.isArray(items)) {
            for (var item of items) {
                let i = toItem(item);
                this.items[i.id] = i;
                this.itemrefs.set(i.href, i.id);
            }
        } else {
            let i = toItem(items);
            this.items[i.id] = i;
            this.itemrefs.set(i.href, i.id);
        }
    }

    getItem(id) {
        return this.items[id];
    }

    getItems() {
        return this.items;
    }
}

module.exports = {
    manifest: function (manifest) {
        let items = manifest['item'];
        return new Manifest(items);
    }
};
