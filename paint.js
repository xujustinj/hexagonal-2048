function paint_rectangle(name, x1, y1, x2, y2, red, green, blue, roundness) {
  colorMode(RGB, 255);
  noStroke();
  fill(red, green, blue);

  var left = x1;
  var right = x2;
  if (x1 > x2) {
    left = x2;
    right = x1;
  }

  var top = y1;
  var bottom = y2;
  if (y1 > y2) {
    top = y2;
    bottom = y1;
  }

  rect(left, top, right - left, bottom - top, roundness);

//  register("rectangle", name, (x1 + x2) / 2, (y1 + y2) / 2, left, right, top, bottom, red, green, blue, null, roundness);
}

function paint_regular_hexagon_unrounded(name, x, y, r, red, green, blue) { // regular hexagon that looks like this <=>
  colorMode(RGB, 255);
  stroke(red, green, blue);
  fill(red, green, blue);

  rect(x - (r - 1) / 2, y - (r - 1) * Math.sqrt(3) / 2, r - 1, (r - 1) * Math.sqrt(3)); // r - 1 serves the purpose of making everything smaller so that the strokes overlap in the centre of the object without leaving any ugly blank lines
  triangle(x - (r - 1) / 2, y - (r - 1) * Math.sqrt(3) / 2, x - (r - 1), y, x - (r - 1) / 2, y + (r - 1) * Math.sqrt(3) / 2);
  triangle(x + (r - 1) / 2, y - (r - 1) * Math.sqrt(3) / 2, x + (r - 1), y, x + (r - 1) / 2, y + (r - 1) * Math.sqrt(3) / 2);

//  register("regular_hexagon", name, x, y, x - Math.abs(r), x + Math.abs(r), y - Math.abs(r) * Math.sqrt(3) / 2, red, green, blue, Math.abs(r), 0);
}

function register(type, name, x, y, left, right, top, bottom, r, g, b, p1, roundness) {
  var exists;

  for (var i = 0; i < shapes.length; i ++) {
    if (shapes[i].name == name) {
      shapes[i].type = type;
      shapes[i].x = x;
      shapes[i].y = y;
      shapes[i].left = left;
      shapes[i].right = right;
      shapes[i].top = top;
      shapes[i].bottom = bottom;
      shapes[i].r = red;
      shapes[i].g = green;
      shapes[i].b = blue;
      shapes[i].p1 = p1;
      shapes[i].roundness = roundness;

      exists = true;
    }
  }

  if (!exists) {
    shapes.unshift(new Object());
    shapes[i].type = type;
    shapes[i].name = name;
    shapes[i].x = x;
    shapes[i].y = y;
    shapes[i].left = left;
    shapes[i].right = right;
    shapes[i].top = top;
    shapes[i].bottom = bottom;
    shapes[i].r = red;
    shapes[i].g = green;
    shapes[i].b = blue;
    shapes[i].p1 = r;
    shapes[i].roundness = 0;
  }
}
