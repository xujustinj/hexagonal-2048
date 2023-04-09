const board = new HexBoard({
  initialSpawnCount: 3,
  moveSpawnCount: 2,
});
const display = new P5Display({
  windowProportion: 0.9,
  tileSideLength: 0.1,
  tileSpacing: 0.016,
  framesPerSecond: 60,
  slideDuration: 0.1,
  spawnDuration: 0.1,
  flashDuration: 0.1,
  flashMagnitude: 0.2,
  fontSrc:
    "https://raw.githubusercontent.com/intel/clear-sans/main/TTF/ClearSans-Bold.ttf",
  tileValueSizes: {
    1: 0.08,
    2: 0.08,
    3: 0.07,
    4: 0.06,
    5: 0.05,
    6: 0.04,
    7: 0.035,
  },
  scoreSize: 0.05,
  backgroundRGB: { r: 187, g: 173, b: 160 },
  tileRGBs: [
    {
      // empty
      background: { r: 205, g: 193, b: 180 },
      value: { r: 205, g: 193, b: 180 },
    },
    {
      // 2
      background: { r: 238, g: 228, b: 218 },
      value: { r: 119, g: 110, b: 101 },
    },
    {
      // 4
      background: { r: 238, g: 225, b: 201 },
      value: { r: 119, g: 110, b: 101 },
    },
    {
      // 8
      background: { r: 243, g: 178, b: 122 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 16
      background: { r: 246, g: 150, b: 100 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 32
      background: { r: 247, g: 124, b: 95 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 64
      background: { r: 247, g: 95, b: 59 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 128
      background: { r: 237, g: 208, b: 115 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 256
      background: { r: 237, g: 204, b: 98 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 512
      background: { r: 237, g: 201, b: 80 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 1024
      background: { r: 237, g: 197, b: 63 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 2048
      background: { r: 237, g: 194, b: 46 },
      value: { r: 249, g: 246, b: 242 },
    },
    // Based on the screenshot found at
    // nicosai.wordpress.com/2014/10/31/10-things-i-learned-from-2048/
    {
      // 4096
      background: { r: 239, g: 103, b: 108 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 8192
      background: { r: 237, g: 77, b: 88 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 16384
      background: { r: 226, g: 67, b: 57 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 32768
      background: { r: 113, g: 180, b: 213 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 65536
      background: { r: 94, g: 160, b: 223 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 131072
      background: { r: 0, g: 124, b: 190 },
      value: { r: 249, g: 246, b: 242 },
    },
    // Arbitrarily incrementing by (10,20,-20) hereon.
    {
      // 262114
      background: { r: 10, g: 144, b: 170 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 524288
      background: { r: 20, g: 164, b: 150 },
      value: { r: 249, g: 246, b: 242 },
    },
    {
      // 1048576
      background: { r: 30, g: 184, b: 130 },
      value: { r: 249, g: 246, b: 242 },
    },
  ],
  scoreRGB: { r: 249, g: 246, b: 242 },
});
const controller = new HexController({
  distanceThreshold: 80,
  speedThreshold: 160,
});

function preload() {
  display.preload();
}

function setup() {
  display.setup();
  loadGame();
}

function loadGame() {
  const transitions = board.loadGame();
  makeTransitions(transitions);
}

function reset() {
  const transitions = board.reset();
  makeTransitions(transitions);
}

function draw() {
  control();
  display.draw(board);
}

function keyPressed() {
  controller.pressKey(keyCode);
  control();
  delay(500).then(saveGame);
}

function touchStarted() {
  controller.startSwipe(mouseX, mouseY, now());

  // Prevent the default touch action.
  return false;
}

function touchEnded() {
  controller.endSwipe(mouseX, mouseY, now());
  control();
  delay(500).then(saveGame);

  // Prevent the default touch action.
  return false;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function saveGame() {

  var progress = {
    game: board.tiles,
    score: board.score
  };
  localStorage.setItem('progress', JSON.stringify(progress));

  console.log(progress)
}

function control() {
  const direction = controller.getBuffer();
  if (direction !== null) {
    move(direction);
  }
}

function move(direction) {
  if (board.isGameOver() && display.transitions === null) {
    alert(`You lose! Score: ${board.score}`);
    reset();
    return;
  }

  console.log(`Moving in direction: ${direction}`);

  console.log('Current score =', board.score)

  const transitions = board.move(direction);
  if (transitions !== null) {
    makeTransitions(transitions);
  }
}

function makeTransitions(transitions) {
  controller.canMove = false;
  display.transition(transitions, (ts) => {
    ts.forEach((t) => t.apply());
    ts.forEach((t) => (board.score += t.getScore()));
    controller.canMove = true;
  });
}

function windowResized() {
  display.autoSize();
}
