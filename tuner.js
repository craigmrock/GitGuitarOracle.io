
const tunerLowE = document.querySelector('.lowE-btn');
const tunerA = document.querySelector('.A-btn');
const tunerD = document.querySelector('.D-btn');
const tunerG = document.querySelector('.G-btn');
const tunerB = document.querySelector('.B-btn');
const tunerHighE = document.querySelector('.highE-btn');


const stringLowE = new Audio('./audio/lowE.mp3');
const stringA = new Audio('./audio/A.mp3');
const stringD = new Audio('./audio/D.mp3');
const stringG = new Audio('./audio/G.mp3');
const stringB = new Audio('./audio/B.mp3');
const stringHighE = new Audio('./audio/highE.mp3');

let activeStringAudio;
let activeStringButton;

function clearActiveString() {
    activeStringAudio?.pause();
    if (activeStringAudio) {
        activeStringAudio.currentTime = 0;
    }
    activeStringButton?.classList.remove('is-playing');
    activeStringAudio = undefined;
    activeStringButton = undefined;
}

function playString(audio, button) {
    clearActiveString();
    audio.currentTime = 0;
    activeStringAudio = audio;
    activeStringButton = button;
    button.classList.add('is-playing');
    audio.onended = () => {
        if (activeStringAudio === audio) {
            clearActiveString();
        }
    };
    audio.play().catch(() => {
        if (activeStringAudio === audio) {
            clearActiveString();
        }
    });
}

tunerLowE.addEventListener('click', () => playString(stringLowE, tunerLowE));
tunerA.addEventListener('click', () => playString(stringA, tunerA));
tunerD.addEventListener('click', () => playString(stringD, tunerD));
tunerG.addEventListener('click', () => playString(stringG, tunerG));
tunerB.addEventListener('click', () => playString(stringB, tunerB));
tunerHighE.addEventListener('click', () => playString(stringHighE, tunerHighE));
