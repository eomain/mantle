
const path = require('path');
const { app, BrowserWindow } = require('electron');
const { books } = require('../core/books');

let application = {
    window: undefined,

    init: function () {
        this.window = new BrowserWindow({
            center: true,
            show: false,
            icon: path.join(app.getAppPath(), 'static', 'asset', 'icon', 'icon.png'),
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                enableRemoteModule: true,
            }
        });
    },

    show: function (ready) {
        this.window.once('ready-to-show', () => {
            this.window.maximize();
            this.window.show();
            if (ready)
                ready();
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

    lock: function (onlock) {
        this.onlock = onlock;
    },

    run: function (ready) {

        if (!app.requestSingleInstanceLock())
            this.quit();

        app.on('window-all-closed', () => {
            this.quit();
        });

        app.on('second-instance', (event, cmd, dir) => {
            if (this.window) {
                if (this.window.isMinimized())
                    this.window.restore();
                this.window.focus();
                if (this.onlock)
                    this.onlock(cmd);
            }
        });

        app.on('ready', () => {
            const { menu } = require('./menu');
            menu();
            this.init();
            this.load(path.join(app.getAppPath(), 'static', 'index.html'));
            this.show(ready);
        });
    },

    quit: function () {
        books.clear();
        app.quit();
    }
};

module.exports = {
    app: application
};
