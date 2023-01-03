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
  ready = true;
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
      const t = 1 - flashFrames / 8;
      board.tiles.forEach((tile) => painter.paintTile(tile));
      transitions.forEach((transition) => painter.animateMerge(transition, t));

      flashFrames--;
    } else {
      // (moveFrames === 0)
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
  if (!ready) {
    return;
  }

  direction = HexDirection.fromKeycode(keyCode);
  if (direction !== null) {
    move(direction);
  }
}

function touchStarted() {
  if (!ready) {
    return false;
  }

  touchStart.x = mouseX;
  touchStart.y = mouseY;
  touchStart.t = frameCount;

  // Prevent the default touch action.
  return false;
}

function touchEnded() {
  if (!ready) {
    return false;
  }

  const delta = {
    x: mouseX - touchStart.x,
    y: mouseY - touchStart.y,
    t: frameCount - touchStart.t,
  };

  let magnitude = delta.x ** 2 + delta.y ** 2;
  if (magnitude < distanceThreshold ** 2) {
    // Not far enough.
    return false;
  }
  if (magnitude < (delta.t * speedThreshold) ** 2) {
    // Too slow.
    return false;
  }

  const heading = Math.atan2(delta.y, delta.x);
  const direction = HexDirection.fromHeading(heading);
  move(direction);

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

  if (moveFrames > 0) {
    // Inputs are locked while the tiles are moving.
    // For smoothness, inputs unlock for the last few frames of the move.
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
