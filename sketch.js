function setup() {

    // 1. Create and centre the canvas.
    canvas = createCanvas(size, size);
    canvas.position(windowWidth / 2 - centre, windowHeight / 2 - centre);
    frameRate(fps);

    // 2. Define the colour scheme and style.
    colorMode(RGB, 255);
    textFont(font);
    noStroke();
    bgColour = color(187, 173, 160);
    colours = [
        color(205, 193, 180),  // empty
        color(238, 228, 218),  //       2
        color(238, 225, 201),  //       4
        color(243, 178, 122),  //       8
        color(246, 150, 100),  //      16
        color(247, 124,  95),  //      32
        color(247,  95,  59),  //      64
        color(237, 208, 115),  //     128
        color(237, 204,  98),  //     256
        color(237, 201,  80),  //     512
        color(237, 197,  63),  //    1024
        color(237, 194,  46),  //    2048
        color(146, 223,  99),  //    4096
        color(132, 226,  72),  //    8192
        color(135, 228,  49),  //   16384
        color(107, 228,  21),  //   32768
        color(107, 154,  88),  //   65536
        color(107,  87, 161),  //  131072
        color(107,  87, 161),  //  262114
        color(107,  87, 161),  //  524288
        color(107,  87, 161)]; // 1048576

    // 3. Reset the game internal variables.
    reset();

}


function reset() {

    // 1. Set the values of internal variables.
    moveFrames = 16;
    lose       = false;
    score      = 0;

    // 2. Create the tiles.
    for (let n = 0; n < tiles.length; n ++) {
        tiles[n] = new Tile(n);
    }

    // 3. Determine the starting tiles.
    spawn(initialSpawn);

}


function spawn(n) {

    // Recursively creates as many tiles as possible, up to n many, in
    //   random locations on the board. Each tile has a 80% probability of
    //   containing 2, and a 20% probability of containing 4. When picking
    //   a real number x from a uniform distribution over [1,2.25),
    //   P(floor(x) = 1) = P(1 <= x < 2) = P(x < 2) = 80%, and
    //   P(floor(x) = 2) = P(2 <= x < 3) = P(2 <= x) = 20%.

    // A. Base case, do nothing.
    if (n === 0) {
        return;
    }

    // B. If there are no empty tiles, do nothing.
    if (full()) {
        return;
    }

    // C. Otherwise, proceed.
    // 1. Make a copy of the tiles array.
    let tilesCopy = new Array(tiles.length);
    for (let i = 0; i < tiles.length; i ++) {
        tilesCopy[i] = {id: i, value: tiles[i].value};
    }

    // 2. Guess random tiles until an empty tile is found.
    for (let i = tiles.length - 1; i >= 0; i --) {
        let j = randInt(0, i + 1); // A random index in [0,i+1).

        // a. If the random tile is empty,
        if (tilesCopy[j].value === 0) {
            tiles[tilesCopy[j].id].spawn(randInt(1, 2.25));
            break;

        // b. If the random tile is nonempty, swap it to the end of the
        //    array (where it will not be considered again) and repeat.
        } else {
            let temp = tilesCopy[j];
            tilesCopy[j] = tilesCopy[i];
            tilesCopy[i] = temp;
        }
    }

    // 3. Recursive step.
    spawn(n - 1);

}


function draw() {

    // 1. Recentre and repaint the canvas.
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    background(bgColour);

    if (moveFrames > 5) {
        let t = 1 - (moveFrames - 5) / 10;
        tiles.forEach(function (tile) {tile.paintBlank();});
        tiles.forEach(function (tile) {tile.paintSpawn(t);});
        tiles.forEach(function (tile) {tile.paintSlide(t);});

        moveFrames --;
    } else if (moveFrames > 0) {
        let t = 1 + (3 - abs(3 - moveFrames)) / 20;
        tiles.forEach(function (tile) {tile.paintPlain();});
        tiles.forEach(function (tile) {tile.paintFlash(t);});

        moveFrames --;
        if (moveFrames === 0) {
            refreshTiles();
        }
    } else { // (moveFrames === 0)
        for (var i = 0; i < tiles.length; i ++) {
            tiles[i].paintPlain();
        }
    }

    drawScore();

}


