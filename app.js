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
}

saveNoteBtn.addEventListener("click", function() {
    const title = noteTitle.value.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    const body = sanitizeNoteBody(noteBody.value.trim());

    if (title && body) {
        const note = { title, body };
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (editIndex === null) {
            // Save new note
            notes.push(note);
            displayWelcome(); // Update the welcome text after adding a note
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
    
    if (notes.length === 0) {
        document.getElementById("notes-list").style.display = "none";
        document.getElementById("add-note").style.margin = "0 auto"; // Center add-note section
    } else {
        document.getElementById("notes-list").style.display = "block";
        document.getElementById("add-note").style.margin = ""; // Reset margin when there are notes
    }
    
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

// Edit a note
function editNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes[index];

    noteTitle.value = note.title.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    noteBody.value = note.body;
    editIndex = index; // Set the index to edit mode
}

// Delete a note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const confirmDelete = confirm("Are you sure you want to delete this note?");

  if (confirmDelete) {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      displayNotes();
  }
}

// Welcome text based on time of day
function displayWelcome() {
    const welcomeText = document.getElementById("welcome-text");
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    let hour = new Date().getHours();

    // Check if the page has just loaded
    if (!welcomeText.classList.contains("loaded")) {
        if (notes.length === 0) {
            // Show welcome text if there are no notes
            welcomeText.innerHTML = '<span class="gradient-welcome">Welcome to Newthings Notes</span>';
            welcomeText.classList.add("loaded");
        } else {
            // Display time-based greeting if notes exist
            if (hour > 4 && hour < 12) {
                welcomeText.innerHTML = "Good morning ☀️";
            } else if (hour < 17) {
                welcomeText.innerHTML = "Good afternoon 📝";
            } else if (hour < 19) {
                welcomeText.innerHTML = "Good evening 🌇";
            } else {
                welcomeText.innerHTML = "Good evening 🌙";
            }
        }
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

// Sanitize note body except for <b>, <i>, <u>
function sanitizeNoteBody(body) {
    return body
        .replace(/<(?!\/?(b|i|u)\b)[^>]*>/g, "")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&lt;b&gt;/g, "<b>")
        .replace(/&lt;\/b&gt;/g, "</b>")
        .replace(/&lt;i&gt;/g, "<i>")
        .replace(/&lt;\/i&gt;/g, "</i>")
        .replace(/&lt;u&gt;/g, "<u>")
        .replace(/&lt;\/u&gt;/g, "</u>");
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

// Select elements
const deleteAllNotesBtn = document.getElementById("delete-all-notes");

// Event listener for deleting all notes
deleteAllNotesBtn.addEventListener("click", function() {
    if (prompt("WARNING: This will delete ALL of your notes. This action is irreversible. To confirm, type \"DELETE\" in all caps.") == "DELETE") {
        localStorage.removeItem("notes");
        alert("Notes cleared successfully.");
        displayWelcome();
        displayNotes(); // Update display after deletion
    }
});
