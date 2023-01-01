class Direction {
  static UP_LEFT = new Direction("UP_LEFT");
  static UP_MIDDLE = new Direction("UP_MIDDLE");
  static UP_RIGHT = new Direction("UP_RIGHT");
  static DOWN_LEFT = new Direction("DOWN_LEFT");
  static DOWN_MIDDLE = new Direction("DOWN_MIDDLE");
  static DOWN_RIGHT = new Direction("DOWN_RIGHT");

  constructor(name) {
    this.name = name;
  }

  toString() {
    return `Direction.${this.name}`;
  }
}
