/**
 * SCALE GAME :
 * A Key and Scale type is displayed and the user
 * has to play any notes within the scale within 30 seconds
 */

/* Tonal.js TESTS
//console.log(Tonal.Key.majorKey("C#").scale);
//console.log(Tonal.Key.minorKey("G").harmonic.scale);
//console.log(Tonal.ScaleType.names());
//console.log(Tonal.Note.fromMidi(60)); //C4
//console.log(Tonal.Note.fromMidi(71)); //B4


console.log("C: ", Tonal.Key.majorKey("B").scale);
console.log("C: ", convertEnharmonic(Tonal.Key.majorKey("B").scale));

console.log("MINOR NATURAL : ")
console.log("C: ", Tonal.Key.minorKey("C").natural.scale);
console.log("Db: ", Tonal.Key.minorKey("Db").natural.scale);
console.log("Db: ", convertEnharmonic(Tonal.Key.minorKey("Db").natural.scale));
console.log("D: ", Tonal.Key.minorKey("D").natural.scale);
console.log("Eb: ", Tonal.Key.minorKey("Eb").natural.scale);
console.log("E: ", Tonal.Key.minorKey("E").natural.scale);
console.log("F: ", Tonal.Key.minorKey("F").natural.scale);
console.log("Gb: ", Tonal.Key.minorKey("C").natural.scale);
console.log("G: ", Tonal.Key.minorKey("G").natural.scale);
console.log("Ab: ", Tonal.Key.minorKey("Ab").natural.scale);
console.log("A: ", Tonal.Key.minorKey("A").natural.scale);
console.log("Bb: ", Tonal.Key.minorKey("Bb").natural.scale);
console.log("B: ", Tonal.Key.minorKey("B").natural.scale);

console.log("MINOR HARMONIC : ")
console.log("C: ", Tonal.Key.minorKey("C").harmonic.scale);
console.log("Db: ", Tonal.Key.minorKey("Db").harmonic.scale);
console.log("D: ", Tonal.Key.minorKey("D").harmonic.scale);
console.log("Eb: ", Tonal.Key.minorKey("Eb").harmonic.scale);
console.log("E: ", Tonal.Key.minorKey("E").harmonic.scale);
console.log("F: ", Tonal.Key.minorKey("F").harmonic.scale);
console.log("Gb: ", Tonal.Key.minorKey("C").harmonic.scale);
console.log("G: ", Tonal.Key.minorKey("G").harmonic.scale);
console.log("Ab: ", Tonal.Key.minorKey("Ab").harmonic.scale);
console.log("A: ", Tonal.Key.minorKey("A").harmonic.scale);
console.log("Bb: ", Tonal.Key.minorKey("Bb").harmonic.scale);
console.log("B: ", Tonal.Key.minorKey("B").harmonic.scale);

console.log("MINOR MELODIC : ")
console.log("C: ", Tonal.Key.minorKey("C").melodic.scale);
console.log("Db: ", Tonal.Key.minorKey("Db").melodic.scale);
console.log("D: ", Tonal.Key.minorKey("D").melodic.scale);
console.log("Eb: ", Tonal.Key.minorKey("Eb").melodic.scale);
console.log("E: ", Tonal.Key.minorKey("E").melodic.scale);
console.log("F: ", Tonal.Key.minorKey("F").melodic.scale);
console.log("Gb: ", Tonal.Key.minorKey("C").melodic.scale);
console.log("G: ", Tonal.Key.minorKey("G").melodic.scale);
console.log("Ab: ", Tonal.Key.minorKey("Ab").melodic.scale);
console.log("A: ", Tonal.Key.minorKey("A").melodic.scale);
console.log("Bb: ", Tonal.Key.minorKey("Bb").melodic.scale);
console.log("B: ", Tonal.Key.minorKey("B").melodic.scale);
*/

let wrongNotesList = [];
let randomKey = null;
let selectedScaleType = null;

