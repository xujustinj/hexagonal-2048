function preload() {
  painter.preload();
}

function setup() {
  reset();
  painter.setup();
  frameRate(fps);
}

function reset() {
  transitions = board.reset();
  moveFrames = 12;
  controller.canMove = false;
}

function draw() {
  background(painter.bgColor);
  drawBoard();
  drawScore();
}

function drawBoard() {
  push();
  {
    translate(painter.centre, painter.centre);

    if (moveFrames > 0) {
      controller.canMove = false;
      const t = 1 - moveFrames / 12;
      board.tiles.forEach((tile) => painter.paintBlank(tile));
      transitions.forEach((transition) => painter.animateSpawn(transition, t));
      transitions.forEach((transition) => painter.animateSlide(transition, t));
      moveFrames--;
      if (moveFrames === 0) {
        transitions.forEach((transition) => transition.apply());
        transitions.forEach(
          (transition) => (board.score += transition.getScore())
        );
        flashFrames = 8;
      }
    } else if (flashFrames > 0) {
      controller.canMove = true;
      const t = 1 - flashFrames / 8;
      board.tiles.forEach((tile) => painter.paintTile(tile));
      transitions.forEach((transition) => painter.animateMerge(transition, t));

      flashFrames--;
    } else {
      controller.canMove = true;
      board.tiles.forEach((tile) => painter.paintTile(tile));
      noLoop();
    }
  }
  pop();
}

function drawScore() {
  painter.paintScore(board.score);
}

function keyPressed() {
  direction = controller.pressKey(keyCode);
  if (direction !== null) {
    move(direction);
  }
}

function touchStarted() {
  controller.startSwipe(mouseX, mouseY, frameCount / fps);

  // Prevent the default touch action.
  return false;
}

function touchEnded() {
  direction = controller.endSwipe(mouseX, mouseY, frameCount / fps);
  if (direction !== null) {
    move(direction);
  }

  // Prevent the default touch action.
  return false;
}

function move(direction) {
  if (board.isGameOver() && moveFrames === 0) {
    alert(`You lose! Score: ${board.score}`);
    reset();
    loop();
    return;
  }

  console.log(`Moving in direction: ${direction}`);
  nextTransitions = board.move(direction);
  if (nextTransitions !== null) {
    transitions = nextTransitions;
    moveFrames = 12;
    loop();
  }
}

function windowResized() {
  painter.autoSize();
}
