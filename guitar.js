import { scalesData } from './scalesData.js';
import { library } from './library.js';


(function() {
    const keysButtons = new Array();
  keysButtons[0] = document.querySelector('.cKey-btn');
  keysButtons[1] = document.querySelector('.fKey-btn');
  keysButtons[2] = document.querySelector('.bbKey-btn');
  keysButtons[3] = document.querySelector('.ebKey-btn');
  keysButtons[4] = document.querySelector('.abKey-btn');
  keysButtons[5] = document.querySelector('.dbKey-btn');
  keysButtons[6] = document.querySelector('.gKey-btn');
  keysButtons[7] = document.querySelector('.dKey-btn');
  keysButtons[8] = document.querySelector('.aKey-btn');
  keysButtons[9] = document.querySelector('.eKey-btn');
  keysButtons[10] = document.querySelector('.bKey-btn');
  keysButtons[11] = document.querySelector('.fsKey-btn');
  keysButtons[12] = document.querySelector('.csKey-btn');
  
  const scaleText = document.querySelector('.scale-results');
  const scaleDefinitionText = document.querySelector('.scale-results-definition');
  const root = document.documentElement;
  const fretboard = document.querySelector('.fretboard1');
  const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleFretMarkPositions = [12, 24];
  const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const instrumentTuningPresets = {
    'Guitar (6 strings)': [4, 11, 7, 2, 9, 4]
  };
  
  let accidentals = 'flats';
  let selectedInstrument = 'Guitar (6 strings)';
  let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
  let numberOfFrets = 24; // Number of frets on the guitar
  
  let scaleResultsString = '';
  let currentScaleNotes = []; // Store the current scale notes
  
  function showTypeBtns () {
    document.getElementById("type-btn").style.display = "block";
  }
  
  function updateNumberOfFrets(newNumberOfFrets) {
    // Update the global variable
    numberOfFrets = newNumberOfFrets;

    // Get the fretboard1 element
    const fretboard = document.getElementById('fretboard1');

    // Remove any existing fretboard size classes
    fretboard.classList.remove('fretboard-5', 'fretboard-12', 'fretboard-24');

    // Add the new class based on the number of frets
    fretboard.classList.add(`fretboard-${newNumberOfFrets}`);

    // Regenerate the fretboard with the updated number of frets
    setupFretboard(currentScaleNotes);
}

  // Attach to the global `window` object
  window.updateNumberOfFrets = updateNumberOfFrets;

  function setupFretboard(scaleNotes) {
    //console.log('Generating fretboard with scale notes:', scaleNotes); // Debugging
  
    fretboard.innerHTML = ''; // Clear existing fretboard
    root.style.setProperty('--number-of-strings', numberOfStrings);
  
    // Add fret number row
    const fretNumberRow = document.createElement('div');
    fretNumberRow.classList.add('fret-number-row');
    for (let fret = 0; fret <= numberOfFrets; fret++) {
        const fretNumber = document.createElement('div');
        fretNumber.classList.add('fret-number');
        fretNumber.textContent = fret === 0 ? 'Open' : fret; // Leave the first column empty for the nut
        fretNumberRow.appendChild(fretNumber);
    }
    fretboard.appendChild(fretNumberRow);
  
    // Add strings to the fretboard
    for (let i = 0; i < numberOfStrings; i++) {
      const string = createStringElement();
      fretboard.appendChild(string);
  
      for (let fret = 0; fret <= numberOfFrets; fret++) {
          const noteFret = createNoteFretElement(i, fret, scaleNotes);
          string.appendChild(noteFret);
      }
  }
  
  /**
   * Creates a string element for the fretboard.
   * @returns {HTMLElement} The string element.
   */
  function createStringElement() {
      const string = document.createElement('div');
      string.classList.add('sg-string');
      return string;
  }
  
  /**
   * Creates a note fret element for a specific string and fret.
   * @param {number} stringIndex - The index of the string.
   * @param {number} fret - The fret number.
   * @param {Array} scaleNotes - The notes in the selected scale.
   * @returns {HTMLElement} The note fret element.
   */
  function createNoteFretElement(stringIndex, fret, scaleNotes) {
      const noteFret = document.createElement('div');
      noteFret.classList.add('sg-note-fret');
  
      const noteName = generateNoteNames(fret + instrumentTuningPresets[selectedInstrument][stringIndex], accidentals);
      noteFret.setAttribute('data-note', noteName);

      //console.log("Note Name:", noteName); // Debugging
      //console.log("Scale Notes:", scaleNotes); // Debugging

  
      // Add single fret marks
      if (stringIndex === 0 && singleFretMarkPositions.includes(fret)) {
          noteFret.classList.add('sg-single-fretmark');
      }
  
      // Add double fret marks
      if (stringIndex === 0 && doubleFretMarkPositions.includes(fret)) {
          const doubleFretMark = tools.createElement('div');
          doubleFretMark.classList.add('sg-double-fretmark');
          noteFret.appendChild(doubleFretMark);
      }
  
      // Highlight notes in the scale
      if (scaleNotes.includes(noteName)) {
          highlightNoteFret(noteFret, noteName, scaleNotes);
      }
  
      return noteFret;
  }
  
  /**
   * Highlights a note fret element based on its role in the scale.
   * @param {HTMLElement} noteFret - The note fret element.
   * @param {string} noteName - The name of the note.
   * @param {Array} scaleNotes - The notes in the selected scale.
   */
  function highlightNoteFret(noteFret, noteName, scaleNotes) {
      noteFret.classList.add('highlighted');
      noteFret.style.setProperty('--noteDotOpacity', 1); // Explicitly set the opacity
  
      // Set background color for the root note
      if (noteName.trim().toLowerCase() === scaleNotes[0].trim().toLowerCase()) {
          noteFret.style.backgroundColor = '#56d62d'; // Green background for the root note
      }
  
      /* // Set background color for the third note in the scale
      if (scaleNotes.length >= 7 && noteName.trim().toLowerCase() === scaleNotes[2].trim().toLowerCase()) {
          noteFret.style.backgroundColor = '#d142f5'; // Purple background for the third note
      } */
  }
  }


  
  const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
  
    }
  }
  
  function generateNoteNames(noteIndex, accidentals) {
    noteIndex = noteIndex % 12;

    // Check if scaleResultsString contains sharp or flat notes
    if (scaleResultsString.includes('#')) {
        accidentals = 'sharps'; // Update accidentals to sharps
    } else if (scaleResultsString.includes('b')) {
        accidentals = 'flats'; // Update accidentals to flats
    }

    // Get the appropriate note based on accidentals
    let noteName = accidentals === 'sharps' ? notesSharp[noteIndex] : notesFlat[noteIndex];

    // Handle special cases for enharmonic equivalents
    if (scaleResultsString.includes('B Lydian') && noteName === 'F') {
        noteName = 'E#'; // Replace F with E# for B Lydian
    }

    if (scaleResultsString.includes('D Harmonic Minor') || scaleResultsString.includes('G Melodic Minor')) {
      if( noteName === 'A#') {
        noteName = 'Bb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('G Harmonic Minor')) {
      if(noteName === 'A#') {
        noteName = 'Bb'; // Replace Db with C# for D Harmonic Minor
      }
      if(noteName === 'D#') {
        noteName = 'Eb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Db Aeolian')) {
      if(noteName === 'A') {
        noteName = 'Bbb'; // Replace Db with C# for D Harmonic Minor
      }
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Db Min Pentatonic') ||
    scaleResultsString.includes('Db Dorian') ||
    scaleResultsString.includes('Db Mixolydian') ||
    scaleResultsString.includes('Bb Phrygian') ||
    scaleResultsString.includes('Eb Phrygian') ||
    scaleResultsString.includes('Eb Aeolian') ||
    scaleResultsString.includes('Eb Harmonic Minor') ||
    scaleResultsString.includes('Ab Dorian') ||
    scaleResultsString.includes('Ab Aeolian') ||
    scaleResultsString.includes('Ab Melodic Minor') ||
    scaleResultsString.includes('Ab Harmonic Minor') ||
    scaleResultsString.includes('F Locrian')) {
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Db Locrian')) {
      if (noteName === 'D') {
          noteName = 'Ebb'; // Replace D with Ebb for Db Locrian
      }
      if (noteName === 'G') {
          noteName = 'Abb'; // Replace G with Abb for Db Locrian
      }
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Db Locrian
      }
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Db Phrygian')) {
      if (noteName === 'D') {
          noteName = 'Ebb'; // Replace D with Ebb for Db Locrian
      }
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Db Locrian
      }
    }

    if (scaleResultsString.includes('Ab Phrygian')) {
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Ab Phrygian or Db Harmonic Minor
      }
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Db Harmonic Minor')) {
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Ab Phrygian or Db Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Ab Locrian')) {
      if (noteName === 'D') {
          noteName = 'Ebb'; // Replace D with Ebb for Ab Locrian
      }
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Ab Locrian
      }
      if(noteName === 'B') {
        noteName = 'Cb'; // Replace Db with C# for D Harmonic Minor
      }
    }

    if (scaleResultsString.includes('Eb Locrian')) {
      if (noteName === 'B') {
          noteName = 'Cb'; // Replace D with Ebb for Ab Locrian
      }
      if (noteName === 'A') {
          noteName = 'Bbb'; // Replace A with Bbb for Ab Locrian
      }
    }

    return noteName;
}
  
  keysButtons.forEach((button, index) => {
    const { major, minor } = scalesData[index];

    button.addEventListener('click', () => {
        showTypeBtns(); // Show the type buttons container
        setupFretboard([]); // Clear the fretboard before displaying new notes

        // Update the message and clear scale results
        updateMessage(scalesData[index].key);

        // Add event listeners for major and minor buttons
        const typeBtnContainer = document.getElementById('type-btn');
        const majBtn = document.querySelector('.major-btn');
        const minBtn = document.querySelector('.minor-btn');

        if (!majBtn || !minBtn) {
            console.error("Major or Minor buttons are missing.");
            return;
        }

        // Show the buttons when a key is selected
        typeBtnContainer.style.display = 'block';

        majBtn.addEventListener('click', () => handleScaleSelection(major));
        minBtn.addEventListener('click', () => handleScaleSelection(minor));
    });
});
  
  /**
  * Updates the message element and clears the scale results.
  * @param {string} key - The selected key.
  */
  function updateMessage(key) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = `You selected the key of: ${key}`;
    scaleText.textContent = ''; // Clear the scale-results element
  }
  
  /**
  * Handles the selection of a scale (major or minor).
  * @param {Array} scaleArray - The array of scales (major or minor).
  */
  function handleScaleSelection(scaleArray) {
    const scaleResultsElement = document.getElementById("scale-results");
    scaleResultsElement.style.display = "block";
  
    // Select a random scale and update scaleResultsString
    scaleResultsString = scaleArray[Math.floor(Math.random() * scaleArray.length)];
    scaleText.textContent = scaleResultsString;
    console.log("Selected Scale:", scaleResultsString);
  
    // Extract notes from scaleResultsString and update the fretboard
    currentScaleNotes = scaleResultsString.split(': ')[1].split(' - ');
    setupFretboard(currentScaleNotes);

    // Update scaleDefinitionText if scaleText includes a key from library.js
    let found = false;
    const scaleTextLower = scaleText.textContent.toLowerCase();
    const keysSorted = Object.keys(library).sort((a, b) => b.length - a.length);

    for (const key of keysSorted) {
    // Create a regex to match the key as a whole word, case-insensitive
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(scaleText.textContent)) {
        scaleDefinitionText.textContent = library[key];
        found = true;
        break;
    }
  }
  if (!found) {
    scaleDefinitionText.textContent = '';
  }
  };
  
  })();