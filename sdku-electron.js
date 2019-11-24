const { app, BrowserWindow } = require('electron');

function createWindow() {
    setTimeout(() => {
        let win = new BrowserWindow({
            width: 1280,
            height: 720,
            frame: false,
            title: 'sdku',
            transparent: true,
            show: false,
            backgroundColor: '#00ffffff',
            webPreferences: {
                nodeIntegration: true
            }
        });

        win.loadFile('dist/index.html');

        win.once('ready-to-show', () => {
            win.show();
        });
    }, 500);
}

app.on('ready', createWindow);
