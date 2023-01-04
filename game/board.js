class Board {
  constructor(tiles, directions, initialSpawnCount, moveSpawnCount) {
    this.tiles = tiles;
    this.directions = directions;

    this.pairsCache = {};
    this.linesCache = {};

    this.initialSpawnCount = initialSpawnCount;
    this.moveSpawnCount = moveSpawnCount;

    this.score = 0;
  }

  isGameOver() {
    // Whether or not the game is over.
    return (
      this.tiles.every((tile) => !tile.isEmpty()) &&
      this.directions.every((direction) =>
        this.getPairs(direction).every(([a, b]) => a.value !== b.value)
      )
    );
  }

  getPairs(direction) {
    // Returns all pairs [a,b] of tiles where b is the neighbour of a in the
    // given direction.
    if (this.pairsCache[direction] === undefined) {
      this.pairsCache[direction] = this.getPairsImpl(direction);
    }
    return this.pairsCache[direction];
  }

  getPairsImpl(direction) {
    // "Abstract" method.
    // Returns all pairs [a,b] of tiles where b is the neighbour of a in the
    // given direction.
    return;
  }

  getLines(direction) {
    // Returns all lines of tiles [a,b,c,...] that are aligned with the given
    // direction.
    if (this.linesCache[direction] === undefined) {
      const nextTile = new Map();
      const prevTile = new Map();
      for (const [tile, neighbour] of this.getPairs(direction)) {
        nextTile.set(tile, neighbour);
        prevTile.set(neighbour, tile);
      }
      return this.tiles
        .filter((tile) => !prevTile.has(tile))
        .map((root) => {
          const line = [];
          let tile = root;
          while (tile !== undefined) {
            line.push(tile);
            tile = nextTile.get(tile);
          }
          return line;
        });
    }
    return this.linesCache[direction];
  }

  slide(line) {
    // line is an array of tiles parallel to the direction of the player's move.
    // Earlier indices correspond to tiles further along the direction.
    const transitions = line.map((tile) => new TileTransition(tile)).reverse();

    let originIdx = 1;
    let targetIdx = 0;
    while (originIdx < transitions.length) {
      // Slide each nonempty tile to the furthest tile that it can slide into.

      if (originIdx === targetIdx) {
        // Origin and target are the same -- skip.
        originIdx++;
        continue;
      }

      const origin = transitions[originIdx];
      if (origin.tile.isEmpty()) {
        // Current tile is empty -- skip.
        originIdx++;
        continue;
      }

      const target = transitions[targetIdx];
      if (TileTransition.canSlide(origin, target)) {
        TileTransition.slide(origin, target);
        originIdx++;
      } else {
        // Try again with the next target.
        targetIdx++;
        continue;
      }
    }

    return transitions;
  }

  spawn(transitions, n) {
    // Selects up to n empty tiles and populates them with values.
    const empty = transitions.filter((transition) => transition.isEmpty());
    const toSpawn = sample(empty, n);
    for (const transition of toSpawn) {
      transition.spawnRandom();
    }
    return transitions;
  }

  move(direction) {
    transitions = this.getLines(direction)
      .map((line) => this.slide(line))
      .flat();
    if (transitions.some((transition) => transition.isMoved())) {
      return this.spawn(transitions, this.moveSpawnCount);
    }
    return null;
  }

  reset() {
    this.score = 0;
    this.tiles.forEach((tile) => tile.clear());
    const transitions = this.tiles.map((tile) => new TileTransition(tile));
    return this.spawn(transitions, this.initialSpawnCount);
  }
}

class HexBoard extends Board {
  // The 19 hexagonal tiles that make up the board.
  /*
       x  -2  -1   0  +1  +2
     y +----------------------
    -4 |           *
    -3 |       *       *
    -2 |   *       *       *
    -1 |       *       *
     0 |   *       *       *
    +1 |       *       *
    +2 |   *       *       *
    +3 |       *       *
    +4 |           *
  */

  constructor() {
    const directions = [
      HexDirection.UP_LEFT,
      HexDirection.UP_MIDDLE,
      HexDirection.UP_RIGHT,
      HexDirection.DOWN_LEFT,
      HexDirection.DOWN_MIDDLE,
      HexDirection.DOWN_RIGHT,
    ];
    const tileCoordinates = [
      [-2, -2],
      [-2, 0],
      [-2, 2],
      [-1, -3],
      [-1, -1],
      [-1, 1],
      [-1, 3],
      [0, -4],
      [0, -2],
      [0, 0],
      [0, 2],
      [0, 4],
      [1, -3],
      [1, -1],
      [1, 1],
      [1, 3],
      [2, -2],
      [2, 0],
      [2, 2],
    ];

    const tileMap = {};
    for (const cr of tileCoordinates) {
      const [col, row] = cr;
      tileMap[cr] = new Tile(col, row);
    }

    super(Object.values(tileMap), directions, 3, 2);
    this.tileMap = tileMap;
  }

  getPairsImpl(direction) {
    const pairs = [];
    for (const tile of this.tiles) {
      const neighbourCol = tile.col + direction.colOffset;
      const neighbourRow = tile.row + direction.rowOffset;
      const neighbour = this.tileMap[[neighbourCol, neighbourRow]];
      if (neighbour !== undefined) {
        pairs.push([tile, neighbour]);
      }
    }
    return pairs;
  }
}
