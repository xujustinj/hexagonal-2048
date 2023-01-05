class Painter {
  static FONT_SRC =
    "https://raw.githubusercontent.com/intel/clear-sans/main/TTF/ClearSans-Bold.ttf";
  font = undefined;

  // The default length of the side of each hexagonal tile.
  sideLength = 60;

  // The width of the gap between adjacent tiles.
  spacing = 10;
  fontSizes = { 1: 40, 2: 40, 3: 36, 4: 32, 5: 28, 6: 24, 7: 20 };
  scoreSize = 30;
  diameter = 2 * SIN_60 * this.sideLength + this.spacing;

  // color(...) is not accessible outside of the setup() and draw() methods.
  // These colour variables will be lazily initialized in initColors() instead.

  // The fill colour of the canvas.
  bgColor = undefined;

  // Array of background colours of hexagonal tiles on the board.
  // tileColors[0] is the colour of the empty tile.
  // For 0 < n <= 20, tileColors[n] is the colour of tiles with the value 2^n.
  tileColors = undefined;

  // The text colour of all tiles other than the 2 and 4 tiles.
  lightTextColor = undefined;
  // The text colour of the 2 and 4 tiles.
  darkTextColor = undefined;

  // The proportion of the window filled by the canvas.
  proportion = 0.9;
  canvas = undefined;

  static BASE_SIZE = 600;
  size = Painter.BASE_SIZE;

  centre = this.size / 2;

  fps = 60;

  // The scale factor of the canvas.
  // This does not use p5's scale(x,y) function, which results in fuzzy edges.
  // We instead apply the stretch before calling p5 paint methods.
  scale = 1;

  // The duration (in seconds) of the moving and flashing animations.
  slideDuration = 0.2;
  spawnDuration = 0.1;
  flashDuration = 0.1;
  preTransitionDuration = Math.max(this.slideDuration, this.spawnDuration);
  postTransitionDuration = this.flashDuration;

  flashStrength = 0.2;

  transitionTime = null;

  // A callback to invoke the transition at the transition time.
  onTransition = null;

  setSize(size) {
    this.size = size;
    this.centre = this.size / 2;
    this.scale = this.size / Painter.BASE_SIZE;
    resizeCanvas(this.size, this.size);
    this.centreCanvas();
  }

  preload() {
    this.font = loadFont(Painter.FONT_SRC);
  }

  setup() {
    this.initCanvas();
    this.initColors();
    this.autoSize();
    frameRate(this.fps);
  }

  autoSize() {
    const windowSize = Math.min(windowWidth, windowHeight);
    this.setSize(Math.floor(this.proportion * windowSize));
  }

  initCanvas() {
    this.canvas = createCanvas(this.size, this.size);
    this.centreCanvas();
  }

  centreCanvas() {
    this.canvas.position(
      (windowWidth - width) / 2,
      (windowHeight - height) / 2
    );
  }

  tileToScreen({ x, y }) {
    const u = this.diameter * this.scale;
    return { x: x * u, y: y * u };
  }

  initColors() {
    colorMode(RGB, 255);
    this.bgColor = color(187, 173, 160);
    this.tileColors = [
      color(205, 193, 180), // empty
      color(238, 228, 218), // 2
      color(238, 225, 201), // 4
      color(243, 178, 122), // 8
      color(246, 150, 100), // 16
      color(247, 124, 95), // 32
      color(247, 95, 59), // 64
      color(237, 208, 115), // 128
      color(237, 204, 98), // 256
      color(237, 201, 80), // 512
      color(237, 197, 63), // 1024
      color(237, 194, 46), // 2048
      // Based on the screenshot found at
      // nicosai.wordpress.com/2014/10/31/10-things-i-learned-from-2048/
      color(239, 103, 108), // 4096
      color(237, 77, 88), // 8192
      color(226, 67, 57), // 16384
      color(113, 180, 213), // 32768
      color(94, 160, 223), // 65536
      color(0, 124, 190), // 131072
      // Arbitrarily incrementing by (10,20,-20) hereon.
      color(10, 144, 170), // 262114
      color(20, 164, 150), // 524288
      color(30, 184, 130), // 1048576
    ];
    this.lightTextColor = color(249, 246, 242);
    this.darkTextColor = color(119, 110, 101);
  }

  paintTileHexagon(coordinates, value, size = 1.0) {
    const { x, y } = this.tileToScreen(coordinates);
    const s = this.sideLength * size * this.scale;
    const h = s * SIN_60;
    const w = s * COS_60;
    const tileColor = this.tileColors[value];

    push();
    {
      translate(x, y);
      beginShape();
      fill(tileColor);
      noStroke();
      vertex(-s, 0);
      vertex(-w, -h);
      vertex(w, -h);
      vertex(s, 0);
      vertex(w, h);
      vertex(-w, h);
      endShape(CLOSE);
    }
    pop();
  }

  paintTileValue(coordinates, value, size = 1.0) {
    if (value === 0) {
      return;
    }

    const { x, y } = this.tileToScreen(coordinates);
    const numberAsString = (1 << value).toString();

    push();
    {
      translate(x, y);
      textFont(this.font);
      textSize(this.fontSizes[numberAsString.length] * size * this.scale);
      textAlign(CENTER, CENTER);
      fill(value <= 2 ? this.darkTextColor : this.lightTextColor);
      // -7 to correct for vertical alignment
      text(numberAsString, 0, -7 * size * this.scale);
    }
    pop();
  }

  paintScore(score) {
    push();
    {
      translate(this.size, this.size);
      textFont(this.font);
      textSize(this.scoreSize * this.scale);
      textAlign(RIGHT, BOTTOM);
      fill(this.lightTextColor);
      text(`Score: ${score}`, -8 * this.scale, -4 * this.scale);
    }
    pop();
  }

  paintBlank(tile) {
    this.paintTileHexagon(tile.coordinates, 0);
  }

  paintTile(tile) {
    this.paintTileHexagon(tile.coordinates, tile.value);
    this.paintTileValue(tile.coordinates, tile.value);
  }

  animateSlide(transition, t) {
    if (transition.oldValue !== 0) {
      const xy = {
        x:
          t * transition.target.coordinates.x +
          (1 - t) * transition.tile.coordinates.x,
        y:
          t * transition.target.coordinates.y +
          (1 - t) * transition.tile.coordinates.y,
      };
      this.paintTileHexagon(xy, transition.oldValue);
      this.paintTileValue(xy, transition.oldValue);
    }
  }

  animateSpawn(transition, t) {
    if (transition.type === TileTransitionType.SPAWN) {
      this.paintTileHexagon(
        transition.tile.coordinates,
        transition.newValue,
        t
      );
    }
  }

  animateFlash(transition, t) {
    assert(0 <= t && t <= 1);
    const size =
      transition.type === TileTransitionType.MERGE
        ? 1.0 + Math.cos((t * Math.PI) / 2) * this.flashStrength
        : 1.0;
    this.paintTileHexagon(
      transition.tile.coordinates,
      transition.newValue,
      size
    );
    this.paintTileValue(transition.tile.coordinates, transition.newValue, size);
  }

  draw(board) {
    background(this.bgColor);
    this.drawBoard(board);
    this.paintScore(board.score);
    if (this.transitions === null) {
      noLoop();
    }

    if (this.transitionTime !== null) {
      const time = now();
      if (time >= this.transitionTime && this.onTransition !== null) {
        // Trigger the transition.
        this.onTransition(this.transitions);
        this.onTransition = null;
      }
      if (time >= this.transitionTime + this.postTransitionDuration) {
        // Cleanup the transition.
        this.transitions = null;
        this.transitionTime = null;
      }
    }
  }

  transition(transitions, onTransition) {
    // Sets up the painter to animate a transition.
    if (this.onTransition !== null) {
      this.onTransition(this.transitions);
    }

    this.transitionTime = now() + this.preTransitionDuration;
    this.transitions = transitions;
    this.onTransition = onTransition;

    // Unfreeze the animation loop.
    loop();
  }

  drawBoard(board) {
    push();
    {
      translate(this.centre, this.centre);

      const time = now();
      if (this.transitionTime !== null && this.transitions !== null) {
        board.tiles.forEach((tile) => this.paintBlank(tile));

        if (time < this.transitionTime) {
          // Pre-Transition

          if (time >= this.transitionTime - this.slideDuration) {
            const t = 1 - (this.transitionTime - time) / this.slideDuration;
            this.transitions.forEach((transition) =>
              this.animateSlide(transition, t)
            );
          }

          if (time >= this.transitionTime - this.spawnDuration) {
            const t = 1 - (this.transitionTime - time) / this.spawnDuration;
            this.transitions.forEach((transition) =>
              this.animateSpawn(transition, t)
            );
          }
        } else {
          // Post-Transition

          board.tiles.forEach((tile) => this.paintTile(tile));

          if (time < this.transitionTime + this.flashDuration) {
            const t = (time - this.transitionTime) / this.flashDuration;
            this.transitions.forEach((transition) =>
              this.animateFlash(transition, t)
            );
          }
        }
      } else {
        board.tiles.forEach((tile) => this.paintTile(tile));
      }
    }
    pop();
  }
}
