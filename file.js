const fs = require('fs');

function open(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    w.webContents.send('openFile', data);
  });
}

function save(path) {

}

module.exports.open = open;
module.exports.save = save;
