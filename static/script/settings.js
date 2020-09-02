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
            let nav = document.getElementById('settings-navbar');
            let value = nav.options[nav.selectedIndex].value == 'yes';
            mantle.reader.fs.nav = value;
            if (!mantle.reader.isFullScreen)
                return;
            mantle.reader.fullscreen(true);
        },

        info: function () {
            let nav = document.getElementById('settings-infobar');
            let value = nav.options[nav.selectedIndex].value == 'yes';
            mantle.reader.fs.info = value;
            if (!mantle.reader.isFullScreen)
                return;
            mantle.reader.fullscreen(true);
        }
    }
};
