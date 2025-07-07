const __VERSION__ = "3.1C-optimized";

// ===================================================================================
// ИГРОВАЯ КОНФИГУРАЦИЯ
// ===================================================================================

const PATHS = {
  // ASSETS: "/media/assets/match3/",
  ASSETS: "./assets/match3/",
  CARDS: {
    smetanaGlass: "smetana_glass.svg",
    curd: "curd.svg",
    butter: "butter.svg",
    iceCream: "ice_cream.svg",
    creamBox: "cream_box.svg",
  },
  LAMBOY: "lamboy.svg",
  HAND: "hand.svg",
  ARROW: "arrow.svg",
  HIGHLIGHT: "highlight.svg",
  HIGHLIGHT_COUNTER: "highlight_counter.svg",
  get: (type, file) => PATHS.ASSETS + (type === 'card' ? PATHS.CARDS[file] : file)
};

const GAME_CONFIG = {
  MAX_CANVAS_WIDTH: 428,
  MAX_CANVAS_HEIGHT: 809,
  GRID_ROWS: 6,
  GRID_COLS: 6,
};

const COLORS = {
  HEADER_BG_TOP: "#FFFFFF",
  HEADER_BG_BOTTOM: "#A6BDE5",
  HEADER_DIVIDER_UP: "#224C93",
  HEADER_DIVIDER_DOWN: "#2C62B8",
  BODY_BG: "#FFFFFF",
  GRID_ZONE_BG: "#527EC9",
  GRID_ZONE_STROKE: "#224C93",
  CELL_BG: "#FFFFFF",
  CELL_STROKE: "#224C93",
  STEPS_BG: "#FFFFFF",
  STEPS_STROKE: "#224C93",
  STEPS_TEXT: "#224C93",
  TARGET_BG: "#FFFFFF",
  TARGET_STROKE: "#224C93",
  TARGET_COUNTER_BG: "#B2222C",
  TARGET_COUNTER_TEXT: "#FFFFFF",
};

const LAYOUT = {
  HEADER_HEIGHT: 279,
  HEADER_DIVIDER_UP_HEIGHT: 4,
  HEADER_DIVIDER_DOWN_HEIGHT: 22,
  LAMBOY_PADDING_LEFT: 84,
  LAMBOY_PADDING_TOP: 0,
  LAMBOY_WIDTH: 344,
  LAMBOY_HEIGHT: 363,
  COUNTERS_PADDING_TOP: 18,
  COUNTERS_PADDING_LEFT: 84,
  COUNTERS_GAP: 10,
  GRID_ZONE_PADDING_LEFT: 21,
  GRID_ZONE_PADDING_TOP: 97,
  GRID_ZONE_WIDTH: 386,
  GRID_ZONE_HEIGHT: 386,
  GRID_ZONE_ARM_THICKNESS: 265,
  GRID_ZONE_RADIUS: 16,
  GRID_PADDING_LEFT: 35.62,
  GRID_PADDING_TOP: 113.49,
};

const CELL_CONFIG = {
  WIDTH: 54.73,
  HEIGHT: 54.73,
  GAP: 5,
  PADDING: 0,
  RADIUS: 9,
  get NEW_CELL_START_Y() { return this.HEIGHT + this.GAP; },
};

const UI_ELEMENTS = {
  HEADER_TARGET: {
    X: 64, Y: 75,
    CARD_WIDTH: 70.72, CARD_HEIGHT: 70.72,
    BORDER_RADIUS: 12, IMAGE_SCALE: 1.2
  },
  TARGET_COUNTER: {
    RADIUS: 24, FONT: "500 16px Roboto Mono",
    get X_OFFSET() { return 55 + this.RADIUS; },
    get Y_OFFSET() { return 33 + this.RADIUS; }
  },
  STEPS_CARD: {
    WIDTH: 134, HEIGHT: 61, RADIUS: 12,
    FONT: "500 20px Roboto Mono"
  },
  TARGET_CARD: {
    WIDTH: 116, HEIGHT: 61, RADIUS: 12,
    FONT: "500 20px Roboto Mono"
  }
};

const ANIMATION_CONFIG = {
  SWAP_DURATION: 400,
  REMOVE_DURATION: 250,
  DROP_OLD_DURATION: 250,
  DROP_NEW_DURATION: 250,
  EASING: {
    REMOVING: t => 1 - Math.cos((t * Math.PI) / 2),
    FALLING: t => {
      const overshoot = 1.1;
      return t < 0.7 ? (overshoot * (t / 0.7)) : overshoot - (overshoot - 1) * ((t - 0.7) / 0.3);
    },
    SWAPPING: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
  }
};

const TUTORIAL_STATE = {
    NONE: 'none', INTRO: 'intro', STEP_2_HEADER_TARGET: 'step_2_header_target',
    STEP_3_SHOW_SWAP: 'step_3_show_swap', STEP_4_PERFORM_SWAP: 'step_4_perform_swap',
    STEP_5_MATCH_EFFECT: 'step_5_match_effect', STEP_6_NEW_ELEMENTS: 'step_6_new_elements',
    STEP_7_TARGET_COUNTER: 'step_7_target_counter', STEP_8_STEPS_COUNTER: 'step_8_steps_counter',
    COMPLETE: 'complete',
};

