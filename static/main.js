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
        mantle.loader.show();
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
    mantle.doc.title();
    mantle.loader.hide();
    w3.removeClass('#tabsect', 'w3-show');
    w3.removeClass('#default', 'w3-hide');
    mantle.info.hide();
};

mantle.loader = {
    show: function () {
        w3.addClass('#opener', 'w3-hide');
        w3.removeClass('#loader', 'w3-hide');
    },

    hide: function () {
        w3.removeClass('#opener', 'w3-hide');
        w3.addClass('#loader', 'w3-hide');
    }
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
        w3.removeClass('.mantle-tab', 'w3-theme-d3');
        w3.addClass('#b' + id, 'w3-theme-d3');
    },

    /* Append a tab to the end of the navbar */
    append: function (id, title) {
        let btn = document.createElement('button');
        btn.id = 'b' + id;
        btn.className = 'mantle-tab w3-large w3-bar-item w3-button w3-border-right';
        btn.innerHTML = title + '\n';
        btn.innerHTML += '<span class="mantle-pad-4 mantle-margin-left w3-circle w3-medium w3-pink" onclick="mantle.ipc.close(\'' + id + '\')">&times</span>';
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

    /* Add an opener tab to the navbar */
    opener: function () {
        let btn = document.createElement('button');
        btn.className = 'mantle-tab w3-bar-item w3-button w3-theme-l2 w3-large';
        btn.innerHTML = '+';
        btn.innerHTML += '<span class="w3-large"></span>';
        btn.onclick = () => mantle.ipc.open();
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
    /* The book slider */
    slider: undefined,

    /* Show the info bar */
    show: function () {
        this.update(this.slider.value, this.slider.max);
        w3.addClass('#infobar', 'w3-show');
    },

    /* Hide the info bar */
    hide: function () {
        w3.removeClass('#infobar', 'w3-show');
    },

    /* Update the data within the info bar */
    update: function (current, max) {
        this.slider.value = current;
        this.slider.max = max;
        w3.displayObject('pagecount', {
            current: current,
            max: max
        });
    },

    /* Set the page to the slider range value */
    range: function () {
        mantle.reader.goto(parseInt(this.slider.value));
    }
};

mantle.doc = {
    title: function (title) {
        if (!title)
            document.title = 'Mantle';
        else
            document.title = title + ' - Mantle';
    }
};

window.onload = function () {
    mantle.reader.frame = document.getElementById('frame');
    mantle.info.slider = document.getElementById('slider');
    w3.includeHTML();
};

window.onclick = function (event) {
    if (event.target.classList.contains('w3-modal'))
        mantle.settings.close();
};
