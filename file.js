const fs = require('fs');

function open(path, w) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    w.webContents.send('openFile', data);
  });
}

function save() {

}

module.exports.open = open;
module.exports.save = save;