const TUTORIAL_CONFIG = {
  MODAL_BG: "rgba(50, 83, 116, 0.48)",
  POPUP: {
    BG: "#FFFFFF", RADIUS: 16,
    TEXT_COLOR: "#527EC9", FONT: "600 16px Roboto", LINE_HEIGHT: 24,
    PADDING_X: 20, PADDING_Y: 20,
  },
  BUTTON: {
    WIDTH: 165, HEIGHT: 35, RADIUS: 12,
    BG: "#A7E8B3", TEXT_COLOR: "#2F7A2E", FONT: "500 17px Roboto",
    MARGIN_BOTTOM: 20,
  },
  ARROW: {
    GAP_Y: 0
  },
  TEXTS: {
    [TUTORIAL_STATE.INTRO]: {
      text: "Сейчас кратко объясним,\nкак играть. Готов?", buttonText: "Поехали",
      y: 'center', width: 250, isModal: true, centerBlock: true,
    },
    [TUTORIAL_STATE.STEP_2_HEADER_TARGET]: {
      text: "Помоги Ламбою собрать\nзаказ из продуктов",
      y: 181, width: 241, isModal: true, hasArrow: true, centerBlock: true, highlightType: 'header',
    },
    [TUTORIAL_STATE.STEP_3_SHOW_SWAP]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260, width: 366, spotlight: true,
    },
    [TUTORIAL_STATE.STEP_4_PERFORM_SWAP]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260, width: 366, spotlight: true,
    },
    [TUTORIAL_STATE.STEP_5_MATCH_EFFECT]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260, width: 366, spotlight: true,
    },
    [TUTORIAL_STATE.STEP_6_NEW_ELEMENTS]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260, width: 366, spotlight: true,
    },
    [TUTORIAL_STATE.STEP_7_TARGET_COUNTER]: {
      text: "За каждый собранный заказ ты\nполучаешь 10 ламбиксов",
      y: 375, width: 298, isModal: true, hasArrow: true, centerBlock: true, highlightType: 'targetCounter',
    },
    [TUTORIAL_STATE.STEP_8_STEPS_COUNTER]: {
      text: "Не забывай следить за\nограниченным количеством\nшагов. Попробуем?", buttonText: "Давай играть",
      y: 390, width: 284, isModal: true, hasArrow: true, centerBlock: true, highlightType: 'stepsCounter',
    },
  }
};


// ===================================================================================
// УТИЛИТАРНЫЕ ФУНКЦИИ
// ===================================================================================

const loadImage = src => new Promise(resolve => {
  const img = new Image();
  img.src = src;
  img.onload = () => resolve(img);
  img.onerror = e => { console.error("Failed to load image:", src, e); resolve(null); };
});

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
    const v1x = curr.x - prev.x, v1y = curr.y - prev.y, len1 = Math.hypot(v1x, v1y);
    const v2x = next.x - curr.x, v2y = next.y - curr.y, len2 = Math.hypot(v2x, v2y);
    const startX = curr.x - (v1x / len1) * radius, startY = curr.y - (v1y / len1) * radius;
    const endX = curr.x + (v2x / len2) * radius, endY = curr.y + (v2y / len2) * radius;
    if (i === 0) ctx.moveTo(startX, startY); else ctx.lineTo(startX, startY);
    ctx.arcTo(curr.x, curr.y, endX, endY, radius);
  }
  ctx.closePath();
};

const drawRoundedPlus = (ctx, x, y, width, height, armThickness, radius) => {
  const cx = x + width / 2, cy = y + height / 2, halfArm = armThickness / 2;
  const pts = [
    { x: cx - halfArm, y: y }, { x: cx + halfArm, y: y },
    { x: cx + halfArm, y: cy - halfArm }, { x: x + width, y: cy - halfArm },
    { x: x + width, y: cy + halfArm }, { x: cx + halfArm, y: cy + halfArm },
    { x: cx + halfArm, y: y + height }, { x: cx - halfArm, y: y + height },
    { x: cx - halfArm, y: cy + halfArm }, { x: x, y: cy + halfArm },
    { x: x, y: cy - halfArm }, { x: cx - halfArm, y: cy - halfArm },
  ];
  drawRoundedPolygon(ctx, pts, radius);
};

const measureAndWrapText = (ctx, text, maxWidth, lineHeight) => {
  const lines = [];
  text.split('\n').forEach(paragraph => {
    let currentLine = '';
    const words = paragraph.split(' ');
    for (const word of words) {
      const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
  });
  return { lines, height: lines.length * lineHeight };
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
  if (!image) return;
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
    this.cells = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.isCellActive(row, col)) {
            continue;
        }

        let availableTypes = [...this.assetKeys];

        // Проверка, не создаст ли новый элемент горизонтальный ряд из трёх
        if (col >= 2 && this.cells[row][col - 1]?.type === this.cells[row][col - 2]?.type) {
            const forbiddenType = this.cells[row][col - 1].type;
            availableTypes = availableTypes.filter(t => t !== forbiddenType);
        }

        // Проверка, не создаст ли новый элемент вертикальный ряд из трёх
        if (row >= 2 && this.cells[row - 1][col]?.type === this.cells[row - 2][col]?.type) {
            const forbiddenType = this.cells[row - 1][col].type;
            availableTypes = availableTypes.filter(t => t !== forbiddenType);
        }
        
        // На случай, если все типы окажутся под запретом (очень редкий крайний случай)
        if (availableTypes.length === 0) {
            availableTypes = [...this.assetKeys];
        }

        const key = availableTypes[Math.floor(this.random() * availableTypes.length)];
        this.cells[row][col] = new Cell(key, row, col);
      }
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
// --- НАЧАЛО БЛОКА ДЛЯ ВСТАВКИ: ПОЛНАЯ ЗАМЕНА КЛАССА Renderer ---

class Renderer {
  constructor(ctx, opts) {
    this.ctx = ctx;
    this.scale = opts.scale;
    this.offset = opts.offset;
    this.dims = opts.dims;
    this.images = opts.images;
  }

  getCoords(pos) {
    const x0 = LAYOUT.GRID_PADDING_LEFT;
    const y0 = LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_PADDING_TOP;
    return {
      x: x0 + pos.col * (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP),
      y: y0 + pos.row * (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP),
    };
  }

