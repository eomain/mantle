'use strict';

const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

var mantle = {};

mantle.ipc = {
    /* Opens up a dialog for selecting files (books). */
    select: function () {
        return dialog.showOpenDialog({
            filters: [
                { name: 'Books', extensions: ['epub'] }
            ],
            properties: ['openFile', 'multiSelections']
        });
    },

    /* Opens and displays books chosen by the user. */
    open: async function () {
        let object = await this.select();
        if (object.canceled)
            return;
        w3.addClass('#opener', 'w3-hide');
        w3.removeClass('#loader', 'w3-hide');
        ipcRenderer.send('epub-open', object.filePaths);
    },

    /* Closes the book that is currently open. */
    close: function (id) {
        mantle.book.close(id);
        ipcRenderer.send('epub-close', id);
    }
};

/* Displays the startup "index" page. */
mantle.index = function () {
    w3.removeClass('#opener', 'w3-hide');
    w3.addClass('#loader', 'w3-hide');
    w3.removeClass('#tabsect', 'w3-show');
    w3.removeClass('#default', 'w3-hide');
    mantle.info.hide();
};

/* Used to manage the books navbar and tabs. */
mantle.tab = {
    /* The navbar */
    nav: undefined,

    /* The current active tab */
    current: undefined,

    /* Show the navbar */
    show: function () {
        w3.addClass('#navbar', 'w3-show');
    },

    /* Hide the navbar */
    hide: function () {
        w3.removeClass('#navbar', 'w3-show');
    },

    /* Set a tab to be active within the navbar */
    activate: function (id) {
        //let e = document.getElementById('navbar');
        w3.removeClass('.mantle-tab', 'w3-theme-d4');
        //let c = e.childNodes[n];
        //this.current = current;
        w3.addClass('#b' + id, 'w3-theme-d4');
    },

    /* Append a tab to the end of the navbar */
    append: function (id, title) {
        let btn = document.createElement('button');
        btn.id = 'b' + id;
        btn.className = 'mantle-tab w3-bar-item w3-button';
        btn.innerHTML = title + '\n';
        btn.innerHTML += '<span class="w3-theme-d4" onclick="mantle.ipc.close(\'' + id + '\')">&times</span>';
        btn.onclick = function () {
            let book = mantle.book.get(id);
            if (Object.is(book, mantle.reader.book))
                return;
            mantle.reader.save();
            mantle.reader.book = book;
            mantle.reader.update();
            mantle.reader.restore();
            mantle.tab.activate(id);
        };
        let e = document.getElementById('navbar');
        e.appendChild(btn);
        if (!mantle.reader.isFullScreen)
            this.show();
    },

    /* Clear all the tabs from the navbar */
    clear: function () {
        let e = document.getElementById('navbar');
        while (e.firstChild) {
            // TODO: remove book
            e.removeChild(e.firstChild);
        }
    }
};

/* Used to manage the info bar at the bottom */
mantle.info = {
    /* Show the info bar */
    show: function () {
        w3.addClass('#infobar', 'w3-show');
    },

    /* Hide the info bar */
    hide: function () {
        w3.removeClass('#infobar', 'w3-show');
    },

    /* Update the data within the info bar */
    update: function (current, max) {
        w3.displayObject('pagecount', {
            current: current,
            max: max
        });
    }
};

window.onload = function () {
    mantle.reader.frame = document.getElementById('frame');
}
