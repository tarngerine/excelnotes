const { app, BrowserWindow } = require('electron')

let w

function createWindow() {
  w = new BrowserWindow({
    width: 800,
    height: 600,
  })
  w.loadFile('index.html')
  w.webContents.openDevTools()
  w.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    w = null
  })
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