  drawHeader(orderProduct, targetItemsCount) {
    const { width } = this.dims;
    const scaledHeaderHeight = LAYOUT.HEADER_HEIGHT * this.scale;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, scaledHeaderHeight);
    gradient.addColorStop(0, COLORS.HEADER_BG_TOP);
    gradient.addColorStop(0.71, COLORS.HEADER_BG_BOTTOM);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, scaledHeaderHeight);

    this.ctx.save();
    const offsetX = (width - GAME_CONFIG.MAX_CANVAS_WIDTH * this.scale) / 2;
    this.ctx.translate(offsetX, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    if (this.images.lamBoy) {
      this.ctx.drawImage(this.images.lamBoy, LAYOUT.LAMBOY_PADDING_LEFT, LAYOUT.LAMBOY_PADDING_TOP, LAYOUT.LAMBOY_WIDTH, LAYOUT.LAMBOY_HEIGHT);
    }
    this.drawHighlightedTarget(orderProduct, targetItemsCount);
    this.ctx.restore();

    this.ctx.fillStyle = COLORS.HEADER_DIVIDER_UP;
    this.ctx.fillRect(0, scaledHeaderHeight - LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT - LAYOUT.HEADER_DIVIDER_UP_HEIGHT, width, LAYOUT.HEADER_DIVIDER_UP_HEIGHT);
    this.ctx.fillStyle = COLORS.HEADER_DIVIDER_DOWN;
    this.ctx.fillRect(0, scaledHeaderHeight - LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT, width, LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT);
  }

  drawHighlightedTarget(orderProduct, targetItemsCount) {
    const { X, Y, CARD_WIDTH, CARD_HEIGHT, BORDER_RADIUS, IMAGE_SCALE } = UI_ELEMENTS.HEADER_TARGET;
    const { RADIUS, FONT, X_OFFSET, Y_OFFSET } = UI_ELEMENTS.TARGET_COUNTER;

    drawCard(this.ctx, X, Y, CARD_WIDTH, CARD_HEIGHT, BORDER_RADIUS, COLORS.TARGET_STROKE, COLORS.TARGET_BG);
    drawImageInCell(this.ctx, this.images[orderProduct], X, Y, CARD_WIDTH, CARD_HEIGHT, CELL_CONFIG.PADDING, IMAGE_SCALE);
    
    const counterX = X + X_OFFSET, counterY = Y + Y_OFFSET;
    this.ctx.fillStyle = COLORS.TARGET_COUNTER_BG;
    this.ctx.beginPath();
    this.ctx.arc(counterX, counterY, RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();
    
    this.ctx.fillStyle = COLORS.TARGET_COUNTER_TEXT;
    this.ctx.font = FONT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`x${targetItemsCount}`, counterX, counterY);
  }
  
  drawCounters(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const targetX = LAYOUT.COUNTERS_PADDING_LEFT;
    const targetY = LAYOUT.HEADER_HEIGHT + LAYOUT.COUNTERS_PADDING_TOP;
    const stepsX = targetX + UI_ELEMENTS.TARGET_CARD.WIDTH + LAYOUT.COUNTERS_GAP;
    
    drawCard(this.ctx, stepsX, targetY, UI_ELEMENTS.STEPS_CARD.WIDTH, UI_ELEMENTS.STEPS_CARD.HEIGHT, UI_ELEMENTS.STEPS_CARD.RADIUS, COLORS.STEPS_STROKE, COLORS.STEPS_BG);
    drawCard(this.ctx, targetX, targetY, UI_ELEMENTS.TARGET_CARD.WIDTH, UI_ELEMENTS.TARGET_CARD.HEIGHT, UI_ELEMENTS.TARGET_CARD.RADIUS, COLORS.TARGET_STROKE, COLORS.TARGET_BG);
    
    drawImageInCell(this.ctx, this.images[orderProduct], targetX, targetY, CELL_CONFIG.WIDTH, UI_ELEMENTS.TARGET_CARD.HEIGHT, 10);
    
    this.ctx.fillStyle = COLORS.STEPS_TEXT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = UI_ELEMENTS.TARGET_CARD.FONT;
    this.ctx.fillText(`${score}/${targetItemsCount}`, targetX + UI_ELEMENTS.TARGET_CARD.WIDTH / 2 + 22, targetY + UI_ELEMENTS.TARGET_CARD.HEIGHT / 2);
    this.ctx.font = UI_ELEMENTS.STEPS_CARD.FONT;
    this.ctx.fillText(`Шаги ${currentStep}/${stepsCount}`, stepsX + UI_ELEMENTS.STEPS_CARD.WIDTH / 2, targetY + UI_ELEMENTS.STEPS_CARD.HEIGHT / 2);
    this.ctx.restore();
  }

  drawBody(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    const { width, height } = this.dims;
    const scaledHeaderHeight = LAYOUT.HEADER_HEIGHT * this.scale;
    this.ctx.fillStyle = COLORS.BODY_BG;
    this.ctx.fillRect(0, scaledHeaderHeight, width, height - scaledHeaderHeight);
    this.drawCounters(orderProduct, score, targetItemsCount, currentStep, stepsCount);
  }

  drawGridZone(grid, selected) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.fillStyle = COLORS.GRID_ZONE_BG;
    this.ctx.strokeStyle = COLORS.GRID_ZONE_STROKE;
    this.ctx.lineWidth = 1;
    drawRoundedPlus(this.ctx, LAYOUT.GRID_ZONE_PADDING_LEFT, LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_ZONE_PADDING_TOP, LAYOUT.GRID_ZONE_WIDTH, LAYOUT.GRID_ZONE_HEIGHT, LAYOUT.GRID_ZONE_ARM_THICKNESS, LAYOUT.GRID_ZONE_RADIUS);
    this.ctx.fill();
    this.ctx.stroke();
    this.drawGrid(grid, selected);
    this.ctx.restore();
  }

  drawCell(cell, selected) {
    const base = this.getCoords(cell);
    const x0 = cell._animX ?? base.x, y0 = cell._animY ?? base.y;
    let cellW = CELL_CONFIG.WIDTH, cellH = CELL_CONFIG.HEIGHT;
    let posX = x0, posY = y0, alpha = 1, scaleFactor = 1;

    if (selected) {
      scaleFactor = 1.06;
      cellW *= scaleFactor; cellH *= scaleFactor;
      posX -= (cellW - CELL_CONFIG.WIDTH) / 2;
      posY -= (cellH - CELL_CONFIG.HEIGHT) / 2;
    }
    if (cell._removalProgress != null) {
      const p = cell._removalProgress, scale = 1 - p;
      cellW *= scale; cellH *= scale;
      posX = x0 + (CELL_CONFIG.WIDTH - cellW) / 2;
      posY = y0 + (CELL_CONFIG.HEIGHT - cellH) / 2;
      alpha = 1 - p;
    }

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    drawCard(this.ctx, posX, posY, cellW, cellH, CELL_CONFIG.RADIUS, COLORS.CELL_STROKE, COLORS.CELL_BG, 2 * scaleFactor + 1.3 * (scaleFactor !== 1));
    drawImageInCell(this.ctx, this.images[cell.type], posX, posY, cellW, cellH, CELL_CONFIG.PADDING, scaleFactor);
    this.ctx.restore();
  }

  drawGrid(grid, selectedPos) {
    for (const row of grid.cells) {
      for (const cell of row) {
        if (!cell || cell.isDeleted) continue;
        const isSelected = selectedPos && cell.row === selectedPos.row && cell.col === selectedPos.col;
        this.drawCell(cell, isSelected);
      }
    }
  }

  drawScene(grid, state) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, this.dims.width, this.dims.height);
    this.drawHeader(state.orderProduct, state.targetItemsCount);
    this.drawBody(state.orderProduct, state.score, state.targetItemsCount, state.currentStep, state.stepsCount);
    this.drawGridZone(grid, state.selected);
    this.ctx.restore();
  }
  
  drawTutorial(state) {
    const { ctx, scale, offset, dims, images } = this;
    const { tutorialState, tutorialMove, tutorialHand, selectedCell, grid } = state;
    const popupData = TUTORIAL_CONFIG.TEXTS[tutorialState];
    if (!popupData) return;

    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (popupData.isModal || popupData.spotlight) {
      ctx.fillStyle = TUTORIAL_CONFIG.MODAL_BG;
      ctx.fillRect(-offset.x / scale, -offset.y / scale, dims.width / scale, dims.height / scale);
    }
    if (popupData.spotlight && tutorialMove) {
      tutorialMove.spotlightCells.forEach(pos => {
        const cell = grid.cells[pos.row][pos.col];
        if (cell) this.drawCell(cell, selectedCell?.row === pos.row && selectedCell?.col === pos.col);
      });
    }
    
    const layout = popupData.layout;
    if (layout) {
      ctx.fillStyle = TUTORIAL_CONFIG.POPUP.BG;
      roundRect(ctx, layout.popupX, layout.popupY, layout.popupWidth, layout.popupHeight, TUTORIAL_CONFIG.POPUP.RADIUS);
      ctx.fill();

      ctx.fillStyle = TUTORIAL_CONFIG.POPUP.TEXT_COLOR;
      ctx.font = TUTORIAL_CONFIG.POPUP.FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      layout.lines.forEach((line, i) => ctx.fillText(line, layout.textCenterX, layout.textStartY + i * TUTORIAL_CONFIG.POPUP.LINE_HEIGHT));

      if (popupData.hasArrow && images.arrow) ctx.drawImage(images.arrow, layout.arrowX, layout.arrowY);
      
      if (popupData.buttonText) {
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON.BG;
        roundRect(ctx, layout.buttonX, layout.buttonY, TUTORIAL_CONFIG.BUTTON.WIDTH, TUTORIAL_CONFIG.BUTTON.HEIGHT, TUTORIAL_CONFIG.BUTTON.RADIUS);
        ctx.fill();
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON.TEXT_COLOR;
        ctx.font = TUTORIAL_CONFIG.BUTTON.FONT;
        ctx.textBaseline = "middle";
        ctx.fillText(popupData.buttonText, layout.buttonX + TUTORIAL_CONFIG.BUTTON.WIDTH / 2, layout.buttonY + TUTORIAL_CONFIG.BUTTON.HEIGHT / 2 + 2);
      }
    }

    if (popupData.highlightType) {
        const highlightImage = popupData.highlightType === 'header' ? images.highlight : images.highlightCounter;
        if (highlightImage) {
            let targetX = 0, targetY = 0;
            if (popupData.highlightType === 'header') {
                targetX = UI_ELEMENTS.HEADER_TARGET.X + UI_ELEMENTS.HEADER_TARGET.CARD_WIDTH / 2;
                targetY = UI_ELEMENTS.HEADER_TARGET.Y + UI_ELEMENTS.HEADER_TARGET.CARD_HEIGHT / 2;
            } else if (popupData.highlightType === 'targetCounter') {
                targetX = LAYOUT.COUNTERS_PADDING_LEFT + UI_ELEMENTS.TARGET_CARD.WIDTH / 2;
                targetY = LAYOUT.HEADER_HEIGHT + LAYOUT.COUNTERS_PADDING_TOP + UI_ELEMENTS.TARGET_CARD.HEIGHT / 2;
            } else if (popupData.highlightType === 'stepsCounter') {
                targetX = LAYOUT.COUNTERS_PADDING_LEFT + UI_ELEMENTS.TARGET_CARD.WIDTH + LAYOUT.COUNTERS_GAP + UI_ELEMENTS.STEPS_CARD.WIDTH / 2;
                targetY = LAYOUT.HEADER_HEIGHT + LAYOUT.COUNTERS_PADDING_TOP + UI_ELEMENTS.STEPS_CARD.HEIGHT / 2;
            }
            ctx.drawImage(highlightImage, targetX - highlightImage.width / 2, targetY - highlightImage.height / 2);
        }
    }

    if (tutorialHand.visible && images.hand) {
      ctx.save();
      ctx.translate(tutorialHand.x, tutorialHand.y);
      ctx.scale(tutorialHand.scale, tutorialHand.scale);
      ctx.drawImage(images.hand, -15, -10, images.hand.width * 0.9, images.hand.height * 0.9);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
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
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp; tmp.engine = this;
    this.assetKeys = Object.keys(PATHS.CARDS);
    
    const seed = initGameData.seed || Date.now().toString(16);
    this.randomGen = new LCG(seed);
    
    this.dimensions = { width: GAME_CONFIG.MAX_CANVAS_WIDTH, height: GAME_CONFIG.MAX_CANVAS_HEIGHT };
    this.scale = 1; this.offset = { x: 0, y: 0 };

    this.trainingCount = +initGameData.trainingCount || 0;
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount || 10;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount || 10;
    this.score = 0;
    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(GAME_CONFIG.GRID_ROWS, GAME_CONFIG.GRID_COLS, this.assetKeys, () => this.randomGen.random(),
      (row, col, rows, cols) => !((row === 0 || row === rows - 1) && (col === 0 || col === cols - 1))
    );
    this.animMgr = new AnimationManager();
    this.renderer = new Renderer(this.ctx, {
      scale: this.scale, offset: this.offset, dims: this.dimensions, images: this.images
    });

    this.orderProduct = this.assetKeys[Math.floor(this.randomGen.random() * this.assetKeys.length)];
    this.selectedCell = null; this.secondCell = null;
    this.needsRender = true;
    this.gameLoopId = null;

    this.isTutorialActive = this.showTutorial;
    this.tutorialState = this.showTutorial ? TUTORIAL_STATE.INTRO : TUTORIAL_STATE.NONE;
    this.tutorialMove = null;
    this.tutorialHand = { x: 0, y: 0, scale: 1, visible: false };

    this.boundResize = () => { this.resizeCanvas(); this.requestRender(); };
    this.boundHandlePointerDown = e => this.handlePointerDown(e);

    // window.addEventListener("resize", this.boundResize);
    // canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    // this.loadAssets();
  }

  async init() {
    console.log("Engine initialization started...");
    await this.loadAssets();
    this.resizeCanvas(); // Устанавливаем размер холста после загрузки
    this.initTutorialLayouts(); // Рассчитываем макеты, когда все готово
    
    window.addEventListener("resize", this.boundResize);
    this.canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    
    if (this.assetsLoadedCb) this.assetsLoadedCb();
    
    if (this.isTutorialActive) {
      this.findTutorialMove();
      this.runTutorial();
    }
    this.requestRender(); // Первый рендер
    console.log("Engine initialization complete.");
  }
  
  initTutorialLayouts() {
    console.log("Pre-calculating tutorial layouts...");
    const ctx = this.canvas.getContext('2d');
    const { POPUP, BUTTON, ARROW } = TUTORIAL_CONFIG;

    for (const key in TUTORIAL_CONFIG.TEXTS) {
      const popupData = TUTORIAL_CONFIG.TEXTS[key];
      ctx.font = POPUP.FONT;
      const popupWidth = popupData.width;
      const maxWidth = popupWidth - POPUP.PADDING_X * 2;
      const measured = measureAndWrapText(ctx, popupData.text, maxWidth, POPUP.LINE_HEIGHT);
      
      let contentHeight = measured.height;
      if (popupData.buttonText) contentHeight += BUTTON.HEIGHT + BUTTON.MARGIN_BOTTOM;
      if (popupData.hasArrow && this.images.arrow) contentHeight += this.images.arrow.height + ARROW.GAP_Y;
      
      const popupHeight = contentHeight + POPUP.PADDING_Y * 2;
      let popupY = popupData.y === 'center' ? (GAME_CONFIG.MAX_CANVAS_HEIGHT - popupHeight) / 2 : popupData.y;
      const popupX = (GAME_CONFIG.MAX_CANVAS_WIDTH - popupWidth) / 2;
      
      let textStartY = popupY + POPUP.PADDING_Y;
      if (popupData.centerBlock) textStartY = popupY + (popupHeight - contentHeight) / 2;

      popupData.layout = {
        lines: measured.lines, popupWidth, popupHeight, popupX, popupY,
        textCenterX: popupX + popupWidth / 2, textStartY,
        arrowX: popupData.hasArrow ? popupX + (popupWidth - (this.images.arrow?.width || 0)) / 2 : 0,
        arrowY: textStartY + measured.height + ARROW.GAP_Y,
        buttonX: popupData.buttonText ? popupX + (popupWidth - BUTTON.WIDTH) / 2 : 0,
        buttonY: popupY + popupHeight - BUTTON.HEIGHT - BUTTON.MARGIN_BOTTOM,
      };
    }
    console.log("Tutorial layouts calculated.");
  }

  requestRender() {
    this.needsRender = true;
    if (!this.gameLoopId) this.startGameLoop();
  }

  startGameLoop() {
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  stopGameLoop() {
    if(this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.gameLoopId = null;
  }

  gameLoop() {
    this.animMgr.update(performance.now());
    if (this.animMgr.isAnimating() || this.needsRender) {
      this.renderer.drawScene(this.grid, {
        orderProduct: this.orderProduct, score: this.score, targetItemsCount: this.targetItemsCount,
        currentStep: this.currentStep, stepsCount: this.stepsCount, selected: this.selectedCell
      });
      if (this.isTutorialActive) {
        this.renderer.drawTutorial({
          tutorialState: this.tutorialState, tutorialMove: this.tutorialMove,
          tutorialHand: this.tutorialHand, selectedCell: this.selectedCell, grid: this.grid
        });
      }
      this.needsRender = false;
    }
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  resizeCanvas() {
    const p = this.canvas.parentElement;
    if (!p) return;
    const { clientWidth: w, clientHeight: h } = p;
    this.dimensions = { width: w, height: h };
    this.scale = Math.min(w / GAME_CONFIG.MAX_CANVAS_WIDTH, h / GAME_CONFIG.MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (w - GAME_CONFIG.MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (h - GAME_CONFIG.MAX_CANVAS_HEIGHT * this.scale) / 2,
    };
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
    this.renderer.scale = this.scale; this.renderer.offset = this.offset; this.renderer.dims = this.dimensions;
  }

  async loadAssets() {
    console.log("Loading assets...");
    const cardEntries = Object.entries(PATHS.CARDS);
    const otherEntries = [
        ["lamBoy", PATHS.LAMBOY], ["hand", PATHS.HAND], ["arrow", PATHS.ARROW],
        ["highlight", PATHS.HIGHLIGHT], ["highlightCounter", PATHS.HIGHLIGHT_COUNTER]
    ];
    const allEntries = [...cardEntries, ...otherEntries];
    
    const imagePromises = allEntries.map(([key, file]) => 
        loadImage(PATHS.ASSETS + file).then(img => ({ key, img }))
    );
    const imageResults = await Promise.all(imagePromises);
    imageResults.forEach(({ key, img }) => { this.images[key] = img; });
    console.log("All images loaded.");

    await Promise.all([
        document.fonts.load(TUTORIAL_CONFIG.POPUP.FONT),
        document.fonts.load(UI_ELEMENTS.STEPS_CARD.FONT)
    ]);
    console.log("Required fonts loaded.");
    
    // this.onAssetsLoaded();
  }

  onAssetsLoaded() {
    this.resizeCanvas();
    if (this.assetsLoadedCb) this.assetsLoadedCb();
    this.initTutorialLayouts(); 
    if (this.isTutorialActive) {
      this.findTutorialMove();
      this.runTutorial();
    }
    this.requestRender();
  }

  animSwap(a, b) {
    const duration = ANIMATION_CONFIG.SWAP_DURATION;
    const fromCell = this.grid.cells[a.row][a.col];
    const toCell = this.grid.cells[b.row][b.col];

    this.animMgr.add(new MyAnimation(performance.now(), duration, t => {
      const e = ANIMATION_CONFIG.EASING.SWAPPING(t);
      [{ cell: fromCell, from: a, to: b }, { cell: toCell, from: b, to: a }].forEach(({ cell, from, to }) => {
        if (!cell || cell.isDeleted) return;
        const p0 = this.renderer.getCoords(from);
        const p1 = this.renderer.getCoords(to);
        cell._animX = p0.x + (p1.x - p0.x) * e;
        cell._animY = p0.y + (p1.y - p0.y) * e;
      });
    }, async () => {
      this.grid.cells[a.row][a.col] = toCell;
      this.grid.cells[b.row][b.col] = fromCell;
      if(fromCell) { fromCell.row = b.row; fromCell.col = b.col; }
      if(toCell) { toCell.row = a.row; toCell.col = a.col; }
      
      delete fromCell?._animX; delete fromCell?._animY;
      delete toCell?._animX; delete toCell?._animY;
      this.requestRender();

      const hasMatch = this.grid.getMatchedCells().some(row => row.some(x => x));
      if (hasMatch) {
        if(!this.isTutorialActive) {
          this.currentStep++;
          if (this.currentStep >= this.stepsCount) this.handleGameOver();
        }
        await this.handleMatches();
      } else {
        this.animMgr.add(new MyAnimation(performance.now(), duration, t2 => {
          const e2 = ANIMATION_CONFIG.EASING.SWAPPING(t2);
          [{ cell: fromCell, from: b, to: a }, { cell: toCell, from: a, to: b }].forEach(({ cell, from, to }) => {
            if (!cell || cell.isDeleted) return;
            const p0 = this.renderer.getCoords(from);
            const p1 = this.renderer.getCoords(to);
            cell._animX = p0.x + (p1.x - p0.x) * e2;
            cell._animY = p0.y + (p1.y - p0.y) * e2;
          });
        }, () => {
          this.grid.cells[a.row][a.col] = fromCell;
          this.grid.cells[b.row][b.col] = toCell;
          if(fromCell) { fromCell.row = a.row; fromCell.col = a.col; }
          if(toCell) { toCell.row = b.row; toCell.col = b.col; }
          delete fromCell?._animX; delete fromCell?._animY;
          delete toCell?._animX; delete toCell?._animY;
          this.requestRender();
        }));
      }
    }));
    this.requestRender();
  }

  onCellClicked(cellPosition) {
    if (!this.selectedCell){
      this.selectedCell = cellPosition;
    } else if (this.selectedCell.row === cellPosition.row && this.selectedCell.col === cellPosition.col) {
      this.selectedCell = null;
    } else {
      this.secondCell = cellPosition;
    }

    if (this.selectedCell && this.secondCell && this.grid.areAdjacent(this.selectedCell, this.secondCell)) {
      this.animSwap(this.selectedCell, this.secondCell);
      this.selectedCell = null;
      this.secondCell = null;
    }
    this.requestRender();
  }

  handlePointerDown(e) {
    if (this.isTutorialActive) {
      this.handleTutorialClick(e);
      return;
    }
    if (this.animMgr.isAnimating()) return;
    const pos = this.getCellGridPosition(e);
    if (pos) this.onCellClicked(pos);
  }

  async handleMatches() {
    const matched = this.grid.getMatchedCells();
    const positions = [];
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        if (matched[row][col]) positions.push({ row, col });
      }
    }

    if (positions.length === 0) {
      if (!this.grid.checkAvailableMoves()) {
        this.grid.initGridWithTurns();
        await this.handleMatches(); 
      }
      return;
    }

    const correctCount = positions.filter(pos => this.grid.cells[pos.row][pos.col]?.type === this.orderProduct).length;
    this.score += correctCount;
    if (this.score >= this.targetItemsCount) this.handleGameOver();
  
    await this.animRemoveMatches(positions);
    await this.animDrop();
  }

  animRemoveMatches(matchedPositions) {
    return new Promise(resolve => {
      const items = matchedPositions
        .map(({ row, col }) => this.grid.cells[row][col])
        .filter(cell => cell && !cell.isDeleted);
      
      this.animMgr.add(new MyAnimation(performance.now(), ANIMATION_CONFIG.REMOVE_DURATION, t => {
        const p = ANIMATION_CONFIG.EASING.REMOVING(t);
        items.forEach(cell => { cell._removalProgress = p; });
        this.requestRender();
      }, () => {
        items.forEach(cell => { cell.isDeleted = true; delete cell._removalProgress; });
        this.requestRender();
        resolve();
      }));
      this.requestRender();
    });
  }

  animDrop() {
    return new Promise(resolve => {
      const dropItems = [];
      for (let col = 0; col < this.grid.cols; col++) {
        let emptyCount = 0;
        for (let row = this.grid.rows - 1; row >= 0; row--) {
          if (!this.grid.isCellActive(row, col)) { emptyCount = 0; continue; }
          const cell = this.grid.cells[row][col];
          if (!cell || cell.isDeleted) {
            emptyCount++;
          } else if (emptyCount > 0) {
            dropItems.push({ cell, from: { row, col }, to: { row: row + emptyCount, col } });
          }
        }
      }

      const onOldDropped = () => {
        this.grid.dropCells();
        const emptyPos = [];
        for (let r = 0; r < this.grid.rows; r++) for (let c = 0; c < this.grid.cols; c++) {
          if (this.grid.isCellActive(r, c) && (!this.grid.cells[r][c] || this.grid.cells[r][c].isDeleted)) {
            emptyPos.push({row: r, col: c});
          }
        }
        this.grid.fillEmptyCells();
        const newItems = emptyPos.map(pos => {
          const cell = this.grid.cells[pos.row][pos.col];
          const to = this.renderer.getCoords(pos);
          const from = { x: to.x, y: to.y - CELL_CONFIG.NEW_CELL_START_Y };
          cell._animX = from.x; cell._animY = from.y;
          return { cell, from, to };
        });

        if(newItems.length === 0) { this.handleMatches().then(resolve); return; }

        this.animMgr.add(new MyAnimation(performance.now(), ANIMATION_CONFIG.DROP_NEW_DURATION, t2 => {
          const e2 = ANIMATION_CONFIG.EASING.FALLING(t2);
          newItems.forEach(({ cell, from, to }) => {
            if (cell.isDeleted) return;
            cell._animX = from.x + (to.x - from.x) * e2;
            cell._animY = from.y + (to.y - from.y) * e2;
          });
          this.requestRender();
        }, async () => {
          newItems.forEach(({ cell }) => { delete cell._animX; delete cell._animY; });
          this.requestRender();
          await this.handleMatches();
          resolve();
        }));
      };

      if(dropItems.length === 0) { onOldDropped(); return; }

      this.animMgr.add(new MyAnimation(performance.now(), ANIMATION_CONFIG.DROP_OLD_DURATION, t => {
        const e = ANIMATION_CONFIG.EASING.FALLING(t);
        dropItems.forEach(({ cell, from, to }) => {
          if (cell.isDeleted) return;
          const p0 = this.renderer.getCoords(from);
          const p1 = this.renderer.getCoords(to);
          cell._animX = p0.x + (p1.x - p0.x) * e;
          cell._animY = p0.y + (p1.y - p0.y) * e;
        });
        this.requestRender();
      }, onOldDropped));
      this.requestRender();
    });
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const gridStartX = this.offset.x + LAYOUT.GRID_PADDING_LEFT * this.scale;
    const gridStartY = this.offset.y + (LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_PADDING_TOP) * this.scale;
    const cellWidth = (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP) * this.scale;
    const cellHeight = (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP) * this.scale;
    const col = Math.floor((x - gridStartX) / cellWidth);
    const row = Math.floor((y - gridStartY) / cellHeight);
    if (row < 0 || col < 0 || row >= this.grid.rows || col >= this.grid.cols) return null;
    const cell = this.grid.cells[row][col];
    return cell && !cell.isDeleted ? { row, col } : null;
  }

  setFinishCallback(cb) { this.finishCb = cb; }
  setAssetsLoadedCallback(cb) { this.assetsLoadedCb = cb; }

  handleGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    console.log("GameOver!", this.score, this.currentStep);
    if (this.finishCb) {
      const gameData = { score: this.score, currentStep: this.currentStep };
      this.finishCb(gameData);
    }
    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);
  }

  findTutorialMove() {
    const { grid } = this;
    const checkMatch = (row, col, dRow, dCol) => {
        const type = grid.cells[row]?.[col]?.type;
        if (!type) return [];
        const match = [{ row, col }];
        for (let i = 1; i < 3; i++) {
            const nRow = row + dRow * i, nCol = col + dCol * i;
            if (grid.cells[nRow]?.[nCol]?.type === type) {
                match.push({ row: nRow, col: nCol });
            } else break;
        }
        return match.length >= 3 ? match : [];
    };

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            if (!grid.isCellActive(row, col)) continue;
            if (col < grid.cols - 1 && grid.isCellActive(row, col + 1)) {
                [grid.cells[row][col], grid.cells[row][col + 1]] = [grid.cells[row][col + 1], grid.cells[row][col]];
                for (const { row: currentRow, col: currentCol } of [{ row, col }, { row, col: col + 1 }]) {
                    const hMatch = [...checkMatch(currentRow, currentCol, 0, -1), ...checkMatch(currentRow, currentCol, 0, 1)].slice(1);
                    const vMatch = [...checkMatch(currentRow, currentCol, -1, 0), ...checkMatch(currentRow, currentCol, 1, 0)].slice(1);
                    if (hMatch.length >= 2 || vMatch.length >= 2) {
                        const allMatches = [...hMatch, ...vMatch, {row: currentRow, col: currentCol}];
                        const uniqueMatches = [...new Map(allMatches.map(item => [`${item.row},${item.col}`, item])).values()];
                        this.tutorialMove = { from: { row, col: col + 1 }, to: { row, col }, spotlightCells: [{ row, col }, { row, col: col + 1 }, ...uniqueMatches] };
                        [grid.cells[row][col], grid.cells[row][col + 1]] = [grid.cells[row][col + 1], grid.cells[row][col]];
                        return;
                    }
                }
                [grid.cells[row][col], grid.cells[row][col + 1]] = [grid.cells[row][col + 1], grid.cells[row][col]];
            }
        }
    }
  }

  runTutorial() {
    this.canDrag = false;
    this.tutorialState = TUTORIAL_STATE.INTRO;
    this.requestRender();
  }

  handleTutorialClick(e) {
    const popupData = TUTORIAL_CONFIG.TEXTS[this.tutorialState];
    if (!popupData?.buttonText) return;

    const layout = popupData.layout;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left, clickY = e.clientY - rect.top;
    
    const buttonX_scaled = layout.buttonX * this.scale + this.offset.x;
    const buttonY_scaled = layout.buttonY * this.scale + this.offset.y;
    const buttonW_scaled = TUTORIAL_CONFIG.BUTTON.WIDTH * this.scale;
    const buttonH_scaled = TUTORIAL_CONFIG.BUTTON.HEIGHT * this.scale;

    if (clickX > buttonX_scaled && clickX < buttonX_scaled + buttonW_scaled && clickY > buttonY_scaled && clickY < buttonY_scaled + buttonH_scaled) {
      this.advanceTutorial();
    }
  }

  async advanceTutorial() {
    switch (this.tutorialState) {
      case TUTORIAL_STATE.INTRO:
        this.tutorialState = TUTORIAL_STATE.STEP_2_HEADER_TARGET;
        this.requestRender();
        await new Promise(r => setTimeout(r, 2000));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.STEP_2_HEADER_TARGET:
        this.tutorialState = TUTORIAL_STATE.STEP_3_SHOW_SWAP;
        const toCoords = this.renderer.getCoords(this.tutorialMove.to);
        this.tutorialHand.x = toCoords.x + CELL_WIDTH / 2;
        this.tutorialHand.y = toCoords.y - CELL_HEIGHT;
        this.tutorialHand.visible = true;
        this.requestRender();
        await new Promise(r => setTimeout(r, 1000));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.STEP_3_SHOW_SWAP:
        this.tutorialState = TUTORIAL_STATE.STEP_4_PERFORM_SWAP;
        this.requestRender();
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.STEP_4_PERFORM_SWAP:
        await this.animateHandAndSwap();
        this.tutorialState = TUTORIAL_STATE.STEP_5_MATCH_EFFECT;
        this.requestRender();
        await new Promise(r => setTimeout(r, 800));
        this.tutorialState = TUTORIAL_STATE.STEP_6_NEW_ELEMENTS;
        this.requestRender();
        await new Promise(r => setTimeout(r, 800));
        this.tutorialHand.visible = false;
        this.tutorialState = TUTORIAL_STATE.STEP_7_TARGET_COUNTER;
        this.requestRender();
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.STEP_7_TARGET_COUNTER:
        await new Promise(r => setTimeout(r, 2000));
        this.tutorialState = TUTORIAL_STATE.STEP_8_STEPS_COUNTER;
        this.requestRender();
        break;
      case TUTORIAL_STATE.STEP_8_STEPS_COUNTER:
        this.isTutorialActive = false;
        this.tutorialState = TUTORIAL_STATE.COMPLETE;
        this.canDrag = true;
        this.requestRender();
        break;
    }
  }

  async animateHandAndSwap() {
    const { from, to } = this.tutorialMove;
    const fromCoords = this.renderer.getCoords(from);
    const toCoords = this.renderer.getCoords(to);
    const handStartX = this.tutorialHand.x;
    const handStartY = this.tutorialHand.y;

    await this._animate(500, t => {
      const targetY = toCoords.y + CELL_HEIGHT / 2 + 10;
      this.tutorialHand.y = handStartY + (targetY - handStartY) * t;
    });

    this.selectedCell = to;
    this.requestRender();
    await this._animate(200, t => { this.tutorialHand.scale = 1 - 0.1 * t; });
    await this._animate(200, t => { this.tutorialHand.scale = 0.9 + 0.1 * t; });
    
    await this._animate(500, t => {
      const currentHandY = toCoords.y + CELL_HEIGHT / 2 + 10;
      const targetX = fromCoords.x + CELL_WIDTH / 2;
      const targetY = fromCoords.y + CELL_HEIGHT / 2 + 10;
      this.tutorialHand.x = handStartX + (targetX - handStartX) * t;
      this.tutorialHand.y = currentHandY + (targetY - currentHandY) * t;
    });
    
    this.selectedCell = from;
    this.requestRender();
    await this._animate(200, t => { this.tutorialHand.scale = 1 - 0.1 * t; });
    await this._animate(200, t => { this.tutorialHand.scale = 0.9 + 0.1 * t; });

    this.selectedCell = null;
    this.animSwap(from, to);
  }

  _animate(duration, updateCallback) {
    return new Promise(resolve => {
      this.animMgr.add(new MyAnimation(performance.now(), duration, updateCallback, resolve));
      this.requestRender();
    });
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
  engine.init();
  return tmp;
}

function deinit(canvas, tmp) {
  if (tmp?.engine) {
    const engine = tmp.engine;
    window.removeEventListener("resize", engine.boundResize);
    engine.canvas.removeEventListener("pointerdown", engine.boundHandlePointerDown);
    engine.stopGameLoop();
    console.log("Engine de-initialized.");
  }
}

export { init, deinit };
