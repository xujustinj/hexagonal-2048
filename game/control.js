class Controller {
  // The controller converts various inputs into directions

  constructor(directions, { distanceThreshold, speedThreshold }) {
    // Directions: a list of {direction, keyCode, heading}
    this.directions = directions;
    this.directionsByKeyCode = {};
    for (const { direction, keyCode } of directions) {
      this.directionsByKeyCode[keyCode] = direction;
    }

    this.distanceThreshold = distanceThreshold ?? 80;
    this.speedThreshold = speedThreshold ?? 160;

    // Whether inputs should be processed as moves.
    this.canMove = false;

    // The x-coordinate, y-coordinate, and time of the swipe start.
    this.touchStart = null;
  }

  pressKey(keyCode) {
    // Process a keystroke.
    // If it corresponds to a direction, return the direction.
    if (this.canMove) {
      return this.directionsByKeyCode[keyCode] ?? null;
    }
    return null;
  }

  startSwipe(x, y, t) {
    // Start a new swipe.
    this.touchStart = { x, y, t };
  }

  endSwipe(x, y, t) {
    // End the current swipe.
    // If it is far enough and fast enough, return the direction to move in.
    if (!this.canMove) {
      this.touchStart = null;
      return null;
    }

    const delta = {
      x: x - this.touchStart.x,
      y: y - this.touchStart.y,
      t: t - this.touchStart.t,
    };
    this.touchStart = null;

    const magnitude = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    if (magnitude < this.distanceThreshold) {
      // Not far enough.
      return null;
    }
    const speed = magnitude / delta.t;
    if (speed < this.speedThreshold) {
      // Not fast enough.
      return null;
    }

    const swipeHeading = Math.atan2(delta.y, delta.x);
    return minBy(this.directions, ({ heading }) =>
      differenceRad(heading, swipeHeading)
    ).direction;
  }
}

class HexController extends Controller {
  constructor() {
    super(
      [
        {
          direction: HexDirection.UP_LEFT,
          keyCode: "Q".charCodeAt(),
          heading: -5 * (Math.PI / 6),
        },
        {
          direction: HexDirection.UP_MIDDLE,
          keyCode: "W".charCodeAt(),
          heading: -Math.PI / 2,
        },
        {
          direction: HexDirection.UP_RIGHT,
          keyCode: "E".charCodeAt(),
          heading: -Math.PI / 6,
        },
        {
          direction: HexDirection.DOWN_LEFT,
          keyCode: "A".charCodeAt(),
          heading: 5 * (Math.PI / 6),
        },
        {
          direction: HexDirection.DOWN_MIDDLE,
          keyCode: "S".charCodeAt(),
          heading: Math.PI / 2,
        },
        {
          direction: HexDirection.DOWN_RIGHT,
          keyCode: "D".charCodeAt(),
          heading: Math.PI / 6,
        },
      ],
      {
        distanceThreshold: 80,
        speedThreshold: 160,
      }
    );
  }
}
