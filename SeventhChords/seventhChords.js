/** 
 * PIANO TRIADS GAME : 
 * Player has to press the correct sevChord on their MIDI device.
 * major, minor, diminished, & augmented
 * all 12 keys
 * root chords only...
*/

console.log(Tonal.Chord.getChord("maj7", "C").symbol)
console.log(Tonal.Chord.getChord("min7", "C").symbol)
console.log(Tonal.Chord.getChord("7", "C").symbol)
console.log(Tonal.Chord.getChord("dim7", "C").symbol)
console.log(Tonal.Chord.getChord("m7b5", "C").symbol)

let pushedNotesList = [];
let sevChord = Tonal.Chord.notes("maj7", "C")
let numOfLvls = 1;
let correct7thChordPressed = false;

function start7thChordsGame(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    const sevChordDisplay = document.getElementById('sevChord-display');
    const messageDisplay = document.getElementById('message');
    const levelDisplay = document.getElementById('level');

    let randomRoot = getrandomRoot();
    let random7thChord = getRandom7thChordType();

    switch (command) {
        case 144: //noteOn
            if (velocity > 0) {
                noteOn(note, messageDisplay);
                convertEnharmonic(sevChord)

                if (removeOctaveNums(pushedNotesList).sort().toString() === sevChord.sort().toString()) {
                    //console.log("CORRECT")
                    if (!correct7thChordPressed) {
                        messageDisplay.textContent = "✅ CORRECT : " + sevChord;
                        sevChordDisplay.classList.add("text-success");
                        numOfLvls++;
                        correct7thChordPressed = true;

                        setTimeout(() => {
                            runNew7thChord(randomRoot, random7thChord, sevChordDisplay, levelDisplay);
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

// after getting a CORRECT sevChord, generate new sevChord and update sevChord displays text+color. 
// Also update level display and reset the correct7thChordPressed
function runNew7thChord(randomRoot, random7thChord, sevChordDisplay, levelDisplay) {
    sevChord = Tonal.Chord.notes(random7thChord.toLowerCase(), randomRoot)
    sevChordDisplay.textContent = randomRoot + random7thChord;
    sevChordDisplay.classList.remove("text-success");
    levelDisplay.textContent = "# " + numOfLvls;
    correct7thChordPressed = false;
}

// Convert the selected scale's notes to the right enharmonic for matching to user input
// had issues with 'bb' '#' and 'Cb' not getting read correctly from MIDI input
function convertEnharmonic(notes) {
    notes.forEach((element, index, array) => {
        if (element.includes("bb") || element.includes("#") || element.includes("Cb") || element.includes("Fb")) {
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

// Get the user selected sevChord type
function getSelected7thChordType() {
    const selectedTriadType = document.querySelectorAll(
        'input[name="sevChord"]:checked'
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

// Select a random sevChord type from the selection the user picked
function getRandom7thChordType() {
    const selectedTriadType = getSelected7thChordType();
    const random7thChord =
        selectedTriadType[Math.floor(Math.random() * selectedTriadType.length)];
    return random7thChord;
}

// Select a random key from the selection the user picked
function getrandomRoot() {
    const selectedKey = getSelectedKey();
    const randomRoot =
        selectedKey[Math.floor(Math.random() * selectedKey.length)];
    return randomRoot;
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
        input.addEventListener('midimessage', start7thChordsGame);
    })
}

//if requestMIDIAccess returns any failures
function MIDIfail() {
    console.log('Could not connect MIDI');
}
