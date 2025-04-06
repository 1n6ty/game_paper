const __VERSION__ = "4";

const PATH = "./assets/match3/";
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
const BASE_ASPECT = 809 / MAX_CANVAS_WIDTH;

const baseDimensions = {
  width: MAX_CANVAS_WIDTH,
  height: Math.floor(MAX_CANVAS_WIDTH * BASE_ASPECT),
};

const HEADER_BG_TOP_COLOR = "#FFFFFF";
const HEADER_BG_BOTTOM_COLOR = "#9FC7F0";
const HEADER_HEIGHT = 279;

const LAMBOY_PADDING_LEFT = 64;
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
const GRID_PADDING_TOP = 110.49;

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

class GameEngine {
  constructor(canvas, initGameData, tmp = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp;
    this.tmp.engine = this;

    this.trainingCount = parseInt(initGameData.trainingCount || "0", 10);
    this.showTutorial = this.trainingCount < 3;

    this.stepsCount = 12;
    this.currentStep = 0;

    this.targetItemsCount = 100;
    this.currentTargetItem = 30;

    this.grid = [];
    this.assetKeys = Object.keys(ASSET_PATHS);
    this.orderProduct =
      this.assetKeys[Math.floor(Math.random() * this.assetKeys.length)];
    this.initGrid();

    this.selectedCell = null;
    this.draggingCell = null;
    this.currentMousePos = null;

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.images = {};
    this.loadAssets();

    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));

    this.handleMatches();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const newWidth = Math.min(parent.clientWidth, MAX_CANVAS_WIDTH);
    const newHeight = Math.floor(newWidth * BASE_ASPECT);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
    this.dimensions = { width: newWidth, height: newHeight };
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
  }

  startGameLoop() {
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    const dt = 1 / 60;
    this.updateLogic(dt);
    this.drawScene();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
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
          const key = this.assetKeys[Math.floor(Math.random() * this.assetKeys.length)];
          row.push({ type: key });
        }
      }
      this.grid.push(row);
    }
  }

  areAdjacent(cell1, cell2) {
    console.log(cell1, cell2);
    const dr = Math.abs(cell1.row - cell2.row);
    const dc = Math.abs(cell1.col - cell2.col);
    return dr + dc === 1;
  }

  handleMatches() {
    let matched;
    let removedCount = 0;
    do {
      matched = this.checkMatches();
      const removed = this.removeMatches(matched);
      if (removed > 0) {
        removedCount += removed;
        this.animateDropCells();
      }
    } while (removedCount > 0 && this.checkMatches().flat().includes(true));

    this.currentTargetItem += removedCount;
  }

  getGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    // Получаем координаты в физическом пространстве
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    // Используем физические размеры для вычислений
    const gridPaddingTop = GRID_PADDING_TOP * dpr;
    const gridWidth = CELL_WIDTH * dpr;
    const gridHeight = CELL_HEIGHT * dpr;
    // Проверка выхода за пределы игрового поля (с учетом физ. размеров)
    if (y < gridPaddingTop || y > this.canvas.height) return null;
    const row = Math.floor((y - gridPaddingTop) / gridHeight);
    const col = Math.floor(x / gridWidth);
    return { row, col };
  }

  handleMouseDown(e) {
    const pos = this.getGridPosition(e);
    if (pos) {
      this.selectedCell = pos;
      this.draggingCell = pos;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cellPos = this.getCellCoordinates(pos);
      // Вычисляем смещение в физическом пространстве
      this.dragOffsetX = (e.clientX - rect.left) * dpr - cellPos.x;
      this.dragOffsetY = (e.clientY - rect.top) * dpr - cellPos.y;
      this.currentMousePos = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    }
  }

  handleMouseMove(e) {
    if (!this.draggingCell) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.currentMousePos = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
  }

  handleMouseUp(e) {
    const pos = this.getGridPosition(e);
    if (this.selectedCell && pos && this.areAdjacent(this.selectedCell, pos)) {
      this.swapCells(this.selectedCell, pos);
    }
    this.selectedCell = null;
    this.draggingCell = null;
    this.currentMousePos = null;
  }

  getCellCoordinates(pos) {
    const dpr = window.devicePixelRatio || 1;
    const cellW = CELL_WIDTH * dpr;
    const cellH = CELL_HEIGHT * dpr;
    return {
      x: GRID_PADDING_LEFT * dpr + pos.col * (cellW + CELL_PADDING * dpr),
      y: HEADER_HEIGHT * dpr + GRID_PADDING_TOP * dpr + pos.row * (cellH + CELL_PADDING * dpr),
      w: cellW,
      h: cellH,
    };
  }

  dropCells() {
    for (let c = 0; c < GRID_COLS; c++)
      for (let r = GRID_ROWS - 1; r >= 0; r--)
        if (this.grid[r][c] === null)
          for (let k = r - 1; k >= 0; k--)
            if (this.grid[k][c] !== null) {
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
          const key = this.assetKeys[Math.floor(Math.random() * this.assetKeys.length)];
          this.grid[r][c] = { type: key, fallOffset: -CELL_HEIGHT, currentFallOffset: -CELL_HEIGHT };
        }
      }
  }

  animateNewCells(duration = 500) {
    const startTime = performance.now();
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      for (let r = 0; r < GRID_ROWS; r++)
        for (let c = 0; c < GRID_COLS; c++) {
          const cell = this.grid[r][c];
          if (cell && cell.fallOffset < 0)
            cell.currentFallOffset = cell.fallOffset * (1 - progress);
        }

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
        this.handleMatches();
      }
    };
    animate();
  }

  animateDropCells(duration = 500) {
    const startTime = performance.now();
    const cellH = CELL_HEIGHT;
    for (let c = 0; c < GRID_COLS; c++) {
      let emptyCount = 0;
      for (let r = GRID_ROWS - 1; r >= 0; r--) {
        const cell = this.grid[r][c];
        if (cell === null || cell.type === 'disabled')
          emptyCount++;
        else if (emptyCount > 0) {
          cell.fallOffset = emptyCount * cellH;
          cell.currentFallOffset = cell.fallOffset;
        } else {
          cell.fallOffset = 0;
          cell.currentFallOffset = 0;
        }
      }
    }

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const cell = this.grid[r][c];

          if (cell && cell.fallOffset !== undefined)
            cell.currentFallOffset = cell.fallOffset * progress;
        }
      }
      this.drawScene();
      if (progress < 1)
        requestAnimationFrame(animate);
      else {
        for (let r = 0; r < GRID_ROWS; r++)
          for (let c = 0; c < GRID_COLS; c++) {
            const cell = this.grid[r][c];
            if (cell && cell.currentFallOffset !== undefined) {
              cell.currentFallOffset = 0;
              cell.fallOffset = 0;
            }
          }

        this.dropCells();
        this.fillEmptyCells();
        this.animateNewCells();
      }
    };
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
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++)
        if (matched[r][c]) {
          this.grid[r][c] = null;
          removedCount++;
        }
    return removedCount;
  }

  animateSwap(cell1, cell2, onComplete, duration = 800, reverse = false) {
    const startTime = performance.now();
    const startPosA = this.getCellCoordinates(cell1);
    const startPosB = this.getCellCoordinates(cell2);

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animate = () => {
      const elapsed = performance.now() - startTime;
      let progress = Math.min(elapsed / duration, 1);

      const effectiveProgress = reverse ? easeInOutQuad(1 - progress) : easeInOutQuad(progress);

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

      this.drawScene();

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        delete this.grid[cell1.row][cell1.col].tempPos;
        delete this.grid[cell2.row][cell2.col].tempPos;
        onComplete();
      }
    };

    animate();
  }

  swapCells(cell1, cell2) {
    const cellA = this.grid[cell1.row][cell1.col];
    const cellB = this.grid[cell2.row][cell2.col];

    if (cellA.type == 'disabled' || cellB.type === 'disabled') return;

    this.animateSwap(cell1, cell2, () => {
      this.grid[cell1.row][cell1.col] = cellB;
      this.grid[cell2.row][cell2.col] = cellA;

      const matched = this.checkMatches();
      const anyMatch = matched.some(row => row.some(match => match));

      if (!anyMatch) {
        this.animateSwap(cell1, cell2, () => {
          this.grid[cell1.row][cell1.col] = cellA;
          this.grid[cell2.row][cell2.col] = cellB;
        }, true);
      } else {
        this.currentStep++;
        this.handleMatches();
      }
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
  };

  drawHighlightedTarget() {
    const { width } = this.dimensions;

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

    this.ctx.save();
    this.ctx.fillStyle = HEADER_TARGET_COUNTER_TEXT_COLOR;
    this.ctx.font = "500 16px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`x${this.targetItemsCount}`,
      highlightedTargetCounterX, highlightedTargetCounterY, STEPS_CARD_WIDTH);
    this.ctx.restore();
  }

  drawHeader() {
    const { width } = this.dimensions;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, HEADER_HEIGHT);
    gradient.addColorStop(0, HEADER_BG_TOP_COLOR);
    gradient.addColorStop(0.71, HEADER_BG_BOTTOM_COLOR);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, HEADER_HEIGHT);

    if (this.images.lamBoy) {
      this.ctx.drawImage(this.images.lamBoy, LAMBOY_PADDING_LEFT, LAMBOY_PADDING_TOP, LAMBOY_WIDTH, LAMBOY_HEIGHT);
    }

    this.drawHighlightedTarget();

    this.ctx.fillStyle = HEADER_UP_DIVIDER_COLOR;
    this.ctx.fillRect(0, HEADER_HEIGHT - HEADER_DOWN_DIVIDER_HEIGHT - HEADER_UP_DIVIDER_HEIGHT,
      width, HEADER_UP_DIVIDER_HEIGHT);
    this.ctx.fillStyle = HEADER_DOWN_DIVIDER_COLOR;
    this.ctx.fillRect(0, HEADER_HEIGHT - HEADER_DOWN_DIVIDER_HEIGHT,
      width, HEADER_DOWN_DIVIDER_HEIGHT);
  }

  drawCounters() {
    const { width } = this.dimensions;

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

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 20px Roboto Mono";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";

    const orderProductImg = this.images[this.orderProduct];
    if (orderProductImg) {
      this.drawImageInCell(orderProductImg,
        targetCardX + 4, targetCardY + 2,
        CELL_WIDTH, CELL_HEIGHT, CELL_PADDING)
    }
    this.ctx.fillText(`${this.currentTargetItem}/${this.targetItemsCount}`,
      targetCardX + TARGET_CARD_WIDTH / 2, targetCardY + TARGET_CARD_HEIGHT / 2, TARGET_CARD_WIDTH / 2 - 2);

    this.ctx.fillText(`Шаги ${this.currentStep}/${this.stepsCount}`,
      stepsCardX + 12, stepsCardY + STEPS_CARD_HEIGHT / 2, STEPS_CARD_WIDTH);
  }

  drawBody() {
    const { width, height } = this.dimensions;

    const gradient = this.ctx.createLinearGradient(0, HEADER_HEIGHT, 0, height - HEADER_HEIGHT);
    gradient.addColorStop(0, BODY_BG_TOP_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, HEADER_HEIGHT, width, height - HEADER_HEIGHT);

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
    const { width, height } = this.dimensions;
    const cellW = CELL_WIDTH;
    const cellH = CELL_HEIGHT;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (this.draggingCell && r == this.draggingCell.row && c == this.draggingCell.col) {
          continue;
        }

        const cell = this.grid[r][c];
        if (!cell || !cell.type || cell.type == 'disabled') continue;

        const pos = cell.tempPos || {
          x: GRID_PADDING_LEFT + c * (cellW + CELL_PADDING),
          y: HEADER_HEIGHT + GRID_PADDING_TOP + r * (cellH + CELL_PADDING) + (cell.currentFallOffset || 0)
        };

        const image = this.images[cell.type];

        this.drawCard(pos.x, pos.y, cellW, cellH, 9, STEPS_STROKE_COLOR, STEPS_BG_COLOR);
        if (image) {
          this.drawImageInCell(image, pos.x, pos.y, cellW, cellH, CELL_PADDING);
        }
      }
    }

    if (this.draggingCell && this.currentMousePos) {
      const cellData = this.grid[this.draggingCell.row][this.draggingCell.col];
      if (cellData && cellData.type) {
        const drawX = this.currentMousePos.x - this.dragOffsetX;
        const drawY = this.currentMousePos.y - this.dragOffsetY;
        const image = this.images[cellData.type];

        this.drawCard(drawX, drawY, cellW, cellH, 9, STEPS_STROKE_COLOR, STEPS_BG_COLOR);
        if (image) {
          this.drawImageInCell(image, drawX, drawY, cellW, cellH, CELL_PADDING);
        }
      }
    }
  }

  drawGridZone() {
    this.ctx.fillStyle = GRID_ZONE_BG_COLOR;
    this.ctx.strokeStyle = GRID_ZONE_STROKE_COLOR;
    this.ctx.lineWidth = 1;
    this.drawRoundedPlus(
      this.ctx,
      GRID_ZONE_PADDING_LEFT, HEADER_HEIGHT + GRID_ZONE_PADDING_TOP,
      GRID_ZONE_WIDTH, GRID_ZONE_HEIGHT,
      GRID_ZONE_ARM_THICKNESS, GRID_ZONE_RADIUS);
    this.ctx.fill();
    this.ctx.stroke();

    this.drawGrid();
  }

  drawScene() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dimensions;
    this.ctx.clearRect(0, 0, width, height);

    this.drawHeader();
    this.drawBody();
    this.drawGridZone();

    this.ctx.restore();
  }

  handleGameOver() {
    this.isGameOver = true;
    if (this.finishCallback) {
      const gameData = { /* данные */ };
      this.finishCallback(gameData);
    }
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
  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.startGameLoop();
  engine.setFinishCallback(finishFunc);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}
