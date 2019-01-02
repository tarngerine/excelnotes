const fs = require('fs');
const p = require('path');
const pathstore = new (require('./ministore.js'))('openWindowPaths');
const { app, ipcMain } = require('electron');

function newFile() {
  app.emit('create-new-window', (win) => {
    win.webContents.once('dom-ready', (e) => {
      win.webContents.send('openFile',
        '# Hi, welcome to excelnotes!');
    });
  });
}

function open(path, win) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    win.webContents.once('dom-ready', (e) => {
      win.webContents.send('openFile', data);
      setWindowPath(win, path);
    });
  });
}

function save(path, win) {
  win.webContents.send('fetchSaveData');
  ipcMain.once('returnedSaveData', (e, m) =>  {
    fs.writeFile(path, m, 'utf8', (err) => {
      if (err) throw err;
      setWindowPath(win, path);
      e.sender.send('saveSuccess');
    });
  });
}

function setWindowPath(win, path) {
  pathstore.set(win.id, path);
  win.setRepresentedFilename(path);
  win.setTitle(p.basename(path));
}

module.exports.newFile = newFile;
module.exports.open = open;
module.exports.save = save;
