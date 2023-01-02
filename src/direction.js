class Direction {
  static byKeycode = {};
  static byAngle = {};
  static all = [];

  static UP_LEFT = new Direction("UP_LEFT", "Q", -150);
  static UP_MIDDLE = new Direction("UP_MIDDLE", "W", -90);
  static UP_RIGHT = new Direction("UP_RIGHT", "E", -30);
  static DOWN_LEFT = new Direction("DOWN_LEFT", "A", 150);
  static DOWN_MIDDLE = new Direction("DOWN_MIDDLE", "S", 90);
  static DOWN_RIGHT = new Direction("DOWN_RIGHT", "D", 30);

  constructor(name, key, heading) {
    this.name = name;
    this.keycode = key.charCodeAt();
    this.headingRad = heading * (Math.PI / 180);

    Direction.byKeycode[this.keycode] = this;
    Direction.all.push(this);
  }

  toString() {
    return `Direction.${this.name}`;
  }

  headingDifference(rad) {
    const diff = Math.abs(this.headingRad - rad);
    return diff < Math.PI ? diff : 2 * Math.PI - diff;
  }

  static fromKeycode(c) {
    return Direction.byKeycode[c] ?? null;
  }

  static fromHeading(rad) {
    var minDirection = undefined;
    var minDiff = Infinity;
    for (const direction of Direction.all) {
      const diff = direction.headingDifference(rad);
      if (diff < minDiff) {
        minDirection = direction;
        minDiff = diff;
      }
    }
    return minDirection;
  }
}
