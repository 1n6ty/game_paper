export default class Cell {
  constructor(type, row, col) {
    this.type = type;
    this.row = row;
    this.col = col;
    this.isDeleted = false;
  }
}
