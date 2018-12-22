var canvas;

var centreX;
var centreY;

var h = Math.sqrt(3) / 2;

// var shapes = new Array();

var tiles = new Array(19);
var sliders = new Array(19);

var before = new Array(19);
var target = new Array(19); // for i being the original location of the hexagon, target[i] is where that hexagon goes

var moving = 0;

var turn = 1;

var next1;
var nextHex1;
var next2;
var nextHex2;

var lose = false;

var score = 0;

function setup() {
  canvas = createCanvas(624, 624);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  centreX = width / 2;
  centreY = width / 2;

  frameRate(64);

  for (var i = 0; i < tiles.length; i ++) {
    tiles[i] = new Tile();
    tiles[i].define(i);
  }

  next1 = floor(random(0, 19));
  while (tiles[next1].value > 0) {
    next1 = floor(random(0, 19));
  }

  nextHex1 = new Tile()
  nextHex1.define(next1);
  nextHex1.setValue(floor(random(1, 2.25)));

  tiles[next1].setValue(nextHex1.value);

  next2 = floor(random(0, 19));
  while (tiles[next2].value > 0) {
    next2 = floor(random(0, 19));
  }

  nextHex2 = new Tile()
  nextHex2.define(next2);
  nextHex2.setValue(floor(random(1, 2.25)));

  tiles[next2].setValue(nextHex2.value);

  moving = 16;
}

function draw() {
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  background(187, 173, 160);

  if (moving > 0) {
    move();
  } else {
    for (var i = 0; i < tiles.length; i ++) {
      tiles[i].paint();
      tiles[i].text();
    }
  }

  noStroke();
  fill(255);
  textSize(32);
  textFont("Calibri");
  textAlign(RIGHT, BOTTOM);
  text("Score: " + score, width - 4, height - 4);
}

