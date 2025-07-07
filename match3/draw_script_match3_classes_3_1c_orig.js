const __VERSION__ = "3.1C";

// const PATH = "./assets/match3/";
const PATH = "/media/assets/match3/";

const cardPaths = {
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
const HEADER_BG_BOTTOM_COLOR = "#A6BDE5";
const HEADER_HEIGHT = 279;

const LAMBOY_PADDING_LEFT = 84;
const LAMBOY_PADDING_TOP = 0;

const LAMBOY_WIDTH = 344;
const LAMBOY_HEIGHT = 363;

const HEADER_UP_DIVIDER_COLOR = "#224C93";
const HEADER_DOWN_DIVIDER_COLOR = "#2C62B8";
const HEADER_UP_DIVIDER_HEIGHT = 4;
const HEADER_DOWN_DIVIDER_HEIGHT = 22;

const HEADER_TARGET_LEFT = 64;
const HEADER_TARGET_TOP = 75;
const HEADER_TARGET_CARD_WIDTH = 70.72;
const HEADER_TARGET_CARD_HEIGHT = 70.72;
const HEADER_TARGET_CARD_BORDER_RADIUS = 12;
const HEADER_TARGET_CARD_IMAGE_WIDTH = 70.72;
const HEADER_TARGET_CARD_IMAGE_HEIGHT = 70.72;
const HEADER_TARGET_COUNTER_BG_COLOR = "#B2222C";
const HEADER_TARGET_STROKE_COLOR = "#22498A";
const HEADER_TARGET_COUNTER_TEXT_COLOR = "#FFFFFF";
const HEADER_TARGET_COUNTER_RADIUS = 24;

const BODY_BG_COLOR = "#FFFFFF";

const COUNTERS_PADDING_TOP = 18;
const COUNTERS_PADDING_LEFT = 84;
const COUNTERS_GAP = 10;

const STEPS_BG_COLOR = "#FFFFFF";
const STEPS_STROKE_COLOR = "#224C93";
const STEPS_TEXT_COLOR = "#224C93";
const STEPS_CARD_WIDTH = 134;
const STEPS_CARD_HEIGHT = 61;

const TARGET_BG_COLOR = "#FFFFFF";
const TARGET_STROKE_COLOR = "#224C93";
const TARGET_CARD_WIDTH = 116;
const TARGET_CARD_HEIGHT = 61;

const GRID_ZONE_BG_COLOR = "#527EC9";
const GRID_ZONE_STROKE_COLOR = "#224C93";
const GRID_ZONE_PADDING_LEFT = 21;
const GRID_ZONE_PADDING_TOP = 97;
const GRID_ZONE_WIDTH = 386;
const GRID_ZONE_HEIGHT = 386;
const GRID_ZONE_ARM_THICKNESS = 265;
const GRID_ZONE_RADIUS = 16;

const GRID_PADDING_LEFT = 35.62;
const GRID_PADDING_TOP = 113.49;

const CELL_BG_COLOR = "#FFFFFF";
const CELL_STROKE_COLOR = "#224C93";
const CELL_WIDTH = 54.73;
const CELL_HEIGHT = 54.73;
const CELL_GAP = 5;
const CELL_PADDING = 0;
const CELL_RADIUS = 9;

const NEW_CELL_START_Y = CELL_HEIGHT + CELL_GAP;

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

const removingCellsEaseIn = t =>  1 - Math.cos((t * Math.PI) / 2);
const fallingCellsEaseIn = t => {
  const overshoot = 1.1;
  if (t < 0.7) {
    return (overshoot) * (t / 0.7);
  } else {
    return overshoot - (overshoot - 1) * ((t - 0.7) / 0.3);
  }
};

const swapCellsEaseIn = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
// const swapCellsEaseIn = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

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

const drawCard = (ctx, x, y, width, height, radius, strokeColor, fillColor, strokeWidth = 2) => {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  roundRect(ctx, x, y, width, height, radius);
  ctx.stroke();
  ctx.fill();
};

const drawImageInCell = (ctx, image, drawX, drawY, cellW, cellH, cellPadding, maxScale = 1) => {
  const availableWidth = cellW - 2 * cellPadding;
  const availableHeight = cellH - 2 * cellPadding;
  const scale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight,
    maxScale
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
    this.isDeleted = false;
  }
}

