/** 
 * PIANO TRIADS GAME : 
 * Player has to press the correct triad on their MIDI device.
 * major, minor, diminished, & augmented
 * all 12 keys
 * root chords only...
*/

let pushedNotesList = [];
let triad = Tonal.Chord.notes("major", "C")
let numOfLvls = 1;
let correctTriadPressed = false;

function startTriadsGame(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    const triadDisplay = document.getElementById('triad-display');
    const messageDisplay = document.getElementById('message');
    const levelDisplay = document.getElementById('level');

    let randomKey = getRandomKey();
    let randomTriad = getRandomTriadType();

    switch (command) {
        case 144: //noteOn
            if (velocity > 0) {
                noteOn(note, messageDisplay);
                convertEnharmonic(triad)

                if (removeOctaveNums(pushedNotesList).sort().toString() === triad.sort().toString()) {
                    //console.log("CORRECT")
                    if (!correctTriadPressed) {
                        messageDisplay.textContent = "✅ CORRECT : " + triad;
                        triadDisplay.classList.add("text-success");
                        numOfLvls++;
                        correctTriadPressed = true;

                        setTimeout(() => {
                            runNewTriad(randomKey, randomTriad, triadDisplay, levelDisplay);
                        }, 2000);
                    }
                }
                else {
                    //console.log("WRONG NOTES")
                    messageDisplay.textContent = removeOctaveNums(pushedNotesList) + "  (" + detectChord(removeOctaveNums(pushedNotesList)) + ")";
                }
            }
            else {
                noteOff(note, messageDisplay);
            }
            break;
        case 128: //noteOff
            noteOff(note, messageDisplay);
            break;
    }
}

// detect chord from a list of notes
function detectChord(pushedNotesList) {
    const detectedChord = Tonal.Chord.detect(pushedNotesList);
    // if (detectedChord.length == 0) {
    //     return " ";
    // }
    return detectedChord;
}

// after getting a CORRECT triad, generate new triad and update triad displays text+color. 
// Also update level display and reset the correctTriadPressed
function runNewTriad(randomKey, randomTriad, triadDisplay, levelDisplay) {
    triad = Tonal.Chord.notes(randomTriad.toLowerCase(), randomKey)
    triadDisplay.textContent = `${randomKey + " " + randomTriad}`;
    triadDisplay.classList.remove("text-success");
    levelDisplay.textContent = "# " + numOfLvls;
    correctTriadPressed = false;
}

// Convert the selected scale's notes to the right enharmonic for matching to user input
// had issues with 'bb' '#' and 'Cb' not getting read correctly from MIDI input
function convertEnharmonic(notes) {
    notes.forEach((element, index, array) => {
        if (element.includes("bb") || element.includes("#") || element.includes("Cb")) {
            array[index] = Tonal.Note.enharmonic(element);
        }
    });
    return notes;
}

// remove octave numbers from pushed notes list
function removeOctaveNums(translatedPushedNotesList) {
    return translatedPushedNotesList.map(note => Tonal.Note.pitchClass(note));
}

// note ON, what to do when a note is pressed. Push note to pushedNotesList and update display message
function noteOn(note, messageDisplay) {
    const pushedNote = Tonal.Note.fromMidi(note);
    pushedNotesList.push(pushedNote);
    messageDisplay.textContent = removeOctaveNums(pushedNotesList)
    //console.log(pushedNotesList)
}

// note OFF, what to do when a note is released. Remove the released note from pushedNotesList and update display message
function noteOff(note, messageDisplay) {
    const pushedNote = Tonal.Note.fromMidi(note);
    pushedNotesList.splice(pushedNotesList.indexOf(pushedNote), 1);
    messageDisplay.textContent = removeOctaveNums(pushedNotesList) + "  (" + detectChord(removeOctaveNums(pushedNotesList)) + ")";
    //console.log(pushedNotesList)
}

// Get the user selected triad type
function getSelectedTriadType() {
    const selectedTriadType = document.querySelectorAll(
        'input[name="triad"]:checked'
    );
    const selectedTriad = Array.from(selectedTriadType).map(
        (checkbox) => checkbox.value
    );
    return selectedTriad;
}

// Get the user selected key(s)
function getSelectedKey() {
    const selectedKey = document.querySelectorAll(
        'input[name="key"]:checked'
    );
    const selectedKeyValue = Array.from(selectedKey).map(
        (checkbox) => checkbox.value
    );
    return selectedKeyValue;
}

// Select a random triad type from the selection the user picked
function getRandomTriadType() {
    const selectedTriadType = getSelectedTriadType();
    const randomTriad =
        selectedTriadType[Math.floor(Math.random() * selectedTriadType.length)];
    return randomTriad;
}

// Select a random key from the selection the user picked
function getRandomKey() {
    const selectedKey = getSelectedKey();
    const randomKey =
        selectedKey[Math.floor(Math.random() * selectedKey.length)];
    return randomKey;
}



/** MIDI CHECK **/
//check if browser supports MIDI first
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(MIDIsuccess, MIDIfail);
}

//if requestMIDIAccess returns good
function MIDIsuccess(midiAccess) {
    console.log(midiAccess);
    console.log('MIDI Connected!');

    //grab the MIDI input, so the device
    const inputs = midiAccess.inputs;
    console.log("inputs: ", inputs)

    inputs.forEach((input) => {
        console.log(input);
        input.addEventListener('midimessage', startTriadsGame);
    })
}

//if requestMIDIAccess returns any failures
function MIDIfail() {
    console.log('Could not connect MIDI');
}

