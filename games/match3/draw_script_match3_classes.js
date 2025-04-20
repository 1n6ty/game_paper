const __VERSION__ = "1.1C";

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

const loadImage = src =>
  new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = e => {
      console.error("Failed to load image:", src, e);
      resolve(null);
    };
  });

// const newFallingCellsEaseIn = t => 1 - Math.pow(1 - t, 1.5);
// const fallingCellsEaseIn = t => 1 - Math.pow(1 - t, 1.5);
const fallingCellsEaseIn = t => {
  const overshoot = 1.1; // Насколько ниже цель (1.0 — точно в цель, 1.1 — чуть ниже)
  if (t < 0.7) {
    // 0..0.7 — падаем с ускорением до overshoot
    return (overshoot) * (t / 0.7);
  } else {
    // 0.7..1.0 — возвращаемся обратно
    return overshoot - (overshoot - 1) * ((t - 0.7) / 0.3);
  }
};

const swapCellsEaseIn = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const roundRect = (ctx, x, y, width, height, radius) => {
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
};

const drawRoundedPolygon = (ctx, points, radius) => {
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
};

const drawRoundedPlus = (ctx, x, y, width, height, armThickness, radius) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const halfArm = armThickness / 2;

  // Вычисляем 12 точек внешнего контура плюса
  // Рисуем форму как объединение вертикального и горизонтального прямоугольников
  const pts = [
    { x: cx - halfArm, y: y }, // верхняя левая точка вертикального прямоугольника
    { x: cx + halfArm, y: y }, // верхняя правая
    { x: cx + halfArm, y: cy - halfArm }, // переход к горизонтальному верхнему краю
    { x: x + width, y: cy - halfArm }, // верхняя правая точка горизонтального прямоугольника
    { x: x + width, y: cy + halfArm }, // нижняя правая
    { x: cx + halfArm, y: cy + halfArm }, // переход к вертикальному нижнему краю
    { x: cx + halfArm, y: y + height }, // нижняя правая вертикального прямоугольника
    { x: cx - halfArm, y: y + height }, // нижняя левая
    { x: cx - halfArm, y: cy + halfArm }, // переход к горизонтальному нижнему краю
    { x: x, y: cy + halfArm }, // нижняя левая горизонтального прямоугольника
    { x: x, y: cy - halfArm }, // верхняя левая горизонтального прямоугольника
    { x: cx - halfArm, y: cy - halfArm }, // переход к вертикальному верхнему краю
  ];

  drawRoundedPolygon(ctx, pts, radius);
};

const drawCard = (ctx, x, y, width, height, radius, strokeColor, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  roundRect(ctx, x, y, width, height, radius);
  ctx.stroke();
  ctx.fill();
};

const drawImageInCell = (
  ctx,
  image,
  drawX,
  drawY,
  cellW,
  cellH,
  cellPadding
) => {
  const availableWidth = cellW - 2 * cellPadding;
  const availableHeight = cellH - 2 * cellPadding;
  const scale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight
  );
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (availableWidth - drawWidth) / 2;
  const offsetY = (availableHeight - drawHeight) / 2;
  ctx.drawImage(
    image,
    drawX + cellPadding + offsetX,
    drawY + cellPadding + offsetY,
    drawWidth,
    drawHeight
  );
};

// --- Cell: чистая модель ---
class Cell {
  constructor(type, row, col) {
    this.type = type;
    this.row = row;
    this.col = col;
  }
}

// --- Grid: логика сетки ---
class Grid {
  constructor(rows, cols, assetKeys, randomFn) {
    this.rows = rows;
    this.cols = cols;
    this.assetKeys = assetKeys;
    this.random = randomFn;
    this.cells = [];
    this.initGridWithTurns();
  }
  
  isCellActive(r, c) {
    const border =
      (r === 0 || r === this.rows - 1) && (c === 0 || c === this.cols - 1);
    return !border;
  }

