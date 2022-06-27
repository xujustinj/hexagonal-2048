// Mathematical constants.

const sin60 = Math.sqrt(3) / 2; // sin(PI / 3)
const cos60 = 1 / 2; // cos(PI / 3)
const tan60 = Math.sqrt(3); // tan(PI / 3)

function randInt(a, b) {
  // Produces a random integer value in [a,b).
  return floor(a + (b - a) * Math.random());
}

// Canvas constants.

var canvas = {};

const proportion = 7 / 8; // The proportion of the window filled by the canvas.

var size = 600; // The side length of the square canvas.
var centre = size / 2; // (centre, centre) is the centre of the canvas.

const fps = 60; // The frame rate.

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
const space = 10; // The width of the gap between adjacent tiles.
const sideLength = 60; // The default length of the side of each hexagonal tile.
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
  // (i,j) is listed in this array iff:
  // - 0 <= i < j <= 18
  // - The tiles numbered i and j in the above diagram share an
  //   edge.
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

// Unfortunately, color(...) is not accessible outside of the setup() and draw()
//   methods.
var bgColour = {}; // color(187, 173, 160), the fill colour of the canvas.
var colours = []; // Contains the 21 (counting duplicates) possible fill
//   colours of the hexagonal tiles on the board. colours[n]
//   is the colour of all tiles displaying the value 2^n, or
//   the colour of the empty tile when n = 0. The greatest
//   possible tile value achievable on the board is 2^20.
/*
   colours = [
       // From the original game.
       color(205, 193, 180),  // empty
       color(238, 228, 218),  //       2
       color(238, 225, 201),  //       4
       color(243, 178, 122),  //       8
       color(246, 150, 100),  //      16
       color(247, 124,  95),  //      32
       color(247,  95,  59),  //      64
       color(237, 208, 115),  //     128
       color(237, 204,  98),  //     256
       color(237, 201,  80),  //     512
       color(237, 197,  63),  //    1024
       color(237, 194,  46),  //    2048
       // Based on the screenshot found at
       // nicosai.wordpress.com/2014/10/31/10-things-i-learned-from-2048/
       color(239, 103, 108),  //    4096
       color(237,  77,  88),  //    8192
       color(226,  67,  57),  //   16384
       color(113, 180, 213),  //   32768
       color( 94, 160, 223),  //   65536
       color(  0, 124, 190),  //  131072
       // Arbitrarily incrementing by (10,20,-20) hereon.
       color( 10, 144, 170),  //  262114
       color( 20, 164, 150),  //  524288
       color( 30, 184, 130)]; // 1048576
*/

var lightTextColour = {}; // color(249, 246, 242), the text colour of all tiles
//   other than the 2 and 4 tiles.
var darkTextColour = {}; // color(119, 110, 101), the text colour of the 2 and
//   4 tiles.

// Internal variables.
const initialSpawn = 3; // The number of tiles spawned at the beginning of each
//   game.
const moveSpawn = 2; // The number of tiles spawned after each move.

var moveFrames = 0; // The number of frames remaining in the tile-sliding
//   animation following a move.
var lose = false; // Whether or not the player can move.
var score = 0; // The player's score.
var ready = false; // Whether or not the game is ready to accept inputs.

var touchStart = {
  x: 0, // The x-coordinate of the touch.
  y: 0, // The y-coordinate of the touch.
  t: 0,
}; // The frame number of the touch.
const distanceThreshold = 80; // The minimum number of pixels a swipe must
//   travel in order to register.
const speedThreshold = 4; // The minimum number of average pixels per frame
//   a swipe must achieve in order to register.
