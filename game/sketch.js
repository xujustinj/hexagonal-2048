const board = new HexBoard();
const painter = new Painter();
const controller = new HexController();

function preload() {
  painter.preload();
}

function setup() {
  painter.setup();
  reset();
}

function reset() {
  transitions = board.reset();
  makeTransitions(transitions);
}

function draw() {
  control();
  painter.draw(board);
}

function keyPressed() {
  controller.pressKey(keyCode);
  control();
}

function touchStarted() {
  controller.startSwipe(mouseX, mouseY, now());

  // Prevent the default touch action.
  return false;
}

function touchEnded() {
  controller.endSwipe(mouseX, mouseY, now());
  control();

  // Prevent the default touch action.
  return false;
}

function control() {
  const direction = controller.getBuffer();
  if (direction !== null) {
    move(direction);
  }
}

function move(direction) {
  if (board.isGameOver() && painter.transitions === null) {
    alert(`You lose! Score: ${board.score}`);
    reset();
    return;
  }

  console.log(`Moving in direction: ${direction}`);
  const transitions = board.move(direction);
  if (transitions !== null) {
    makeTransitions(transitions);
  }
}

function makeTransitions(transitions) {
  controller.canMove = false;
  painter.transition(transitions, (ts) => {
    ts.forEach((t) => t.apply());
    ts.forEach((t) => (board.score += t.getScore()));
    controller.canMove = true;
  });
}

function windowResized() {
  painter.autoSize();
}
