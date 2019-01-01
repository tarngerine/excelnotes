'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');
const store = new (require('electron-store'))();
const pathstore = new (require('./ministore.js'))('openWindowPaths');
const menu = require('./menu.js');

function createWindow() {
  let w = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Untitled',
    acceptFirstMouse: true,
  });
  w.loadFile('index.html');
  // w.webContents.openDevTools('undocked');
  pathstore.set(w.id, undefined);

  // End lifecycle
  w.on('close', () => pathstore.set(w.id));
  w.on('closed', () => w = null);

  return w;
}

app.on('ready', () => {
  store.clear(); // Remove if we eventually actually need persistent store
  menu();
  createWindow();
});

app.on('create-new-window', (callback) => {
  let w = createWindow();
  if (callback) callback(w);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
