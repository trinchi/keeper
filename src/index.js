const {app, BrowserView, BrowserWindow} = require('electron');
const settings = require('../res/settings');
const path = require('path');
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

let mainWindow;
let loadingScreen;

function createWindow() {

    mainWindow = new BrowserWindow({
        minWidth: 900,
        minHeight: 600,
        width: 900,
        height: 600,
        titleBarStyle: "hidden",
        show: false
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
        y: 20,
        width: 900,
        height: 580
    });

    browserView.webContents.loadURL(settings.url);

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    setTimeout( () => {
        loadingScreen.hide();
        mainWindow.show();
    }, 2000);

}

function createLoadingScreen() {

    loadingScreen = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false
    });

    loadingScreen.loadURL(path.join('file://', __dirname, '/loadingScreen.html'));
}

app.on('ready', createLoadingScreen);
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
    if (mainWindow === null) {
        createWindow();
    }
});