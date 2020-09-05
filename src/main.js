
const { app } = require('./app/main');
const { ipcMain } = require("electron");
const { Epub } = require('./reader/epub');
const { books } = require('./core/books');

const reader = {
    open: function (path) {
        let epub = new Epub(path);

        epub.load().then(() => {
            let id = books.add(epub);
            app.send('nav-update', books.entries());
            app.send('book-add', books.bookStat(id));
            app.send('book-display', books.bookPage(id, 1));
        }).catch(e => {
            // TODO
        });
    },

    openAll: function (paths) {
        if (paths.length > 0) {
            app.send('book-load');
            paths.forEach(book => this.open(book));
        }
    },

    close: function (id) {
        books.remove(id);
        app.send('nav-update', books.entries());
        if (books.count() == 0)
            app.send('index');
        else
            app.send('book-read', books.bookPage(books.last(), 1));
    },

    page: function (id, page) {
        app.send('book-display', books.bookPage(id, page));
    }
};

ipcMain.on('epub-open', (event, books) => {
    reader.openAll(books);
});

ipcMain.on('epub-close', (event, id) => {
    reader.close(id);
});

ipcMain.on('epub-page', (event, req) => {
    reader.page(req.id, req.page);
});

app.lock(argv => {
    // Open books in current window on second instance
    reader.openAll(argv.slice(2));
});

app.run(() => {
    reader.openAll(process.argv.slice(2));
});
