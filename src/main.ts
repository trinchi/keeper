import {app, BrowserView, BrowserWindow, ipcMain} from 'electron';
import {autoUpdater} from 'electron-updater';
import * as settings from './settings.json';
import * as path from 'path';

const log = require('electron-log');
log.transports.file.level = "info";
autoUpdater.logger = log;

let mainWindow: Electron.BrowserWindow;
let loadingScreen: Electron.BrowserWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        minWidth: 900,
        minHeight: 600,
        width: 900,
        height: 600,
        titleBarStyle: 'hidden',
        show: false
    });

    mainWindow.loadURL(path.join('file://', __dirname, '../src/main.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools({mode: 'undocked'});

    ipcMain.on('main-window-finished-loading', () => {
        loadingScreen.close();
        mainWindow.show();
    });

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

    loadingScreen.loadURL(path.join('file://', __dirname, '../src/loadingScreen.html'));

    loadingScreen.on('closed', () => {
        loadingScreen = null
    });
}

app.on('ready', createLoadingScreen);
app.on("ready", createWindow);

app.on('ready', function () {
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createLoadingScreen();
        createWindow();
    }
});