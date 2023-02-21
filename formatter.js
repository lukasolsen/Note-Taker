// Listen for click event on the save note button
const noteButton = document.querySelector("#note-button");
const noteInput = document.querySelector("#note-input");
const notesContainer = document.querySelector("#notes-container");
const noteAlert = document.querySelector('#note-alert');
let notes = [];
noteButton.addEventListener("click", handleNoteButtonClick);

// Load saved notes from local storage
loadNotes();

// Handle click event on the save note button
function handleNoteButtonClick() {
  const text = noteInput.value.trim();
  if (text.length > 0) {
    const randomColor = getRandomColor();
    const note = createNoteElement(text, randomColor);
    notesContainer.appendChild(note);
    saveNotes();
    noteInput.value = "";
  }
}

// Create note element
function createNoteElement(text, color) {
  const note = document.createElement("div");
  note.classList.add("note");
  note.style.backgroundColor = color;
  note.innerText = text;
  const deleteButton = createButtonElement("bi bi-trash", handleDeleteButtonClick);
  note.appendChild(deleteButton);
  const infoButton = createButtonElement("bi bi-info-circle", handleInfoButtonClick);
  note.appendChild(infoButton);
  const downloadButton = createButtonElement("bi bi-download", handleDownloadButtonClick);
  note.appendChild(downloadButton);
  const speakerButton = createButtonElement("bi bi-volume-up", handleSpeakerButtonClick);
  note.appendChild(speakerButton);
  return note;
}

// Create button element
function createButtonElement(iconClass, clickHandler) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-light", "mx-2");
  const icon = document.createElement("i");
  icon.classList.add(iconClass);
  button.appendChild(icon);
  button.addEventListener("click", clickHandler);
  return button;
}

// Handle click event on the delete button
function handleDeleteButtonClick(event) {
  const note = event.target.closest(".note");
  notesContainer.removeChild(note);
  saveNotes();
}

// Handle click event on the info button
function handleInfoButtonClick(event) {
  const note = event.target.closest(".note");
  alert(`Note created on ${note.dataset.timestamp}`);
}

// Handle click event on the download button
function handleDownloadButtonClick(event) {
  const note = event.target.closest(".note");
  const fileName = `note-${note.dataset.timestamp}.txt`;
  const fileContents = note.innerText;
  downloadFile(fileName, fileContents);
}

// Handle click event on the speaker button
function handleSpeakerButtonClick(event) {
  const note = event.target.closest(".note");
  speak(note.innerText);
}

// Download a file with the given name and contents
function downloadFile(fileName, contents) {
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`);
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Speak the given text
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

// Get a random color
function getRandomColor() {
  const colors = [
    "#4b4b4b",
    "#e67e22",
    "#9b59b6",
    "#3498db",
    "#1abc9c",
    "#e74c3c",
    "#f1c40f",
  ];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

// Load saved notes from local
//storage
function loadNotes() {
    const notess = JSON.parse(localStorage.getItem("notes")) || [];
    notess.forEach((note) => {
        createNoteElement(note);
    });
    notes = notess;
}

// Save notes to local storage
function saveNotes(text, color) {
        notes.push({ text, color });
        localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNote(index) {
    // Remove the note from the notes array
    notes.splice(index, 1);
  
    // Update the local storage with the new notes array
    localStorage.setItem("notes", JSON.stringify(notes));
  }

// Handle click event on the save note button
function handleNoteButtonClick() {
    const text = noteInput.value.trim();
    if (text.length > 0) {
        const randomColor = getRandomColor();
        noteAlert.classList.remove("d-none");
        noteAlert.style.backgroundColor = randomColor;

        noteInput.value = "";
        createNoteElement({ text, color: randomColor });
        saveNotes(text, randomColor);

        setTimeout(function() {
            noteAlert.classList.add("d-none");
        }, 1500);
    }
}

// Create a new note element
function createNoteElement(note) {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");
    noteElement.style.backgroundColor = note.color;
    
    const textElement = document.createElement("div");
    textElement.classList.add("note-text");
    textElement.innerText = note.text;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button", "btn");
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.addEventListener("click", handleDeleteButtonClick);
    
    const playButton = document.createElement("button");
    playButton.classList.add("play-button", "btn");
    playButton.innerHTML = '<i class="bi bi-play-circle"></i>';
    playButton.addEventListener("click", handlePlayButtonClick);
    
    const infoButton = document.createElement("button");
    infoButton.classList.add("info-button", "btn");
    infoButton.innerHTML = '<i class="bi bi-info-circle"></i>';
    infoButton.addEventListener("click", handleInfoButtonClick);
    buttonContainer.append(deleteButton, playButton, infoButton);
    noteElement.append(textElement, buttonContainer);
    
    const notesContainer = document.querySelector("#notes-container");
    notesContainer.append(noteElement);
}

// We need a HEX color for the deletion of a note
function rgbToHex(rgb) {
    // Convert the "rgb(r, g, b)" string to an array of the individual color values
    const colorValues = rgb.slice(4, -1).split(",").map(value => parseInt(value.trim()));
    
    // Convert each color value to a 2-digit hexadecimal string
    const hexValues = colorValues.map(value => {
      const hex = value.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    });
    
    // Combine the 3 hexadecimal color values into a single string
    return "#" + hexValues.join("");
}

// Handle click event on the delete button
function handleDeleteButtonClick(event) {
    const note = event.target.closest(".note");
    const index = notes.findIndex((n) => n.text === note.querySelector(".note-text").textContent && n.color === rgbToHex(note.style.backgroundColor));
    if (index !== -1) {
      deleteNote(index);
      note.remove();
    } else {
      alert("Error: Note not found in array.");
    }
}
  

// Handle click event on the play button
function handlePlayButtonClick(event) {
    const utterance = new SpeechSynthesisUtterance();

    const note = event.target.closest(".note");
    const text = note.querySelector(".note-text").innerText;
    utterance.text = text;
    //utterance.lang = "en-US"; // Used if you want to select custom language.
    speechSynthesis.speak(utterance);
}

// Handle click event on the info button
function handleInfoButtonClick(event) {
    const note = event.target.closest(".note");
    const text = note.querySelector(".note-text").innerText;
    alert(text);
}

noteButton.addEventListener("click", handleNoteButtonClick);