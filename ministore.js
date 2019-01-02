const Store = require('electron-store');

function ministore(key) {
  this.key = key;
  let store = new Store();

  this.set = (k, v) => {
    let s = store.get(this.key);
    s[k] = v;
    store.set(this.key, s);
  }
  this.get = (k) => {
    return store.get(this.key)[k];
  }
  this.delete = (k) => {
    let s = store.get(this.key);
    delete s[k];
    store.set(this.key, s);
  }
  this.reset = () => {
    store.set(this.key, {});
  }
  this.store = () => store.get(this.key);
}

module.exports = ministore;
