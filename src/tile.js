class Tile {
  constructor(col, row) {
    // Tiles are painted up to twice. Normally, the tile is painted at its
    // position shown above. Upon making a move, nonempty tiles slide in the
    // direction of the move if possible, to some destination position. During
    // the move, the original position of the tile is painted as empty, while
    // it is painted at some location along the path of motion.

    // Position properties (centre of tile)
    this.col = col;
    this.row = row;

    // Display properties.

    // The base-2 logarithm of the number displayed on this tile.
    // 0 if the tile is empty.
    this.value = 0;

    // The previous value of this tile.
    this.previousValue = 0;

    // Motion properties.

    // The tile that this tile is moving to (if at all).
    this.target = this;

    // Whether this tile has been selected as the location of a random spawn.
    // Affects how the tile is painted with paintMotion().
    this.spawning = false;

    // Whether the value to be displayed on this tile is the result of a merge.
    this.merging = false;
  }

  isEmpty() {
    return this.value === 0;
  }

  // Editing methods.
  setValue(n) {
    this.value = n;
  }

  clear() {
    this.value = 0;
  }

  reset() {
    this.value = 0;
    this.previousValue = 0;
    this.target = this;
    this.spawning = false;
    this.merging = false;
  }

  spawn(n) {
    this.value = n;
    this.spawning = true;
  }

  merge() {
    this.previousValue = this.value;
    this.value++;
    this.merging = true;
    score += 1 << this.value;
  }

  finishUpdating() {
    this.previousValue = this.value;
    this.target = this;
    this.spawning = false;
    this.merging = false;
  }

  // Display methods
  paintBlank() {
    painter.paintTileHexagon([this.col, this.row], 0);
  }

  paintSlide(t) {
    if (this.previousValue !== 0) {
      const col = this.target.col * t + this.col * (1 - t);
      const row = this.target.row * t + this.row * (1 - t);
      painter.paintTileHexagon([col, row], this.previousValue);
      painter.paintTileNumber([col, row], this.previousValue);
    }
  }

  paintSpawn(t) {
    if (this.spawning) {
      painter.paintTileHexagon([this.col, this.row], this.value, t);
    }
  }

  paintFlash(t) {
    if (this.spawning || this.merging) {
      painter.paintTileHexagon([this.col, this.row], this.value, t);
      painter.paintTileNumber([this.col, this.row], this.value);
    }
  }

  paintPlain() {
    painter.paintTileHexagon([this.col, this.row], this.value);
    painter.paintTileNumber([this.col, this.row], this.value);
  }
}
