const __VERSION__ = "9";

// const PATH = "./assets/match3/";
const PATH = "/media/assets/match3/";

const ASSET_PATHS = {
  smetanaGlass: `${PATH}smetana_glass.svg`,
  curd: `${PATH}curd.svg`,
  butter: `${PATH}butter.svg`,
  creamBox: `${PATH}cream_box.svg`,
  iceCream: `${PATH}ice_cream.svg`,
};

const lamBoyUrl = `${PATH}lamboy.svg`;

const GRID_ROWS = 6;
const GRID_COLS = 6;

const MAX_CANVAS_WIDTH = 428;
const MAX_CANVAS_HEIGHT = 809;

const HEADER_BG_TOP_COLOR = "#FFFFFF";
const HEADER_BG_BOTTOM_COLOR = "#9FC7F0";
const HEADER_HEIGHT = 279;

const LAMBOY_PADDING_LEFT = 84;
const LAMBOY_PADDING_TOP = 0;

const LAMBOY_WIDTH = 344;
const LAMBOY_HEIGHT = 363;

const HEADER_UP_DIVIDER_COLOR = "#5485C9";
const HEADER_DOWN_DIVIDER_COLOR = "#739BD3";
const HEADER_UP_DIVIDER_HEIGHT = 4;
const HEADER_DOWN_DIVIDER_HEIGHT = 22;

const HEADER_TARGET_LEFT = 64;
const HEADER_TARGET_TOP = 75;
const HEADER_TARGET_CARD_WIDTH = 70.72;
const HEADER_TARGET_CARD_HEIGHT = 70.72;
const HEADER_TARGET_CARD_BORDER_RADIUS = 12;
const HEADER_TARGET_CARD_IMAGE_WIDTH = 70.72;
const HEADER_TARGET_CARD_IMAGE_HEIGHT = 70.72;
const HEADER_TARGET_COUNTER_BG_COLOR = "#DB6971";
const HEADER_TARGET_COUNTER_TEXT_COLOR = "#FFFFFF";
const HEADER_TARGET_COUNTER_RADIUS = 24;

const BODY_BG_TOP_COLOR = "#EBF5FF";
const BODY_BG_BOTTOM_COLOR = "#D8EBFF";

const COUNTERS_PADDING_TOP = 18;
const COUNTERS_PADDING_LEFT = 84;
const COUNTERS_GAP = 10;

const STEPS_BG_COLOR = "#FFFFFF";
const STEPS_STROKE_COLOR = "#4E82B5";
const STEPS_TEXT_COLOR = "#4E82B5";
const STEPS_CARD_WIDTH = 134;
const STEPS_CARD_HEIGHT = 61;

const TARGET_BG_COLOR = "#FFFFFF";
const TARGET_STROKE_COLOR = "#4E82B5";
const TARGET_CARD_WIDTH = 116;
const TARGET_CARD_HEIGHT = 61;

const GRID_ZONE_BG_COLOR = "#B2D2F3";
const GRID_ZONE_STROKE_COLOR = "#4E82B5";
const GRID_ZONE_PADDING_LEFT = 21;
const GRID_ZONE_PADDING_TOP = 97;
const GRID_ZONE_WIDTH = 386;
const GRID_ZONE_HEIGHT = 386;
const GRID_ZONE_ARM_THICKNESS = 265;
const GRID_ZONE_RADIUS = 16;

const GRID_PADDING_LEFT = 35.62;
const GRID_PADDING_TOP = 113.49;

const CELL_WIDTH = 54.73;
const CELL_HEIGHT = 54.73;
const CELL_PADDING = 5;

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      resolve(null);
    };
  });

class LCG {
  constructor(seed) {
    this.modulus = 2 ** 31;
    this.multiplier = 1103515245;
    this.increment = 12345;
    this.state = LCG.hash(seed) % this.modulus;
  }

  static hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & 0xffffffff;
    }
    return hash >>> 0;
  }

  random() {
    this.state = (this.multiplier * this.state + this.increment) % this.modulus;
    return this.state / this.modulus;
  }
}

