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