function keyPressed() {
  if (moving < 10) { // locked out while moving
    if ((lose) && (moving == 0)) {
      alert("You lose! Score: " + score);
      reset();
    } else {
      for (var i = 0; i < target.length; i ++) {
        target[i] = i;
        before[i] = tiles[i].value;
      }

      if (keyCode == 69) { // E (right-up)
        slide(10, 11, 12, 9, 2, 3, 13, 8, 1, 0, 4, 14, 7, 6, 5, 15, 18, 17, 16);
        combine(10, 11, 12, 9, 2, 3, 13, 8, 1, 0, 4, 14, 7, 6, 5, 15, 18, 17, 16);
        slide(10, 11, 12, 9, 2, 3, 13, 8, 1, 0, 4, 14, 7, 6, 5, 15, 18, 17, 16);
      } else if (keyCode == 87) { // W (up)
        slide(12, 13, 14, 11, 3, 4, 15, 10, 2, 0, 5, 16, 9, 1, 6, 17, 8, 7, 18);
        combine(12, 13, 14, 11, 3, 4, 15, 10, 2, 0, 5, 16, 9, 1, 6, 17, 8, 7, 18);
        slide(12, 13, 14, 11, 3, 4, 15, 10, 2, 0, 5, 16, 9, 1, 6, 17, 8, 7, 18);
      } else if (keyCode == 81) { // Q (left-up)
        slide(14, 15, 16, 13, 4, 5, 17, 12, 3, 0, 6, 18, 11, 2, 1, 7, 10, 9, 8);
        combine(14, 15, 16, 13, 4, 5, 17, 12, 3, 0, 6, 18, 11, 2, 1, 7, 10, 9, 8);
        slide(14, 15, 16, 13, 4, 5, 17, 12, 3, 0, 6, 18, 11, 2, 1, 7, 10, 9, 8);
      } else if (keyCode == 65) { // A (left-down)
        slide(16, 17, 18, 15, 5, 6, 7, 14, 4, 0, 1, 8, 13, 3, 2, 9, 12, 11, 10);
        combine(16, 17, 18, 15, 5, 6, 7, 14, 4, 0, 1, 8, 13, 3, 2, 9, 12, 11, 10);
        slide(16, 17, 18, 15, 5, 6, 7, 14, 4, 0, 1, 8, 13, 3, 2, 9, 12, 11, 10);
      } else if (keyCode == 83) { // S (down)
        slide(18, 7, 8, 17, 6, 1, 9, 16, 5, 0, 2, 10, 15, 4, 3, 11, 14, 13, 12);
        combine(18, 7, 8, 17, 6, 1, 9, 16, 5, 0, 2, 10, 15, 4, 3, 11, 14, 13, 12);
        slide(18, 7, 8, 17, 6, 1, 9, 16, 5, 0, 2, 10, 15, 4, 3, 11, 14, 13, 12);
      } else if (keyCode == 68) { // D (right-down)
        slide(8, 9, 10, 7, 1, 2, 11, 18, 6, 0, 3, 12, 17, 5, 4, 13, 16, 15, 14);
        combine(8, 9, 10, 7, 1, 2, 11, 18, 6, 0, 3, 12, 17, 5, 4, 13, 16, 15, 14);
        slide(8, 9, 10, 7, 1, 2, 11, 18, 6, 0, 3, 12, 17, 5, 4, 13, 16, 15, 14);
      }

      for (var i = 0; i < target.length; i ++) {
        if (i != target[i]) {
          moving = 16;

          next1 = floor(random(0, 19));
          while (tiles[next1].value > 0) {
            next1 = floor(random(0, 19));
          }

          var vacancy = false;
          for (var j = 0; j < target.length; j ++) {
            if (tiles[j].value <= 0) {
              vacancy = true
            }
          }

          if (vacancy) {
            nextHex1 = new Tile()
            nextHex1.define(next1);
            nextHex1.setValue(floor(random(1, 19 / 9)));

            tiles[next1].setValue(nextHex1.value);

            vacancy = false;
            for (var k = 0; k < target.length; k ++) {
              if (tiles[k].value <= 0) {
                vacancy = true
              }
            }

            if (vacancy) {
              next2 = floor(random(0, 19));
              while (tiles[next2].value > 0) {
                next2 = floor(random(0, 19));
              }

              nextHex2 = new Tile()
              nextHex2.define(next2);
              nextHex2.setValue(floor(random(1, 19 / 9)));

              tiles[next2].setValue(nextHex2.value);
            } else {
              next2 = -1;
            }
          } else {
            next1 = -1;
          }

          var filled = true;
          for (var j = 0; j < tiles.length; j ++) {
            if (tiles[j].value <= 0) {
              filled = false;
              lose = false;
            }
          }

          if (filled) {
            lose = true;
            if ((tiles[0].value == tiles[1].value) || (tiles[0].value == tiles[2].value) || (tiles[0].value == tiles[3].value) || (tiles[0].value == tiles[4].value) || (tiles[0].value == tiles[5].value) || (tiles[0].value == tiles[6].value)) {
              lose = false;
            } else if ((tiles[1].value == tiles[2].value) || (tiles[1].value == tiles[6].value) || (tiles[1].value == tiles[7].value) || (tiles[1].value == tiles[8].value) || (tiles[1].value == tiles[9].value)) {
              lose = false;
            } else if ((tiles[2].value == tiles[3].value) || (tiles[2].value == tiles[9].value) || (tiles[2].value == tiles[10].value) || (tiles[2].value == tiles[11].value)) {
              lose = false;
            } else if ((tiles[3].value == tiles[4].value) || (tiles[3].value == tiles[11].value) || (tiles[3].value == tiles[12].value) || (tiles[3].value == tiles[13].value)) {
              lose = false;
            } else if ((tiles[4].value == tiles[5].value) || (tiles[4].value == tiles[13].value) || (tiles[4].value == tiles[14].value) || (tiles[4].value == tiles[15].value)) {
              lose = false;
            } else if ((tiles[5].value == tiles[6].value) || (tiles[5].value == tiles[15].value) || (tiles[5].value == tiles[16].value) || (tiles[5].value == tiles[17].value)) {
              lose = false;
            } else if ((tiles[6].value == tiles[7].value) || (tiles[6].value == tiles[17].value) || (tiles[6].value == tiles[18].value)) {
              lose = false;
            } else if ((tiles[7].value == tiles[8].value) || (tiles[7].value == tiles[18].value)) {
              lose = false;
            } else if (tiles[8].value == tiles[9].value) {
              lose = false;
            } else if (tiles[9].value == tiles[10].value) {
              lose = false;
            } else if (tiles[10].value == tiles[11].value) {
              lose = false;
            } else if (tiles[11].value == tiles[12].value) {
              lose = false;
            } else if (tiles[12].value == tiles[13].value) {
              lose = false;
            } else if (tiles[13].value == tiles[14].value) {
              lose = false;
            } else if (tiles[14].value == tiles[15].value) {
              lose = false;
            } else if (tiles[15].value == tiles[16].value) {
              lose = false;
            } else if (tiles[16].value == tiles[17].value) {
              lose = false;
            } else if (tiles[17].value == tiles[18].value) {
              lose = false;
            }
          }

          break;
        }
      }
    }
  }
}