  #initGrid() {
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        if (!this.isCellActive(r, c)) row.push(new Cell("disabled", r, c));
        else {
          const key =
            this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
          row.push(new Cell(key, r, c));
        }
      }

      this.cells.push(row);
    }
  }

  getMatchedCells() {
    const M = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    for (let r = 0; r < this.rows; r++) {
      let count = 1;
      for (let c = 1; c < this.cols; c++) {
        const cur = this.cells[r][c],
          prev = this.cells[r][c - 1];
        if (cur && prev && cur.type === prev.type && cur.type !== "disabled")
          count++;
        else {
          if (count >= 3) for (let k = c - count; k < c; k++) M[r][k] = true;
          count = 1;
        }
      }

      if (count >= 3)
        for (let k = this.cols - count; k < this.cols; k++) M[r][k] = true;
    }

    for (let c = 0; c < this.cols; c++) {
      let count = 1;
      for (let r = 1; r < this.rows; r++) {
        const cur = this.cells[r][c],
          prev = this.cells[r - 1][c];
        if (cur && prev && cur.type === prev.type && cur.type !== "disabled")
          count++;
        else {
          if (count >= 3) for (let k = r - count; k < r; k++) M[k][c] = true;
          count = 1;
        }
      }

      if (count >= 3)
        for (let k = this.rows - count; k < this.rows; k++) M[k][c] = true;
    }

    return M;
  }

  checkAvailableMoves() {
    const sw = (r1, c1, r2, c2) => {
      const a = this.cells[r1][c1],
        b = this.cells[r2][c2];
      this.cells[r1][c1] = b;
      this.cells[r2][c2] = a;
      const has = this.getMatchedCells().some(r => r.some(x => x));
      this.cells[r1][c1] = a;
      this.cells[r2][c2] = b;
      return has;
    };

    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        const cell = this.cells[r][c];
        if (!cell || cell.type === "disabled") continue;
        if (
          c < this.cols - 1 &&
          this.cells[r][c + 1] &&
          this.cells[r][c + 1].type !== "disabled"
        )
          if (sw(r, c, r, c + 1)) return true;
        if (
          r < this.rows - 1 &&
          this.cells[r + 1][c] &&
          this.cells[r + 1][c].type !== "disabled"
        )
          if (sw(r, c, r + 1, c)) return true;
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
      console.warn("Не удалось сгенерировать сетку без доступных ходов за максимальное число попыток.", attempts);
    } else
      console.log("Сделано!", attempts);
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
      console.warn("Не удалось сгенерировать сетку с доступными ходами за максимальное число попыток.", attempts);
    } else
      console.log("Сделано!", attempts);

    return attempts;
  }

  removeMatches(M) {
    const rem = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        if (M[r][c] && this.cells[r][c]) {
          rem.push({ row: r, col: c, cell: this.cells[r][c] });
          this.cells[r][c] = null;
        }

    return rem;
  }

  dropCells() {
    for (let c = 0; c < this.cols; c++)
      for (let r = this.rows - 1; r >= 0; r--)
        if (this.cells[r][c] === null) {
          for (let k = r - 1; k >= 0; k--) {
            const s = this.cells[k][c];
            if (s && s.type !== "disabled") {
              this.cells[r][c] = s;
              this.cells[r][c].row = r;
              this.cells[k][c] = null;
              break;
            }
          }
        }
  }

  fillEmptyCells() {
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        if (this.cells[r][c] === null && this.isCellActive(r, c)) {
          const key =
            this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
          this.cells[r][c] = new Cell(key, r, c);
        }
  }

  areAdjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  fillUniformRows() {
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      const key = this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        if (!this.isCellActive(r, c)) row.push(new Cell("disabled", r, c));
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
      const key = this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
      const col = [];
      for (let r = 0; r < this.rows; r++) {
        if (!this.isCellActive(r, c)) col.push(new Cell("disabled", r, c));
        else {
          col.push(new Cell(key, r, c));
        }
      }

      this.cells.push(col);
    }
  }
}

// --- Animation ---
class MyAnimation {
  constructor(start, duration, update = () => {}, done = () => { }) {
    this.start = start;
    this.duration = duration;
    this.updateCb = update;
    this.doneCb = done;
    this.done = false;
  }

