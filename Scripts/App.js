let notes = [];

let selectedNoteId;

const titleInput = document.querySelector('#note-title input');
const editor = document.querySelector('#editor');
const previewContainer = document.querySelector('#note-preview-container');
const newNoteBtn = document.getElementById("new-note");
const saveNoteBtn = document.getElementById("save-note");

function AddNote(title, text){
    const newNote = {
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

function UpdateNotePreviewList(list){
  previewContainer.innerHTML = "";
    list.forEach(note => {
        createNotePreview(note);
    });
}

function loadNoteIntoEditor() {
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  if (!selectedNote) return; 

  titleInput.value = selectedNote.title;     
  editor.textContent = selectedNote.body;    
}

function saveNotesToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromStorage() {
  const rawNotes = localStorage.getItem("notes");
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
}

//new note button

newNoteBtn.addEventListener("click", (event) => {
    selectedNoteId = null;
    titleInput.value = "";
    editor.textContent = "";
    titleInput.focus();
});

//save note button

saveNoteBtn.addEventListener("click", (event) => {
    if(selectedNoteId != null)
        return;
    AddNote(titleInput.value, editor.textContent);
});

//update not preview title
titleInput.addEventListener("input", () => {
    const note = notes.find(n => n.id === selectedNoteId);
    if (!note) return;

    note.title = titleInput.value;
    note.lastEdited = Date.now();
    saveNotesToStorage();
    UpdateNotePreviewList(notes);
});

//update note preview body and date. 
editor.addEventListener("input", () => {
    const note = notes.find(n => n.id === selectedNoteId);
    if (!note) return;

    note.body = editor.textContent;
    note.lastEdited = Date.now();
    saveNotesToStorage();
    UpdateNotePreviewList(notes);
});

function createNotePreview(note) {
    const noteEl = document.createElement("div");
    noteEl.classList.add("note-preview");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = note.title;

    const span = document.createElement("span");

    const time = document.createElement("div");
    time.classList.add("time");
    time.textContent = new Date(note.lastEdited).toLocaleTimeString();

    const text = document.createElement("div");
    text.classList.add("text");
    text.textContent = note.body;

    span.appendChild(time);
    span.appendChild(text);

    noteEl.appendChild(title);
    noteEl.appendChild(span);

    noteEl.addEventListener("click", () => {
        selectedNoteId = note.id;
        loadNoteIntoEditor();
    });

    previewContainer.appendChild(noteEl);
}

loadNotesFromStorage();
