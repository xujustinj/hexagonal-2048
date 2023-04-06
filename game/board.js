class Board {
  // A family of line forests, with the same set of tiles as their vertices.
  // The tiles can slide in the directions of their edges, merging if they
  // encounter another tile of the same value.

  constructor(graphs, { initialSpawnCount, moveSpawnCount }) {
    assert(graphs instanceof Map);
    assert(graphs.size > 0);

    this.graphs = graphs;
    let tiles = null;
    for (const graph of graphs.values()) {
      assert(graph instanceof LineForest);
      if (tiles === null) {
        tiles = graph.vertices;
      } else {
        assert(setsEqual(tiles, graph.vertices));
      }
    }
    this.tiles = Array.from(tiles);
    this.directions = Array.from(graphs.keys());

    // The number of tiles spawned when the game begins.
    assert(initialSpawnCount >= 0);
    this.initialSpawnCount = initialSpawnCount;

    // The (maximum) number of tiles spawned after the player moves.
    assert(moveSpawnCount > 0);
    this.moveSpawnCount = moveSpawnCount;

    this.score = 0;
  }

  isGameOver() {
    // Whether the game is over.
    return (
      this.tiles.every((tile) => !tile.isEmpty()) &&
      Array.from(this.graphs.values()).every((graph) => {
        for (const [tile, succ] of graph.successors.entries()) {
          if (tile.value === succ.value) {
            return false;
          }
        }
        return true;
      })
    );
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
    const transitions = this.graphs
      .get(direction)
      .lines.map((line) => this.slide(line))
      .flat();
    if (transitions.some((transition) => transition.isMoved())) {
      return this.spawn(transitions, this.moveSpawnCount);
    }
    return null;
  }

  loadGame() {
    var savedGame = JSON.parse(localStorage.getItem('progress'));

    if (typeof(savedGame.game) !== undefined) {
      this.tiles = savedGame.game;
    }
    if (typeof(savedGame.game) !== undefined) {
      this.score = savedGame.score;
    }

    return this.tiles;
  }

  reset() {
    this.score = 0;
    this.tiles.forEach((tile) => tile.clear());
    const transitions = this.tiles.map((tile) => new TileTransition(tile));
    return this.spawn(transitions, this.initialSpawnCount);
  }
}

class HexBoard extends Board {
  // A board of 19 tiles arranged in a hexagon. Adjacent tiles are paired.
  // HexBoards place their tiles using column/row (c,r) coordinates, below:
  /*
       c  -2  -1   0  +1  +2
     r +----------------------
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
  //
  static COORDINATES = [
    { c: -2, r: -2 },
    { c: -2, r: 0 },
    { c: -2, r: 2 },
    { c: -1, r: -3 },
    { c: -1, r: -1 },
    { c: -1, r: 1 },
    { c: -1, r: 3 },
    { c: 0, r: -4 },
    { c: 0, r: -2 },
    { c: 0, r: 0 },
    { c: 0, r: 2 },
    { c: 0, r: 4 },
    { c: 1, r: -3 },
    { c: 1, r: -1 },
    { c: 1, r: 1 },
    { c: 1, r: 3 },
    { c: 2, r: -2 },
    { c: 2, r: 0 },
    { c: 2, r: 2 },
  ];
  static OFFSET = new Map([
    [HexDirection.UP_LEFT, { dc: -1, dr: -1 }],
    [HexDirection.UP_MIDDLE, { dc: 0, dr: -2 }],
    [HexDirection.UP_RIGHT, { dc: 1, dr: -1 }],
    [HexDirection.DOWN_LEFT, { dc: -1, dr: 1 }],
    [HexDirection.DOWN_MIDDLE, { dc: 0, dr: 2 }],
    [HexDirection.DOWN_RIGHT, { dc: 1, dr: 1 }],
  ]);

  constructor(options) {
    const graphs = new Map();

    const tiles = {};
    for (const { c, r } of HexBoard.COORDINATES) {
      const tile = new Tile(c * SIN_60, r * COS_60);
      if (!(c in tiles)) {
        tiles[c] = {};
      }
      tiles[c][r] = tile;
    }

    for (const [direction, { dc, dr }] of HexBoard.OFFSET.entries()) {
      const edges = new Map();
      for (const { c, r } of HexBoard.COORDINATES) {
        const tile = tiles[c][r];
        const neighbours = [];
        const successor = (tiles[c + dc] ?? {})[r + dr];
        if (successor !== undefined) {
          neighbours.push(successor);
        }
        edges.set(tile, neighbours);
      }
      graphs.set(direction, new LineForest(edges));
    }

    super(graphs, options);
  }
}
