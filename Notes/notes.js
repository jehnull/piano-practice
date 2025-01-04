/** PIANO NOTE GAME : Player has to press the correct note on their MIDI device.**/

let targetNote = 60
let numOfLvls = 0;
let numOfCorrect = 0; 

function startNoteGame(input){
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    const noteDisplay = document.getElementById('note-display');
    const messageDisplay = document.getElementById('message');
    const playerScore = document.getElementById('score');
    noteDisplay.textContent = `${Tonal.Note.fromMidi(targetNote)}`;

    switch (command) {
        case 144: //noteOn
            if(velocity > 0){
                console.log("PRESSED: ", Tonal.Note.fromMidi(note));
                if(note === targetNote){
                    messageDisplay.textContent = "Correct!";
                    numOfCorrect++;
                    
                    targetNote = getRandomNote(21,108);
                    noteDisplay.textContent = `${Tonal.Note.fromMidi(targetNote)}`;
                }
                else{
                    messageDisplay.textContent = "Try again! You played: " + Tonal.Note.fromMidi(note);
                }
                numOfLvls++;
                playerScore.textContent = `${numOfCorrect}/${numOfLvls}`;
            }
            else{
                console.log("RELEASED: ", Tonal.Note.fromMidi(note));
            }
        break;
        case 128: //noteOff
            break;
    }
}

function getRandomNote(lowestNote, highestNote) {
    return Math.floor(Math.random() * (highestNote - lowestNote + 1) + lowestNote);
}


/** MIDI CHECK **/
//check if browser supports MIDI first
if(navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(MIDIsuccess, MIDIfail);
}

//if requestMIDIAccess returns good
function MIDIsuccess(midiAccess){
    console.log(midiAccess);
    console.log('MIDI Connected!');

    //grab the MIDI input, so the device
    const inputs = midiAccess.inputs;
    console.log("inputs: ", inputs)

    inputs.forEach((input) => {
        console.log(input);
        input.addEventListener('midimessage', startNoteGame);
    })
}

//if requestMIDIAccess returns any failures
function MIDIfail() {
    console.log('Could not connect MIDI');
}