  tick(now) {
    const t = Math.min((now - this.start) / this.duration, 1);
    this.updateCb(t);
    if (t === 1 && !this.done) {
      this.done = true;
      this.doneCb();
    }
  }
}

class AnimationManager {
  constructor() {
    this.list = [];
  }

  add(a) {
    this.list.push(a);
  }

  update(now) {
    this.list.forEach(a => a.tick(now));
    this.list = this.list.filter(a => !a.done);
  }
  
  isAnimating() {
    return this.list.length > 0;
  }
}

// --- Renderer (все методы отрисовки) ---
class Renderer {
  constructor(ctx, opts) {
    this.ctx = ctx;
    this.scale = opts.scale;
    this.offset = opts.offset;
    this.dims = opts.dims;
    this.images = opts.images;
  }

  getCoords(pos) {
    const x0 = GRID_PADDING_LEFT;
    const y0 = HEADER_HEIGHT + GRID_PADDING_TOP;
    return {
      x: x0 + pos.col * (CELL_WIDTH + CELL_PADDING),
      y: y0 + pos.row * (CELL_HEIGHT + CELL_PADDING),
    };
  }

  drawHighlightedTarget(orderProduct, targetItemsCount) {
    const highlightedTargetX = HEADER_TARGET_LEFT;
    const highlightedTargetY = HEADER_TARGET_TOP;

    const highlightedTargetCounterX =
      highlightedTargetX + 55 + HEADER_TARGET_COUNTER_RADIUS;
    const highlightedTargetCounterY =
      highlightedTargetY + 33 + HEADER_TARGET_COUNTER_RADIUS;

    drawCard(
      this.ctx,
      highlightedTargetX,
      highlightedTargetY,
      HEADER_TARGET_CARD_WIDTH,
      HEADER_TARGET_CARD_HEIGHT,
      HEADER_TARGET_CARD_BORDER_RADIUS,
      STEPS_STROKE_COLOR,
      STEPS_BG_COLOR
    );

    const orderProductImg = this.images[orderProduct];
    if (orderProductImg) {
      drawImageInCell(
        this.ctx,
        orderProductImg,
        highlightedTargetX,
        highlightedTargetY,
        HEADER_TARGET_CARD_IMAGE_WIDTH,
        HEADER_TARGET_CARD_IMAGE_HEIGHT,
        CELL_PADDING
      );
    }

    this.ctx.fillStyle = HEADER_TARGET_COUNTER_BG_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(
      highlightedTargetCounterX,
      highlightedTargetCounterY,
      HEADER_TARGET_COUNTER_RADIUS,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.fillStyle = HEADER_TARGET_COUNTER_TEXT_COLOR;
    this.ctx.font = "500 16px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `x${targetItemsCount}`,
      highlightedTargetCounterX,
      highlightedTargetCounterY,
      STEPS_CARD_WIDTH
    );
  }

  drawHeader(orderProduct, targetItemsCount) {
    const { width, height } = this.dims;

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
      this.ctx.drawImage(
        this.images.lamBoy,
        LAMBOY_PADDING_LEFT,
        LAMBOY_PADDING_TOP,
        LAMBOY_WIDTH,
        LAMBOY_HEIGHT
      );
    }

    this.drawHighlightedTarget(orderProduct, targetItemsCount);

    this.ctx.restore();

