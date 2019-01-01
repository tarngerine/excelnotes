const { app, Menu, dialog } = require('electron')
const { open, save } = require('./file.js')

module.exports = function(w, store) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label:  'New File',
          accelerator: 'cmd+n',
          click: () => {
            // w.webContents.send()
          }
        },
        {
          label: 'Open...',
          accelerator: 'cmd+o',
          click: () => {
            dialog.showOpenDialog({
              filters: [
                {
                  name: 'Markdown',
                  extensions: ['md']
                }
              ],
              properties: [
                'openFile'
              ]
            }, (paths) => {
              store.set('openFilePath', paths[0])
              open(paths[0], w)
            })
          }
        },
        {
          label: 'Save',
          accelerator: 'cmd+s',
          click: () => {
            if (store.get('openFilePath') === null) {

              dialog.showSaveDialog({
                
              }, (path) => {
                store.set('openFilePath', path)
              })
            }
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
