'use strict';
const { app, BrowserWindow } = require('electron');
const store = new (require('electron-store'))();
const pathstore = new (require('./ministore.js'))('openWindowPaths');
const menu = require('./menu.js');
const { newFile, open } = require('./file.js');

function createWindow() {
  let w = new BrowserWindow({
    width: 860,
    height: 560,
    title: 'Untitled',
    acceptFirstMouse: true,
    backgroundColor: '#232646',
  });
  w.loadFile('index.html');
  // w.webContents.openDevTools('undocked');
  // pathstore.set(w.id, undefined);

  // End lifecycle
  w.on('close', () => pathstore.delete(w.id));
  w.on('closed', () => w = null);

  return w;
}

app.on('ready', () => {
  menu();

  // Resume windows from last session
  let paths = pathstore.store();
  if (paths && Object.keys(paths).length == 0) {
    newFile();
  } else {
    pathstore.reset(); // Since window IDs may be shuffled
    for (let id in paths) {
      app.emit('create-new-window', (win) => {
        open(paths[id], win);
      });
    }
  }
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
    newFile();
  }
});
