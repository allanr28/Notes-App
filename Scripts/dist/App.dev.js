"use strict";

var notes = [];
var selectedNoteId;
var titleInput = document.querySelector('#note-title input');
var editor = document.querySelector('#editor');
var previewContainer = document.querySelector('#note-preview-container');
var searchInput = document.querySelector('#note-search');
var newNoteBtn = document.getElementById("new-note");
var saveNoteBtn = document.getElementById("save-note");
var isNewNoteDirty = false;

function AddNote(title, text) {
  var newNote = {
    id: crypto.randomUUID(),
    title: title,
    body: text,
    lastEdited: Date.now()
  };
  notes.push(newNote);
  selectedNoteId = newNote.id;
  isNewNoteDirty = false;
  saveNotesToStorage();

  if (searchInput && searchInput.value.trim()) {
    searchInput.value = "";
  }

  renderNotes();
  updateSaveButtonState();
}

function UpdateNotePreviewList(list) {
  previewContainer.innerHTML = "";
  list.forEach(function (note) {
    createNotePreview(note);
  });
}

function getFilteredNotes() {
  if (!searchInput) return notes;
  var query = searchInput.value.trim().toLowerCase();
  if (!query) return notes;
  return notes.filter(function (note) {
    var title = (note.title || "").toLowerCase();
    var body = (note.body || "").toLowerCase();
    return title.includes(query) || body.includes(query);
  });
}

function renderNotes() {
  var filtered = getFilteredNotes();

  if (selectedNoteId && !filtered.some(function (n) {
    return n.id === selectedNoteId;
  })) {
    selectedNoteId = null;
    isNewNoteDirty = false;
    titleInput.value = "";
    editor.textContent = "";
    updateSaveButtonState();
  }

  UpdateNotePreviewList(filtered);
}

function loadNoteIntoEditor() {
  var selectedNote = notes.find(function (note) {
    return note.id === selectedNoteId;
  });
  if (!selectedNote) return;
  titleInput.value = selectedNote.title;
  editor.textContent = selectedNote.body;
}

function updateSaveButtonState() {
  var canSave = selectedNoteId === null && isNewNoteDirty;
  saveNoteBtn.classList.toggle("disabled", !canSave);

  if (!canSave) {
    saveNoteBtn.setAttribute("aria-disabled", "true");
  } else {
    saveNoteBtn.removeAttribute("aria-disabled");
  }
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
  renderNotes();
  loadNoteIntoEditor();
  updateSaveButtonState();
} //new note button


newNoteBtn.addEventListener("click", function (event) {
  selectedNoteId = null;
  isNewNoteDirty = false;
  titleInput.value = "";
  editor.textContent = "";
  titleInput.focus();
  renderNotes();
  updateSaveButtonState();
}); //save note button

saveNoteBtn.addEventListener("click", function (event) {
  if (selectedNoteId != null || !isNewNoteDirty) return;
  AddNote(titleInput.value, editor.textContent);
  updateSaveButtonState();
}); //update not preview title

titleInput.addEventListener("input", function () {
  var note = notes.find(function (n) {
    return n.id === selectedNoteId;
  });

  if (!note) {
    isNewNoteDirty = true;
    updateSaveButtonState();
    return;
  }

  note.title = titleInput.value;
  note.lastEdited = Date.now();
  saveNotesToStorage();
  renderNotes();
  updateSaveButtonState();
}); //update note preview body and date. 

editor.addEventListener("input", function () {
  var note = notes.find(function (n) {
    return n.id === selectedNoteId;
  });

  if (!note) {
    isNewNoteDirty = true;
    updateSaveButtonState();
    return;
  }

  note.body = editor.textContent;
  note.lastEdited = Date.now();
  saveNotesToStorage();
  renderNotes();
  updateSaveButtonState();
});

function createNotePreview(note) {
  var noteEl = document.createElement("div");
  noteEl.classList.add("note-preview");

  if (note.id === selectedNoteId) {
    noteEl.classList.add("selected");
  }

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
    isNewNoteDirty = false;
    loadNoteIntoEditor();
    renderNotes();
    updateSaveButtonState();
  });
  previewContainer.appendChild(noteEl);
}

loadNotesFromStorage();
updateSaveButtonState();

if (searchInput) {
  searchInput.addEventListener("input", renderNotes);
}