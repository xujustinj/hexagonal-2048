function preload() {
  painter.preload();
}

function setup() {
  reset();
  painter.setup();
  frameRate(fps);
}

function reset() {
  moveFrames = 16;
  board.reset();
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

    if (moveFrames > 5) {
      const t = 1 - (moveFrames - 5) / 10;
      board.tiles.forEach((tile) => tile.paintBlank());
      board.tiles.forEach((tile) => tile.paintSpawn(t));
      board.tiles.forEach((tile) => tile.paintSlide(t));

      moveFrames--;
    } else if (moveFrames > 0) {
      const t = 1 + (3 - abs(3 - moveFrames)) / 20;
      board.tiles.forEach((tile) => tile.paintPlain());
      board.tiles.forEach((tile) => tile.paintFlash(t));

      moveFrames--;
      if (moveFrames === 0) {
        board.flush();
      }
    } else {
      // (moveFrames === 0)
      board.tiles.forEach((tile) => tile.paintPlain());
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

  if (moveFrames > 5) {
    // Inputs are locked while the tiles are moving.
    // For smoothness, inputs unlock for the last few frames of the move.
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
    return;
  }

  console.log(`Moving in direction: ${direction}`);
  board.move(direction);
  moveFrames = 15;
  loop();
}

function windowResized() {
  painter.autoSize();
}
