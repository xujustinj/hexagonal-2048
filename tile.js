function Tile(n) {
  // n is the tile's arbitrary index in the 1-D array of tiles. The simplest
  //   way to arrange a linear sequence of tiles into the hexagonal pattern of
  //   the game board is to contruct a hexagonal spiral.
  //   x   a   b   c   d   e
  // y +----------------------
  // a |          10
  // b |      11      09
  // c |  12      02      08
  // d |      03      01
  // e |  13      00      07
  // f |      04      06
  // g |  14      05      18
  // h |      15      17
  // i |          16

  // Tiles are painted up to twice. Normally, the tile is painted at its
  //   position shown above. Upon making a move, nonempty tiles slide in the
  //   direction of the move if possible, to some destination position. During
  //   the move, the original position of the tile is painted as empty, while
  //   it is painted at some location along the path of motion.

  this.id = n;

  // Position properties.

  this.x = x[n]; // The x-coordinate of the centre of this tile.
  this.y = y[n]; // The y-coordinate of the centre-of this tile.

  // Display properties.

  this.value = 0; // The base-2 logarithm of the number displayed on this
  // tile, or 0 when this tile is empty.
  this.colour = colours[this.value]; // The fill colour of this tile.

  this.previousValue = 0; // The previous value of this tile.
  this.previousColour = colours[this.previousValue]; // The previous fill
  //   colour of this tile.

  // Motion properties.

  this.target = 0; // The index of the tile occupying the position that this
  //   tile is moving to (if it is moving).
  this.spawning = false; // Whether or not this tile has been selected as the
  //   location of a random spawn. Affects how the tile
  //   is painted with paintMotion().
  this.merging = false; // Whether or not the value to be displayed on this
  //   tile is the result of a merge.
}

// Editing methods.

Tile.prototype.setValue = function (n) {
  // 1. Update the value and colour of the tile.
  this.value = n;
  this.colour = colours[n];
};

Tile.prototype.clear = function () {
  // 1. Update the value and colour of the tile.
  this.setValue(0);
};

Tile.prototype.spawn = function (n) {
  // 1. Update the value and colour of the tile.
  this.setValue(n);

  // 2. Update the value of this.spawning.
  this.spawning = true;
};

Tile.prototype.merge = function () {
  // 1. Update the value and colour of the tile.
  this.value++;
  this.colour = colours[this.value];

  // 2. Update the value of this.merging.
  this.merging = true;

  // 3. Update the score.
  score += 1 << this.value;
};

// Display methods.

Tile.prototype.paintBlank = function () {
  paintRegularHexagon(this.x, this.y, sideLength, colours[0]);
};

Tile.prototype.paintSlide = function (t) {
  if (this.previousValue != 0) {
    let x = tiles[this.target].x * t + this.x * (1 - t);
    let y = tiles[this.target].y * t + this.y * (1 - t);
    paintRegularHexagon(x, y, sideLength, this.previousColour);
    this.text(this.previousValue, x, y);
  }
};

Tile.prototype.paintSpawn = function (t) {
  if (this.spawning) {
    paintRegularHexagon(this.x, this.y, sideLength * t, this.colour);
  }
};

Tile.prototype.paintFlash = function (t) {
  if (this.spawning || this.merging) {
    paintRegularHexagon(this.x, this.y, sideLength * t, this.colour);
    this.text(this.value, this.x, this.y);
  }
};

Tile.prototype.paintPlain = function () {
  paintRegularHexagon(this.x, this.y, sideLength, this.colour);
  this.text(this.value, this.x, this.y);
};

Tile.prototype.text = function (n, x, y) {
  // 1. Determine the font size, dependent on the number to be displayed.
  let fontSize;
  if (n === 0) {
    // Display nothing.
    return;
  } else if (n < 7) {
    // Display 1 or 2 digits.
    fontSize = 40;
  } else if (n < 10) {
    // Display 3 digits.
    fontSize = 36;
  } else if (n < 14) {
    // Display 4 digits.
    fontSize = 32;
  } else if (n < 17) {
    // Display 5 digits.
    fontSize = 28;
  } else if (n < 20) {
    // Display 6 digits.
    fontSize = 24;
  } else {
    // Display 7 digits.
    fontSize = 20;
  }

  // 2. Apply the appropriate stretches.
  x *= stretch;
  y *= stretch;
  fontSize *= stretch;

  // 2. Determine the text colour.
  if (n > 2) {
    fill(lightTextColour);
  } else {
    fill(darkTextColour);
  }

  // 3. Paint the text.
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  text(1 << n, x, y);
};
