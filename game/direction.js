class Direction {
  constructor(name, key, headingDeg, cls = Direction) {
    this.name = `${cls.name}.${name}`;
    this.keycode = key.charCodeAt();
    this.headingRad = radians(headingDeg);

    cls.byKeycode[this.keycode] = this;
    cls.all.push(this);
  }

  toString() {
    return this.name;
  }
}

class HexDirection extends Direction {
  static byKeycode = {};
  static all = [];

  static UP_LEFT = new HexDirection("UP_LEFT", "Q", -150, -1, -1);
  static UP_MIDDLE = new HexDirection("UP_MIDDLE", "W", -90, 0, -2);
  static UP_RIGHT = new HexDirection("UP_RIGHT", "E", -30, 1, -1);
  static DOWN_LEFT = new HexDirection("DOWN_LEFT", "A", 150, -1, 1);
  static DOWN_MIDDLE = new HexDirection("DOWN_MIDDLE", "S", 90, 0, 2);
  static DOWN_RIGHT = new HexDirection("DOWN_RIGHT", "D", 30, 1, 1);

  constructor(name, key, headingDeg, colOffset, rowOffset) {
    super(name, key, headingDeg, HexDirection);

    this.colOffset = colOffset;
    this.rowOffset = rowOffset;
  }

  static fromKeycode(c) {
    return HexDirection.byKeycode[c] ?? null;
  }

  static fromHeading(rad) {
    return minBy(HexDirection.all, (direction) =>
      differenceRad(direction.headingRad, rad)
    );
  }
}
