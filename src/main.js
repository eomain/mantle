
const { app, BrowserWindow } = require("electron")

function start() {
    let win = new BrowserWindow({
        center: true,
        show: false
    })

    win.loadFile('index.html')

    win.on('ready-to-show', () => {
        win.show()
    })

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', start)