// Scale Game
function startScalesGame(input) {
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];

  const gameContainer = document.getElementById("game-container");
  const wrongNotes = document.getElementById("wrong-notes");
  const notesList = document.getElementById("current-notes");

  switch (command) {
    case 144: //noteOn
      if (velocity > 0) {
        let correctScale = "";
        const currentNote = Tonal.Note.pitchClass(Tonal.Note.fromMidi(note));
        let currentNotesList = [];
        currentNotesList.push(currentNote);
        notesList.textContent = currentNotesList;

        if (["harmonic", "melodic", "natural"].includes(selectedScaleType)) {
          // minor key
          correctScale = convertEnharmonic(Tonal.Key.minorKey(randomKey)[selectedScaleType].scale);
          updateNotesList(correctScale, currentNote, wrongNotes, notesList, gameContainer);
        } 
        else {
          //major
          correctScale = convertEnharmonic(Tonal.Key.majorKey(randomKey).scale);
          updateNotesList(correctScale, currentNote, wrongNotes, notesList, gameContainer);
        }
      }
      break;
    case 128: //noteOff
      break;
  }
}

// Update the wrong notes list and change color of note based on wrong (red) or right (green)
function updateNotesList(correctScale, currentNote, wrongNotes, notesList, gameContainer) {
  if (correctScale.includes(currentNote)) {
    notesList.classList.remove("text-danger");
    notesList.classList.add("text-success");
    gameContainer.classList.remove("bg-danger");
    gameContainer.classList.add("bg-success");
  } 
  else {
    wrongNotesList.push(" " + currentNote);
    wrongNotes.textContent = wrongNotesList;
    notesList.classList.remove("text-success");
    notesList.classList.add("text-danger");
    gameContainer.classList.remove("bg-success");
    gameContainer.classList.add("bg-danger");
  }
}




// Get the user selected scale type
function getSelectedScaleType() {
  const selectedRadio = document.querySelector(
    'input[name="btnradio"]:checked'
  );
  return selectedRadio.value;
}

// Get the user selected key(s)
function getSelectedKey() {
  const selectedCheckboxes = document.querySelectorAll(
    'input[name="key"]:checked'
  );
  const selectedValues = Array.from(selectedCheckboxes).map(
    (checkbox) => checkbox.value
  );
  return selectedValues;
}

// Select a random key from the selection the user picked
function getRandomKey() {
  const selectedValues = getSelectedKey();
  const randomKey =
    selectedValues[Math.floor(Math.random() * selectedValues.length)];
  return randomKey;
}

// Convert the selected scale's notes to the right enharmonic for matching to user input
function convertEnharmonic(scale) {
  scale.forEach((element, index, array) => {
    if (element.includes("bb") || element.includes("#")) {
      array[index] = Tonal.Note.enharmonic(element);
    }
  });
  return scale;
}

/** MIDI CHECK **/
//check if browser supports MIDI first
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(MIDIsuccess, MIDIfail);
}

//if requestMIDIAccess returns good
function MIDIsuccess(midiAccess) {
  console.log("MIDI Connected!");

  //grab the MIDI input, so the device
  const inputs = midiAccess.inputs;

  inputs.forEach((input) => {
    console.log("MIDI Connected:", input.name);

    const timeCount = document.getElementById("timer-count");
    const scaleDisplay = document.getElementById("scale-display");
    const scaleTypeDisplay = document.getElementById("scale-type-display");
    const wrongNotes = document.getElementById("wrong-notes");

    let countdown = 6;

    function makeAlert() {
      if (countdown > 0) {
        countdown--;
        timeCount.textContent = countdown;
      } 
      else {
        countdown = 31;
        randomKey = getRandomKey();
        selectedScaleType = getSelectedScaleType();
        scaleDisplay.textContent = randomKey;
        scaleTypeDisplay.textContent = selectedScaleType;
        wrongNotes.textContent = [];
        wrongNotesList = [];
        input.addEventListener("midimessage", startScalesGame);
      }
    }
    setInterval(makeAlert, 1000);
  });
}

//if requestMIDIAccess returns any failures
function MIDIfail() {
  console.log("Could not connect MIDI");
}
