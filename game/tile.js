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

    // The base-2 logarithm of the number currently displayed on this tile.
    // 0 if the tile is empty.
    this.value = 0;
  }

  isEmpty() {
    return this.value === 0;
  }

  clear() {
    this.value = 0;
  }
}

class TileTransitionType {
  // There are four different ways that a tile can obtain its current value.

  // 1. There is no value (the tile is empty).
  static EMPTY = new TileTransitionType("EMPTY");

  // 2. The value slid over from another tile (possibly the same one).
  static SLIDE = new TileTransitionType("SLIDE");

  // 3. The value spawned here.
  static SPAWN = new TileTransitionType("SPAWN");

  // 4. The value merged here.
  static MERGE = new TileTransitionType("MERGE");

  constructor(name) {
    this.name = `${TileTransitionType.name}.${name}`;
  }

  toString() {
    return this.name;
  }
}

class TileTransition {
  // Each move in the game causes all tiles to "transition".
  // A tile transition consists of two parts.
  //  1. The tile, with its old value, slides to the location of another tile.
  //  2. A new value appears at the place of the tile.
  // A TileTransition object represents the transition of a single tile.
  // It contains enough information to both perform and undo the transition.
  // This class further contains methods to manage multiple simultaneous
  // transitions in a way that is consistent with the game mechanics.

  constructor(tile) {
    // By default, the transition for a tile is to slide in place, a no-op.
    // TileTransition methods modify transitions in a way that remains
    // consistent.
    this.tile = tile;
    this.target = tile;
    this.oldValue = tile.value;
    this.newValue = tile.value;
    this.type = tile.isEmpty()
      ? TileTransitionType.EMPTY
      : TileTransitionType.SLIDE;
  }

  apply() {
    // Apply this transition.
    assert(this.tile.value === this.oldValue);
    this.tile.value = this.newValue;
  }

  undo() {
    // Undo this transition.
    assert(this.tile.value === this.newValue);
    this.tile.value = this.oldValue;
  }

  getScore() {
    if (this.type === TileTransitionType.MERGE) {
      return exp2(this.newValue);
    }
    return 0;
  }

  isEmpty() {
    return this.type === TileTransitionType.EMPTY;
  }

  isMoved() {
    return this.target !== this.tile;
  }

  static canSlide(origin, target) {
    // Whether the origin tile can be slid into the target.
    return (
      // Tiles can only be slid once per transition.
      !origin.isMoved() &&
      // Tiles cannot be slid into themselves.
      origin.tile !== target.tile &&
      // Empty tiles cannot slide.
      !origin.tile.isEmpty() &&
      // Target tile must either be empty or the same value.
      (target.type === TileTransitionType.EMPTY ||
        (target.type === TileTransitionType.SLIDE &&
          origin.oldValue === target.newValue))
    );
  }

  static slide(origin, target) {
    // Slides the origin tile into the target.
    // Requires: canSlide(origin, target)
    assert(!origin.isMoved());
    assert(origin.tile !== target.tile);
    assert(!origin.tile.isEmpty());

    // Slide or merge the origin tile into the target.
    switch (target.type) {
      case TileTransitionType.EMPTY:
        assert(target.newValue === 0);
        target.newValue = origin.oldValue;
        target.type = TileTransitionType.SLIDE;
        break;
      case TileTransitionType.SLIDE:
        assert(target.newValue === origin.oldValue);
        target.newValue += 1;
        target.type = TileTransitionType.MERGE;
        break;
      default:
        throw new Error(`Cannot slide into a tile with type ${target.type}.`);
    }

    // The origin tile will become empty.
    origin.target = target.tile;
    origin.newValue = 0;
    origin.type = TileTransitionType.EMPTY;
  }

  spawn(value) {
    // Declare that the given value will spawn at this tile.
    assert(this.type === TileTransitionType.EMPTY);
    this.newValue = value;
    this.type = TileTransitionType.SPAWN;
  }

  spawnRandom() {
    // Spawning probabilities: 2 - 80%, 4 - 20%.
    this.spawn(Math.random() < 0.8 ? 1 : 2);
  }
}
