
const path = require('path');
const { app, BrowserWindow } = require('electron');
const { books } = require('../core/books');

let application = {
    window: undefined,

    init: function () {
        this.window = new BrowserWindow({
            center: true,
            show: false,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                enableRemoteModule: true,
            }
        });
    },

    show: function () {
        this.window.once('ready-to-show', () => {
            this.window.maximize();
            this.window.show();
        });
    },

    load: function (url) {
        this.window.loadFile(url);
    },

    send: function (channel, data) {
        this.window.webContents.send(channel, data);
    },

    toggleFullscreen: function () {
        let flag = !this.window.isFullScreen();
        this.window.setFullScreen(flag);
        this.send('reader-fullscreen', flag);
    },

    quit: function () {
        books.clear();
        app.quit();
    }
};

app.on('window-all-closed', () => {
    application.quit();
});

app.on('ready', () => {
    const { menu } = require('./menu');
    menu();
    application.init();
    application.load(path.join(app.getAppPath(), 'static', 'index.html'));
    application.show();
});

module.exports = {
    app: application
};