function slide(a1, a2, a3, b1, b2, b3, b4, c1, c2, c3, c4, c5, d1, d2, d3, d4, e1, e2, e3) {

  // a
  if (tiles[a2].value <= 0) {
    if (tiles[a3].value > 0) {
      tiles[a2].setValue(tiles[a3].value);
      retarget(a3, a2);
      tiles[a3].setValue(0);
    }
  }

  if (tiles[a1].value <= 0) {
    if (tiles[a2].value > 0) {
      tiles[a1].setValue(tiles[a2].value);
      retarget(a2, a1);
      tiles[a2].setValue(0);
    }
    if (tiles[a3].value > 0) {
      tiles[a2].setValue(tiles[a3].value);
      retarget(a3, a2);
      tiles[a3].setValue(0);
    }
  }

  // b
  if (tiles[b3].value <= 0) {
    if (tiles[b4].value > 0) {
      tiles[b3].setValue(tiles[b4].value);
      retarget(b4, b3);
      tiles[b4].setValue(0);
    }
  }

  if (tiles[b2].value <= 0) {
    if (tiles[b3].value > 0) {
      tiles[b2].setValue(tiles[b3].value);
      retarget(b3, b2);
      tiles[b3].setValue(0);
    }
    if (tiles[b4].value > 0) {
      tiles[b3].setValue(tiles[b4].value);
      retarget(b4, b3);
      tiles[b4].setValue(0);
    }
  }

  if (tiles[b1].value <= 0) {
    if (tiles[b2].value > 0) {
      tiles[b1].setValue(tiles[b2].value);
      retarget(b2, b1);
      tiles[b2].setValue(0);
    }
    if (tiles[b3].value > 0) {
      tiles[b2].setValue(tiles[b3].value);
      retarget(b3, b2);
      tiles[b3].setValue(0);
    }
    if (tiles[b4].value > 0) {
      tiles[b3].setValue(tiles[b4].value);
      retarget(b4, b3);
      tiles[b4].setValue(0);
    }
  }

  // c
  if (tiles[c4].value <= 0) {
    if (tiles[c5].value > 0) {
      tiles[c4].setValue(tiles[c5].value);
      retarget(c5, c4);
      tiles[c5].setValue(0);
    }
  }

  if (tiles[c3].value <= 0) {
    if (tiles[c4].value > 0) {
      tiles[c3].setValue(tiles[c4].value);
      retarget(c4, c3);
      tiles[c4].setValue(0);
    }
    if (tiles[c5].value > 0) {
      tiles[c4].setValue(tiles[c5].value);
      retarget(c5, c4);
      tiles[c5].setValue(0);
    }
  }

  if (tiles[c2].value <= 0) {
    if (tiles[c3].value > 0) {
      tiles[c2].setValue(tiles[c3].value);
      retarget(c3, c2);
      tiles[c3].setValue(0);
    }
    if (tiles[c4].value > 0) {
      tiles[c3].setValue(tiles[c4].value);
      retarget(c4, c3);
      tiles[c4].setValue(0);
    }
    if (tiles[c5].value > 0) {
      tiles[c4].setValue(tiles[c5].value);
      retarget(c5, c4);
      tiles[c5].setValue(0);
    }
  }

  if (tiles[c1].value <= 0) {
    if (tiles[c2].value > 0) {
      tiles[c1].setValue(tiles[c2].value);
      retarget(c2, c1);
      tiles[c2].setValue(0);
    }
    if (tiles[c3].value > 0) {
      tiles[c2].setValue(tiles[c3].value);
      retarget(c3, c2);
      tiles[c3].setValue(0);
    }
    if (tiles[c4].value > 0) {
      tiles[c3].setValue(tiles[c4].value);
      retarget(c4, c3);
      tiles[c4].setValue(0);
    }
    if (tiles[c5].value > 0) {
      tiles[c4].setValue(tiles[c5].value);
      retarget(c5, c4);
      tiles[c5].setValue(0);
    }
  }

  // d
  if (tiles[d3].value <= 0) {
    if (tiles[d4].value > 0) {
      tiles[d3].setValue(tiles[d4].value);
      retarget(d4, d3);
      tiles[d4].setValue(0);
    }
  }

  if (tiles[d2].value <= 0) {
    if (tiles[d3].value > 0) {
      tiles[d2].setValue(tiles[d3].value);
      retarget(d3, d2);
      tiles[d3].setValue(0);
    }
    if (tiles[d4].value > 0) {
      tiles[d3].setValue(tiles[d4].value);
      retarget(d4, d3);
      tiles[d4].setValue(0);
    }
  }

  if (tiles[d1].value <= 0) {
    if (tiles[d2].value > 0) {
      tiles[d1].setValue(tiles[d2].value);
      retarget(d2, d1);
      tiles[d2].setValue(0);
    }
    if (tiles[d3].value > 0) {
      tiles[d2].setValue(tiles[d3].value);
      retarget(d3, d2);
      tiles[d3].setValue(0);
    }
    if (tiles[d4].value > 0) {
      tiles[d3].setValue(tiles[d4].value);
      retarget(d4, d3);
      tiles[d4].setValue(0);
    }
  }

  // e
  if (tiles[e2].value <= 0) {
    if (tiles[e3].value > 0) {
      tiles[e2].setValue(tiles[e3].value);
      retarget(e3, e2);
      tiles[e3].setValue(0);
    }
  }

  if (tiles[e1].value <= 0) {
    if (tiles[e2].value > 0) {
      tiles[e1].setValue(tiles[e2].value);
      retarget(e2, e1);
      tiles[e2].setValue(0);
    }
    if (tiles[e3].value > 0) {
      tiles[e2].setValue(tiles[e3].value);
      retarget(e3, e2);
      tiles[e3].setValue(0);
    }
  }
}

