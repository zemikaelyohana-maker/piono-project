// Web Audio API Context for generating sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Function to play sound at a given frequency
function playNote(frequency) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  // Smoother sound decay (fade out)
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.8);
}

// Keydown Event: Fires when pressing a keyboard key
window.addEventListener('keydown', (e) => {
  // Convert key to lowercase to support Caps Lock or Shift
  const keyPress = e.key.toLowerCase();
  
  // Find matching key element using data-key attribute
  const pianoKey = document.querySelector(`.key[data-key="${keyPress}"]`);

  // Ignore keys that are not mapped or keys held down (repeating)
  if (!pianoKey || e.repeat) return;

  // Add the active visual class
  pianoKey.classList.add('active');

  // Retrieve frequency and play the sound
  const freq = pianoKey.getAttribute('data-freq');
  if (freq) {
    playNote(freq);
  }
});

// Keyup Event: Fires when releasing a keyboard key
window.addEventListener('keyup', (e) => {
  const keyPress = e.key.toLowerCase();
  const pianoKey = document.querySelector(`.key[data-key="${keyPress}"]`);

  if (pianoKey) {
    pianoKey.classList.remove('active');
  }
});