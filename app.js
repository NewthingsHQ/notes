// Select elements
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const saveNoteBtn = document.getElementById("save-note");
const notesContainer = document.getElementById("notes-container");

const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");
const underlineBtn = document.getElementById("underline-btn");

let editIndex = null; // Track the index of the note being edited

// Load saved notes from localStorage
window.onload = function() {
    displayNotes();
    displayWelcome();

    if (window.innerWidth <=768 && window.location.pathname!="/mobile.html") {
        // Adjust the width as needed for your design
        window.location.href="mobile.html";
    }
}
/*
// Save or Edit note in localStorage
saveNoteBtn.addEventListener("click", function() {
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();

    if (title && body) {
        const note = { title, body };
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (editIndex === null) {
            // Save new note
            notes.push(note);
        } else {
            // Edit existing note
            notes[editIndex] = note;
            editIndex = null; // Reset edit mode
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        noteTitle.value = "";
        noteBody.value = "";
        displayNotes();
    } else {
        alert("Please fill out both the title and note body.");
    }
});
*/

function sanitizeHtml(input) {
    // Create a temporary div to hold the input
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = input;

    // Remove all child nodes that aren't <b>, <i>, or <u>
    Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeType === 1 && !["B", "I", "U"].includes(node.tagName)) {
            node.parentNode.removeChild(node);
        }
    });

    return tempDiv.innerHTML;
}

// Save or Edit note in localStorage
saveNoteBtn.addEventListener("click", function() {
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();

    if (title && body) {
        const note = { title, body: sanitizeHtml(body) }; // Sanitize body
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (editIndex === null) {
            // Save new note
            notes.push(note);
        } else {
            // Edit existing note
            notes[editIndex] = note;
            editIndex = null; // Reset edit mode
        }

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
            <button class="edit-note" onclick="editNote(${index})">Edit</button>
            <button class="delete-note" onclick="deleteNote(${index})">Delete</button>
        `;

        notesContainer.appendChild(noteElement);
    });
}

function decodeHtml(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
}


// Edit a note
function editNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes[index];

    noteTitle.value = decodeHtml(note.title);
    noteBody.value = note.body;
    editIndex = index; // Set the index to edit mode
}

// Delete a note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
}

// Welcome text based on time of day
function displayWelcome() {
    let welcomeText = document.getElementById("welcome-text");
    let hour = new Date().getHours();
    
    if (hour > 4 && hour < 12) {
        welcomeText.innerHTML = "Good morning ☕";
    } else if (hour < 17) {
        welcomeText.innerHTML = "Good afternoon ☀️";
    } else if (hour < 19) {
        welcomeText.innerHTML = "Good evening 🌇";
    } else {
        welcomeText.innerHTML = "Good evening 🌙";
    }
}

// Formatting functions for Bold, Italic, Underline
function wrapText(tag) {
    const textarea = noteBody;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const wrappedText = `<${tag}>${selectedText}</${tag}>`;
    textarea.setRangeText(wrappedText, start, end, 'end');
}

// Event listeners for formatting buttons
boldBtn.addEventListener("click", function() {
    wrapText("b");
});

italicBtn.addEventListener("click", function() {
    wrapText("i");
});

underlineBtn.addEventListener("click", function() {
    wrapText("u");
});

