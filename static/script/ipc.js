'use strict';

ipcRenderer.on('book-add', (event, req) => {
    mantle.book.open(req.id, req.name, req.page, req.max);
});

ipcRenderer.on('book-read', (event, req) => {
    mantle.book.read(req.id);
});

ipcRenderer.on('book-open', event => {
    mantle.ipc.open();
});

ipcRenderer.on('book-display', (event, req) => {
    mantle.book.display(req.id, req.xhtml);
});

ipcRenderer.on('book-load', event => {
    mantle.loader.show();
});

ipcRenderer.on('nav-update', (event, books) => {
    if (!books)
        return;
    mantle.tab.clear();
    if (books.length > 0) {
        books.forEach(([id, title], i) => {
            mantle.tab.append(id, title);
        });
        mantle.tab.opener();
        mantle.info.show();
    } else {
        mantle.tab.hide();
    }
});

ipcRenderer.on('reader-forward', event => {
    mantle.reader.next();
});

ipcRenderer.on('reader-backward', event => {
    mantle.reader.prev();
});

ipcRenderer.on('reader-begin', event => {
    mantle.reader.begin();
});

ipcRenderer.on('reader-end', event => {
    mantle.reader.end();
});

ipcRenderer.on('reader-fullscreen', (event, value) => {
    mantle.reader.fullscreen(value);
});

ipcRenderer.on('index', event => {
    mantle.index();
});

ipcRenderer.on('settings', event => {
    mantle.settings.open();
});
