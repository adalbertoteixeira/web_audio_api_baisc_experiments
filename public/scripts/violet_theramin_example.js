/**
 * We start by creating an audio context.
 * We need a prefixed version for some browsers and a non-prefixed one for Firefox.
 * The `window`in `window.AudioContext`is here because Safari might break if it's not there.
 */
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Create an audio source.
 * ` AudioContext.createOscillator()` method is created in Javascript, but we can also use:
 *   - raw PCM data (`AudioContext.createBuffer()`);
 *   - use HTML media elements like `<audio>` and `<video>` using `AudioContext.createMediaElementSource()`;
 *   - use webcam or microphone (a WebRTCMediaStream) using `AudioContext.createMediaStreamSource().`
 */
var oscillator = audioContext.createOscillator();

/**
 * The gainNode will control sound volume.
 */
var gainNode = audioContext.createGain();

/**
 * We need to link the source and the destination together.
 */
oscillator.connect(gainNode);
/**
 * Looks like we can chain multiple nodes between the initial and the last.
 * Last one is supposed to be the computer's speakers.
 */
gainNode.connect(audioContext.destination);

/**
 * The Violet Theramin example uses a max gain and frequency values and has inital values.
 */
var maxFrequency = 6800;
var maxVolume = 1;

var initialFrequency = 3000;
var initialVolume = 0.5;

/**
 * Since the gain and frequency are related to the mouse position in the window
 * and the canvas were the Violet Theramin will be displayed should use the
 * entire window we need to get the window's dimensions.
 */
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

/**
 * Now we set values and invoke methods to adjust the effect they have on the sound.
 */
oscillator.type = 'sine';
oscillator.frequency.value = initialFrequency;
gainNode.gain.value = initialVolume;
oscillator.start();

/**
 * The experiment changes frequency and pitch when the cursos moves.
 */
var CurX;
var CurY;

document.onmousemove = updatePage;

function updatePage(e) {
  CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  oscillator.frequency.value = (CurX / WIDTH) * maxFrequency;
  gainNode.gain.value = (CurY / HEIGHT) * maxVolume;

  canvasDraw();
}

/**
 * We need to create a canvas which will occupy the entire window.
 */
var canvas = document.querySelector('.canvas');

canvas.width = WIDTH;
canvas.height = HEIGHT;

/**
 * Drawing context will be `2d`. Could also be:
 *   - 'webgl' (3d type);
 *   - 'webgl2' / 'experimental-webgl2';
 *   - 'bitmaprenderer'.
 */
var canvasContext = canvas.getContext('2d');

/**
 * Helper function for random numbers.
 */
function random(number1, number2) {
  var randomNumber = number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
  return randomNumber;
}

/**
 * The actual function that will draw the circles when the mouse moves. The size
 * and colour of which are related to the frequency and gain values respectively.
 */
function canvasDraw() {
  var rX = CurX;
  var rY = CurY;
  var rC = Math.floor((gainNode.gain.value / maxVolume) * 30);

  canvasContext.globalAlpha = 0.2;

  for (var i = 1; i <= 15; i = i + 2) {
    canvasContext.beginPath();
    canvasContext.fillStyle = 'rgb(' + 100 + (i * 10) + ', ' + Math.floor((gainNode.gain.value / maxVolume) * 255) + ',' + Math.floor((oscillator.frequency.value / maxFrequency) * 255) + ')';
    canvasContext.arc(rX + random(0, 50), rY + random(0, 50), rC / 2 + i, (Math.PI / 180) * 0, (Math.PI / 180) * 260, false);
    canvasContext.fill();
    canvasContext.closePath();
  }
}

/**
 * A mute / unmute button, because theramin's pitches can really hurt your ears...
 */
var mute = document.querySelector('.mute');

mute.onclick = function() {
  if (mute.id === '') {
    gainNode.disconnect(audioContext);
    mute.id = 'activated';
    mute.innerHTML = 'Unmute';
  } else {
    gainNode.conect(audioContext.destination);
    mute.innerHTML = 'Mute';
  }
}
