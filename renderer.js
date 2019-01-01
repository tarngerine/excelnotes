'use strict';
let editor = document.getElementById('editor');
let viewer = document.getElementById('viewer');

let md = require('marked');
md.setOptions({
  breaks: true
});

// Launch
editor.value = "# Hi, welcome to excelnotes!"
viewer.innerHTML = md(editor.value);

// Update on edit
editor.addEventListener("input", () => {
  viewer.innerHTML = md(editor.value);
});

// Open File
require('electron').ipcRenderer.on('openFile', (e, m) => {
  editor.value = m;
});