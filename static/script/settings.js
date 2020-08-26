'use strict';

mantle.settings = {
    open: function () {
        w3.addClass('#settings', 'w3-show');
    },

    close: function () {
        w3.removeClass('#settings', 'w3-show');
    },

    fullscreen: {
        nav: function () {
            if (!mantle.reader.isFullScreen)
                return;
            let nav = document.getElementById('settings-navbar');
            let value = nav.selectedIndex != 0;
            mantle.reader.fs.nav = value;
            mantle.reader.fullscreen(true);
        },

        info: function () {
            if (!mantle.reader.isFullScreen)
                return;
            let nav = document.getElementById('settings-infobar');
            let value = nav.selectedIndex != 0;
            mantle.reader.fs.info = value;
            mantle.reader.fullscreen(true);
        }
    }
};
