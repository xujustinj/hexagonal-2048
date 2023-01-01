class Painter {
  font = null;
  sideLength = 60;
  spacing = 10;
  fontSizes = { 1: 40, 2: 40, 3: 36, 4: 32, 5: 28, 6: 24, 7: 20 };
  scoreSize = 30;
  diameter = 2 * sin60 * this.sideLength + this.spacing;

  constructor(font) {
    this.font = font;
  }

  // The scale factor of the canvas.
  // This does not use p5's scale(x,y) function, which results in fuzzy edges.
  // We instead apply the stretch before calling p5 paint methods.
  scale = 1;
  setScale(s) {
    this.scale = s;
  }

  getXY([col, row]) {
    return [
      col * sin60 * this.diameter * this.scale,
      row * this.diameter * this.scale,
    ];
  }

  paintTileHexagon([col, row], value, size = 1) {
    const [x, y] = this.getXY([col, row]);

    fill(tileColors[value]);
    noStroke();

    const s = this.sideLength * this.scale * size;
    const h = s * sin60;
    const w = s * cos60;

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
    textSize(this.fontSizes[numberAsString.length]);
    textAlign(CENTER, CENTER);
    fill(value <= 2 ? darkTextColor : lightTextColor);
    text(numberAsString, x, y - 7); // correct for misalignment
  }

  paintScore(score) {
    push();
    {
      translate(600 * this.scale, 600 * this.scale);
      textFont(this.font);
      textSize(30 * this.scale);
      textAlign(RIGHT, BOTTOM);
      fill(lightTextColor);
      text(`Score: ${score}`, -8 * this.scale, -4 * this.scale);
    }
    pop();
  }
}
