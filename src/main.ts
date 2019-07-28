import { app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as settings from './settings.json';
import * as path from 'path';

const log = require('electron-log');
log.transports.file.level = "info";
autoUpdater.logger = log;

let mainWindow: Electron.BrowserWindow;
let loadingScreen: Electron.BrowserWindow;

function createWindow() {
    const menuTemplate: MenuItemConstructorOptions[] = [{
        label: 'Application',
        submenu: [
            {label: 'About Application', role: 'about'},
            {type: 'separator',},
            {
                label: 'Quit', accelerator: 'Command+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    }, {
        label: 'Edit',
        submenu: [
            {label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo'},
            {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'},
            {type: 'separator'},
            {label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
            {label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
            {label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
            {label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll'},
        ],
    }];

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
    //mainWindow.webContents.openDevTools({mode: 'undocked'});

    ipcMain.on('main-window-finished-loading', () => {
        if (loadingScreen) {
            loadingScreen.close();
        }
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        mainWindow = null
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
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
