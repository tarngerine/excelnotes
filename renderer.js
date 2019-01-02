'use strict';
const mdmath = require('./markdown-math');
const marked = require('marked');
const { ipcRenderer } = require('electron');
const win = require('electron').remote.getCurrentWindow();

let editor = document.getElementById('editor');
let viewer = document.getElementById('viewer');

marked.setOptions({
  breaks: true,
});

// Parse and render markdown
function refreshViewer() {
  try {
    let lex = marked.lexer(editor.value);
    lex.forEach((token, i) => {
      if (token.text && token.type !== 'code') {
        token.text = mdmath(token.text);
        lex[i] = token;
      }
      if (token.type === 'table') {
        token.cells = token.cells.map((row) => {
          return row.map((cell) => {
            return mdmath(cell);
          })
        })
      }
    });
    viewer.innerHTML = marked.parser(lex);
  } catch (error) { console.log(error) }
}

// Launch
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