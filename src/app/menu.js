
const { app } = require('./main');
const { Menu } = require('electron');

const TEMPLATE = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open...',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    app.send('book-open');
                }
            },

            {
                type: 'separator'
            },

            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },

    {
        label: 'Edit',
        submenu: [
            {
                label: 'Previous page',
                accelerator: 'Left',
                click: () => {
                    app.send('reader-backward');
                }
            },

            {
                label: 'Next page',
                accelerator: 'Right',
                click: () => {
                    app.send('reader-forward');
                }
            },

            {
                label: 'First page',
                accelerator: 'Home',
                click: () => {
                    app.send('reader-begin');
                }
            },

            {
                label: 'Last page',
                accelerator: 'End',
                click: () => {
                    app.send('reader-end');
                }
            },

            {
                type: 'separator'
            },

            {
                label: 'Settings',
                accelerator: 'CmdOrCtrl+M',
                click: () => {
                    app.send('settings');
                }
            }
        ]
    },

    {
        label: 'View',
        submenu: [
            {
                label: 'Fullscreen',
                accelerator: 'F11',
                click: () => {
                    app.toggleFullscreen();
                }
            }
        ]
    },

    {
        label: 'Help',
        submenu: [
            {
                label: 'About'
            }
        ]
    }
];

module.exports = {
    menu: () => {
        return Menu.setApplicationMenu(Menu.buildFromTemplate(TEMPLATE));
    }
};
