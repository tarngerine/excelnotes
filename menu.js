const { app, BrowserWindow, dialog, Menu } = require('electron');
const pathstore = new (require('./ministore.js'))('openWindowPaths');
const { open, save } = require('./file.js');

module.exports = function() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label:  'New File',
          accelerator: 'cmd+n',
          click: () => {
            app.emit('create-new-window');
          }
        },
        {
          label: 'Open...',
          accelerator: 'cmd+o',
          click: () => {
            let win = BrowserWindow.getFocusedWindow();
            dialog.showOpenDialog(
              win,
              {
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
                if (paths === undefined || paths.length === 0) return;

                let existingWin = BrowserWindow.getAllWindows().find((w) => {
                  return pathstore.get(w.id) === paths[0];
                });

                if (existingWin !== undefined) {
                  existingWin.focus();
                  // TODO: handle changed content in editor OR filesystem
                  return;
                }
                app.emit('create-new-window', (win) => {
                  open(paths[0], win);
                });
              }
            );
          }
        },
        {
          label: 'Save',
          accelerator: 'cmd+s',
          click: () => {
            let win = BrowserWindow.getFocusedWindow();
            let existingPath = pathstore.get(win.id);
            if (existingPath === undefined) {
              dialog.showSaveDialog(
                win,
                {
                  filters: [
                    {
                      name: 'Markdown',
                      extensions: ['md']
                    }
                  ]
                }, (path) => {
                  if (path !== undefined) save(path, win);
                }
              );
            } else {
              save(existingPath, win);
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
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
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
  ];

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
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
