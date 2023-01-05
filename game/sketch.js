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
  painter.draw(board);
}

function keyPressed() {
  direction = controller.pressKey(keyCode);
  if (direction !== null) {
    move(direction);
  }
}

function touchStarted() {
  controller.startSwipe(mouseX, mouseY, now());

  // Prevent the default touch action.
  return false;
}

function touchEnded() {
  direction = controller.endSwipe(mouseX, mouseY, now());
  if (direction !== null) {
    move(direction);
  }

  // Prevent the default touch action.
  return false;
}

function move(direction) {
  if (board.isGameOver() && painter.transitions === null) {
    alert(`You lose! Score: ${board.score}`);
    reset();
    return;
  }

  console.log(`Moving in direction: ${direction}`);
  transitions = board.move(direction);
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