function combine(a1, a2, a3, b1, b2, b3, b4, c1, c2, c3, c4, c5, d1, d2, d3, d4, e1, e2, e3) {

  // a
  if ((tiles[a1].value == tiles[a2].value) && (tiles[a1].value > 0)) {
    tiles[a1].setValue(tiles[a1].value + 1);
    tiles[a2].setValue(0);
    score += (tiles[a1].value - 1) * pow(2, tiles[a1].value);
    retarget(a2, a1);
  }

  if ((tiles[a2].value == tiles[a3].value) && (tiles[a2].value > 0)) {
    tiles[a2].setValue(tiles[a2].value + 1);
    tiles[a3].setValue(0);
    score += (tiles[a2].value - 1) * pow(2, tiles[a2].value);
    retarget(a3, a2);
  }

  // b
  if ((tiles[b1].value == tiles[b2].value) && (tiles[b1].value > 0)) {
    tiles[b1].setValue(tiles[b1].value + 1);
    tiles[b2].setValue(0);
    score += (tiles[b1].value - 1) * pow(2, tiles[b1].value);
    retarget(b2, b1);
  }

  if ((tiles[b2].value == tiles[b3].value) && (tiles[b2].value > 0)) {
    tiles[b2].setValue(tiles[b2].value + 1);
    tiles[b3].setValue(0);
    score += (tiles[b2].value - 1) * pow(2, tiles[b2].value);
    retarget(b3, b2);
  }

  if ((tiles[b3].value == tiles[b4].value) && (tiles[b3].value > 0)) {
    tiles[b3].setValue(tiles[b4].value + 1);
    tiles[b4].setValue(0);
    score += (tiles[b3].value - 1) * pow(2, tiles[b3].value);
    retarget(b4, b3);
  }

  // c
  if ((tiles[c1].value == tiles[c2].value) && (tiles[c1].value > 0)) {
    tiles[c1].setValue(tiles[c1].value + 1);
    tiles[c2].setValue(0);
    score += (tiles[c1].value - 1) * pow(2, tiles[c1].value);
    retarget(c2, c1);
  }

  if ((tiles[c2].value == tiles[c3].value) && (tiles[c2].value > 0)) {
    tiles[c2].setValue(tiles[c2].value + 1);
    tiles[c3].setValue(0);
    score += (tiles[c2].value - 1) * pow(2, tiles[c2].value);
    retarget(c3, c2);
  }

  if ((tiles[c3].value == tiles[c4].value) && (tiles[c3].value > 0)) {
    tiles[c3].setValue(tiles[c3].value + 1);
    tiles[c4].setValue(0);
    score += (tiles[c3].value - 1) * pow(2, tiles[c3].value);
    retarget(c4, c3);
  }

  if ((tiles[c4].value == tiles[c5].value) && (tiles[c4].value > 0)) {
    tiles[c4].setValue(tiles[c4].value + 1);
    tiles[c5].setValue(0);
    score += (tiles[c4].value - 1) * pow(2, tiles[c4].value);
    retarget(c5, c4);
  }

  // d
  if ((tiles[d1].value == tiles[d2].value) && (tiles[d1].value > 0)) {
    tiles[d1].setValue(tiles[d1].value + 1);
    tiles[d2].setValue(0);
    score += (tiles[d1].value - 1) * pow(2, tiles[d1].value);
    retarget(d2, d1);
  }

  if ((tiles[d2].value == tiles[d3].value) && (tiles[d2].value > 0)) {
    tiles[d2].setValue(tiles[d2].value + 1);
    tiles[d3].setValue(0);
    score += (tiles[d2].value - 1) * pow(2, tiles[d2].value);
    retarget(d3, d2);
  }

  if ((tiles[d3].value == tiles[d4].value) && (tiles[d3].value > 0)) {
    tiles[d3].setValue(tiles[d3].value + 1);
    tiles[d4].setValue(0);
    score += (tiles[d3].value - 1) * pow(2, tiles[d3].value);
    retarget(d4, d3);
  }

  // e
  if ((tiles[e1].value == tiles[e2].value) && (tiles[e1].value > 0)) {
    tiles[e1].setValue(tiles[e1].value + 1);
    tiles[e2].setValue(0);
    score += (tiles[e1].value - 1) * pow(2, tiles[e1].value);
    retarget(e2, e1);
  }

  if ((tiles[e2].value == tiles[e3].value) && (tiles[e2].value > 0)) {
    tiles[e2].setValue(tiles[e2].value + 1);
    tiles[e3].setValue(0);
    score += (tiles[e2].value - 1) * pow(2, tiles[e2].value);
    retarget(e3, e2);
  }
}

