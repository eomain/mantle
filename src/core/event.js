
const { ipcMain } = require("electron");
const { reader } = require('./reader');

ipcMain.on('epub-open', (event, books) => {
    reader.openAll(books);
});

ipcMain.on('epub-close', (event, id) => {
    reader.close(id);
});

ipcMain.on('epub-page', (event, req) => {
    reader.page(req.id, req.page);
});
