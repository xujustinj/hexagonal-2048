function paintRegularHexagon(x, y, s, colour) {
  // Paints a regular hexagon that looks like <=> on the canvas.
  // The centre of the hexagon is located at (x,y).
  // s is the side length of the hexagon, which is also distance between its
  //   centre and its vertices.
  // The hexagon is filled with the consumed colour.

  x *= stretch;
  y *= stretch;
  s *= stretch;

  fill(colour);

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

function paintTileNumber(value, x, y, colour) {
  if (value === 0) {
    return;
  }

  const numberAsString = (1 << value).toString();

  // 1. Determine the font size, dependent on the number to be displayed.
  textSize(
    { 1: 40, 2: 40, 3: 36, 4: 32, 5: 28, 6: 24, 7: 20 }[numberAsString.length] *
      stretch
  );

  // 2. Determine the text colour.
  fill(value <= 2 ? darkTextColour : lightTextColour);

  // 3. Paint the text.
  textAlign(CENTER, CENTER);
  text(numberAsString, x * stretch, y * stretch);
}
