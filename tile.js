const space = 12;

function Tile() {

  this.id = 0;
  this.sideLength = 64;

  this.value = 0;
  this.colour = colours[0];

  // This default behaviour is poor communication and should be put into the define function instead.
  this.shouldX = this.x = centre;
  this.shouldY = this.y = centre;

  this.define = function(n) {
    this.id = n;
    this.sideLength = 64;

    if ((n == 12) || (n == 13) || (n == 14)) {
      this.shouldX = this.x -= this.sideLength * 3 + space * sin60 * 2;
    } else if ((n == 3) || (n == 4) || (n == 11) || (n == 15)) {
      this.shouldX = this.x -= this.sideLength * 1.5 + space * sin60;
    } else if ((n == 1) || (n == 6) || (n == 9) || (n == 17)) {
      this.shouldX = this.x += this.sideLength * 1.5 + space * sin60;
    } else if ((n == 7) || (n == 8) || (n == 18)) {
      this.shouldX = this.x += this.sideLength * 3 + space * sin60 * 2;
    }

    if (n == 10) {
      this.shouldY = this.y -= this.sideLength * sin60 * 4 + space * 2;
    } else if ((n == 9) || (n == 11)) {
      this.shouldY = this.y -= this.sideLength * sin60 * 3 + space * 1.5;
    } else if ((n == 2) || (n == 8) || (n == 12)) {
      this.shouldY = this.y -= this.sideLength * sin60 * 2 + space;
    } else if ((n == 1) || (n == 3)) {
      this.shouldY = this.y -= this.sideLength * sin60 + space * 0.5;
    } else if ((n == 4) || (n == 6)) {
      this.shouldY = this.y += this.sideLength * sin60 + space * 0.5;
    } else if ((n == 5) || (n == 14) || (n == 18)) {
      this.shouldY = this.y += this.sideLength * sin60 * 2 + space;
    } else if ((n == 15) || (n == 17)) {
      this.shouldY = this.y += this.sideLength * sin60 * 3 + space * 1.5;
    } else if (n == 16) {
      this.shouldY = this.y += this.sideLength * sin60 * 4 + space * 2;
    }
  }

  this.move = function() {
    this.sideLength = 64;

    if (moving > 5) {
      this.x = tiles[target[this.id]].x - (moving - 5) * (tiles[target[this.id]].x - this.shouldX) / 11;
      this.y = tiles[target[this.id]].y - (moving - 5) * (tiles[target[this.id]].y - this.shouldY) / 11;
    } else if ((before[this.id] < tiles[target[this.id]].value) && ((moving == 5) || (moving == 1))) {
      this.sideLength = 66;
      this.x = tiles[target[this.id]].x;
      this.y = tiles[target[this.id]].y;
    } else if ((before[this.id] < tiles[target[this.id]].value) && ((moving == 4) || (moving == 2))) {
      this.sideLength = 68;
      this.x = tiles[target[this.id]].x;
      this.y = tiles[target[this.id]].y;
    } else if ((before[this.id] < tiles[target[this.id]].value) && (moving == 3)) {
      this.sideLength = 72;
      this.x = tiles[target[this.id]].x;
      this.y = tiles[target[this.id]].y;
    } else if (moving > 0) {
      this.x = tiles[target[this.id]].x;
      this.y = tiles[target[this.id]].y;
    }
  }

  this.setValue = function(n) { // use an array instead.
    this.value = n;
    this.colour = colours[n];
  }

  this.paintDummy = function() {
    paint_regular_hexagon(this.x, this.y, this.sideLength, colours[0]);
  }

  this.paint = function() {
    paint_regular_hexagon(this.x, this.y, this.sideLength, colours[this.value]);
  }

  this.text = function() {
    var num = pow(2, this.value);
    var length = (num + "").length; // digits

    textAlign(CENTER, CENTER);

    if (length < 3) {
      textSize(52);
    } else if (length < 4) {
      textSize(48);
    } else if (length < 5) {
      textSize(44);
    } else if (length < 6) {
      textSize(40);
    } else if (length < 7) {
      textSize(36);
    } else {
      textSize(32);
    }

    if (this.value > 2) {
      fill(249, 246, 242);
      text(num, this.x, this.y);
    } else if (this.value > 0) {
      fill(119, 110, 101);
      text(num, this.x, this.y);
    } // else (this.value == 0) -> do nothing
  }
}
