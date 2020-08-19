'use strict';

/* Manages the application reader */
mantle.reader = {
    /* The book currently active */
    book: undefined,

    /* The frame for displaying the content */
    frame: undefined,

    /* If the reader is set to fullscreen */
    isFullScreen: false,

    /* Display the XHTML page */
    display: function (xhtml) {
        this.frame.src = xhtml;
        w3.addClass('#default', 'w3-hide');
        w3.addClass('#tabsect', 'w3-show');

        mantle.info.update(this.book.current, this.book.max);
    },

    /* Save the reader state of the current book */
    save: function () {
        if (!this.book)
            return;
        this.book.scrollY = this.frame.contentWindow.scrollY;
        this.book.scrollX = this.frame.contentWindow.scrollX;
        this.book.zoom = this.frame.contentWindow.document.body.style.zoom;
    },

    /* Restore the reader state of the current book */
    restore: function () {
        let onload = this.frame.onload;
        this.frame.onload = function () {
            let book = mantle.reader.book;
            if (!book)
                return;
            this.contentWindow.scrollTo(book.scrollX, book.scrollY);
            let height = this.contentWindow.document.body.clientHeight;
            let inner = this.contentWindow.innerHeight;
            //this.contentWindow.document.body.style.zoom = (inner / height);
            this.onload = onload;
        }
    },

    /* Update the current page */
    update: function () {
        if (this.book)
            this.book.load();
    },

    /* Jumps to the given page and displays it */
    goto: function (page) {
        if (!this.book)
            return;
        if (page != this.book.goto(page))
            this.book.load();
    },

    /* Displays the next page */
    next: function() {
        if (!this.book)
            return;
        let page = this.book.next();
        if (!page)
            return;
        this.book.load();
    },

    /* Displays the previous page */
    prev: function() {
        if (!this.book)
            return;
        let page = this.book.prev();
        if (!page)
            return;
        this.book.load();
    },

    /* Displays the first page */
    begin: function () {
        if (!this.book)
            return;
        if (!this.book.atStart()) {
            this.book.begin();
            this.book.load();
        }
    },

    /* Displays the last page */
    end: function () {
        if (!this.book)
            return;
        if (!this.book.atEnd()) {
            this.book.end();
            this.book.load();
        }
    },

    /* Set the reader to fullscreen mode */
    fullscreen: function (value) {
        if (value) {
            mantle.tab.hide();
            mantle.info.hide();
        } else {
            mantle.tab.show();
            mantle.info.show();
        }
        this.isFullScreen = value;
    },

    /* Sets the focus to the reader */
    focus: function () {
        this.frame.focus();
    },

    /* Reset the zoom level */
    resetZoom: function () {
        this.book.zoom = 1.0;
    }
};
