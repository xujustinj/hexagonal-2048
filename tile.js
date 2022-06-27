class Tile {
  constructor(n) {
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
    this.previousValue = 0; // The previous value of this tile.

    // Motion properties.

    this.target = 0; // The index of the tile occupying the position that this
    //   tile is moving to (if it is moving).
    this.spawning = false; // Whether or not this tile has been selected as the
    //   location of a random spawn. Affects how the tile
    //   is painted with paintMotion().
    this.merging = false; // Whether or not the value to be displayed on this
    //   tile is the result of a merge.
  }

  isEmpty() {
    return this.value === 0;
  }

  // Editing methods.
  setValue(n) {
    this.value = n;
  }

  clear() {
    this.setValue(0);
  }

  spawn(n) {
    this.setValue(n);
    this.spawning = true;
  }

  merge() {
    this.value++;
    this.merging = true;
    score += 1 << this.value;
  }

  finishUpdating() {
    this.target = this.id;
    this.previousValue = this.value;
    this.spawning = false;
    this.merging = false;
  }

  // Display methods
  paintBlank() {
    paintRegularHexagon(this.x, this.y, sideLength, colours[0]);
  }

  paintSlide(t) {
    if (this.previousValue != 0) {
      let x = tiles[this.target].x * t + this.x * (1 - t);
      let y = tiles[this.target].y * t + this.y * (1 - t);
      paintRegularHexagon(x, y, sideLength, colours[this.previousValue]);
      paintTileNumber(this.previousValue, x, y);
    }
  }

  paintSpawn(t) {
    if (this.spawning) {
      paintRegularHexagon(this.x, this.y, sideLength * t, colours[this.value]);
    }
  }

  paintFlash(t) {
    if (this.spawning || this.merging) {
      paintRegularHexagon(this.x, this.y, sideLength * t, colours[this.value]);
      paintTileNumber(this.value, this.x, this.y);
    }
  }

  paintPlain() {
    paintRegularHexagon(this.x, this.y, sideLength, colours[this.value]);
    paintTileNumber(this.value, this.x, this.y);
  }
}
