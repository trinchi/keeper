const {app, BrowserView, BrowserWindow} = require('electron');
const {autoUpdater} = require('electron-updater');
const settings = require('../res/settings');
const path = require('path');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;
let loadingScreen;

function createWindow() {

    mainWindow = new BrowserWindow({
        minWidth: 900,
        minHeight: 600,
        width: 900,
        height: 600,
        titleBarStyle: 'hidden',
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

}

function createLoadingScreen() {

    loadingScreen = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false
    });

    loadingScreen.loadURL(path.join('file://', __dirname, '/loadingScreen.html'));

    loadingScreen.on('closed', () => {
        loadingScreen = null
    });

    setTimeout( () => {
        loadingScreen.close();
        mainWindow.show();
    }, 3000);
}

app.on('ready', createLoadingScreen);
app.on('ready', createWindow);

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createLoadingScreen();
        createWindow();
    }
});