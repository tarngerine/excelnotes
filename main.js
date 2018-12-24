const { app, BrowserWindow, Menu } = require('electron')
const Store = require('electron-store')
const menu = require('./menu.js')

let w, store

function createWindow() {
  store = store || new Store();
  w = new BrowserWindow({
    width: 800,
    height: 600,
  })
  // w.setRepresentedFilename('')
  // w.setDocumentEdited(true)
  w.loadFile('index.html')
  w.webContents.openDevTools()
  w.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    w = null
  })
  menu(w, store)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (w === null) {
    createWindow()
  }
})