// --- Grid: логика сетки ---
class Grid {
  constructor(rows, cols, assetKeys, randomFn, cellActivityRule = (row, col, rows, cols) => true) {
    this.rows = rows;
    this.cols = cols;
    this.assetKeys = assetKeys;
    this.random = randomFn;
    this.cells = [];
    this.isCellActive = (row, col) => cellActivityRule(row, col, rows, cols);
    this.initGridWithTurns();
  }

  #initGrid() {
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        if (!this.isCellActive(r, c)) {
          row.push(null);
        } else {
          const key = this.assetKeys[
            Math.floor(this.random() * this.assetKeys.length)
          ];
          row.push(new Cell(key, r, c));
        }
      }

      this.cells.push(row);
    }
  }

  getMatchedCells() {
    const M = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
  
    // горизонтали
    for (let r = 0; r < this.rows; r++) {
      let count = 1;
      for (let c = 1; c < this.cols; c++) {
        const cur  = this.cells[r][c];
        const prev = this.cells[r][c - 1];
        if (cur && prev
          && !cur.isDeleted && !prev.isDeleted
          && cur.type === prev.type
        ) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = c - count; k < c; k++) 
              M[r][k] = true;
          }

          count = 1;
        }
      }

      if (count >= 3) {
        for (let k = this.cols - count; k < this.cols; k++) 
          M[r][k] = true;
      }
    }
  
    // вертикали (по той же схеме)
    for (let c = 0; c < this.cols; c++) {
      let count = 1;
      for (let r = 1; r < this.rows; r++) {
        const cur  = this.cells[r][c];
        const prev = this.cells[r - 1][c];
        if (cur && prev
          && !cur.isDeleted && !prev.isDeleted
          && cur.type === prev.type
        ) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = r - count; k < r; k++) 
              M[k][c] = true;
          }

          count = 1;
        }
      }

      if (count >= 3) {
        for (let k = this.rows - count; k < this.rows; k++) 
          M[k][c] = true;
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
      const has = this.getMatchedCells().some(row => row.some(x => x));
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
          const key = this.assetKeys[
            Math.floor(this.random() * this.assetKeys.length)
          ];
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
      const key = this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
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
      const key = this.assetKeys[Math.floor(this.random() * this.assetKeys.length)];
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
      x: x0 + pos.col * (CELL_WIDTH + CELL_GAP),
      y: y0 + pos.row * (CELL_HEIGHT + CELL_GAP),
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
      HEADER_TARGET_STROKE_COLOR,
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
        CELL_PADDING,
        1.2
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
        targetCardX,
        targetCardY,
        CELL_WIDTH,
        TARGET_CARD_HEIGHT,
        10
      );
    }

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 20px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
      `${score}/${targetItemsCount}`,
      targetCardX + TARGET_CARD_WIDTH / 2 + 22,
      targetCardY + TARGET_CARD_HEIGHT / 2,
      TARGET_CARD_WIDTH / 2 + 8
    );

    this.ctx.fillText(
      `Шаги ${currentStep}/${stepsCount}`,
      stepsCardX + STEPS_CARD_WIDTH / 2,
      stepsCardY + STEPS_CARD_HEIGHT / 2,
      STEPS_CARD_WIDTH - 8
    );

    this.ctx.restore();
  }

  drawBody(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    const { width, height } = this.dims;
    const scaledHeaderHeight = HEADER_HEIGHT * this.scale;

    this.ctx.fillStyle = BODY_BG_COLOR;
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
    let strokeColor = CELL_STROKE_COLOR;
    let fillColor = CELL_BG_COLOR;
    let alpha = 1;
    let scaleFactor = 1;
  
    if (selected) {
      scaleFactor = 1.06;
      cellW *= scaleFactor;
      cellH *= scaleFactor;
      const dx = (cellW - CELL_WIDTH) / 2;
      const dy = (cellH - CELL_HEIGHT) / 2;
      posX -= dx;
      posY -= dy;
      strokeColor = CELL_STROKE_COLOR;
      // fillColor = BODY_BG_BOTTOM_COLOR;
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
    drawCard(this.ctx, posX, posY, cellW, cellH, CELL_RADIUS, strokeColor, fillColor, 
      2 * scaleFactor + 1.3 * (scaleFactor !== 1));
    const img = this.images[cell.type];
    if (img) {
      drawImageInCell(this.ctx, img, posX, posY, cellW, cellH, CELL_PADDING, scaleFactor);
    }

    this.ctx.restore();
  }  

  drawGrid(grid, selectedPos) {
    for (const row of grid.cells) {
      for (const cell of row) {
        if (!cell || cell.isDeleted) continue;
        const sel = selectedPos
          && cell.row === selectedPos.row
          && cell.col === selectedPos.col;
        this.drawCell(cell, sel);
      }
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
  constructor(canvas, initGameData, tmp = {}) {
    tmp.engine = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp;
    this.assetKeys = Object.keys(cardPaths);
    
    const seed = initGameData.seed || Date.now().toString(16);
    this.randomGen = new LCG(seed);
    
    this.dimensions = { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    };

    this.trainingCount = +initGameData.trainingCount || 0;
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount || 10;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount || 10;
    this.score = 0;
    
    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GRID_ROWS,
      GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
      (r, c, rows, cols) => {
        const border =
      (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
        return !border;
      }
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

    this.boundResize = () => {
      this.resizeCanvas();
      this.requestRender();
    };

    this.boundHandlePointerDown = e => this.handlePointerDown(e);

    window.addEventListener("resize", this.boundResize);
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
    } else { 
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
    const h = p.clientHeight;
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
    if (this.assetsLoadedCb)
      this.assetsLoadedCb();

    this.handleMatches();
    this.requestRender();
  }

  async loadAssets() {
    const entries = [...Object.entries(cardPaths), ["lamBoy", lamBoyUrl]];
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
        if (!cell || cell.isDeleted) return;
        const p0 = this.renderer.getCoords(from);
        const p1 = this.renderer.getCoords(to);
        cell._animX = p0.x + (p1.x - p0.x) * e;
        cell._animY = p0.y + (p1.y - p0.y) * e;
      });
    }, () => {
      // commit swap in model
      this.grid.cells[a.row][a.col] = toCell;
      this.grid.cells[b.row][b.col] = fromCell;
      fromCell.row = b.row; 
      fromCell.col = b.col;
      toCell.row = a.row; 
      toCell.col = a.col;
      // check for matches
      const hasMatch = this.grid.getMatchedCells().some(row => row.some(x => x));
      if (hasMatch) {
        // finalize
        this.currentStep++;
        if (this.currentStep >= this.stepsCount)
          this.handleGameOver();

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
            if (!cell || cell.isDeleted) return;
            const p0 = this.renderer.getCoords(from);
            const p1 = this.renderer.getCoords(to);
            cell._animX = p0.x + (p1.x - p0.x) * e2;
            cell._animY = p0.y + (p1.y - p0.y) * e2;
          });
        }, () => {
          // revert model
          this.grid.cells[a.row][a.col] = fromCell;
          this.grid.cells[b.row][b.col] = toCell;
          fromCell.row = a.row; 
          fromCell.col = a.col;
          toCell.row = b.row; 
          toCell.col = b.col;
          delete fromCell._animX; 
          delete fromCell._animY;
          delete toCell._animX; 
          delete toCell._animY;
          this.requestRender();
        }));
      }
    }));
    this.requestRender();
  }

  onCellClicked(cellPosition) {
    if (!this.selectedCell){
      this.selectedCell = cellPosition;
    } else if (
      this.selectedCell.row === cellPosition.row &&
      this.selectedCell.col === cellPosition.col
    )
      this.selectedCell = null;
    else this.secondCell = cellPosition;
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

  handlePointerDown(e) {
    const pos = this.getCellGridPosition(e);

    if (!pos || this.animMgr.isAnimating()) return;

    this.onCellClicked(pos);
  }

  animRemoveMatches(matchedPositions, duration = 250) {
    const items = matchedPositions
      .map(({ row, col }) => this.grid.cells[row][col])
      .filter(cell => cell && !cell.isDeleted);
    
    this.animMgr.add(new MyAnimation(
      performance.now(),
      duration,
      t => {
        const p = removingCellsEaseIn(t);
        items.forEach(cell => {
          cell._removalProgress = p;
        });
        this.requestRender();
      },
      () => {
        items.forEach(cell => {
          cell.isDeleted = true;
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
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        if (matched[r][c]) 
          positions.push({ row: r, col: c });
      }
    }
  
    if (positions.length === 0) {
      if (!this.grid.checkAvailableMoves()) {
        this.grid.initGridWithTurns();
        this.handleMatches();
        this.requestRender();
      }

      return;
    }
  
    const correctCount = positions.filter(pos => {
      const cell = this.grid.cells[pos.row][pos.col];
      return cell && cell.type === this.orderProduct;
    }).length;
    this.score += correctCount;
    if (this.score >= this.targetItemsCount){
      this.handleGameOver();
    }
  
    this.animRemoveMatches(positions);
  }  

  animDrop(oldDuration = 250, newDuration = 250) {
    const dropItems = [];
    for (let c = 0; c < this.grid.cols; c++) {
      let emptyCount = 0;
      for (let r = this.grid.rows - 1; r >= 0; r--) {
        if (!this.grid.isCellActive(r, c)) {
          emptyCount = 0;
          continue;
        }

        const cell = this.grid.cells[r][c];
        if (!cell || cell.isDeleted) {
          emptyCount++;
        } else if (emptyCount > 0) {
          dropItems.push({
            cell,
            from: { row: r, col: c },
            to: { row: r + emptyCount, col: c }
          });
        }
      }
    }

    this.animMgr.add(new MyAnimation(
      performance.now(),
      oldDuration,
      t => {
        const e = fallingCellsEaseIn(t);
        dropItems.forEach(({ cell, from, to }) => {
          if (cell.isDeleted) return;
          const p0 = this.renderer.getCoords(from);
          const p1 = this.renderer.getCoords(to);
          cell._animX = p0.x + (p1.x - p0.x) * e;
          cell._animY = p0.y + (p1.y - p0.y) * e;
        });
        this.requestRender();
      },
      () => {
        this.grid.dropCells();

        const emptyPos = [];
        for (let r = 0; r < this.grid.rows; r++) {
          for (let c = 0; c < this.grid.cols; c++) {
            if (this.grid.isCellActive(r, c) &&
              (!this.grid.cells[r][c] || this.grid.cells[r][c].isDeleted)
            ) {
              emptyPos.push({ row: r, col: c });
            }
          }
        }

        this.grid.fillEmptyCells();

        const newItems = emptyPos.map(pos => {
          const cell = this.grid.cells[pos.row][pos.col];
          const to   = this.renderer.getCoords(pos);
          const from = { x: to.x, y: to.y - NEW_CELL_START_Y };
          cell._animX = from.x;
          cell._animY = from.y;
          return { cell, from, to };
        });

        this.animMgr.add(new MyAnimation(
          performance.now(),
          newDuration,
          t2 => {
            const e2 = fallingCellsEaseIn(t2);
            newItems.forEach(({ cell, from, to }) => {
              if (cell.isDeleted) return;
              cell._animX = from.x + (to.x - from.x) * e2;
              cell._animY = from.y + (to.y - from.y) * e2;
            });
            this.requestRender();
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
    const cellWidth = (CELL_WIDTH + CELL_GAP) * this.scale;
    const cellHeight = (CELL_HEIGHT + CELL_GAP) * this.scale;
    const col = Math.floor((x - gridStartX) / cellWidth);
    const row = Math.floor((y - gridStartY) / cellHeight);
    if (row < 0 || col < 0 || row >= this.grid.rows || col >= this.grid.cols) return null;
    const cell = this.grid.cells[row][col];
    if (!cell || cell.isDeleted) return null;

    return { row, col };
  }

  setFinishCallback(cb) {
    this.finishCb = cb;
  }

  setAssetsLoadedCallback(cb) {
    this.assetsLoadedCb = cb;
  }

  handleGameOver() {
    console.log("GameOver!", this.score, this.currentStep);
    this.isGameOver = true;
    if (this.finishCb) {
      const gameData = { 
        score: this.score, 
        currentStep: this.currentStep 
      };
      console.log(gameData);
      this.finishCb(gameData);
    }

    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}

function init(canvas, initGameData, tmp, finishCallback = gameData => {}, assetsLoadedCallback = () => {}) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) console.log("Canvas does not exist!");

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishCallback);
  engine.setAssetsLoadedCallback(assetsLoadedCallback);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}

export { init, deinit };
