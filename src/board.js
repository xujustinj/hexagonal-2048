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

  flush() {
    this.tiles.forEach((tile) => tile.flush());
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

  moving() {
    // Whether any tiles are moving.
    return this.tiles.some((tile) => tile.moving());
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

  reset() {
    // 1. Reset the score.
    this.score = 0;

    // 2. Create the tiles.
    this.tiles.forEach((tile) => tile.clear());

    // 3. Determine the starting tiles.
    this.spawn(this.initialSpawnCount);
  }

  slide(line) {
    // line is an array of tiles parallel to the direction of the player's move.
    // Earlier indices correspond to tiles further along the direction.
    let i = line.length - 1;
    let j = i;
    while (j >= 0) {
      const targetTile = line[i];
      const currentTile = line[j];
      if (currentTile.isEmpty() || currentTile === targetTile) {
        // do nothing and continue
        currentTile.target = currentTile;
        j--;
      } else if (targetTile.isEmpty()) {
        targetTile.setValue(currentTile.value);
        currentTile.clear();
        currentTile.target = targetTile;
        j--;
      } else if (currentTile.value === targetTile.value) {
        this.score += targetTile.merge();
        currentTile.clear();
        currentTile.target = targetTile;
        i--;
        j--;
      } else if (currentTile.value !== targetTile.value) {
        i--;
      }
    }
  }

  spawn(n) {
    // Selects up to n empty tiles and populates them with values.
    const emptyTiles = this.tiles.filter((tile) => tile.isEmpty());
    const tilesToSpawn = sample(emptyTiles, n);
    for (const tile of tilesToSpawn) {
      tile.spawnRandom();
    }
  }

  move(direction) {
    this.flush();

    for (const line of this.getLines(direction)) {
      this.slide(line);
    }

    if (this.moving()) {
      this.spawn(this.moveSpawnCount);
    }
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

    super(Object.values(tileMap), HexDirection.all, 3, 2);
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
