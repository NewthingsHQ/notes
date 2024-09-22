// Select elements
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const saveNoteBtn = document.getElementById("save-note");
const notesContainer = document.getElementById("notes-container");

// Load saved notes from localStorage
window.onload = function() {
    displayNotes();
}

// Save note to localStorage
saveNoteBtn.addEventListener("click", function() {
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();

    if (title && body) {
        const note = { title, body };
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
        noteTitle.value = "";
        noteBody.value = "";
        displayNotes();
    } else {
        alert("Please fill out both the title and note body.");
    }
});

// Display saved notes
function displayNotes() {
    notesContainer.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    
    notes.forEach((note, index) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");

        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <button class="delete-note" onclick="deleteNote(${index})">Delete</button>
        `;

        notesContainer.appendChild(noteElement);
    });
}

// Delete a note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
}
