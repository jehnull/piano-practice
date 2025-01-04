//check if browser supports MIDI first
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(MIDIsuccess, MIDIfail);
}
else {
    const noMIDIBrowser = document.getElementById('noMIDIBrowser');
    document.getElementById("noBrowser").innerHTML = "AYYY";
    noMIDIBrowser.classList.remove('d-none');
}

//if requestMIDIAccess returns success
function MIDIsuccess(midiAccess) {
  console.log(midiAccess);
  console.log("MIDI Connected!");

  const inputs = midiAccess.inputs;
  console.log("inputs: ", inputs);

  inputs.forEach((input) => {
    document.getElementById("midiDeviceName").innerHTML = input.name;
    console.log(input.name);
  });
}

console.log(Tonal.Chord.detect(["D", "F#", "A", "C"])); // => ["D7"]
console.log(Tonal.Chord.detect(["F#", "A", "C", "D"])); // => ["D7/F#"]

//if requestMIDIAccess returns any failures
function MIDIfail() {
  console.log('Could not connect MIDI');
  const midiAlert = document.getElementById('midiFailAlert');
  midiAlert.classList.remove('d-none');
}
