import Cell from "./Cell";

export default class Grid {
  #random = () => {};
  #isGroundCellActive = () => {};

  constructor(rows, cols, assetKeys, randomFn, fieldActivityRules) {
    this.rows = rows;
    this.cols = cols;
    this.assetKeys = assetKeys;
    this.#random = randomFn;
    this.cells = [];
    this.groundGrid = [];
    this.isCellActive = (row, col) =>
      !!fieldActivityRules.grid(row, col, rows, cols);
    this.#isGroundCellActive = (row, col) =>
      !!fieldActivityRules.ground(row, col, rows, cols);
    this.generateGrid();
    this.initGrid();
  }

  generateGrid() {
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(this.#isGroundCellActive(r, c));
      }

      this.groundGrid.push(row);
    }
  }

  initGrid() {
    this.cells = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );

    const active = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.isCellActive(r, c)) active.push({ r, c });
      }
    }

    const maxPairsByCells = Math.floor(active.length / 2);
    const maxPairsByKeys = this.assetKeys.length;
    const numPairs = Math.min(12, maxPairsByCells, maxPairsByKeys);

    const cellsForPairs = numPairs * 2;
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(this.#random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
    };

    const pick = (arr) => shuffle(arr.slice());
    const selected = pick(active).slice(0, cellsForPairs);
    const keys = pick(this.assetKeys).slice(0, numPairs);
    const values = shuffle(keys.flatMap((k) => [k, k]));

    selected.forEach((pos, i) => {
      this.cells[pos.r][pos.c] = new Cell(values[i], pos.r, pos.c);
    });
  }
}
