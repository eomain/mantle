
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
    }
};

ipcMain.on('epub-open', (event, books) => {
    books.forEach(book => reader.open(book));
});

ipcMain.on('epub-close', (event, id) => {
    books.remove(id);
    app.send('nav-update', books.entries());
    if (books.count() == 0)
        app.send('index');
    else
        app.send('book-read', books.bookPage(books.last(), 1));
});

ipcMain.on('epub-page', (event, req) => {
    let id = req.id;
    let page = req.page;
    app.send('book-display', books.bookPage(id, page));
});

app.lock((argv) => {
    // Open books in current window on second instance
    argv.slice(2).forEach(book => reader.open(book));
});

app.run(() => {
    const argv = process.argv.slice(2);
    if (argv.length > 0) {
        app.send('book-load');
        argv.forEach(book => reader.open(book));
    }
});
