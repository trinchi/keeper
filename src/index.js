const {app, BrowserView, BrowserWindow} = require('electron');

const json = require('../res/settings');

const path = require('path');

const {autoUpdater} = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 900,
        minHeight: 600,
        width: 900,
        height: 600,
        titleBarStyle: "hidden"
    });

    let browserView = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    });

    if (process.platform === 'darwin') {
        mainWindow.loadURL(path.join('file://', __dirname, '/titleBar.html'));
    }

    mainWindow.setBrowserView(browserView);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({mode:'undocked'});

    browserView.setAutoResize({
        width: true,
        height: true
    });

    browserView.setBounds({
        x: 0,
        y: 15,
        width: 900,
        height: 585
    });

    browserView.webContents.loadURL(json.url);

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

app.on('ready', createWindow);

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function() {
    app.quit()
});

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});