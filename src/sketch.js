function setup() {
  // 1. Create and centre the canvas.
  canvas = createCanvas(600, 600);

  // 2. Define the colour scheme and style.
  colorMode(RGB, 255);
  bgColour = color(187, 173, 160);
  colours = [
    color(205, 193, 180), // empty
    color(238, 228, 218), //       2
    color(238, 225, 201), //       4
    color(243, 178, 122), //       8
    color(246, 150, 100), //      16
    color(247, 124, 95), //      32
    color(247, 95, 59), //      64
    color(237, 208, 115), //     128
    color(237, 204, 98), //     256
    color(237, 201, 80), //     512
    color(237, 197, 63), //    1024
    color(237, 194, 46), //    2048
    color(239, 103, 108), //    4096
    color(237, 77, 88), //    8192
    color(226, 67, 57), //   16384
    color(113, 180, 213), //   32768
    color(94, 160, 223), //   65536
    color(0, 124, 190), //  131072
    color(10, 144, 170), //  262114
    color(20, 164, 150), //  524288
    color(30, 184, 130),
  ]; // 1048576
  lightTextColour = color(249, 246, 242);
  darkTextColour = color(119, 110, 101);

  // 3. Reset the game internal variables.
  reset();

  // 4. Enable painting.
  autoSize();
  frameRate(fps);
}

function autoSize() {
  size = Math.floor(proportion * Math.min(windowWidth, windowHeight));
  centre = size / 2;
  resizeCanvas(size, size);
  painter.setScale(size / 600);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  redraw();
}

function reset() {
  // 1. Set the values of internal variables.
  moveFrames = 16;
  lose = false;
  score = 0;

  // 2. Create the tiles.
  tiles.forEach((tile) => tile.clear());

  // 3. Determine the starting tiles.
  spawn(initialSpawn);

  // 4. Allow input.
  ready = true;
}

function spawn(n) {
  // Recursively creates as many tiles as possible, up to n many, in random
  // locations on the board.
  // Each tile has a 80% probability of spawning 2, and a 20% probability of
  // spawning 4. When picking a real number x from a uniform distribution over
  // [1,2.25), we get P(floor(x) = 1) = 80% and P(floor(x) = 2) = 20%.
  getEmptyTiles()
    .map((tile) => [Math.random(), tile])
    .sort()
    .slice(0, n)
    .forEach(([_, tile]) => tile.spawn(randInt(1, 2.25)));
}

function draw() {
  background(bgColour);

  drawBoard();
  drawScore();
}

function refreshTiles() {
  tiles.forEach((tile) => tile.finishUpdating());
}

function drawBoard() {
  push();
  {
    translate(centre, centre);

    if (moveFrames > 5) {
      const t = 1 - (moveFrames - 5) / 10;
      tiles.forEach((tile) => tile.paintBlank());
      tiles.forEach((tile) => tile.paintSpawn(t));
      tiles.forEach((tile) => tile.paintSlide(t));

      moveFrames--;
    } else if (moveFrames > 0) {
      const t = 1 + (3 - abs(3 - moveFrames)) / 20;
      tiles.forEach((tile) => tile.paintPlain());
      tiles.forEach((tile) => tile.paintFlash(t));

      moveFrames--;
      if (moveFrames === 0) {
        refreshTiles();
      }
    } else {
      // (moveFrames === 0)
      tiles.forEach((tile) => tile.paintPlain());
      noLoop();
    }
  }
  pop();
}

function drawScore() {
  painter.paintScore(score);
}

function keyPressed() {
  if (!ready) {
    return;
  }

  if (moveFrames > 5) {
    // Inputs are locked while the tiles are moving.
    return; //   For smoothness, inputs unlock for the last
  } //   few frames of the move.

  if (lose && moveFrames === 0) {
    alert(`You lose! Score: ${score}`);
    reset();
    return;
  }

  if (keyCode === 69) {
    // E (right-up)
    move("ru");
  } else if (keyCode === 87) {
    // W (up)
    move("mu");
  } else if (keyCode === 81) {
    // Q (left-up)
    move("lu");
  } else if (keyCode === 65) {
    // A (left-down)
    move("ld");
  } else if (keyCode === 83) {
    // S (down)
    move("md");
  } else if (keyCode === 68) {
    // D (right-down)
    move("rd");
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

  let delta = {
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

  if (delta.y < 0) {
    // Upward swipe.
    if (delta.x * tan60 >= -delta.y) {
      move("ru");
    } else if (delta.x * tan60 > delta.y) {
      move("mu");
    } else {
      move("lu");
    }
  } else if (delta.y > 0) {
    // Downward swipe.
    if (delta.x * tan60 > delta.y) {
      move("rd");
    } else if (delta.x * tan60 >= -delta.y) {
      move("md");
    } else {
      move("ld");
    }
  }

  // Prevent the default touch action.
  return false;
}

function move(direction) {
  refreshTiles();

  moves[direction].forEach(slide);

  if (unmoved()) {
    return;
  }

  spawn(moveSpawn);
  lose = full() && stuck();
  moveFrames = 15;

  loop();
}

function slide(r) {
  // r is a list of tile indices corresponding to a row parallel to the
  //   direction of the player's move. Earlier values in r correspond to tiles
  //   further along the direction of the move.
  let i = 0;
  let j = 0;
  while (j < r.length) {
    const targetTile = tiles[r[i]];
    const currentTile = tiles[r[j]];
    if (currentTile.isEmpty() || currentTile === targetTile) {
      // do nothing and continue
      currentTile.target = currentTile;
      j++;
    } else if (targetTile.isEmpty()) {
      targetTile.setValue(currentTile.value);
      currentTile.clear();
      currentTile.target = targetTile;
      j++;
    } else if (currentTile.value === targetTile.value) {
      targetTile.merge();
      currentTile.clear();
      currentTile.target = targetTile;
      i++;
      j++;
    } else if (currentTile.value !== targetTile.value) {
      i++;
    }
  }
}

function windowResized() {
  autoSize();
}
