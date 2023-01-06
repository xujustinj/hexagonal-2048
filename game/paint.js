class Painter {
  static DEFAULT_CANVAS_SIZE = 600;

  constructor({
    windowProportion,
    tileSideLength,
    tileSpacing,
    framesPerSecond,
    slideDuration,
    spawnDuration,
    flashDuration,
    flashMagnitude,
    fontSrc,
    tileValueSizes,
    scoreSize,
    backgroundRGB,
    tileRGBs,
    scoreRGB,
  }) {
    // SIZING
    assert(windowProportion > 0.0);
    this.windowProportion = windowProportion;

    assert(tileSideLength > 0.0);
    this.tileSideLength = tileSideLength;

    assert(tileSpacing >= 0.0);
    // The distance between tiles.
    this.tileDistance = 2 * SIN_60 * tileSideLength + tileSpacing;

    // ANIMATION CONFIG
    assert(framesPerSecond > 0);
    this.framesPerSecond = framesPerSecond;

    assert(slideDuration >= 0.0);
    this.slideDuration = slideDuration;
    assert(spawnDuration >= 0.0);
    this.spawnDuration = spawnDuration;
    assert(flashDuration >= 0.0);
    this.flashDuration = flashDuration;

    this.preTransitionDuration = Math.max(slideDuration, spawnDuration);
    this.postTransitionDuration = this.flashDuration;

    assert(flashMagnitude >= 0.0);
    this.flashMagnitude = flashMagnitude;

    // FONT
    // Fonts are loaded lazily in preload().
    this.fontSrc = fontSrc;
    this.font = undefined;
    this.tileValueSizes = tileValueSizes;
    this.scoreSize = scoreSize;

    // COLORS
    // color(...) is not accessible outside of the setup() and draw() methods.
    // Colour variables will be lazily initialized in initColors() instead.

    this.backgroundRGB = backgroundRGB;
    this.backgroundColor = undefined;

    // Array of {background, value} RGBs of tiles.
    // tileColors[0] has the colours of the empty tile.
    // For n > 0, tileColors[n] has the colours of tiles with the value 2^n.
    assert(tileRGBs instanceof Array);
    this.tileRGBs = tileRGBs;
    this.tileColors = undefined;

    this.scoreRGB = scoreRGB;
    this.scoreColor = undefined;

    // =========================================================================
    // INTERNAL
    this.canvas = null;
    this.canvasSize = 0.0;

    // TRANSITION
    this.transitions = null;
    this.transitionTime = null;
    // A callback to invoke the transition at the transition time.
    this.onTransition = null;
  }

  setupCanvas(size) {
    this.canvasSize = size;
    if (this.canvas === null) {
      this.canvas = createCanvas(this.canvasSize, this.canvasSize);
    } else {
      resizeCanvas(this.canvasSize, this.canvasSize);
    }
    this.canvas.position(
      (windowWidth - width) / 2,
      (windowHeight - height) / 2
    );
  }

  preload() {
    this.font = loadFont(this.fontSrc);
  }

  setup() {
    this.setupCanvas(Painter.DEFAULT_CANVAS_SIZE);
    this.initColors();
    this.autoSize();
    frameRate(this.framesPerSecond);
  }

  autoSize() {
    const windowSize = Math.min(windowWidth, windowHeight);
    const canvasSize = Math.floor(this.windowProportion * windowSize);
    this.setupCanvas(canvasSize);
  }

  centreCanvas() {
    this.canvas.position(
      (windowWidth - width) / 2,
      (windowHeight - height) / 2
    );
  }

  tileToScreen({ x, y }) {
    const u = this.tileDistance * this.canvasSize;
    return { x: x * u, y: y * u };
  }

  static rgbToColor({ r, g, b }) {
    return color(r, g, b);
  }

  initColors() {
    colorMode(RGB, 255);
    this.backgroundColor = Painter.rgbToColor(this.backgroundRGB);
    this.tileColors = this.tileRGBs.map(({ background, value }) => ({
      background: Painter.rgbToColor(background),
      value: Painter.rgbToColor(value),
    }));
    this.scoreColor = Painter.rgbToColor(this.scoreRGB);
  }

  paintTileHexagon(coordinates, value, size = 1.0) {
    const { x, y } = this.tileToScreen(coordinates);
    const s = this.tileSideLength * size * this.canvasSize;
    const h = s * SIN_60;
    const w = s * COS_60;
    const tileBackgroundColor = this.tileColors[value].background;

    push();
    {
      translate(x, y);
      beginShape();
      fill(tileBackgroundColor);
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
    const fontSize =
      this.tileValueSizes[numberAsString.length] * size * this.canvasSize;
    const tileValueColor = this.tileColors[value].value;

    const horizontalAdjustment =
      (numberAsString.startsWith("1") ? -0.04 : -0.01) * fontSize;
    const verticalAdjustment = -0.17 * fontSize;

    push();
    {
      translate(x, y);
      textFont(this.font);
      textSize(fontSize);
      textAlign(CENTER, CENTER);
      fill(tileValueColor);
      // small corrections for alignment
      text(numberAsString, horizontalAdjustment, verticalAdjustment);
    }
    pop();
  }

  paintScore(score) {
    push();
    {
      translate(this.canvasSize, this.canvasSize);
      textFont(this.font);
      textSize(this.scoreSize * this.canvasSize);
      textAlign(RIGHT, BOTTOM);
      fill(this.scoreColor);
      text(`Score: ${score}`, -0.02 * this.canvasSize, -0.01 * this.canvasSize);
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
        ? 1.0 + Math.cos((t * Math.PI) / 2) * this.flashMagnitude
        : 1.0;
    this.paintTileHexagon(
      transition.tile.coordinates,
      transition.newValue,
      size
    );
    this.paintTileValue(transition.tile.coordinates, transition.newValue, size);
  }

  draw(board) {
    background(this.backgroundColor);
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
      translate(0.5 * this.canvasSize, 0.5 * this.canvasSize);

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
