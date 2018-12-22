var space = 12;

function Tile() {

  this.id = 0;
  this.sideLength = 64;

  this.value = 0;

  this.shouldX = this.x = centreX;
  this.shouldY = this.y = centreY;

  this.red = 205;
  this.green = 193;
  this.blue = 180;

  this.define = function(n) {
    this.id = n;
    this.sideLength = 64;

    if ((n == 12) || (n == 13) || (n == 14)) {
      this.shouldX = this.x -= this.sideLength * 3 + space * h * 2;
    } else if ((n == 3) || (n == 4) || (n == 11) || (n == 15)) {
      this.shouldX = this.x -= this.sideLength * 1.5 + space * h;
    } else if ((n == 1) || (n == 6) || (n == 9) || (n == 17)) {
      this.shouldX = this.x += this.sideLength * 1.5 + space * h;
    } else if ((n == 7) || (n == 8) || (n == 18)) {
      this.shouldX = this.x += this.sideLength * 3 + space * h * 2;
    }

    if (n == 10) {
      this.shouldY = this.y -= this.sideLength * h * 4 + space * 2;
    } else if ((n == 9) || (n == 11)) {
      this.shouldY = this.y -= this.sideLength * h * 3 + space * 1.5;
    } else if ((n == 2) || (n == 8) || (n == 12)) {
      this.shouldY = this.y -= this.sideLength * h * 2 + space;
    } else if ((n == 1) || (n == 3)) {
      this.shouldY = this.y -= this.sideLength * h + space * 0.5;
    } else if ((n == 4) || (n == 6)) {
      this.shouldY = this.y += this.sideLength * h + space * 0.5;
    } else if ((n == 5) || (n == 14) || (n == 18)) {
      this.shouldY = this.y += this.sideLength * h * 2 + space;
    } else if ((n == 15) || (n == 17)) {
      this.shouldY = this.y += this.sideLength * h * 3 + space * 1.5;
    } else if (n == 16) {
      this.shouldY = this.y += this.sideLength * h * 4 + space * 2;
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

  this.setValue = function(n) {
    this.value = n;

    if (n == 1) { // 2
      this.setColour("eee4da");
    } else if (n == 2) { // 4
      this.setColour("eee1c9");
    } else if (n == 3) { // 8
      this.setColour("f3b27a");
    } else if (n == 4) { // 16
      this.setColour("f69664");
    } else if (n == 5) { // 32
      this.setColour("f77c5f");
    } else if (n == 6) { // 64
      this.setColour("f75f3b");
    } else if (n == 7) { // 128
      this.setColour("edd073");
    } else if (n == 8) { // 256
      this.setColour("edcc62");
    } else if (n == 9) { // 512
      this.setColour("edc950");
    } else if (n == 10) { // 1024
      this.setColour("edc53f");
    } else if (n == 11) { // 2048
      this.setColour("edc22e");
    } else if (n == 12) { // 4096
      this.setColour("92df63");
    } else if (n == 13) { // 8192
      this.setColour("84e248");
    } else if (n == 14) { // 16384
      this.setColour("87e431");
    } else if (n == 15) { // 32768
      this.setColour("6be415");
    } else if (n == 16) { // 65536
      this.setColour("6b9a58");
    } else if (n >= 17) { // 131072
      this.setColour("6b57a1");
    } else { // includes n <= 0
      this.red = 205;
      this.green = 193;
      this.blue = 180;
    }
  }

  this.paintDummy = function() {
    paint_regular_hexagon_unrounded("backHex" + this.id, this.x, this.y, this.sideLength, 205, 193, 180);
  }

  this.paint = function() {
    paint_regular_hexagon_unrounded("Hex" + this.id, this.x, this.y, this.sideLength, this.red, this.green, this.blue);
  }

  this.text = function() {
    var num = pow(2, this.value);
    var length = ceil(log(num) / log(10)); // digits

    textFont("Calibri");
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

  this.setColour = function(hexCode) {
    var bigint = parseInt(hexCode, 16);
    this.red = (bigint >> 16) & 255;
    this.green = (bigint >> 8) & 255;
    this.blue = bigint & 255;
  }
}
