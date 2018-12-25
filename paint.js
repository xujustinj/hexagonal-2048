function paint_regular_hexagon (x, y, s, colour) {
    // Paints a regular hexagon that looks like this <=> on the canvas.
    // The centre of the hexagon is located at (x,y).
    // The distance between the centre of the hexagon and any of its vertices is
    //   s, which is also its side length.
    // The hexagon is filled with the consumed colour.

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
