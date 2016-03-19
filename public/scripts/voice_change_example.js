/**
 * Get the mediafrom the user. Will get deprecated in favour of
 * [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).
 */
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);


/**
 * We start by creating an audio context.
 * We need a prefixed version for some browsers and a non-prefixed one for Firefox.
 * The `window`in `window.AudioContext`is here because Safari might break if it's not there.
 */
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Check we can use the user media
 */
if (navigator.getUserMedia) {
  navigator.getUserMedia(
    {
      audio: true,
      video: false,
    },

    // It works!
    function(stream) {
      /**
       * Create an audio source using the stream;
       */
      var source = audioContext.createMediaStreamSource(stream);

      /**
       * Add effects.
       */
      var biquadFilter = audioContext.createBiquadFilter();
      biquadFilter.type = "lowshelf";
      biquadFilter.frequency.value = 3000;
      biquadFilter.detune.value = 100;
      biquadFilter.gain.value = 25;

      /**
       * Chain the effects
       */
      source.connect(biquadFilter);
      biquadFilter.connect(audioContext.destination)
    },

    // it fails...
    function(error) {
      console.log('We got an error:' + error);
    }
  );
} else {
  console.log('getUserMedia is not supported in this browser.')
}