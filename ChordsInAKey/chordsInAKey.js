
let randomRoman = null;
let romanIndex = null;
let randomKey = null;
let randomKeyType = null;
const romanNums = ["I","II","III","IV","V","VI","VII"];

function startScalesGame() {

    const romanDisplay = document.getElementById("roman-display");
    const keyDisplay = document.getElementById("key-display");
    const correctChord = document.getElementById("correct-chord");
    
    randomRoman = getRandomRoman();
    romanIndex = romanNums.indexOf(randomRoman);
    randomKey = getRandomKey();
    randomKeyType = getRandomKeyType();
    let randomKeyTypeShort = ""

    if (randomKeyType === "Major") {
        keyDisplay.classList.remove("text-warning");
        keyDisplay.classList.add("text-info");
        randomKeyTypeShort = "Maj"
    }
    else {
        keyDisplay.classList.remove("text-info");
        keyDisplay.classList.add("text-warning");
        randomKeyTypeShort = "m"
    }

    correctChord.textContent = "";
    romanDisplay.textContent = randomRoman;
    keyDisplay.textContent = randomKey + randomKeyTypeShort;


}

function getAnswer() {
    const scaleChords = Tonal.Mode.seventhChords(randomKeyType, randomKey);
    const correctChord = document.getElementById("correct-chord");

    correctChord.textContent = scaleChords[romanIndex];
}

function getRandomRoman() {
    return romanNums[Math.floor(Math.random() * romanNums.length)];
}   

// Get the user selected triad type
function getSelectedKeyType() {
    const keyType = document.querySelectorAll(
        'input[name="keyType"]:checked'
    );
    const selectedKeyType = Array.from(keyType).map(
        (checkbox) => checkbox.value
    );
    return selectedKeyType;
}

// Select a random triad type from the selection the user picked
function getRandomKeyType() {
    const selectedKeyType = getSelectedKeyType();
    const randomKeyType =
        selectedKeyType[Math.floor(Math.random() * selectedKeyType.length)];
    return randomKeyType;
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

// Select a random key from the selection the user picked
function getRandomKey() {
    const selectedKey = getSelectedKey();
    const randomKey =
        selectedKey[Math.floor(Math.random() * selectedKey.length)];
    return randomKey;
}

let countdown = 4;

function makeAlert() {
  const timeCount = document.getElementById("timer-count");

  if (countdown >= 1) {
    countdown--;
    timeCount.textContent = countdown;
  } 
  else if (countdown === 0) {
    getAnswer();
    countdown--;
  } 
  else {
    countdown = 6;
    startScalesGame();
  }
}

setInterval(makeAlert, 1400);
