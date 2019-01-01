'use strict';
const { app, BrowserWindow, Menu } = require('electron');
const menu = require('./menu.js');

let w;

function createWindow() {
  w = new BrowserWindow({
    width: 800,
    height: 600,
  });
  // w.setRepresentedFilename('')
  // w.setDocumentEdited(true)
  w.loadFile('index.html');
  // w.webContents.openDevTools('undocked');
  w.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    w = null;
  })
}

app.on('ready', () => {
  menu();
  createWindow();
});

app.on('create-new-window', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (w === null) {
    createWindow();
  }
})
