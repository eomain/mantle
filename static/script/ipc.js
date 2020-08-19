'use strict';

ipcRenderer.on('book-add', (event, req) => {
    mantle.book.open(req.id, req.page, req.max);
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

ipcRenderer.on('nav-update', (event, arg) => {
    if (!arg)
        return;
    mantle.tab.clear();
    if (arg.length > 0) {
        arg.forEach(([id, title], i) => {
            mantle.tab.append(id, title);
        });

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
