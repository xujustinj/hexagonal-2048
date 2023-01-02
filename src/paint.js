// Mathematical constants.

const SIN_60 = Math.sqrt(3) / 2; // sin(PI / 3)
const COS_60 = 1 / 2; // cos(PI / 3)
const TAN_60 = Math.sqrt(3); // tan(PI / 3)

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

  // The scale factor of the canvas.
  // This does not use p5's scale(x,y) function, which results in fuzzy edges.
  // We instead apply the stretch before calling p5 paint methods.
  scale = 1;

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

  getXY([col, row]) {
    return [
      col * SIN_60 * this.diameter * this.scale,
      (row / 2) * this.diameter * this.scale,
    ];
  }

  paintTileHexagon([col, row], value, size = 1) {
    const [x, y] = this.getXY([col, row]);

    fill(this.tileColors[value]);
    noStroke();

    const s = this.sideLength * this.scale * size;
    const h = s * SIN_60;
    const w = s * COS_60;

    beginShape();
    vertex(x - s, y);
    vertex(x - w, y - h);
    vertex(x + w, y - h);
    vertex(x + s, y);
    vertex(x + w, y + h);
    vertex(x - w, y + h);
    endShape(CLOSE);
  }

  paintTileNumber([col, row], value) {
    if (value === 0) {
      return;
    }

    const [x, y] = this.getXY([col, row]);

    const numberAsString = (1 << value).toString();

    textFont(this.font);
    textSize(this.fontSizes[numberAsString.length] * this.scale);
    textAlign(CENTER, CENTER);
    fill(value <= 2 ? this.darkTextColor : this.lightTextColor);
    text(numberAsString, x, y - 7 * this.scale); // correct for misalignment
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
}