    this.ctx.fillStyle = HEADER_UP_DIVIDER_COLOR;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight -
        HEADER_DOWN_DIVIDER_HEIGHT -
        HEADER_UP_DIVIDER_HEIGHT,
      width,
      HEADER_UP_DIVIDER_HEIGHT
    );

    this.ctx.fillStyle = HEADER_DOWN_DIVIDER_COLOR;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight - HEADER_DOWN_DIVIDER_HEIGHT,
      width,
      HEADER_DOWN_DIVIDER_HEIGHT
    );
  }

  drawCounters(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const targetCardX = COUNTERS_PADDING_LEFT;
    const targetCardY = HEADER_HEIGHT + COUNTERS_PADDING_TOP;
    const stepsCardX = COUNTERS_PADDING_LEFT + TARGET_CARD_WIDTH + COUNTERS_GAP;
    const stepsCardY = HEADER_HEIGHT + COUNTERS_PADDING_TOP;

    drawCard(
      this.ctx,
      stepsCardX,
      stepsCardY,
      STEPS_CARD_WIDTH,
      STEPS_CARD_HEIGHT,
      12,
      STEPS_STROKE_COLOR,
      STEPS_BG_COLOR
    );

    drawCard(
      this.ctx,
      targetCardX,
      targetCardY,
      TARGET_CARD_WIDTH,
      TARGET_CARD_HEIGHT,
      12,
      TARGET_STROKE_COLOR,
      TARGET_BG_COLOR
    );

    const orderProductImg = this.images[orderProduct];
    if (orderProductImg) {
      drawImageInCell(
        this.ctx,
        orderProductImg,
        targetCardX + 4,
        targetCardY + 7,
        (CELL_WIDTH * 6) / 7,
        (CELL_HEIGHT * 6) / 7,
        CELL_PADDING
      );
    }

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 20px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
      `${score}/${targetItemsCount}`,
      targetCardX + (TARGET_CARD_WIDTH * 3) / 4 - 6,
      targetCardY + TARGET_CARD_HEIGHT / 2,
      TARGET_CARD_WIDTH / 2 - 4
    );

    this.ctx.fillText(
      `Шаги ${currentStep}/${stepsCount}`,
      stepsCardX + STEPS_CARD_WIDTH / 2,
      stepsCardY + STEPS_CARD_HEIGHT / 2,
      STEPS_CARD_WIDTH - 13
    );

    this.ctx.restore();
  }

  drawBody(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    const { width, height } = this.dims;
    const scaledHeaderHeight = HEADER_HEIGHT * this.scale;

    const gradient = this.ctx.createLinearGradient(
      0,
      scaledHeaderHeight,
      0,
      height
    );
    gradient.addColorStop(0, BODY_BG_TOP_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight,
      width,
      height - scaledHeaderHeight
    );

    this.drawCounters(orderProduct, score, targetItemsCount, currentStep, stepsCount);
  }

  drawGridZone(grid, selected) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    this.ctx.fillStyle = GRID_ZONE_BG_COLOR;
    this.ctx.strokeStyle = GRID_ZONE_STROKE_COLOR;
    this.ctx.lineWidth = 1;

    drawRoundedPlus(
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

    this.drawGrid(grid, selected);

    this.ctx.restore();
  }

  drawCell(cell, selected) {
    const base = this.getCoords(cell);
    const x0 = cell._animX != null ? cell._animX : base.x;
    const y0 = cell._animY != null ? cell._animY : base.y;
  
    let cellW = CELL_WIDTH;
    let cellH = CELL_HEIGHT;
    let posX = x0;
    let posY = y0;
    let strokeColor = STEPS_STROKE_COLOR;
    let fillColor = STEPS_BG_COLOR;
    let alpha = 1;
    const scaleFactor = 1.10;
  
    if (selected) {
      cellW *= scaleFactor;
      cellH *= scaleFactor;
      const dx = (cellW - CELL_WIDTH) / 2;
      const dy = (cellH - CELL_HEIGHT) / 2;
      posX -= dx;
      posY -= dy;
      strokeColor = STEPS_STROKE_COLOR;
      fillColor = BODY_BG_BOTTOM_COLOR;
    }
  
    if (cell._removalProgress != null) {
      const p = cell._removalProgress; // от 0 до 1
      const scale = 1 - p;
      cellW *= scale;
      cellH *= scale;
      const dx = (CELL_WIDTH - cellW) / 2;
      const dy = (CELL_HEIGHT - cellH) / 2;
      posX = x0 + dx;
      posY = y0 + dy;
      alpha = 1 - p;
    }
  
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    drawCard(this.ctx, posX, posY, cellW, cellH, 9, strokeColor, fillColor);
    const img = this.images[cell.type];
    if (img) {
      drawImageInCell(this.ctx, img, posX, posY, cellW, cellH, CELL_PADDING);
    }

    this.ctx.restore();
  }  

  drawGrid(grid, selectedPos) {
    for (const row of grid.cells)
      for (const cell of row) {
        if (!cell || cell.type === "disabled") continue;
        const sel =
          selectedPos &&
          cell.row === selectedPos.row &&
          cell.col === selectedPos.col;

        this.drawCell(cell, sel);
      }
  }

  drawScene(grid, state) {
    console.log("Scene is drawn");
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dims;
    this.ctx.clearRect(0, 0, width, height);

    this.drawHeader(state.orderProduct, state.targetItemsCount);
    this.drawBody(state.orderProduct, 
      state.score,
      state.targetItemsCount,
      state.currentStep,
      state.stepsCount);
    this.drawGridZone(grid, state.selected);

    this.ctx.restore();
    // this.drawGrid();
  }
}

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
      hash = (hash << 5) + hash + str.charCodeAt(i);
      hash = hash & 0xffffffff;
    }

    return hash >>> 0;
  }

  random() {
    this.state = (this.multiplier * this.state + this.increment) % this.modulus;
    return this.state / this.modulus;
  }
}