function refreshTiles() {
    tiles.forEach(function (tile) {
        tile.target         = tile.id;
        tile.previousValue  = tile.value;
        tile.previousColour = tile.colour;
        tile.spawning       = false;
        tile.merging        = false;
    });
}


function drawScore() {
    fill(255);
    textSize(32);
    textAlign(RIGHT, BOTTOM);
    text("Score: " + score, width - 8, height - 4);
}


function keyPressed() {

    if (moveFrames > 5) { // Inputs are locked while the tiles are moving.
        return;           //   For smoothness, inputs unlock for the last
    }                     //   few frames of the move.

    if (lose && (moveFrames === 0)) {
        alert("You lose! Score: " + score);
        reset();
    } else {

        refreshTiles();

        let rows = [];
        if (keyCode === 69) { // E (right-up)
            rows = [[10, 11, 12],
                  [ 9,  2,  3, 13],
                [ 8,  1,  0,  4, 14],
                  [ 7,  6,  5, 15],
                    [18, 17, 16]];
        } else if (keyCode === 87) { // W (up)
            rows = [[12, 13, 14],
                  [11,  3,  4, 15],
                [10,  2,  0,  5, 16],
                  [ 9,  1,  6, 17],
                    [ 8,  7, 18]];
        } else if (keyCode === 81) { // Q (left-up)
            rows = [[14, 15, 16],
                  [13,  4,  5, 17],
                [12,  3,  0,  6, 18],
                  [11,  2,  1,  7],
                    [10,  9,  8]];
        } else if (keyCode === 65) { // A (left-down)
            rows = [[16, 17, 18],
                  [15,  5,  6,  7],
                [14,  4,  0,  1,  8],
                  [13,  3,  2,  9],
                    [12, 11, 10]];
        } else if (keyCode === 83) { // S (down)
            rows = [[18,  7,  8],
                  [17,  6,  1,  9],
                [16,  5,  0,  2, 10],
                  [15,  4,  3, 11],
                    [14, 13, 12]];
        } else if (keyCode === 68) { // D (right-down)
            rows = [[ 8,  9, 10],
                  [ 7,  1,  2, 11],
                [18,  6,  0,  3, 12],
                  [17,  5,  4, 13],
                    [16, 15, 14]];
        } else {
            return;
        }

        rows.forEach(function (row) {
            slide(row);
            combine(row);
            slide(row);
        });

        if (unmoved()) {
            return;
        }

        spawn(2);

        lose = full() && stuck();

        moveFrames = 15;

    }
}


function slide(r) {
    // r is a list of tile indices corresponding to a row parallel to the
    //   direction of the player's move. Earlier values in r correspond to tiles
    //   further along the direction of the move.

    let n = 0;
    for (let i = 0; i < r.length; i ++) {
        if (tiles[r[i]].value != 0) {
            retarget(r[i], r[n]);
            tiles[r[n]].setValue(tiles[r[i]].value);
            if (i != n) {
                tiles[r[i]].clear();
            }
            n ++;
        }
    }
}


function combine(r) {
    // r is a list of tile indices corresponding to a row parallel to the
    //   direction of the player's move. Earlier values in r correspond to tiles
    //   further along the direction of the move.

    for (let i = 1; i < r.length; i ++) {
        if (tiles[r[i]].value != 0) {
            if (tiles[r[i]].value === tiles[r[i - 1]].value) {
                retarget(r[i], r[i - 1]);
                tiles[r[i - 1]].merge();
                tiles[r[i]].clear();
                i ++;
            }
        }
    }
}


function retarget(from, to) {
    for (var i = 0; i < tiles.length; i ++) {
        if (tiles[i].target === from) {
            tiles[i].target = to;
        }
    }
}
