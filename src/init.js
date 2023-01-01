function randInt(a, b) {
  // Produces a random integer value in [a,b).
  return floor(a + (b - a) * Math.random());
}

// The frame rate.
const fps = 60;

// The 19 hexagonal tiles that make up the board.
/*
     r1  -2  -1   0   1   2
    y +----------------------
 -2.0 |          10
 -1.5 |      11      09
 -1.0 |  12      02      08
 -0.5 |      03      01
  0.0 |  13      00      07
  0.5 |      04      06
  1.0 |  14      05      18
  1.5 |      15      17
  2.0 |          16
*/

var tiles = [
  new Tile(0, 0),
  new Tile(1, -0.5),
  new Tile(0, -1),
  new Tile(-1, -0.5),
  new Tile(-1, 0.5),
  new Tile(0, 1),
  new Tile(1, 0.5),
  new Tile(2, 0),
  new Tile(2, -1),
  new Tile(1, -1.5),
  new Tile(0, -2),
  new Tile(-1, -1.5),
  new Tile(-2, -1),
  new Tile(-2, 0),
  new Tile(-2, 1),
  new Tile(-1, 1.5),
  new Tile(0, 2),
  new Tile(1, 1.5),
  new Tile(2, 1),
];

const adjacent = [
  // (i,j) is listed in this array iff the corresponding tiles share an edge.
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 3],
  [2, 9],
  [2, 10],
  [2, 11],
  [3, 4],
  [3, 11],
  [3, 12],
  [3, 13],
  [4, 5],
  [4, 13],
  [4, 14],
  [4, 15],
  [5, 6],
  [5, 15],
  [5, 16],
  [5, 17],
  [6, 7],
  [6, 17],
  [6, 18],
  [7, 8],
  [7, 18],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [16, 17],
  [17, 18],
];

const moves = {
  // right-up
  ru: [
    [10, 11, 12],
    [9, 2, 3, 13],
    [8, 1, 0, 4, 14],
    [7, 6, 5, 15],
    [18, 17, 16],
  ],
  // middle-up
  mu: [
    [12, 13, 14],
    [11, 3, 4, 15],
    [10, 2, 0, 5, 16],
    [9, 1, 6, 17],
    [8, 7, 18],
  ],
  // left-up
  lu: [
    [14, 15, 16],
    [13, 4, 5, 17],
    [12, 3, 0, 6, 18],
    [11, 2, 1, 7],
    [10, 9, 8],
  ],
  // left-down
  ld: [
    [16, 17, 18],
    [15, 5, 6, 7],
    [14, 4, 0, 1, 8],
    [13, 3, 2, 9],
    [12, 11, 10],
  ],
  // middle-down
  md: [
    [18, 7, 8],
    [17, 6, 1, 9],
    [16, 5, 0, 2, 10],
    [15, 4, 3, 11],
    [14, 13, 12],
  ],
  // right-down
  rd: [
    [8, 9, 10],
    [7, 1, 2, 11],
    [18, 6, 0, 3, 12],
    [17, 5, 4, 13],
    [16, 15, 14],
  ],
};

function full() {
  // Whether or not every tile is nonempty.
  return tiles.every((tile) => !tile.isEmpty());
}

function stuck() {
  // If full(), whether or not no moves are possible.
  return adjacent.every((p) => tiles[p[0]].value != tiles[p[1]].value);
}

function unmoved() {
  // Whether or not the last player input moved any tiles.
  return tiles.every((n) => n.target === n);
}

function getEmptyTiles() {
  return tiles.filter((tile) => tile.isEmpty());
}

// Style constants.
const painter = new Painter();

// Internal variables.
// The number of tiles spawned at the beginning of each game.
const initialSpawn = 3;
// The number of tiles spawned after each move.
const moveSpawn = 2;

// The number of frames remaining in the tile-sliding animation.
var moveFrames = 0;

// Whether or not the player can move.
var lose = false;

// The player's score.
var score = 0;

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
