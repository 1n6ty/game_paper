import Cell from "./Cell";

export default class Grid {
  constructor(
    rows,
    cols,
    assetKeys,
    randomFn,
    cellActivityRule = (row, col, rows, cols) => true
  ) {
    this.rows = rows;
    this.cols = cols;
    this.assetKeys = assetKeys;
    this.random = randomFn;
    this.cells = [];
    this.isCellActive = (row, col) => cellActivityRule(row, col, rows, cols);
    this.initGridWithTurns();
  }

  #initGrid() {
    this.cells = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.isCellActive(row, col)) {
          continue;
        }

        let availableTypes = [...this.assetKeys];

        // Проверка, не создаст ли новый элемент горизонтальный ряд из трёх
        if (
          col >= 2 &&
          this.cells[row][col - 1]?.type === this.cells[row][col - 2]?.type
        ) {
          const forbiddenType = this.cells[row][col - 1].type;
          availableTypes = availableTypes.filter((t) => t !== forbiddenType);
        }

        // Проверка, не создаст ли новый элемент вертикальный ряд из трёх
        if (
          row >= 2 &&
          this.cells[row - 1][col]?.type === this.cells[row - 2][col]?.type
        ) {
          const forbiddenType = this.cells[row - 1][col].type;
          availableTypes = availableTypes.filter((t) => t !== forbiddenType);
        }

        // На случай, если все типы окажутся под запретом (очень редкий крайний случай)
        if (availableTypes.length === 0) {
          availableTypes = [...this.assetKeys];
        }

        const key =
          availableTypes[Math.floor(this.random() * availableTypes.length)];
        this.cells[row][col] = new Cell(key, row, col);
      }
    }
  }

  getMatchedCells() {
    const M = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));

    // горизонтали
    for (let r = 0; r < this.rows; r++) {
      let count = 1;
      for (let c = 1; c < this.cols; c++) {
        const cur = this.cells[r][c];
        const prev = this.cells[r][c - 1];
        if (
          cur &&
          prev &&
          !cur.isDeleted &&
          !prev.isDeleted &&
          cur.type === prev.type
        ) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = c - count; k < c; k++) M[r][k] = true;
          }

          count = 1;
        }
      }

      if (count >= 3) {
        for (let k = this.cols - count; k < this.cols; k++) M[r][k] = true;
      }
    }

    // вертикали (по той же схеме)
    for (let c = 0; c < this.cols; c++) {
      let count = 1;
      for (let r = 1; r < this.rows; r++) {
        const cur = this.cells[r][c];
        const prev = this.cells[r - 1][c];
        if (
          cur &&
          prev &&
          !cur.isDeleted &&
          !prev.isDeleted &&
          cur.type === prev.type
        ) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = r - count; k < r; k++) M[k][c] = true;
          }

          count = 1;
        }
      }

      if (count >= 3) {
        for (let k = this.rows - count; k < this.rows; k++) M[k][c] = true;
      }
    }

    return M;
  }

  checkAvailableMoves() {
    const swap = (r1, c1, r2, c2) => {
      const a = this.cells[r1][c1];
      const b = this.cells[r2][c2];
      this.cells[r1][c1] = b;
      this.cells[r2][c2] = a;
      const has = this.getMatchedCells().some((row) => row.some((x) => x));
      this.cells[r1][c1] = a;
      this.cells[r2][c2] = b;
      return has;
    };

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if (!cell || cell.isDeleted) continue;
        // вправо
        if (c < this.cols - 1) {
          const n = this.cells[r][c + 1];
          if (n && !n.isDeleted && swap(r, c, r, c + 1)) return true;
        }

        // вниз
        if (r < this.rows - 1) {
          const n = this.cells[r + 1][c];
          if (n && !n.isDeleted && swap(r, c, r + 1, c)) return true;
        }
      }
    }

    return false;
  }

  // для тестирования
  initGridNoTurns() {
    const MAX_ATTEMPTS = 10000;
    let attempts = 0;

    do {
      this.grid = [];
      this.#initGrid();
      attempts++;
    } while (this.checkAvailableMoves() && attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
      console.warn(
        "Не удалось сгенерировать сетку без доступных ходов за максимальное число попыток.",
        attempts
      );
    } else console.log("Сделано!", attempts);
  }

  initGridWithTurns() {
    const MAX_ATTEMPTS = 10000;
    let attempts = 0;

    do {
      this.grid = [];
      this.#initGrid();
      attempts++;
    } while (!this.checkAvailableMoves() && attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
      console.warn(
        "Не удалось сгенерировать сетку с доступными ходами за максимальное число попыток.",
        attempts
      );
    } else console.log("Сделано!", attempts);

    return attempts;
  }

  removeMatches(M) {
    const removed = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if (M[r][c] && cell && !cell.isDeleted) {
          cell.isDeleted = true;
          removed.push({ row: r, col: c, cell });
        }
      }
    }

    return removed;
  }

  dropCells() {
    for (let c = 0; c < this.cols; c++) {
      let emptyCount = 0;
      for (let r = this.rows - 1; r >= 0; r--) {
        // если ячейка никогда не существует, сбрасываем счётчик
        if (!this.isCellActive(r, c)) {
          emptyCount = 0;
          continue;
        }

        const curr = this.cells[r][c];
        if (!curr || curr.isDeleted) {
          // пустая или удалённая - увеличиваем пустой счётчик
          emptyCount++;
        } else if (emptyCount > 0) {
          // переносим cell вниз на emptyCount строк
          this.cells[r + emptyCount][c] = curr;
          curr.row = r + emptyCount;
          this.cells[r][c] = null;
        }
      }
    }
  }

  fillEmptyCells() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if ((!cell || cell.isDeleted) && this.isCellActive(r, c)) {
          const key =
            this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
          this.cells[r][c] = new Cell(key, r, c);
        }
      }
    }
  }

  areAdjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  fillUniformRows() {
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      const key =
        this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        if (!this.isCellActive(r, c)) row.push(null);
        else {
          row.push(new Cell(key, r, c));
        }
      }

      this.cells.push(row);
    }
  }

  fillUniformCols() {
    this.cells = [];
    for (let c = 0; c < this.cols; c++) {
      const key =
        this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
      const col = [];
      for (let r = 0; r < this.rows; r++) {
        if (!this.isCellActive(r, c)) col.push(null);
        else {
          col.push(new Cell(key, r, c));
        }
      }

      this.cells.push(col);
    }
  }
}
