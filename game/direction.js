class HexDirection {
  static UP_LEFT = new HexDirection("UP_LEFT", -1, -1);
  static UP_MIDDLE = new HexDirection("UP_MIDDLE", 0, -2);
  static UP_RIGHT = new HexDirection("UP_RIGHT", 1, -1);
  static DOWN_LEFT = new HexDirection("DOWN_LEFT", -1, 1);
  static DOWN_MIDDLE = new HexDirection("DOWN_MIDDLE", 0, 2);
  static DOWN_RIGHT = new HexDirection("DOWN_RIGHT", 1, 1);

  constructor(name, colOffset, rowOffset) {
    this.name = `${HexDirection.name}.${name}`;
    this.colOffset = colOffset;
    this.rowOffset = rowOffset;
  }

  toString() {
    return this.name;
  }
}
