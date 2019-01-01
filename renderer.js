'use strict';
const mdmath = require('./markdown-math');
const marked = require('marked');
const { ipcRenderer } = require('electron');
const win = require('electron').remote.getCurrentWindow();

let editor = document.getElementById('editor');
let viewer = document.getElementById('viewer');

let renderer = new marked.Renderer();
renderer.text = (text) => mdmath(text);
marked.setOptions({
  breaks: true,
  renderer: renderer
});

function refreshViewer() {
  viewer.innerHTML = marked(editor.value);
}

// Launch
editor.value = "# Hi, welcome to excelnotes!"
refreshViewer();
editor.focus();

// Update on edit
editor.addEventListener("input", () => {
  refreshViewer();
  updateDocumentEdited();
});

// Update document edited status
function updateDocumentEdited() {
  let edited = (fileOnDisk !== editor.value);
  let t = win.getTitle();
  let suffix = ' — Edited';
  if (edited === true && !win.isDocumentEdited()) {
    win.setTitle(t + (edited ? suffix : ''));
  }
  if (edited === false && win.isDocumentEdited()) {
    win.setTitle(t.replace(suffix, ''));
  }
  win.setDocumentEdited(edited);
}

// Open File
let fileOnDisk;
ipcRenderer.on('openFile', (e, m) => {
  editor.value = m;
  fileOnDisk = m;
  refreshViewer();
});

// Save File
let dataToSave; // In case user edits more before save completes
ipcRenderer.on('fetchSaveData', (e, m) => {
  dataToSave = editor.value;
  ipcRenderer.send('returnedSaveData', dataToSave);
});
ipcRenderer.on('saveSuccess', (e, m) => {
  fileOnDisk = dataToSave;
  updateDocumentEdited();
});