// --- GameEngine ---
class GameEngine {
  constructor(canvas, initData, tmp = {}) {
    tmp.engine = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp;
    this.assetKeys = Object.keys(ASSET_PATHS);
    
    const seed = initData.seed || Date.now().toString(16);
    this.randomGen = new LCG(seed);
    
    this.dimensions = { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    };

    this.trainingCount = +initData.trainingCount || 0;
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initData.maxStepsCount || 20;
    this.currentStep = 0;
    this.targetItemsCount = +initData.targetItemsCount || 20;
    this.score = 0;
    
    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GRID_ROWS,
      GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
    );
    this.animMgr = new AnimationManager();
    this.renderer = new Renderer(this.ctx, {
      scale: this.scale,
      offset: this.offset,
      dims: this.dimensions,
      images: this.images
    });

    this.orderProduct = this.assetKeys[Math.floor(this.randomGen.random() * this.assetKeys.length)];

    this.selectedCell = null;
    this.secondCell = null;
    this.needsRender = true;
    this.lastTime = performance.now();
    this.gameLoopId = null;

    this.boundHandlePointerDown = e => {
      this.handlePointerDown(e);
    };

    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.requestRender();
    });
    canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    this.loadAssets();
    this.resizeCanvas();
  }

  requestRender() {
    this.needsRender = true;
    if (!this.gameLoopId) this.startGameLoop();
  }

  startGameLoop() {
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(now) {
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.updateLogic(dt);
    this.animMgr.update(now);
    if (this.animMgr.isAnimating() || this.needsRender) {
      this.renderer.drawScene(this.grid, {
        orderProduct: this.orderProduct,
        score: this.score,
        targetItemsCount: this.targetItemsCount,
        currentStep: this.currentStep,
        stepsCount: this.stepsCount,
        selected: this.selectedCell
      });
      this.needsRender = false;
      this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
    } else{ 
      console.log("Stop gameloop");
      this.gameLoopId = null;
    }
  }

  updateLogic(dt) {
    this.tutorialOffset = this.showTutorial
      ? Math.sin(performance.now() / 300) * 5
      : 0;
  }

  resizeCanvas() {
    const p = this.canvas.parentElement;
    if (!p) return;
    const w = p.clientWidth;
    const h = p.clientHeight - 60;
    this.dimensions = { width: w, height: h };
    this.scale = Math.min(w / MAX_CANVAS_WIDTH, h / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (w - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (h - MAX_CANVAS_HEIGHT * this.scale) / 2,
    };
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.renderer.scale = this.scale;
    this.renderer.offset = this.offset;
    this.renderer.dims = this.dimensions;
  }

  onAssetsLoaded() {
    this.handleMatches();
    this.requestRender();
  }

  async loadAssets() {
    const entries = [...Object.entries(ASSET_PATHS), ["lamBoy", lamBoyUrl]];
    const imgs = await Promise.all(entries.map(([, p]) => loadImage(p)));
    entries.forEach(([k], i) => (this.images[k] = imgs[i]));

    this.onAssetsLoaded();
  }

  animSwap(a, b, duration = 400) {
    const fromCell = this.grid.cells[a.row][a.col];
    const toCell = this.grid.cells[b.row][b.col];

    this.animMgr.add(new MyAnimation(performance.now(), duration, t => {
      const e = swapCellsEaseIn(t);
      [
        { cell: fromCell, from: a, to: b },
        { cell: toCell, from: b, to: a }
      ].forEach(({ cell, from, to }) => {
        const p0 = this.renderer.getCoords(from);
        const p1 = this.renderer.getCoords(to);
        cell._animX = p0.x + (p1.x - p0.x) * e;
        cell._animY = p0.y + (p1.y - p0.y) * e;
      });
    }, () => {
      // commit swap in model
      this.grid.cells[a.row][a.col] = toCell;
      this.grid.cells[b.row][b.col] = fromCell;
      fromCell.row = b.row; fromCell.col = b.col;
      toCell.row = a.row; toCell.col = a.col;
      // check for matches
      const hasMatch = this.grid.getMatchedCells().some(row => row.some(x => x));
      if (hasMatch) {
        // finalize
        this.currentStep++;
        delete fromCell._animX; delete fromCell._animY;
        delete toCell._animX; delete toCell._animY;
        this.requestRender();
        this.handleMatches();
      } else {
        // no match: animate back
        this.animMgr.add(new MyAnimation(performance.now(), 400, t2 => {
          const e2 = swapCellsEaseIn(t2);
          [
            { cell: fromCell, from: b, to: a },
            { cell: toCell, from: a, to: b }
          ].forEach(({ cell, from, to }) => {
            const p0 = this.renderer.getCoords(from);
            const p1 = this.renderer.getCoords(to);
            cell._animX = p0.x + (p1.x - p0.x) * e2;
            cell._animY = p0.y + (p1.y - p0.y) * e2;
          });
        }, () => {
          // revert model
          this.grid.cells[a.row][a.col] = fromCell;
          this.grid.cells[b.row][b.col] = toCell;
          fromCell.row = a.row; fromCell.col = a.col;
          toCell.row = b.row; toCell.col = b.col;
          delete fromCell._animX; delete fromCell._animY;
          delete toCell._animX; delete toCell._animY;
          this.requestRender();
        }));
      }
    }));
    this.requestRender();
  }

  handlePointerDown(e) {
    const pos = this.getCellGridPosition(e);

    if (!pos || this.animMgr.isAnimating()) return;

    if (!this.selectedCell){
      this.selectedCell = pos;
    } else if (
      this.selectedCell.row === pos.row &&
      this.selectedCell.col === pos.col
    )
      this.selectedCell = null;
    else this.secondCell = pos;
    if (
      this.selectedCell &&
      this.secondCell &&
      this.grid.areAdjacent(this.selectedCell, this.secondCell)
    ) {
      this.animSwap(this.selectedCell, this.secondCell);
      this.selectedCell = null;
      this.secondCell = null;
    }

    this.requestRender();
  }

  animRemoveMatches(matchedPositions, duration = 300) {
    const items = matchedPositions.map(pos => {
      const cell = this.grid.cells[pos.row][pos.col];
      return cell;
    });
    
    this.animMgr.add(new MyAnimation(
      performance.now(),
      duration,
      t => {
      // можно использовать любую easing‑функцию, здесь линейно:
        const p = t;
        items.forEach(cell => {
          cell._removalProgress = p;
        });
        this.requestRender();
      },
      () => {
        items.forEach(cell => {
          this.grid.cells[cell.row][cell.col] = null;
          delete cell._removalProgress;
        });
        this.requestRender();

        this.animDrop();
      }
    ));

    this.requestRender();
  }

  handleMatches() {
    const matched = this.grid.getMatchedCells();
    const positions = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (matched[r][c]) 
          positions.push({ row: r, col: c });
      }
    }

    if (positions.length === 0) return;
  
    // учитываем правильные собранные клетки
    const correctCount = positions.filter(pos => {
      const cell = this.grid.cells[pos.row][pos.col];
      return cell && cell.type === this.orderProduct;
    }).length;
    this.score += correctCount;

    this.animRemoveMatches(positions);
  }

  animDrop(oldDuration = 300, newDuration = 300) {
    // собираем старые падающие и считаем число удалённых клеток в каждом столбце
    const oldItems = [];
    const deletedCounts = Array(GRID_COLS).fill(0);
  
    for (let c = 0; c < GRID_COLS; c++) {
      let emptyCount = 0;
      for (let r = GRID_ROWS - 1; r >= 0; r--) {
        const cell = this.grid.cells[r][c];
        if (!cell) {
          emptyCount++;
        } else if (emptyCount > 0) {
          oldItems.push({ cell, from: { row: r, col: c }, to: { row: r + emptyCount, col: c } });
        }
      }

      deletedCounts[c] = emptyCount;
    }
  
    // анимация падения старых клеток
    this.animMgr.add(new MyAnimation(
      performance.now(),
      oldDuration,
      t => {
        const e = fallingCellsEaseIn(t);
        oldItems.forEach(({ cell, from, to }) => {
          const p0 = this.renderer.getCoords(from);
          const p1 = this.renderer.getCoords(to);
          cell._animX = p0.x + (p1.x - p0.x) * e;
          cell._animY = p0.y + (p1.y - p0.y) * e;
        });
      },
      () => {
        this.grid.dropCells();
        this.grid.fillEmptyCells();
  
        // готовим анимацию для новых клеток, используя deletedCounts
        const newItems = [];
        for (let c = 0; c < GRID_COLS; c++) {
          const del = deletedCounts[c];
          if (del > 0) {
            for (let r = 0; r < del; r++) {
              const cell = this.grid.cells[r][c];
              if (cell){
                const to = this.renderer.getCoords({ row: r, col: c });
                // старт сверху на del строк выше
                const from = { x: to.x, y: to.y - del * (CELL_HEIGHT + CELL_PADDING) };
                cell._animX = from.x;
                cell._animY = from.y;
                newItems.push({ cell, from, to });
              }
            }
          }
        }
  
        // анимация падения новых клеток
        this.animMgr.add(new MyAnimation(
          performance.now(),
          newDuration,
          t2 => {
            const e2 = fallingCellsEaseIn(t2);
            newItems.forEach(({ cell, from, to }) => {
              cell._animX = from.x + (to.x - from.x) * e2;
              cell._animY = from.y + (to.y - from.y) * e2;
            });
          },
          () => {
            newItems.forEach(({ cell }) => {
              delete cell._animX;
              delete cell._animY;
            });
            this.requestRender();
            this.handleMatches();
          }
        ));
      }
    ));
  
    this.requestRender();
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridStartX = this.offset.x + GRID_PADDING_LEFT * this.scale;
    const gridStartY = this.offset.y + (HEADER_HEIGHT + GRID_PADDING_TOP) * this.scale;
    const cellWidth = (CELL_WIDTH + CELL_PADDING) * this.scale;
    const cellHeight = (CELL_HEIGHT + CELL_PADDING) * this.scale;
    const col = Math.floor((x - gridStartX) / cellWidth);
    const row = Math.floor((y - gridStartY) / cellHeight);
    if (row < 0 || col < 0 || row >= GRID_ROWS || col >= GRID_COLS) return null;
    const cell = this.grid.cells[row][col];
    if (!cell || cell.type === "disabled") return null;

    return { row, col };
  }

  setFinishCallback(cb) {
    this.finishCb = cb;
  }

  handleGameOver() {
    this.isGameOver = true;
    if (this.finishCb)
      this.finishCb({ score: this.score, steps: this.currentStep });

    window.removeEventListener("resize", () => {
      this.resizeCanvas();
      this.requestRender();
    });

    this.canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
  }
}

function init(canvas, initGameData, tmp, finishCallback = gameData => {}) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishCallback);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}

export { init, deinit };
