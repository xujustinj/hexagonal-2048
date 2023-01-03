// The frame rate.
const fps = 60;

const board = new HexBoard();

// Style constants.
const painter = new Painter();

// The ongoing move.
var transitions = null;

// The number of frames remaining in the tile-sliding animation.
var moveFrames = 0;
var flashFrames = 0;

// Whether or not the game is ready to accept inputs.
var ready = false;

var touchStart = {
  x: 0, // The x-coordinate of the touch.
  y: 0, // The y-coordinate of the touch.
  t: 0, // The frame number of the touch.
};

// The minimum number of pixels a swipe must travel in order to register.
const distanceThreshold = 80;

// The minimum speed (pixels/frame) a swipe must travel in order to register.
const speedThreshold = 4;
