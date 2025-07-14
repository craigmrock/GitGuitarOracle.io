import { scalesData } from './scalesData.js';
import { chordsData } from './chordsData.js';
import { library } from './library.js';


(function() {
  const chordText = document.querySelector('.chord-results1');
  const chordText2 = document.querySelector('.chord-results2');
  const chordText3 = document.querySelector('.chord-results3');
  const chordText4 = document.querySelector('.chord-results4');
  const scaleDefinitionText = document.querySelector('.scale-results-definition');
  const root = document.documentElement;
  const chordFretboard1 = document.querySelector('.vertical-fretboard1');
  const chordFretboard2 = document.querySelector('.vertical-fretboard2');
  const chordFretboard3 = document.querySelector('.vertical-fretboard3');
  const chordFretboard4 = document.querySelector('.vertical-fretboard4');
    
  const singleFretMarkPositions = [3, 5];
  const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const instrumentTuningPresets = {
    'Guitar (6 strings)': [4, 11, 7, 2, 9, 4]
  };
  
  let accidentals = 'flats';
  let selectedInstrument = 'Guitar (6 strings)';
  let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
  let numberOfFrets = 5; // Number of frets on the guitar
  
  
  
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

    // --- NEW CODE: Show chords for matching key ---
    // Extract the key name from the scaleResultsString (e.g., 'C Ionian')
    const keyName = scaleResultsString.split(':')[0].trim();
    // Find the matching key object in chordsData
    const keyObj = chordsData.find(obj => obj.key === keyName);
    if (keyObj && keyObj.I_IV_V_I) {
        // Show the chords in the I_IV_V_I progression
        const chords = keyObj.I_IV_V_I;
        if (chordFretboard1) chordFretboard1.textContent = chords[0] || '';
        if (chordFretboard2) chordFretboard2.textContent = chords[1] || '';
        if (chordFretboard3) chordFretboard3.textContent = chords[2] || '';
        if (chordFretboard4) chordFretboard4.textContent = chords[3] || '';
    } else {
        // Clear if not found
        if (chordFretboard1) chordFretboard1.textContent = '';
        if (chordFretboard2) chordFretboard2.textContent = '';
        if (chordFretboard3) chordFretboard3.textContent = '';
        if (chordFretboard4) chordFretboard4.textContent = '';
    }
}
  
  )();