const { app, BrowserWindow } = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('dist/index.html');
}

app.on('ready', createWindow);
