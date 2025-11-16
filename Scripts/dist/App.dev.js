"use strict";

var notes = [];
var selectedNoteId;
var titleInput = document.querySelector('#note-title input');
var editor = document.querySelector('#editor');
var previewContainer = document.querySelector('#note-preview-container');

function AddNote(title, text) {
  var newNote = {
    id: crypto.randomUUID(),
    title: title,
    body: text,
    lastEdited: Date.now()
  };
  notes.push(newNote);
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
  if (!selectedNote) return; // guard against undefined

  titleInput.value = selectedNote.title; // ✅ input uses value

  editor.textContent = selectedNote.body; // ✅ contenteditable uses textContent
}

function createNotePreview(note) {
  // Outer container
  var noteEl = document.createElement("div");
  noteEl.classList.add("note-preview"); // Title

  var title = document.createElement("div");
  title.classList.add("title");
  title.textContent = note.title; // Span wrapper

  var span = document.createElement("span"); // Time

  var time = document.createElement("div");
  time.classList.add("time");
  time.textContent = new Date(note.lastEdited).toLocaleTimeString(); // Text

  var text = document.createElement("div");
  text.classList.add("text");
  text.textContent = note.body; // Build the tree

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

AddNote("First note", "This is the body of my first note");
AddNote("Second note", "Another test note");
selectedNoteId = notes[0].id;
loadNoteIntoEditor();