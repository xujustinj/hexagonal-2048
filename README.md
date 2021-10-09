[//]: # "permalink: /index.html"

# Hexagonal 2048

Yet another hexagonal variant of [Gabriele Cirulli's _2048_](https://play2048.co/). This project was started in summer 2017, inspired by a love for the original and an introductory course to using [_p5.js_](https://p5js.org/) for game design, and has become a project for learning the secrets of JavaScript and practising good design.

_Hexagonal 2048_ can be played [here](https://justinxu.me/hexagonal-2048/).

## Gameplay

Tiles slide in the direction the player chooses, and identical tiles combine by summing their values. New tiles spawn randomly, so the player must plan strategically to avoid losing by filling up the board and running out of moves.

The original game is won upon constructing the **2048** tile, but with the added degrees of freedom in _Hexagonal 2048_, getting there is barely a challenge. It has not yet been decided which tile presents the equivalent challenge in _Hexagonal 2048_, so there is presently no win condition.

## Controls

Swiping and click-dragging work on all devices. Alternatively, use the following keyboard commands to move in the respective directions:

        W
    Q       E

    A       D
        S

By using _p5.js_, the entire game exists within a canvas for the easiest image capture. Simply right click the canvas and **Copy Image** or **Save Image** to capture the board.

## Credit

The colour scheme, scoring algorithm, and gameplay are all modelled after [Gabriele Cirulli's _2048_](https://play2048.co/).

By no means is this a novel variant of _2048_, nor does it carry a unique name. This was developed independently of similar games (some better, some worse) which may be easily found by Googling ["Hexagonal 2048"](https://www.google.com/search?q=hexagonal%202048).

## Screens

### Colour Scheme

![The colour scheme for Hexagonal 2048.](img/Colour%20Scheme.png "The colour scheme for Hexagonal 2048.")

### 2048 Achieved

![A board with a newly merged 2048 tile.](img/2048%20Achieved.png "A board with a newly merged 2048 tile.")

### Game Over

![Game over: there are no moves left for the player.](img/Game%20Over.png "Game over: there are no moves left for the player.")
