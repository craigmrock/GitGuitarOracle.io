function Timer(callback, timeInterval, options) {
    this.timeInterval = timeInterval;
    
    // Add method to start timer
    this.start = () => {
      // Set the expected time. The moment in time we start the timer plus whatever the time interval is. 
      this.expected = Date.now() + this.timeInterval;
      // Start the timeout and save the id in a property, so we can cancel it later
      this.theTimeout = null;
      
      if (options.immediate) {
        callback();
      } 
      
      this.timeout = setTimeout(this.round, this.timeInterval);
      console.log('Timer Started');
    }
    // Add method to stop timer
    this.stop = () => {
  
      clearTimeout(this.timeout);
      console.log('Timer Stopped');
    }
    // Round method that takes care of running the callback and adjusting the time
    this.round = () => {
      console.log('timeout', this.timeout);
      // The drift will be the current moment in time for this round minus the expected time..
      let drift = Date.now() - this.expected;
      // Run error callback if drift is greater than time interval, and if the callback is provided
      if (drift > this.timeInterval) {
        // If error callback is provided
        if (options.errorCallback) {
          options.errorCallback();
        }
      }
      callback();
      // Increment expected time by time interval for every round after running the callback function.
      this.expected += this.timeInterval;
      console.log('Drift:', drift);
      console.log('Next round time interval:', this.timeInterval - drift);
      // Run timeout again and set the timeInterval of the next iteration to the original time interval minus the drift.
      this.timeout = setTimeout(this.round, this.timeInterval - drift);
    }
  }

  export default Timer;

const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const tempoSlider = document.querySelector('.slider');
const startStopButton = document.querySelector('.start-stop');
const decreaseTempoButton = document.querySelector('.decrease-tempo');
const increaseTempoButton = document.querySelector('.increase-tempo');
const measureCountDisplay = document.querySelector('.measure-count');
const subtractBeatsButton = document.querySelector('.subtract-beats');
const addBeatsButton = document.querySelector('.add-beats');

let tempo = Number(tempoSlider.value);
let beatsPerMeasure = Number(measureCountDisplay.textContent);
let currentBeat = 0;
let timer;
let audioContext;
let isStarting = false;
let audioReadyPromise;

function updateTempo(nextTempo) {
  tempo = Math.min(280, Math.max(20, nextTempo));
  tempoSlider.value = tempo;
  tempoDisplay.textContent = tempo;
  tempoText.textContent = tempo < 60 ? 'Largo' : tempo < 80 ? 'Adagio' : tempo < 120 ? 'Andante' : tempo < 168 ? 'Allegro' : 'Presto';

  if (timer) {
    timer.stop();
    startMetronome();
  }
}

function playClick() {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const isDownbeat = currentBeat === 0;
  oscillator.frequency.value = isDownbeat ? 1100 : 800;
  gain.gain.setValueAtTime(0.25, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.05);
  currentBeat = (currentBeat + 1) % beatsPerMeasure;
}

function prepareAudioContext() {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();

  if (audioContext.state === 'running') {
    return Promise.resolve();
  }

  audioReadyPromise ??= audioContext.resume().then(() => {
    if (audioContext.state !== 'running') {
      throw new Error(`Audio context is ${audioContext.state}`);
    }
  }).finally(() => {
    audioReadyPromise = undefined;
  });

  return audioReadyPromise;
}

function startMetronome() {
  if (isStarting || timer) {
    return;
  }

  isStarting = true;
  prepareAudioContext().then(() => {
    currentBeat = 0;
    playClick();
    timer = new Timer(playClick, 60000 / tempo, { immediate: false });
    timer.start();
    startStopButton.textContent = 'STOP';
    startStopButton.setAttribute('aria-pressed', 'true');
  }).catch((error) => {
    audioContext = undefined;
    audioReadyPromise = undefined;
    console.error('Unable to start the metronome audio.', error);
  }).finally(() => {
    isStarting = false;
  });
}

function stopMetronome() {
  timer?.stop();
  timer = undefined;
  startStopButton.textContent = 'START';
  startStopButton.setAttribute('aria-pressed', 'false');
}

startStopButton.addEventListener('pointerdown', () => {
  prepareAudioContext().catch((error) => {
    audioContext = undefined;
    audioReadyPromise = undefined;
    console.error('Unable to prepare the metronome audio.', error);
  });
}, { passive: true });
tempoSlider.addEventListener('input', () => updateTempo(Number(tempoSlider.value)));
decreaseTempoButton.addEventListener('click', () => updateTempo(tempo - 1));
increaseTempoButton.addEventListener('click', () => updateTempo(tempo + 1));
startStopButton.addEventListener('click', () => timer ? stopMetronome() : startMetronome());
subtractBeatsButton.addEventListener('click', () => {
  beatsPerMeasure = Math.max(1, beatsPerMeasure - 1);
  measureCountDisplay.textContent = beatsPerMeasure;
});
addBeatsButton.addEventListener('click', () => {
  beatsPerMeasure = Math.min(12, beatsPerMeasure + 1);
  measureCountDisplay.textContent = beatsPerMeasure;
});