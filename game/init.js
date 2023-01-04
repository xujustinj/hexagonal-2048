// The frame rate.
const fps = 60;

const board = new HexBoard();
const painter = new Painter();
const controller = new HexController();

// The ongoing move.
var transitions = null;

// The number of frames remaining in the tile-sliding animation.
var moveFrames = 0;
var flashFrames = 0;
