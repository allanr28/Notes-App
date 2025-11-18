"use strict";

var notes = [];
var selectedNoteId;
var titleInput = document.querySelector('#note-title input');
var editor = document.querySelector('#editor');
var previewContainer = document.querySelector('#note-preview-container');
var newNoteBtn = document.getElementById("new-note");
var saveNoteBtn = document.getElementById("save-note");

function AddNote(title, text) {
  var newNote = {
    id: crypto.randomUUID(),
    title: title,
    body: text,
    lastEdited: Date.now()
  };
  notes.push(newNote);
  selectedNoteId = newNote.id;
  saveNotesToStorage();
  UpdateNotePreviewList(notes);
}

function UpdateNotePreviewList(list) {
  previewContainer.innerHTML = "";
  list.forEach(function (note) {
    createNotePreview(note);
  });
}

function loadNoteIntoEditor() {
  var selectedNote = notes.find(function (note) {
    return note.id === selectedNoteId;
  });
  if (!selectedNote) return;
  titleInput.value = selectedNote.title;
  editor.textContent = selectedNote.body;
}

function saveNotesToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromStorage() {
  var rawNotes = localStorage.getItem("notes");
  if (!rawNotes) return;

  try {
    notes = JSON.parse(rawNotes);
  } catch (error) {
    notes = [];
    return;
  }

  if (notes.length === 0) return;
  selectedNoteId = notes[0].id;
  UpdateNotePreviewList(notes);
  loadNoteIntoEditor();
} //new note button


newNoteBtn.addEventListener("click", function (event) {
  selectedNoteId = null;
  titleInput.value = "";
  editor.textContent = "";
  titleInput.focus();
}); //save note button

saveNoteBtn.addEventListener("click", function (event) {
  if (selectedNoteId != null) return;
  AddNote(titleInput.value, editor.textContent);
}); //update not preview title

titleInput.addEventListener("input", function () {
  var note = notes.find(function (n) {
    return n.id === selectedNoteId;
  });
  if (!note) return;
  note.title = titleInput.value;
  note.lastEdited = Date.now();
  saveNotesToStorage();
  UpdateNotePreviewList(notes);
}); //update note preview body and date. 

editor.addEventListener("input", function () {
  var note = notes.find(function (n) {
    return n.id === selectedNoteId;
  });
  if (!note) return;
  note.body = editor.textContent;
  note.lastEdited = Date.now();
  saveNotesToStorage();
  UpdateNotePreviewList(notes);
});

function createNotePreview(note) {
  var noteEl = document.createElement("div");
  noteEl.classList.add("note-preview");
  var title = document.createElement("div");
  title.classList.add("title");
  title.textContent = note.title;
  var span = document.createElement("span");
  var time = document.createElement("div");
  time.classList.add("time");
  time.textContent = new Date(note.lastEdited).toLocaleTimeString();
  var text = document.createElement("div");
  text.classList.add("text");
  text.textContent = note.body;
  span.appendChild(time);
  span.appendChild(text);
  noteEl.appendChild(title);
  noteEl.appendChild(span);
  noteEl.addEventListener("click", function () {
    selectedNoteId = note.id;
    loadNoteIntoEditor();
  });
  previewContainer.appendChild(noteEl);
}

loadNotesFromStorage();