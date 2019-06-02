import { ipcRenderer } from 'electron';

const webview = document.querySelector('.webview');
webview.addEventListener('did-finish-load', () => {
    ipcRenderer.send('main-window-finished-loading');
});