class GameEngine {
  constructor(canvas, initGameData, tmp = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.tmp = tmp || {};
    this.tmp.engine = this;

    this.dimensions = {
      width: MAX_CANVAS_WIDTH,
      height: MAX_CANVAS_HEIGHT
    };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    }

    const seed = initGameData.seed || Date.now().toString(16);
    console.log("Seed:", seed);
    this.randomGenerator = new LCG(seed);

    this.trainingCount = parseInt(initGameData.trainingCount || "0", 10);
    this.showTutorial = this.trainingCount < 3;

    this.stepsCount = parseInt(initGameData.maxStepsCount || 20);
    this.currentStepsCount = 0;

    this.targetItemsCount = parseInt(initGameData.targetItemsCount || 20);
    this.score = 0;

    this.isGameOver = false;
    this.canDrag = true;
    this.gameLoopId = null;
    this.finishCallback = () => { };

    this.grid = [];
    this.assetKeys = Object.keys(ASSET_PATHS);
    this.orderProduct =
      this.assetKeys[Math.floor(this.randomGenerator.random() * this.assetKeys.length)];
    this.initGridWithTurns();

    this.selectedCell = null;
    this.secondSelectedCell = null;

    this.isAnimatingCells = false;

    this.isResizing = false;
    this.resizeTimeout = null;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.onResize());

    this.images = {};
    this.loadAssets();

    this.boundHandlePointerDown = (e) => this.handlePointerDown(e);
    this.boundHandlePointerUp = (e) => this.handlePointerUp(e)

    this.canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    this.canvas.addEventListener("pointerup", this.boundHandlePointerUp);

    this.handleMatches();
  }

  onResize() {
    this.isResizing = true;
    this.resizeCanvas();
    this.drawScene();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.isResizing = false;
      this.resizeTimeout = null;
    }, 300);
  }

  onAssetsLoaded() {
    this.drawScene();
    this.startGameLoop();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    const newWidth = parentWidth;
    const newHeight = parentHeight - 60;

    this.dimensions = { width: newWidth, height: newHeight };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    }

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
  }

  async loadAssets() {
    const entries = [
      ...Object.entries(ASSET_PATHS),
      ["lamBoy", lamBoyUrl],
    ];
    const promises = entries.map(([key, path]) => loadImage(path));
    const loaded = await Promise.all(promises);
    entries.forEach(([key], idx) => {
      this.images[key] = loaded[idx] || null;
    });

    this.onAssetsLoaded();
  }

  startGameLoop() {
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    if (this.isGameOver) return;
    // console.log("Gameloop");

    const dt = 1 / 60;
    this.updateLogic(dt);
    if (this.isAnimatingCells || this.isResizing) {
      this.drawScene();
    }
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  stopGameLoop() {
    console.log("Stop GameLoop");
    this.canvas.removeEventListener("pointerdown", (e) => this.boundHandlePointerDown(e));
    this.canvas.removeEventListener("pointerup", (e) => this.boundHandlePointerUp(e));

    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  updateLogic(dt) {
    this.tutorialOffset = this.showTutorial
      ? Math.sin(performance.now() / 300) * 5
      : 0;
  }

  isCellActive(row, col) {
    // Например, для "квадрата без углов" - угловые ячейки неактивны:
    if ((row === 0 || row === GRID_ROWS - 1) && (col === 0 || col === GRID_COLS - 1)) {
      return false;
    }
    return true;
  }

  initGrid() {
    for (let r = 0; r < GRID_ROWS; r++) {
      const row = [];
      for (let c = 0; c < GRID_COLS; c++) {
        if (!this.isCellActive(r, c)) {
          row.push({ type: 'disabled' });
        } else {
          const key = this.assetKeys[Math.floor(this.randomGenerator.random() * this.assetKeys.length)];
          row.push({ type: key });
        }
      }
      this.grid.push(row);
    }
  }

  checkAvailableMoves() {
    const trySwap = (r1, c1, r2, c2) => {
      const cellA = this.grid[r1][c1];
      const cellB = this.grid[r2][c2];

      this.grid[r1][c1] = cellB;
      this.grid[r2][c2] = cellA;

      const matches = this.checkMatches();
      const hasMatch = matches.some(row => row.some(match => match));

      this.grid[r1][c1] = cellA;
      this.grid[r2][c2] = cellB;

      return hasMatch;
    };

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!this.grid[r][c] || this.grid[r][c].type === 'disabled') continue;
        if (c < GRID_COLS - 1 && this.grid[r][c + 1] && this.grid[r][c + 1].type !== 'disabled') {
          if (trySwap(r, c, r, c + 1)) {
            return true;
          }
        }
        if (r < GRID_ROWS - 1 && this.grid[r + 1][c] && this.grid[r + 1][c].type !== 'disabled') {
          if (trySwap(r, c, r + 1, c)) {
            return true;
          }
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
      this.initGrid();
      attempts++;
    } while (this.checkAvailableMoves() && attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
      console.warn("Не удалось сгенерировать сетку без доступных ходов за максимальное число попыток.", attempts);
    } else
      console.log("Сделано!", attempts);
  }

  initGridWithTurns() {
    const MAX_ATTEMPTS = 10000;
    let attempts = 0;

    do {
      this.grid = [];
      this.initGrid();
      attempts++;
    } while (!this.checkAvailableMoves() && attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
      console.warn("Не удалось сгенерировать сетку с доступными ходами за максимальное число попыток.", attempts);
    } else
      console.log("Сделано!", attempts);

    return attempts;
  }

  areAdjacent(cell1, cell2) {
    const dr = Math.abs(cell1.row - cell2.row);
    const dc = Math.abs(cell1.col - cell2.col);
    return dr + dc === 1;
  }

  handleMatches() {
    let matched;
    let removedCount = 0;
    let rightRemovedCount = 0;
    do {
      matched = this.checkMatches();
      let { removedCount: removed, rightRemovedCount: rightRemoved } = this.removeMatches(matched);
      if (removed > 0) {
        removedCount += removed;
        rightRemovedCount += rightRemoved;
        this.animateDropCells();
      }
    } while (removedCount > 0 && this.checkMatches().flat().includes(true));

    this.score += rightRemovedCount;
    if (this.score >= this.targetItemsCount) {
      this.handleGameOver();
    }
  }

  getCellCoordinates(pos) {
    return {
      x: GRID_PADDING_LEFT + pos.col * (CELL_WIDTH + CELL_PADDING),
      y: HEADER_HEIGHT + GRID_PADDING_TOP + pos.row * (CELL_HEIGHT + CELL_PADDING)
    };
  }

  getGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridStartX = this.offset.x + GRID_PADDING_LEFT * this.scale;
    const gridStartY = this.offset.y + (HEADER_HEIGHT + GRID_PADDING_TOP) * this.scale;

    const gridWidth = GRID_COLS * (CELL_WIDTH + CELL_PADDING) * this.scale;
    const gridHeight = GRID_ROWS * (CELL_HEIGHT + CELL_PADDING) * this.scale;
    const gridEndX = gridStartX + gridWidth;
    const gridEndY = gridStartY + gridHeight;

    if (x < gridStartX || y < gridStartY || x > gridEndX || y > gridEndY) {
      return null;
    }

    const relX = x - gridStartX;
    const relY = y - gridStartY;

    const col = Math.floor(relX / ((CELL_WIDTH + CELL_PADDING) * this.scale));
    const row = Math.floor(relY / ((CELL_HEIGHT + CELL_PADDING) * this.scale));

    if (this.grid[row][col].type == 'disabled')
      return null;

    return { row, col };
  }

  handlePointerDown(e) {
    e.preventDefault && e.preventDefault();
    const pos = this.getGridPosition(e);
    let action = false;
    if (pos && this.canDrag) {
      if (this.selectedCell === null) { // нажатие первое
        action = true;
        this.selectedCell = pos;
      } else if (this.selectedCell.col === pos.col && this.selectedCell.row === pos.row) {
        action = true;
        this.selectedCell = null;
      } else {                          // нажатие второе, так как первая выделенная клетка не null
        this.secondSelectedCell = pos;
      }

      if (this.selectedCell && this.secondSelectedCell && (
        this.selectedCell.col !== this.secondSelectedCell.col ^
        this.selectedCell.row !== this.secondSelectedCell.row)) {
        if (this.areAdjacent(this.selectedCell, this.secondSelectedCell)) {
          this.swapCells(this.selectedCell, this.secondSelectedCell);
          if (!this.checkAvailableMoves()) {
            // Нет доступных ходов – сбрасываем поле.
            this.initGridWithTurns();
          }

          this.selectedCell = null;
          this.secondSelectedCell = null;
          action = true;
        }
      }
      if (action)
        this.drawScene();
    }
  }

  handlePointerUp(e) {
    e.preventDefault && e.preventDefault();
    // const pos = this.getGridPosition(e);
    // if (this.selectedCell && pos) {
    //   if (this.areAdjacent(this.selectedCell, pos)) {
    //     this.swapCells(this.selectedCell, pos);
    //     this.selectedCell = null;
    //   }
    // }
  }

  dropCells() {
    for (let c = 0; c < GRID_COLS; c++)
      for (let r = GRID_ROWS - 1; r >= 0; r--)
        if (this.grid[r][c] === null)
          for (let k = r - 1; k >= 0; k--)
            if (this.grid[k][c] !== null && this.grid[k][c].type !== 'disabled') {
              this.grid[r][c] = this.grid[k][c];
              this.grid[k][c] = null;
              break;
            }
  }

  fillEmptyCells() {
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++) {
        if (!this.isCellActive(r, c)) continue;
        if (this.grid[r][c] === null) {
          const key = this.assetKeys[Math.floor(this.randomGenerator.random() * this.assetKeys.length)];
          const fallOffset = -(GRID_PADDING_TOP - GRID_ZONE_PADDING_TOP);
          this.grid[r][c] = { type: key, fallOffset: fallOffset, currentFallOffset: fallOffset };
        }
      }
  }

  animateNewCells(duration = 250) {
    const startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 1.5);

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = easeOut(progress);
      for (let r = 0; r < GRID_ROWS; r++)
        for (let c = 0; c < GRID_COLS; c++) {
          const cell = this.grid[r][c];
          if (cell && cell.fallOffset < 0)
            cell.currentFallOffset = cell.fallOffset * (1 - easeOutProgress);
        }

      // this.isAnimatingCells = true;
      this.canDrag = false;
      this.drawScene();

      if (progress < 1)
        requestAnimationFrame(animate);
      else {
        for (let r = 0; r < GRID_ROWS; r++)
          for (let c = 0; c < GRID_COLS; c++) {
            const cell = this.grid[r][c];
            if (cell && cell.currentFallOffset !== undefined && cell.fallOffset < 0) {
              cell.currentFallOffset = 0;
              cell.fallOffset = 0;
            }
          }
        this.canDrag = true;
        // this.isAnimatingCells = false;
        this.handleMatches();
      }
    };
    animate();
  }

  animateDropCells(duration = 200) {
    const startTime = performance.now();
    const cellH = CELL_HEIGHT;
    for (let c = 0; c < GRID_COLS; c++) {
      let emptyCount = 0;
      for (let r = GRID_ROWS - 1; r >= 0; r--) {
        const cell = this.grid[r][c];
        if (cell === null)
          emptyCount++;
        else if (cell.type === 'disabled')
          continue;
        else if (emptyCount > 0) {
          cell.fallOffset = emptyCount * cellH;
          cell.currentFallOffset = cell.fallOffset;
        } else {
          cell.fallOffset = 0;
          cell.currentFallOffset = 0;
        }
      }
    }

    const easeOut = t => {
      // if (0.6 < t < 0.8) {
      //   return 1.1 - 2 * Math.pow(1.13 - 1.5 * t, 2);
      // }

      return 1 - Math.pow(1 - t, 1.5);
    }
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = easeOut(progress);
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const cell = this.grid[r][c];

          if (cell && cell.type !== 'disabled' && cell.fallOffset !== undefined)
            cell.currentFallOffset = cell.fallOffset * easeOutProgress;
        }
      }

      this.canDrag = false;
      this.drawScene();

      if (elapsed < duration)
        requestAnimationFrame(animate);
      else {
        for (let r = 0; r < GRID_ROWS; r++)
          for (let c = 0; c < GRID_COLS; c++) {
            const cell = this.grid[r][c];
            if (cell && cell.type !== 'disabled' && cell.currentFallOffset !== undefined) {
              cell.currentFallOffset = 0;
              cell.fallOffset = 0;
            }
          }

        this.drawScene();

        this.dropCells();
        this.fillEmptyCells();
        this.animateNewCells();
      }
    };
    this.canDrag = false;
    // this.isAnimatingCells = true;
    animate();
  }

  checkMatches() {
    const matches = Array.from({ length: GRID_ROWS }, () =>
      Array(GRID_COLS).fill(false)
    );

    // Проверка горизонтальных комбинаций
    for (let r = 0; r < GRID_ROWS; r++) {
      let count = 1;
      for (let c = 1; c < GRID_COLS; c++) {
        const cell = this.grid[r][c];
        const prevCell = this.grid[r][c - 1];
        if (!cell || !cell.type || !prevCell || !prevCell.type) continue;
        if (cell.type === prevCell.type)
          count++;
        else {
          if (count >= 3) {
            for (let k = c - count; k < c; k++) {
              matches[r][k] = true;
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let k = GRID_COLS - count; k < GRID_COLS; k++)
          matches[r][k] = true;
      }
    }

    // Проверка вертикальных комбинаций
    for (let c = 0; c < GRID_COLS; c++) {
      let count = 1;
      for (let r = 1; r < GRID_ROWS; r++) {
        const cell = this.grid[r][c];
        const prevCell = this.grid[r - 1][c];
        if (!cell || !cell.type || !prevCell || !prevCell.type) continue;
        if (cell.type === prevCell.type)
          count++;
        else {
          if (count >= 3) {
            for (let k = r - count; k < r; k++)
              matches[k][c] = true;
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let k = GRID_ROWS - count; k < GRID_ROWS; k++)
          matches[k][c] = true;
      }
    }
    return matches;
  }

  removeMatches(matched) {
    let removedCount = 0;
    let rightRemovedCount = 0;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (matched[r][c]) {
          const cell = this.grid[r][c];

          this.grid[r][c] = null;
          removedCount++;
          if (cell && (cell.type === this.orderProduct)) {
            rightRemovedCount++;
          }
        }
      }
    }

    return { removedCount, rightRemovedCount };
  }

  animateSwap(cell1, cell2, onComplete, duration = 400) {
    const startTime = performance.now();
    const startPosA = this.getCellCoordinates(cell1);
    const startPosB = this.getCellCoordinates(cell2);

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animate = () => {
      const elapsed = performance.now() - startTime;
      let progress = Math.min(elapsed / duration, 1);

      const effectiveProgress = easeInOutQuad(progress);

      const posA = {
        x: startPosA.x + (startPosB.x - startPosA.x) * effectiveProgress,
        y: startPosA.y + (startPosB.y - startPosA.y) * effectiveProgress,
      };
      const posB = {
        x: startPosB.x + (startPosA.x - startPosB.x) * effectiveProgress,
        y: startPosB.y + (startPosA.y - startPosB.y) * effectiveProgress,
      };

      this.grid[cell1.row][cell1.col].tempPos = posA;
      this.grid[cell2.row][cell2.col].tempPos = posB;

      // this.isAnimatingCells = true;
      this.drawScene();

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        delete this.grid[cell1.row][cell1.col].tempPos;
        delete this.grid[cell2.row][cell2.col].tempPos;
        // this.isAnimatingCells = false;
        onComplete();
      }
    };

    animate();
  }

  swapCells(cell1, cell2) {
    const cellA = this.grid[cell1.row][cell1.col];
    const cellB = this.grid[cell2.row][cell2.col];

    if (cellA.type == 'disabled' || cellB.type === 'disabled') return;

    this.canDrag = false;

    this.animateSwap(cell1, cell2, () => {
      this.grid[cell1.row][cell1.col] = cellB;
      this.grid[cell2.row][cell2.col] = cellA;

      const matched = this.checkMatches();
      const anyMatch = matched.some(row => row.some(match => match));

      if (!anyMatch) {
        this.animateSwap(cell1, cell2, () => {
          this.grid[cell1.row][cell1.col] = cellA;
          this.grid[cell2.row][cell2.col] = cellB;
        });
      } else {
        this.currentStepsCount++;
        if (this.currentStepsCount >= this.stepsCount) {
          this.handleGameOver();
        }
        this.handleMatches();
      }

      this.canDrag = true;
    });
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  drawCard(x, y, width, height, radius, strokeColor, fillColor) {
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.roundRect(this.ctx, x, y, width, height, radius);
    this.ctx.stroke();
    this.ctx.fill();
  }

  drawImageInCell(image, drawX, drawY, cellW, cellH, cellPadding) {
    const availableWidth = cellW - 2 * cellPadding;
    const availableHeight = cellH - 2 * cellPadding;
    const scale = Math.min(availableWidth / image.naturalWidth, availableHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (availableWidth - drawWidth) / 2;
    const offsetY = (availableHeight - drawHeight) / 2;
    this.ctx.drawImage(
      image,
      drawX + cellPadding + offsetX,
      drawY + cellPadding + offsetY,
      drawWidth,
      drawHeight
    );
  }

  drawHighlightedTarget() {
    const highlightedTargetX = HEADER_TARGET_LEFT;
    const highlightedTargetY = HEADER_TARGET_TOP;

    const highlightedTargetCounterX = highlightedTargetX + 55 + HEADER_TARGET_COUNTER_RADIUS;
    const highlightedTargetCounterY = highlightedTargetY + 33 + HEADER_TARGET_COUNTER_RADIUS;

    this.drawCard(highlightedTargetX, highlightedTargetY,
      HEADER_TARGET_CARD_WIDTH, HEADER_TARGET_CARD_HEIGHT, HEADER_TARGET_CARD_BORDER_RADIUS,
      STEPS_STROKE_COLOR, STEPS_BG_COLOR
    )

    if (this.images[this.orderProduct]) {
      this.drawImageInCell(this.images[this.orderProduct],
        highlightedTargetX, highlightedTargetY,
        HEADER_TARGET_CARD_IMAGE_WIDTH, HEADER_TARGET_CARD_IMAGE_HEIGHT, CELL_PADDING)
    }

    this.ctx.fillStyle = HEADER_TARGET_COUNTER_BG_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(highlightedTargetCounterX, highlightedTargetCounterY,
      HEADER_TARGET_COUNTER_RADIUS, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.fillStyle = HEADER_TARGET_COUNTER_TEXT_COLOR;
    this.ctx.font = "500 16px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`x${this.targetItemsCount}`,
      highlightedTargetCounterX, highlightedTargetCounterY, STEPS_CARD_WIDTH);
  }

  drawHeader() {
    const { width, height } = this.dimensions;

    const scaledHeaderHeight = HEADER_HEIGHT * this.scale;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, scaledHeaderHeight);
    gradient.addColorStop(0, HEADER_BG_TOP_COLOR);
    gradient.addColorStop(0.71, HEADER_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, scaledHeaderHeight);

    this.ctx.save();
    const offsetX = (width - MAX_CANVAS_WIDTH * this.scale) / 2;
    const offsetY = (scaledHeaderHeight - HEADER_HEIGHT * this.scale) / 2;
    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(this.scale, this.scale);

    if (this.images.lamBoy) {
      this.ctx.drawImage(this.images.lamBoy, LAMBOY_PADDING_LEFT, LAMBOY_PADDING_TOP, LAMBOY_WIDTH, LAMBOY_HEIGHT);
    }
    this.drawHighlightedTarget();

    this.ctx.restore();

    this.ctx.fillStyle = HEADER_UP_DIVIDER_COLOR;
    this.ctx.fillRect(0, scaledHeaderHeight - HEADER_DOWN_DIVIDER_HEIGHT - HEADER_UP_DIVIDER_HEIGHT, width, HEADER_UP_DIVIDER_HEIGHT);

    this.ctx.fillStyle = HEADER_DOWN_DIVIDER_COLOR;
    this.ctx.fillRect(0, scaledHeaderHeight - HEADER_DOWN_DIVIDER_HEIGHT, width, HEADER_DOWN_DIVIDER_HEIGHT);
  }

  drawCounters() {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const targetCardX = COUNTERS_PADDING_LEFT;
    const targetCardY = HEADER_HEIGHT + COUNTERS_PADDING_TOP;
    const stepsCardX = COUNTERS_PADDING_LEFT + TARGET_CARD_WIDTH + COUNTERS_GAP;
    const stepsCardY = HEADER_HEIGHT + COUNTERS_PADDING_TOP;

    this.drawCard(stepsCardX, stepsCardY,
      STEPS_CARD_WIDTH, STEPS_CARD_HEIGHT, 12,
      STEPS_STROKE_COLOR, STEPS_BG_COLOR
    )

    this.drawCard(targetCardX, targetCardY,
      TARGET_CARD_WIDTH, TARGET_CARD_HEIGHT, 12,
      TARGET_STROKE_COLOR, TARGET_BG_COLOR
    )

    const orderProductImg = this.images[this.orderProduct];
    if (orderProductImg) {
      this.drawImageInCell(orderProductImg,
        targetCardX + 4, targetCardY + 7,
        CELL_WIDTH * 6 / 7, CELL_HEIGHT * 6 / 7, CELL_PADDING)
    }

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 20px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(`${this.score}/${this.targetItemsCount}`,
      targetCardX + TARGET_CARD_WIDTH * 3 / 4 - 6, targetCardY + TARGET_CARD_HEIGHT / 2, TARGET_CARD_WIDTH / 2 - 4);

    this.ctx.fillText(`Шаги ${this.currentStepsCount}/${this.stepsCount}`,
      stepsCardX + STEPS_CARD_WIDTH / 2, stepsCardY + STEPS_CARD_HEIGHT / 2, STEPS_CARD_WIDTH - 13);

    this.ctx.restore();
  }

  drawBody() {
    const { width, height } = this.dimensions;
    const scaledHeaderHeight = HEADER_HEIGHT * this.scale;

    const gradient = this.ctx.createLinearGradient(0, scaledHeaderHeight, 0, height);
    gradient.addColorStop(0, BODY_BG_TOP_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, scaledHeaderHeight, width, height - scaledHeaderHeight);

    this.drawCounters();
  }

  drawRoundedPolygon(ctx, points, radius) {
    ctx.beginPath();
    const len = points.length;
    for (let i = 0; i < len; i++) {
      const prev = points[(i + len - 1) % len];
      const curr = points[i];
      const next = points[(i + 1) % len];

      const v1x = curr.x - prev.x;
      const v1y = curr.y - prev.y;
      const len1 = Math.hypot(v1x, v1y);
      const v1nx = v1x / len1;
      const v1ny = v1y / len1;

      const v2x = next.x - curr.x;
      const v2y = next.y - curr.y;
      const len2 = Math.hypot(v2x, v2y);
      const v2nx = v2x / len2;
      const v2ny = v2y / len2;

      const startX = curr.x - v1nx * radius;
      const startY = curr.y - v1ny * radius;
      const endX = curr.x + v2nx * radius;
      const endY = curr.y + v2ny * radius;

      if (i === 0) {
        ctx.moveTo(startX, startY);
      } else {
        ctx.lineTo(startX, startY);
      }
      ctx.arcTo(curr.x, curr.y, endX, endY, radius);
    }
    ctx.closePath();
  }

  drawRoundedPlus(ctx, x, y, width, height, armThickness, radius) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const halfArm = armThickness / 2;

    // Вычисляем 12 точек внешнего контура плюса
    // Рисуем форму как объединение вертикального и горизонтального прямоугольников
    const pts = [
      { x: cx - halfArm, y: y },            // верхняя левая точка вертикального прямоугольника
      { x: cx + halfArm, y: y },            // верхняя правая
      { x: cx + halfArm, y: cy - halfArm }, // переход к горизонтальному верхнему краю
      { x: x + width, y: cy - halfArm }, // верхняя правая точка горизонтального прямоугольника
      { x: x + width, y: cy + halfArm }, // нижняя правая
      { x: cx + halfArm, y: cy + halfArm }, // переход к вертикальному нижнему краю
      { x: cx + halfArm, y: y + height },   // нижняя правая вертикального прямоугольника
      { x: cx - halfArm, y: y + height },   // нижняя левая
      { x: cx - halfArm, y: cy + halfArm }, // переход к горизонтальному нижнему краю
      { x: x, y: cy + halfArm },  // нижняя левая горизонтального прямоугольника
      { x: x, y: cy - halfArm },  // верхняя левая горизонтального прямоугольника
      { x: cx - halfArm, y: cy - halfArm }  // переход к вертикальному верхнему краю
    ];

    this.drawRoundedPolygon(ctx, pts, radius);
  }

  drawGrid() {
    // const dpr = window.devicePixelRatio || 1;
    // this.ctx.save();
    // this.ctx.scale(dpr, dpr);

    // this.ctx.translate(this.offset.x, this.offset.y);
    // this.ctx.scale(this.scale, this.scale);

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const cell = this.grid[r][c];
        if (!cell || !cell.type || cell.type === 'disabled') continue;

        const pos = cell.tempPos || this.getCellCoordinates({ col: c, row: r });
        pos.y += (cell.currentFallOffset || 0);

        let cellW = CELL_WIDTH, cellH = CELL_HEIGHT;
        let posX = pos.x, posY = pos.y;
        let strokeColor = STEPS_STROKE_COLOR;
        let fillColor = STEPS_BG_COLOR;

        const scaleFactor = 1.10;  // увеличиваем на 10%
        if (this.selectedCell && this.selectedCell.col === c && this.selectedCell.row === r) {
          cellW = CELL_WIDTH * scaleFactor;
          cellH = CELL_HEIGHT * scaleFactor;
          posX = pos.x - (cellW - CELL_WIDTH) / 2;
          posY = pos.y - (cellH - CELL_HEIGHT) / 2;
          strokeColor = STEPS_STROKE_COLOR;
          fillColor = BODY_BG_BOTTOM_COLOR;
        }

        const image = this.images[cell.type];
        this.drawCard(posX, posY, cellW, cellH, 9, strokeColor, fillColor);
        if (image) {
          this.drawImageInCell(image, posX, posY, cellW, cellH, CELL_PADDING);
        }
      }
    }

    // this.ctx.restore();
  }

  drawGridZone() {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    this.ctx.fillStyle = GRID_ZONE_BG_COLOR;
    this.ctx.strokeStyle = GRID_ZONE_STROKE_COLOR;
    this.ctx.lineWidth = 1;

    this.drawRoundedPlus(
      this.ctx,
      GRID_ZONE_PADDING_LEFT,
      HEADER_HEIGHT + GRID_ZONE_PADDING_TOP,
      GRID_ZONE_WIDTH,
      GRID_ZONE_HEIGHT,
      GRID_ZONE_ARM_THICKNESS,
      GRID_ZONE_RADIUS
    );
    this.ctx.fill();
    this.ctx.stroke();

    this.drawGrid();

    this.ctx.restore();
  }

  drawScene() {
    console.log("Scene is drawn");
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dimensions;
    this.ctx.clearRect(0, 0, width, height);

    this.drawHeader();
    this.drawBody();
    this.drawGridZone();

    this.ctx.restore();
    // this.drawGrid();
  }

  handleGameOver() {
    console.log("GameOver!");
    this.isGameOver = true;
    if (this.finishCallback) {
      const gameData = {
        score: this.score,
        currentStepsCount: this.currentStepsCount
      };
      this.finishCallback(gameData);
    }

    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);
    this.canvas.removeEventListener("pointerup", this.boundHandlePointerUp);

    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  setFinishCallback(callback) {
    this.finishCallback = callback;
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}

function init(canvas, initGameData, tmp, finishFunc = (gameData) => { }) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishFunc);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}

export { init, deinit };