function retarget(iFrom, iTo) {
  for (var i = 0; i < target.length; i ++) {
    if (target[i] == iFrom) {
      target[i] = iTo;
    }
  }
}

function move() {
  for (var i = 0; i < tiles.length; i ++) {
    tiles[i].paintDummy();
  }

  for (var i = 0; i < tiles.length; i ++) {
    if (before[i] > 0) {
      sliders[i] = new Tile();
      sliders[i].define(i);
      sliders[i].move();
      sliders[i].setValue(before[i]);
      sliders[i].paint();
      sliders[i].text();
    }
  }

  if (next1 >= 0) {
    if (moving > 5) {
      nextHex1.sideLength = 64 - (moving - 5) * 64 / 11
    } else if ((moving == 5) || (moving == 1)) {
      nextHex1.sideLength = 66;
    } else if ((moving == 4) || (moving == 2)) {
      nextHex1.sideLength = 68;
    } else if (moving == 3) {
      nextHex1.sideLength = 72;
    }

    nextHex1.paint();
    if (moving <= 5) {
      nextHex1.text();
    }

    if (next2 >= 0) {
      if (moving > 5) {
        nextHex2.sideLength = 64 - (moving - 5) * 64 / 11
      } else if ((moving == 5) || (moving == 1)) {
        nextHex2.sideLength = 66;
      } else if ((moving == 4) || (moving == 2)) {
        nextHex2.sideLength = 68;
      } else if (moving == 3) {
        nextHex2.sideLength = 72;
      }

      nextHex2.paint();
      if (moving <= 5) {
        nextHex2.text();
      }
    }
  }

  moving --;
}

function reset() {
  background(187, 173, 160);

  for (var i = 0; i < tiles.length; i ++) {
    tiles[i] = new Tile();
    tiles[i].define(i);
    tiles[i].paintDummy();
  }

  next1 = floor(random(0, 19));
  while (tiles[next1].value > 0) {
    next1 = floor(random(0, 19));
  }

  nextHex1 = new Tile()
  nextHex1.define(next1);
  nextHex1.setValue(floor(random(1, 2.25)));

  tiles[next1].setValue(nextHex1.value);

  next2 = floor(random(0, 19));
  while (tiles[next2].value > 0) {
    next2 = floor(random(0, 19));
  }

  nextHex2 = new Tile()
  nextHex2.define(next2);
  nextHex2.setValue(floor(random(1, 2.25)));

  tiles[next2].setValue(nextHex2.value);

  moving = 16;

  lose = false;

  score = 0;
}
