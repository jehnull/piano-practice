/** 
 * PIANO NOTE GAME : 
 * Player has to press the correct note on their MIDI device.
 * 
**/

let targetNote = 60
let numOfLvls = 0;
let numOfCorrect = 0;

// Check if the checkbox of allowing Octave numbers is checked
function checkCheckBox(input) {
    const checkboxd = document.getElementById('checkboxOctave');
    checkBoxGame(input, checkboxd)

    checkboxd.addEventListener('change', function () {
        input.removeEventListener('midimessage', startNoteGameWithOctaves);
        input.removeEventListener('midimessage', startNoteGame);
        checkBoxGame(input, checkboxd)
    });
}

// Play the right game based on checkbox marking + reset the game
function checkBoxGame(input, checkboxd) {
    if (checkboxd.checked) {
        input.addEventListener('midimessage', startNoteGameWithOctaves);
    } else {
        input.addEventListener('midimessage', startNoteGame);
    }
    reset();
}

// Reset the game if settings is changed
function reset() {
    targetNote = 60;
    numOfLvls = 0;
    numOfCorrect = 0;

    const noteDisplay = document.getElementById('note-display');
    const messageDisplay = document.getElementById('message');
    const playerScore = document.getElementById('score');

    noteDisplay.textContent = `...`;
    messageDisplay.textContent = "Press Middle C to begin!";
    playerScore.textContent = "0/0";
}

// Future note: how to combine both game functions, dupe lines
// Note game with no octave just the note name: C, D, E, etc.
function startNoteGame(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    const noteDisplay = document.getElementById('note-display');
    const messageDisplay = document.getElementById('message');
    const playerScore = document.getElementById('score');

    const translatedTargetNote = Tonal.Note.pitchClass(Tonal.Note.fromMidi(targetNote));
    const translatedPlayerNote = Tonal.Note.pitchClass(Tonal.Note.fromMidi(note));
    noteDisplay.textContent = translatedTargetNote;

    switch (command) {
        case 144: //noteOn
            if (velocity > 0) {
                //console.log("PRESSED: ", translatedPlayerNote);
                if (translatedTargetNote === translatedPlayerNote) {
                    messageDisplay.textContent = "Correct!";
                    numOfCorrect++;

                    targetNote = getRandomNote(21, 108);
                    noteDisplay.textContent = Tonal.Note.pitchClass(Tonal.Note.fromMidi(targetNote));
                }
                else {
                    messageDisplay.textContent = "Try again! You played: " + translatedPlayerNote;
                }
                numOfLvls++;
                playerScore.textContent = `${numOfCorrect}/${numOfLvls}`;
            }
            else {
                //console.log("PRESSED: ", translatedPlayerNote);
            }
            break;
        case 128: //noteOff
            break;
    }
}

// Note game with octaves: G2, Ab5, etc.
function startNoteGameWithOctaves(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    const noteDisplay = document.getElementById('note-display');
    const messageDisplay = document.getElementById('message');
    const playerScore = document.getElementById('score');
    noteDisplay.textContent = `${Tonal.Note.fromMidi(targetNote)}`;

    switch (command) {
        case 144: //noteOn
            if (velocity > 0) {
                //console.log("PRESSED: ", Tonal.Note.fromMidi(note));
                if (note === targetNote) {
                    messageDisplay.textContent = "Correct!";
                    numOfCorrect++;

                    targetNote = getRandomNote(21, 108);
                    noteDisplay.textContent = `${Tonal.Note.fromMidi(targetNote)}`;
                }
                else {
                    messageDisplay.textContent = "Try again! You played: " + Tonal.Note.fromMidi(note);
                }
                numOfLvls++;
                playerScore.textContent = `${numOfCorrect}/${numOfLvls}`;
            }
            else {
                //console.log("RELEASED: ", Tonal.Note.fromMidi(note));
            }
            break;
        case 128: //noteOff
            break;
    }
}

// Get a random note
// 21 is A0, 108 is C8
function getRandomNote(lowestNote, highestNote) {
    return Math.floor(Math.random() * (highestNote - lowestNote + 1) + lowestNote);
}

/** MIDI CHECK **/
// Check if browser supports MIDI first
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(MIDIsuccess, MIDIfail);
}

// If requestMIDIAccess returns success
function MIDIsuccess(midiAccess) {
    console.log('MIDI Connected!');

    const inputs = midiAccess.inputs;

    inputs.forEach((input) => {
        checkCheckBox(input);
    })
}

// If requestMIDIAccess returns any failures
function MIDIfail() {
    console.log('Could not connect MIDI');
}

