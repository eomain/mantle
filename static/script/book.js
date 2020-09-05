'use strict';

class Book {
    constructor(id, name, page, max) {
        this.id = id;
        this.name = name;
        this.current = page;
        this.max = max;
        this.scrollX = 0;
        this.scrollY = 0;
        this.zoom = 1.0;
    }

    goto(page) {
        let current = this.current;
        if (page > 0 && page <= this.max)
            this.current = page;
        return current;
    }

    next() {
        if (this.current < this.max) {
            this.current += 1;
            return this.current;
        }
    }

    prev() {
        if (this.current > 1) {
            this.current -= 1;
            return this.current;
        }
    }

    begin() {
        this.current = 1;
    }

    end() {
        this.current = this.max;
    }

    atStart() {
        return this.current === 1;
    }

    atEnd() {
        return this.current === this.max;
    }

    object() {
        return {
            id: this.id,
            page: this.current
        };
    }

    load() {
        ipcRenderer.send('epub-page', this.object());
    }
}

mantle.book = {
    books: new Map(),

    open: function (id, name, page, max) {
        this.books.set(id, new Book(id, name, page, max));
    },

    read: function (id) {
        mantle.reader.book = this.books.get(id);
        mantle.reader.update();
        mantle.tab.activate(id);
    },

    get: function (id) {
        return this.books.get(id);
    },

    display: function (id, xhtml) {
        mantle.reader.book = this.books.get(id);
        mantle.reader.display(xhtml);
        mantle.reader.focus();
    },

    close: function (id) {
        this.books.delete(id);
        mantle.reader.book = undefined;
    }
};
