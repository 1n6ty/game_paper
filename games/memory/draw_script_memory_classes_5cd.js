const __VERSION__ = "5Cd";

// const PATH = "./assets/memory/";
const PATH = "/media/assets/memory/";

const cardPaths = {
  bottle: `${PATH}cards/bottle.svg`,
  can: `${PATH}cards/can.svg`,
  cat: `${PATH}cards/cat.svg`,
  cow: `${PATH}cards/cow.svg`,
  flowerPink: `${PATH}cards/flowerPink.svg`,
  flowerPurple: `${PATH}cards/flowerPurple.svg`,
  flowerWhite: `${PATH}cards/flowerWhite.svg`,
  cookie: `${PATH}cards/cookie.svg`,
  leaf: `${PATH}cards/leaf.svg`,
  milkGlass: `${PATH}cards/milkGlass.svg`,
  yogurtChocolate: `${PATH}cards/yogurtChocolate.svg`,
  yogurtPink: `${PATH}cards/yogurtPink.svg`
};

const heartShapedField = (r, c, rows, cols) => {
  const xn = (c / (cols - 1)) * 3 - 1.5;
  const yn = (r / (rows - 1)) * 3 - 1.5;
  const boundaryY = -Math.abs(xn) + 2;

  let forbiddenFirstRow;
  if (cols % 2 === 0) {
    forbiddenFirstRow = [0, Math.floor(cols / 2) - 1, Math.floor(cols / 2), cols - 1];
  } else {
    forbiddenFirstRow = [0, Math.floor(cols / 2), cols - 1];
  }
  
  if (r === 0 && forbiddenFirstRow.includes(c)) {
    return false;
  }

  return yn <= boundaryY;
};

const plusField = (r, c, rows, cols) => {
  const border =
      (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
  return !border;
};

const withoutCenterField = (r, c, rows, cols) => ((r != (rows - 1) / 2) || (c != (cols - 1) / 2));

const chaotic1Field = (r, c, rows, cols) => {
  const borderRow0 = (r === 0 && (c != 2));
  const borderCol0 = (c === 0 && (r != 3));
  const borderCol2 = (c === 2 && (r >= 3 && r <= 4));
  const borderCol3 = (c === 3 && (r >= 2 && r <= 3));
  const borderCol4 = (c === 4 && r === 4);

  return borderRow0 || borderCol0 || borderCol2 || borderCol3 || borderCol4;
};

const fields = [
  // rect
  {
    grid: (r, c, rows, cols) => withoutCenterField(r, c, rows, cols),
    ground: (r, c, rows, cols) => true 
  }, 
  // heart
  {
    grid: (r, c, rows, cols) => heartShapedField(r, c, rows, cols),
    ground: (r, c, rows, cols) => heartShapedField(r, c, rows, cols) 
  },
  // plus
  {
    grid: (r, c, rows, cols) => plusField(r, c, rows, cols) && withoutCenterField(r, c, rows, cols),
    ground: (r, c, rows, cols) => plusField(r, c, rows, cols) 
  },
  // // chaotic 1
  // {
  //   grid: (r, c, rows, cols) => chaotic1Field(r, c, rows, cols),
  //   ground: (r, c, rows, cols) => chaotic1Field(r, c, rows, cols)
  // }
];

const bushesUrl = `${PATH}bushes.svg`;
const groundUrl = `${PATH}ground.svg`;
const handUrl = `${PATH}hand.svg`;

const START_DELAY = 5000;  // милисекунды

const BACK_COOLDOWN = 700;  // милисекунды

// милисекунды
const animDurations = {
  open: 300,
  close: 300,
  mismatch: 400,
  match: 400
};

const animMatchFeedbackConsts = {
  shrink: 0.9
};

const animMismatchFeedbackConsts = {
  shrink: 0.95, 
  shakeDur: 300,  // милисекунды
  shakeCount: 2, 
  amplitute: 3
};

const GRID_ROWS = 5;
const GRID_COLS = 5;

const MAX_CANVAS_WIDTH = 428;
const MAX_CANVAS_HEIGHT = 809;

const BODY_BG_TOP_COLOR = "#80D18F";
const BODY_BG_MIDDLE_COLOR = "#9AD9A6";
const BODY_BG_BOTTOM_COLOR = "#4EB96B";

const STEPS_PADDING_LEFT = 90;
const STEPS_PADDING_TOP = 99;

const STEPS_BG_COLOR = "#CDF7D6";
const STEPS_STROKE_COLOR = "#389150";
const STEPS_TEXT_COLOR = "#389150";
const STEPS_CARD_WIDTH = 250;
const STEPS_CARD_HEIGHT = 61;

const GRID_ZONE_BG_COLOR = "#996A4D";
const GRID_ZONE_PADDING_LEFT = 19;
const GRID_ZONE_PADDING_TOP = 210;
const GRID_ZONE_WIDTH = 390;
const GRID_ZONE_HEIGHT = 390;
const GRID_ZONE_RADIUS = 16;

const GRID_PADDING_LEFT = 26;
const GRID_PADDING_TOP = 217;

const CELL_WIDTH = 72;
const CELL_HEIGHT = 72;
const CELL_GAP = 4;
const CELL_PADDING = 0;
const CELL_CARD_RADIUS = 10;

const BUSHES_WIDTH = 428;
const BUSHES_HEIGHT = 91;
const BOTTOM_GROUND_BG_COLOR = "#996A4D";
const BOTTOM_GROUND_HEIGHT = 67;

const TUTORIAL_STATE = {
    NONE: 'none',
    INTRO: 'intro', // 1. "Сейчас кратко объясним..."
    MEMORIZE: 'memorize', // 2. "Смотри внимательно!..."
    FIND_PAIRS_1: 'find_pairs_1', // 3. Рука движется к 1-й карте
    FIRST_CARD_OPENED: 'first_card_opened', // 4. 1-я карта открыта
    FIND_PAIRS_2: 'find_pairs_2', // 5. Рука движется ко 2-й карте
    SECOND_CARD_OPENED: 'second_card_opened', // 6. 2-я карта открыта, мэтч
    FINAL: 'final', // 7. "Открывай по две карточки..."
    COMPLETE: 'complete'
};

const TUTORIAL_TEXTS = {
  [TUTORIAL_STATE.INTRO]: {
    text: "Сейчас кратко объясним, как играть. Готов?", buttonText: "Поехали",
    width: 284, y: 'center', isModal: true,
    paddingX: 20, paddingY: 40, // Кастомные отступы
  },
  [TUTORIAL_STATE.MEMORIZE]: {
    text: "Смотри внимательно! У тебя будет 5 секунд, чтобы запомнить расположение картинок", buttonText: null,
    width: 327, y: 46, isModal: false,
    paddingX: 16, paddingY: 26.5,
    centerTextBlock: true
  },
  [TUTORIAL_STATE.FIND_PAIRS_1]: {
    text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.", buttonText: null,
    width: 263, y: 59, isModal: false,
    centerTextBlock: true
  },
  [TUTORIAL_STATE.FIRST_CARD_OPENED]: {
    text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.", buttonText: null,
    width: 263, y: 59, isModal: false,
    centerTextBlock: true
  },
  [TUTORIAL_STATE.FIND_PAIRS_2]: {
    text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.", buttonText: null,
    width: 263, y: 59, isModal: false,
    centerTextBlock: true
  },
  [TUTORIAL_STATE.SECOND_CARD_OPENED]: {
    text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.", buttonText: null,
    width: 263, y: 59, isModal: false,
    centerTextBlock: true
  },
  [TUTORIAL_STATE.FINAL]: {
    text: "Открывай по две карточки. Ищи совпадения. Помни, количество шагов ограничено!", buttonText: "Давай играть",
    width: 309, y: 'center', isModal: true,
    paddingX: 20, paddingY: 28,
  }
};

const TUTORIAL_POPUP_WIDTH = 284;
const TUTORIAL_BUTTON_WIDTH = 165, TUTORIAL_BUTTON_HEIGHT = 35;
const TUTORIAL_MODAL_BG = "rgba(97, 67, 49, 0.48)";
const TUTORIAL_POPUP_BG = "#FFFFFF";
const TUTORIAL_BUTTON_BG = "#A7E8B3";
const TUTORIAL_BUTTON_TEXT_COLOR = "#2F7A2E";
const TUTORIAL_TEXT_COLOR = "#996A4D";
const TUTORIAL_POPUP_PADDING_X = 12, TUTORIAL_POPUP_PADDING_Y = 26.5;

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

const openCellEaseInOut = t => t;

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
};

const drawGroundCell = (ctx, x, y, size, gap, radius, 
  hasUp, hasRight, hasDown, hasLeft,
  hasUpLeft, hasUpRight, hasDownRight, hasDownLeft) => {

  size += gap * 3.5;

  const inner = size - gap * 2.5;

  const rtl = !(hasUp && hasLeft || hasLeft || hasUp);
  const rtr = !(hasUp && hasRight || hasRight || hasUp);
  const rbr = !(hasDown && hasRight || hasRight || hasDown);
  const rbl = !(hasDown && hasLeft || hasLeft || hasDown);

  // 1) старт
  if (rtl) {
    ctx.moveTo(x + radius, y);
  } else {
    ctx.moveTo(x, y);
  }

  // 2) верхняя грань
  if (rtr) {
    ctx.lineTo(x + size - radius, y);
    ctx.arcTo(x + size, y, x + size, y + radius, radius);
  }
 
  if (hasUpRight && !hasUp) {
    ctx.lineTo(x + inner - radius, y);
    ctx.arcTo(x + inner, y, x + inner, y - radius, radius);
  } else {
    ctx.lineTo(x + size, y);
  }

  // 3) правая грань
  if (rbr) {
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
  } else {
    ctx.lineTo(x + size, y + size);
  }  
  
  if (hasDownRight && !hasRight) {
    // ctx.lineTo(x + size, y + size - radius);
    // ctx.arcTo(x + size, y + size, x + size + radius, y + size, radius);
    
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + inner, x + size + radius, y + inner, radius);
  } else {
    ctx.lineTo(x + size, y + size);
  }  

  // 4) нижняя
  if (rbl) {
    ctx.lineTo(x + radius, y + size);
    ctx.arcTo(x, y + size, x, y + size - radius, radius);
  }

  if (hasDownLeft && !hasDown) {
    // ctx.lineTo(x + radius, y + size);
    // ctx.arcTo(x, y + size, x, y + size + radius, radius);

    ctx.lineTo(x + size - inner + radius, y + size);
    ctx.arcTo(x + size - inner, y + size, x + size - inner, y + size + radius, radius);
  } else {
    ctx.lineTo(x, y + size);
  }

  // 5) левая
  if (rtl) {
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
  }
 
  if (hasUpLeft && !hasLeft) {
    ctx.lineTo(x, y + size - inner + radius);
    ctx.arcTo(x, y + size - inner, x - radius, y + size - inner, radius);
  } else {
    ctx.lineTo(x, y);
  }
};

const drawGroundGrid = (
  ctx,
  x0, y0,
  groundGrid,
  cellSize,
  gap,
  radius,
  fillColor
) => {
  if (!groundGrid || !groundGrid.length || !groundGrid[0].length) {
    console.error("drawGroundGrid: сетка не задана!");
    return;
  }

  const rows = groundGrid.length;
  const cols = groundGrid[0].length;
  const step = cellSize + gap;

  ctx.save();
  ctx.lineJoin  = "round";
  ctx.fillStyle = fillColor;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!groundGrid[r][c]) continue;
      ctx.beginPath();

      // Координаты ячейки с учётом gap между ними
      const x = x0 + c * step;
      const y = y0 + r * step;

      const up        = groundGrid[r - 1]?.[c]     ?? false;
      const right     = groundGrid[r]?.[c + 1]     ?? false;
      const down      = groundGrid[r + 1]?.[c]     ?? false;
      const left      = groundGrid[r]?.[c - 1]     ?? false;
      const upLeft    = groundGrid[r - 1]?.[c - 1] ?? false;
      const upRight   = groundGrid[r - 1]?.[c + 1] ?? false;
      const downRight = groundGrid[r + 1]?.[c + 1] ?? false;
      const downLeft  = groundGrid[r + 1]?.[c - 1] ?? false;

      drawGroundCell(
        ctx,
        x, y,
        cellSize, gap, radius,
        up, right, down, left,
        upLeft, upRight, downRight, downLeft
      );

      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
};
  
const drawCard = (ctx, x, y, width, height, radius, strokeColor, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  roundRect(ctx, x, y, width, height, radius);
  ctx.stroke();
  ctx.fill();
};
  
const drawImageInCell = (ctx, image, drawX, drawY, cellW, cellH, cellPadding) => {
  const availableWidth = cellW - 2 * cellPadding;
  const availableHeight = cellH - 2 * cellPadding;
  const scale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight,
    1
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

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
    } else {
        currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
};

// --- Cell: чистая модель ---
class Cell {
  constructor(type, row, col) {
    this.type = type;
    this.row = row;
    this.col = col;
    this.isDeleted = false;
    this.isOpened = false;
  }
}

// --- Grid: логика сетки ---
class Grid {
  #random = () => {};
  #isGroundCellActive = () => {};

  constructor(rows, cols, assetKeys, randomFn, fieldActivityRules) {
    this.rows = rows;
    this.cols = cols;
    this.assetKeys = assetKeys;
    this.#random = randomFn;
    this.cells = [];
    this.groundGrid = [];
    this.isCellActive = (row, col) => !!fieldActivityRules.grid(row, col, rows, cols);
    this.#isGroundCellActive = (row, col) => !!fieldActivityRules.ground(row, col, rows, cols);
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
    this.cells = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));

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
    const shuffle = arr => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(this.#random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
    };

    const pick = arr => shuffle(arr.slice());
    const selected = pick(active).slice(0, cellsForPairs);
    const keys = pick(this.assetKeys).slice(0, numPairs);
    const values = shuffle(keys.flatMap(k => [k, k]));

    selected.forEach((pos, i) => {
      this.cells[pos.r][pos.c] = new Cell(values[i], pos.r, pos.c);
    });
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
    const y0 = GRID_PADDING_TOP;
    return {
      x: x0 + pos.col * (CELL_WIDTH + CELL_GAP),
      y: y0 + pos.row * (CELL_HEIGHT + CELL_GAP),
    };
  }

  drawStepsCard(currentStep, stepsCount) {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const stepsCardX = STEPS_PADDING_LEFT;
    const stepsCardY = STEPS_PADDING_TOP;

    this.ctx.beginPath();
    drawCard(this.ctx, stepsCardX, stepsCardY,
      STEPS_CARD_WIDTH, STEPS_CARD_HEIGHT, 12,
      STEPS_STROKE_COLOR, STEPS_BG_COLOR
    );
    this.ctx.closePath();

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 24px/0.15px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(`Шаги ${currentStep}/${stepsCount}`,
      stepsCardX + STEPS_CARD_WIDTH / 2, stepsCardY + STEPS_CARD_HEIGHT / 2, STEPS_CARD_WIDTH - 13);

    this.ctx.restore();
  }

  drawBushes() {
    if (!this.images.bushes) return;

    const { width, height } = this.dims;

    const bushDrawWidth = BUSHES_WIDTH * this.scale;
    const bushDrawHeight = BUSHES_HEIGHT * this.scale;

    // Расположение кустов по вертикали
    const bushY = height - (BOTTOM_GROUND_HEIGHT * this.scale) - bushDrawHeight;

    const totalBushes = Math.ceil(width / bushDrawWidth);

    const midIndex = Math.floor(totalBushes / 2);
    const centerX = width / 2 - bushDrawWidth / 2;

    const startX = centerX - midIndex * bushDrawWidth;

    // Рисуем кусты по горизонтали
    for (let i = 0; i <= totalBushes; i++) {
      let x = startX + i * bushDrawWidth;

      // Положительное значение смещает куст вправо, отрицательное - влево
      const sideShift = ((i - midIndex) * (-0.01)) * bushDrawWidth;

      this.ctx.drawImage(this.images.bushes, x + sideShift, bushY, bushDrawWidth, bushDrawHeight);
    }
  }

  drawBg() {
    const { width, height } = this.dims;

    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0.09, BODY_BG_TOP_COLOR);
    gradient.addColorStop(0.54, BODY_BG_MIDDLE_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.fillStyle = BOTTOM_GROUND_BG_COLOR;
    this.ctx.fillRect(0, height - BOTTOM_GROUND_HEIGHT, width, BOTTOM_GROUND_HEIGHT);
    this.ctx.restore();
  }

  drawCell(cell) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    // this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const { x, y } = this.getCoords(cell);

    // this.ctx.save();
  
    const shake = cell._shake || 0;
    const fbScale = cell._scale || 1;
    this.ctx.translate(x + shake, y);

    this.ctx.translate(CELL_WIDTH / 2, CELL_HEIGHT / 2);
    this.ctx.scale(fbScale, fbScale);
    this.ctx.translate(-CELL_WIDTH / 2, -CELL_HEIGHT / 2);
  
    const flip = cell._flipProgress;
    if (flip != null) {
      const scaleX = flip <= 0.5
        ? (1 - flip * 2)
        : ((flip - 0.5) * 2);
      this.ctx.translate(CELL_WIDTH / 2, CELL_HEIGHT / 2);
      this.ctx.scale(scaleX, 1);
      this.ctx.translate(-CELL_WIDTH / 2, -CELL_HEIGHT / 2);
    }
  
    if (cell._removalProgress != null) {
      this.ctx.globalAlpha = 1 - cell._removalProgress;
    }
  
    const showFace = flip != null ? (flip > 0.5) : cell.isOpened;

    // очистка клетки
    this.ctx.save();
    this.ctx.beginPath();
    roundRect(this.ctx, 0, 0, CELL_WIDTH, CELL_HEIGHT, CELL_CARD_RADIUS);
    this.ctx.closePath();

    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.restore();

    // отображение новой клетки
    if (showFace) {
      this.ctx.beginPath();
      drawCard(this.ctx, 0, 0, CELL_WIDTH, CELL_HEIGHT,
        CELL_CARD_RADIUS, STEPS_BG_COLOR, STEPS_BG_COLOR
      );
      this.ctx.closePath();

      const img = this.images[cell.type];
      if (img) {
        drawImageInCell(this.ctx, img, 0, 0, CELL_WIDTH, CELL_HEIGHT, CELL_PADDING);
      }
    } else {
      if (this.images.ground) {
        this.ctx.drawImage(this.images.ground, 0, 0, CELL_WIDTH, CELL_HEIGHT);
      }
    }

    this.ctx.restore();
    // this.ctx.restore();
    // this.ctx.restore();
  }

  drawCells(cells) {
    for (const row of cells) {
      for (const cell of row) {
        if (!cell) continue;
        this.drawCell(cell);
      }
    }
  }  

  drawGridZone(groundGrid) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    // drawCard(this.ctx, 
    //   GRID_ZONE_PADDING_LEFT,
    //   GRID_ZONE_PADDING_TOP,
    //   GRID_ZONE_WIDTH,
    //   GRID_ZONE_HEIGHT,
    //   GRID_ZONE_RADIUS,
    //   GRID_ZONE_BG_COLOR,
    //   GRID_ZONE_BG_COLOR
    // );

    drawGroundGrid(this.ctx, 
      GRID_ZONE_PADDING_LEFT,
      GRID_ZONE_PADDING_TOP,
      groundGrid,
      CELL_WIDTH, 
      CELL_GAP,
      GRID_ZONE_RADIUS,
      GRID_ZONE_BG_COLOR,
    );

    this.ctx.restore();
  }

  drawTutorial(state) {
    const { ctx, scale, offset, dims, images } = this;
    const { tutorialState, tutorialHand } = state;
    const popupData = TUTORIAL_TEXTS[tutorialState];

    if (!popupData && !tutorialHand.visible) return;

    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (popupData) {
      // 1. Получаем отступы для текущей карточки (с фолбэком на значения по умолчанию)
      const paddingX = popupData.paddingX ?? TUTORIAL_POPUP_PADDING_X;
      const paddingY = popupData.paddingY ?? TUTORIAL_POPUP_PADDING_Y;
      const centerTextBlock = popupData.centerTextBlock ?? false; // 1. Получаем новую опцию
      
      const popupWidth = popupData.width;
      const popupX = (MAX_CANVAS_WIDTH - popupWidth) / 2;
      const maxWidth = popupWidth - 2 * paddingX; // Используем новый отступ

      ctx.font = "600 16px/0.15px Roboto";
      
      const initialLines = popupData.text.split('\n');
      const wrappedLines = [];
      initialLines.forEach(line => {
        wrappedLines.push(...wrapText(ctx, line, maxWidth));
      });

      const lineHeight = 24;
      ctx.lineHeight = lineHeight;
      const textBlockHeight = (wrappedLines.length > 0 ? wrappedLines.length - 1 : 0) * lineHeight + (wrappedLines.length > 0 ? 20 : 0);
      const buttonHeight = popupData.buttonText ? TUTORIAL_BUTTON_HEIGHT : 0;
      const spaceBelowText = popupData.buttonText ? 20 : 0;
      // Используем новый отступ для расчета высоты
      const dynamicHeight = paddingY * 2 + textBlockHeight + spaceBelowText + buttonHeight;

      let popupY;
      if (popupData.y === 'center') {
        popupY = (MAX_CANVAS_HEIGHT - dynamicHeight) / 2;
      } else {
        popupY = popupData.y;
      }
      
      if (popupData.isModal) {
        ctx.fillStyle = TUTORIAL_MODAL_BG;
        ctx.fillRect(-offset.x / scale, -offset.y / scale, dims.width / scale, dims.height / scale);
      }
      
      ctx.fillStyle = TUTORIAL_POPUP_BG;
      ctx.beginPath();
      roundRect(ctx, popupX, popupY, popupWidth, dynamicHeight, 20);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = TUTORIAL_TEXT_COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      let availableHeightForText;
      if (centerTextBlock) {
        // Центрируем по всей высоте карточки
        availableHeightForText = dynamicHeight - paddingY * 2 + 20;
      } else {
        // Центрируем в пространстве над кнопкой (старое поведение)
        availableHeightForText = dynamicHeight - paddingY * 2 - (buttonHeight + spaceBelowText) + 30;
      }
      
      const textBlockCenterY = popupY + paddingY + availableHeightForText / 2;
      const firstLineY = textBlockCenterY - textBlockHeight / 2;

      wrappedLines.forEach((line, i) => {
        ctx.fillText(line, popupX + popupWidth / 2, firstLineY + i * lineHeight);
      });

      if (popupData.buttonText) {
        const buttonX = popupX + (popupWidth - TUTORIAL_BUTTON_WIDTH) / 2;
        const buttonY = popupY + dynamicHeight - TUTORIAL_BUTTON_HEIGHT - 20;
        ctx.fillStyle = TUTORIAL_BUTTON_BG;
        ctx.beginPath();
        roundRect(ctx, buttonX, buttonY, TUTORIAL_BUTTON_WIDTH, TUTORIAL_BUTTON_HEIGHT, 12);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = TUTORIAL_BUTTON_TEXT_COLOR;
        ctx.font = "500 20px Roboto";
        ctx.textBaseline = "middle";
        ctx.fillText(popupData.buttonText, 
          buttonX + TUTORIAL_BUTTON_WIDTH / 2, 
          buttonY + TUTORIAL_BUTTON_HEIGHT / 2 + 2);
      }
    }

    if (tutorialHand.visible && images.hand) {
      ctx.save();
      const handImg = images.hand;
      ctx.translate(tutorialHand.x, tutorialHand.y);
      ctx.scale(tutorialHand.scale, tutorialHand.scale);
      ctx.drawImage(handImg, -15, -10, handImg.width * 0.9, handImg.height * 0.9);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  drawScene(groundGrid, state) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dims;
    this.ctx.clearRect(0, 0, width, height);
    
    this.drawBg();
    this.drawStepsCard(state.currentStep, state.stepsCount);
    this.drawBushes();

    this.drawGridZone(groundGrid);

    this.ctx.restore();
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

    this.dimensions = { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    };

    const seed = initGameData.seed;
    this.randomGen = new LCG(seed);

    this.trainingCount = +initGameData.trainingCount;
    console.log("trainingCount:", this.trainingCount);
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount;
    this.score = 0;

    const fieldNumber = +initGameData.field || Math.floor(this.randomGen.random() * fields.length);

    console.log("fieldNumber:", fieldNumber);
    console.log("targetItemsCount:", this.targetItemsCount);

    this.canDrag = false;
    this.finishCb = null;

    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GRID_ROWS,
      GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
      fields[fieldNumber]
    );
    this.animMgr = new AnimationManager();
    this.renderer = new Renderer(this.ctx, {
      scale: this.scale,
      offset: this.offset,
      dims: this.dimensions,
      images: this.images
    });

    this.selectedCell = null;
    this.secondCell = null;
    this.needsRender = true;
    this.lastTime = performance.now();

    this.isTutorialActive = this.showTutorial;
    this.tutorialState = this.showTutorial ? TUTORIAL_STATE.INTRO : TUTORIAL_STATE.NONE;
    this.tutorialPairPositions = null;
    this.tutorialHand = { x: 0, y: 0, scale: 1, visible: false };
    this.findTutorialPair();

    this.gameLoopId = null;

    this.boundResize = () => {
      this.resizeCanvas();
      this.requestRender();
    };

    this.boundHandlePointerDown = e => {
      this.handlePointerDown(e);
    };

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

  gameLoop() {
    this.animMgr.update(performance.now());
    if (this.animMgr.isAnimating() || this.needsRender) {
      this.renderer.drawScene(this.grid.groundGrid, {
        currentStep: this.currentStep,
        stepsCount: this.stepsCount
      });
      this.renderer.drawCells(this.grid.cells);
      
      // UI обучения рисуется последним, поверх всего
      if (this.isTutorialActive) {
        this.renderer.drawTutorial({
            tutorialState: this.tutorialState,
            tutorialHand: this.tutorialHand
        });
      }

      this.needsRender = false;
    }
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
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

  start() {
    if (this.showTutorial) {
      this.canDrag = false;
      this.requestRender();
    } else {
      // Старая логика startFlipOver
      this.grid.cells.flat().forEach(cell => { 
        if (cell) cell.isOpened = true; 
      });
      this.requestRender();
      setTimeout(() => {
        const closePromises = this.grid.cells.flat()
          .filter(c => c)
          .map(c => this.animClose(c, animDurations.close));
        Promise.all(closePromises).then(() => {
          this.canDrag = true;
        });
      }, START_DELAY);
    }
  }

  onAssetsLoaded() {
    if (this.assetsLoadedCb)
      this.assetsLoadedCb();

    this.start();
  }

  async loadAssets() {
    console.log("Loading assets...");

    const imageLoadPromise = new Promise(async (resolve) => {
      const entries = [...Object.entries(cardPaths), ["bushes", bushesUrl], ["ground", groundUrl], ["hand", handUrl]];
      const imgs = await Promise.all(entries.map(([, p]) => loadImage(p)));
      entries.forEach(([k], i) => (this.images[k] = imgs[i]));
      console.log("Images loaded.");
      resolve();
    });

    // Явно указываем, какие именно шрифты и начертания нам нужны для canvas.
    // Это более надежный способ, чем document.fonts.ready.
    const fontLoadPromises = Promise.all([
        document.fonts.load('500 20px Roboto'),          // Шрифт для попапов обучения
        document.fonts.load('500 24px "Roboto Mono"') // Шрифт для счетчика шагов
    ]).then(() => {
        console.log("Required fonts loaded.");
    }).catch(err => {
        // На случай, если шрифты не загрузятся, игра все равно начнется, но с системными шрифтами.
        console.warn("Font loading failed, but continuing anyway:", err);
    });

    // Ждем выполнения обоих промисов: и для картинок, и для конкретных шрифтов.
    await Promise.all([imageLoadPromise, fontLoadPromises]);
    
    console.log("All assets ready!");
    this.onAssetsLoaded();
  }

  animOpen(pos, duration) {
    this.canDrag = false;
    return new Promise(resolve => {
      const cell = this.grid.cells[pos.row][pos.col];
      this.animMgr.add(new MyAnimation(
        performance.now(), 
        duration,
        t => {
          const p = openCellEaseInOut(t);
          cell._flipProgress = p; 
          this.requestRender(); 
        },
        () => {
          delete cell._flipProgress; 
          cell.isOpened = true; 
          this.requestRender(); 
          resolve(); 
        }
      ));

      this.requestRender();
    });
  }

  animClose(pos, duration) {
    this.canDrag = false;
    return new Promise(resolve => {
      const cell = this.grid.cells[pos.row][pos.col];
      this.animMgr.add(new MyAnimation(
        performance.now(),
        duration,
        t => {
          const p = openCellEaseInOut(1 - t);
          cell._flipProgress = p;
          this.requestRender();
        },
        () => {
          delete cell._flipProgress;
          cell.isOpened = false;
          this.canDrag = true;
          this.requestRender();
          resolve();
        }
      ));

      this.requestRender();
    });
  }

  animMatchRemove(positions, duration) {
    this.canDrag = false;
    return new Promise(resolve => {
      const items = positions
        .map(p => this.grid.cells[p.row][p.col])
        .filter(c => c && !c.isDeleted);

      this.animMgr.add(new MyAnimation(
        performance.now(), 
        duration,
        t => { 
          items.forEach(cell => cell._removalProgress = t); 
          this.requestRender(); 
        },
        () => { 
          items.forEach(cell => { 
            cell.isDeleted = true; 
            this.canDrag = true;
            delete cell._removalProgress; 
          }); 
        
          this.requestRender(); 
          resolve();
        }
      ));

      this.requestRender();
    });
  }

  animMatchFeedback(positions, duration, shrink) {
    this.canDrag = false;
    return new Promise(resolve => {
      const cells = positions.map(p => this.grid.cells[p.row][p.col]);

      // shrink
      this.animMgr.add(new MyAnimation(
        performance.now(), duration,
        t => {
          const s = 1 - (1 - shrink) * t;
          cells.forEach(c => c._scale = s);
          this.requestRender();
        },
        () => {
          // restore
          this.animMgr.add(new MyAnimation(
            performance.now(), duration,
            t => {
              const s = shrink + (1 - shrink) * t;
              cells.forEach(c => c._scale = s);
              this.requestRender();
            },
            () => {
              cells.forEach(c => { 
                delete c._scale; 
                c.isOpened = true;
              });
              this.canDrag = true;
              this.requestRender();
              resolve();
            }
          ));
        }
      ));
    });
  }

  animMismatch(positions, duration, delay) {
    this.canDrag = false;
    return new Promise(resolve => {
      setTimeout(() => {
        const [p1, p2] = positions;
        Promise.all([
          this.animClose(p1, duration),
          this.animClose(p2, duration)
        ]).then(() => {
          this.selectedCell = null;
          this.secondCell = null;
          this.canDrag = true;
          this.requestRender();
          resolve();
        });
      }, delay);
    });
  }

  animMismatchFeedback(positions, duration, delay, shrink, shakeDur, shakeCount, amplitute) {
    this.canDrag = false;
    return new Promise(resolve => {
      const cells = positions.map(p => this.grid.cells[p.row][p.col]);

      // shrink
      this.animMgr.add(new MyAnimation(
        performance.now(), duration,
        t => {
          const s = 1 - (1 - shrink) * t;
          cells.forEach(c => c._scale = s);
          this.requestRender();
        },
        () => {
          // shake
          this.animMgr.add(new MyAnimation(
            performance.now(), shakeDur,
            t => {
              const off = Math.sin(t * shakeCount * Math.PI) * amplitute;
              cells.forEach(c => c._shake = off);
              this.requestRender();
            },
            () => {
              // restore
              this.animMgr.add(new MyAnimation(
                performance.now(), duration,
                t => {
                  const s = shrink + (1 - shrink) * t;
                  cells.forEach(c => {
                    c._scale = s;
                    c._shake = 0;
                  });
                  this.requestRender();
                },
                () => {
                  // close
                  this.animMismatch(positions, duration, delay);
                  resolve();
                }
              ));
            }
          ));
        }
      ));
    });
  }

  async onCellClicked(cellPosition) {
    const cell = this.grid.cells[cellPosition.row][cellPosition.col];

    if (!cellPosition || !cell || cell.isOpened) return;

    if (!this.selectedCell) {
      this.selectedCell = cellPosition;
      await this.animOpen(cellPosition, animDurations.open);
      this.canDrag = true;
    } else if (this.selectedCell.row === cellPosition.row && this.selectedCell.col === cellPosition.col) {
      // pass
    } else if (!this.secondCell) {
      this.secondCell = cellPosition;
      await this.animOpen(cellPosition, animDurations.open);
      await this.handleMatches();
    }
  }

  async handleMatches() {
    if (!this.selectedCell || !this.secondCell) return;
    
    const p1 = this.selectedCell;
    const p2 = this.secondCell;
    const c1 = this.grid.cells[p1.row][p1.col];
    const c2 = this.grid.cells[p2.row][p2.col];
        
    let animPromise;
    
    if (c1.type === c2.type) {
      this.score++;
      animPromise = this.animMatchFeedback([p1, p2], 
        animDurations.match,
        animMatchFeedbackConsts.shrink
      );
      // await this.animMatchRemove([p1, p2], animDurations.remove)
    } else {
      this.currentStep++;
      animPromise = this.animMismatchFeedback([p1, p2], 
        animDurations.mismatch, 
        BACK_COOLDOWN,
        animMismatchFeedbackConsts.shrink,
        animMismatchFeedbackConsts.shakeDur, 
        animMismatchFeedbackConsts.shakeCount, 
        animMismatchFeedbackConsts.amplitute);
    }
    
    this.selectedCell = null;
    this.secondCell = null;
    
    await animPromise;

      if (!this.isTutorialActive) {
        this.canDrag = true;
    }
    
    if (this.currentStep === this.stepsCount || (c1.type === c2.type && this.score === this.targetItemsCount)) {
      this.handleGameOver();
    }
  }

  // Туториал
  findTutorialPair() {
    const flatCells = this.grid.cells.flat().filter(c => c);
    const types = {};
    for (const cell of flatCells) {
      if (!types[cell.type]) types[cell.type] = [];
      types[cell.type].push({ row: cell.row, col: cell.col });
    }
    for (const type in types) {
      if (types[type].length >= 2) {
        this.tutorialPairPositions = types[type].slice(0, 2);
        return;
      }
    }
  }

  handleTutorialClick(e) {
    const popupData = TUTORIAL_TEXTS[this.tutorialState];
    if (!popupData || !popupData.buttonText) return;

    // 1. Получаем отступы для текущей карточки (с фолбэком)
    const paddingX = popupData.paddingX ?? TUTORIAL_POPUP_PADDING_X;
    const paddingY = popupData.paddingY ?? TUTORIAL_POPUP_PADDING_Y;

    const popupWidth = popupData.width;
    const maxWidth = popupWidth - 2 * paddingX; // Используем новый отступ
    
    this.ctx.font = "500 20px Roboto";
    const initialLines = popupData.text.split('\n');
    const wrappedLines = [];
    initialLines.forEach(line => {
        wrappedLines.push(...wrapText(this.ctx, line, maxWidth));
    });

    const lineHeight = 24;
    const textBlockHeight = (wrappedLines.length > 0 ? wrappedLines.length - 1 : 0) * lineHeight + (wrappedLines.length > 0 ? 20 : 0);
    const buttonHeight = TUTORIAL_BUTTON_HEIGHT;
    const spaceBelowText = 20;
    // Используем новый отступ для расчета высоты
    const dynamicHeight = paddingY * 2 + textBlockHeight + spaceBelowText + buttonHeight;

    let popupY;
    if (popupData.y === 'center') {
        popupY = (MAX_CANVAS_HEIGHT - dynamicHeight) / 2;
    } else {
        popupY = popupData.y;
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const popupX_scaled = ((MAX_CANVAS_WIDTH - popupWidth) / 2) * this.scale + this.offset.x;
    const popupY_scaled = popupY * this.scale + this.offset.y;

    const buttonX_scaled = popupX_scaled + ((popupWidth - TUTORIAL_BUTTON_WIDTH) / 2) * this.scale;
    const buttonY_scaled = popupY_scaled + (dynamicHeight - TUTORIAL_BUTTON_HEIGHT - 20) * this.scale;
    const buttonW_scaled = TUTORIAL_BUTTON_WIDTH * this.scale;
    const buttonH_scaled = TUTORIAL_BUTTON_HEIGHT * this.scale;

    if (clickX > buttonX_scaled && clickX < buttonX_scaled + buttonW_scaled &&
        clickY > buttonY_scaled && clickY < buttonY_scaled + buttonH_scaled) {
        
        if (this.tutorialState === TUTORIAL_STATE.INTRO || this.tutorialState === TUTORIAL_STATE.FINAL) {
            this.advanceTutorial();
        }
    }
  }

  async advanceTutorial() {
    // Логика для перехода после клика

    switch (this.tutorialState) {
      case TUTORIAL_STATE.INTRO:
        this.tutorialState = TUTORIAL_STATE.MEMORIZE;
        this.requestRender();
        this.advanceTutorial(); // Сразу запускаем логику для второго шага
        break;
      // КОНЕЦ ДОБАВЛЕННОГО БЛОКА
      case TUTORIAL_STATE.MEMORIZE:
        this.grid.cells.flat().forEach(cell => { 
          if (cell) cell.isOpened = true;
        });
        this.requestRender();
        await new Promise(r => setTimeout(r, START_DELAY));
        const closePromises = this.grid.cells
          .flat()
          .filter(c => c)
          .map(c => this.animClose(c, animDurations.close));
        await Promise.all(closePromises);
        this.tutorialState = TUTORIAL_STATE.FIND_PAIRS_1;
        this.requestRender();
        await new Promise(r => setTimeout(r, 500));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.FIND_PAIRS_1:
        this.tutorialHand.visible = true;
        await this.animateHandAndClick(this.tutorialPairPositions[0]);
        this.tutorialState = TUTORIAL_STATE.FIRST_CARD_OPENED;
        this.requestRender();
        await new Promise(r => setTimeout(r, 500));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.FIRST_CARD_OPENED:
        this.tutorialState = TUTORIAL_STATE.FIND_PAIRS_2;
        this.requestRender();
        await new Promise(r => setTimeout(r, 200));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.FIND_PAIRS_2:
        await this.animateHandAndClick(this.tutorialPairPositions[1]);
        this.tutorialState = TUTORIAL_STATE.SECOND_CARD_OPENED;
        this.requestRender();
        await new Promise(r => setTimeout(r, 1500));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.SECOND_CARD_OPENED:
        this.tutorialHand.visible = false;
        this.tutorialState = TUTORIAL_STATE.FINAL;
        this.requestRender();
        break;
      case TUTORIAL_STATE.FINAL:
        this.tutorialState = TUTORIAL_STATE.COMPLETE;
        this.isTutorialActive = false;
        this.canDrag = true;
        this.requestRender();
        break;
    }
  }

  async animateHandToPos(pos) {
    if (!pos) return;
    const coords = this.renderer.getCoords(pos);
    const targetX = coords.x + CELL_WIDTH / 2, targetY = coords.y + CELL_HEIGHT / 2 + 10;
    const isFirstMove = this.tutorialHand.x === 0 && this.tutorialHand.y === 0;
    const startX = isFirstMove ? targetX : this.tutorialHand.x;
    const startY = isFirstMove ? targetY - 50 : this.tutorialHand.y;
    this.tutorialHand.x = startX; 
    this.tutorialHand.y = startY;
    await this._animate(500, t => { 
      this.tutorialHand.x = startX + (targetX - startX) * t; 
      this.tutorialHand.y = startY + (targetY - startY) * t; 
    });
  }

  async animateHandAndClick(pos) {
    await this.animateHandToPos(pos);
    await this._animate(200, t => { this.tutorialHand.scale = 1 - 0.2 * t; });
    await this.onCellClicked(pos);
    await this._animate(200, t => { this.tutorialHand.scale = 0.8 + 0.2 * t; });
  }

  // Вспомогательный метод для упрощения анимаций
  _animate(duration, updateCallback) {
    return new Promise(resolve => {
      this.animMgr.add(new MyAnimation(performance.now(), duration, updateCallback, resolve));
      this.requestRender();
    });
  }

  handlePointerDown(e) {
    if (this.isTutorialActive) {
      this.handleTutorialClick(e);
      return;
    }

    if (!this.canDrag || this.animMgr.isAnimating()) return;
    const pos = this.getCellGridPosition(e);
    if (pos) this.onCellClicked(pos);
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    const startX = GRID_PADDING_LEFT * this.scale + this.offset.x;
    const startY = GRID_PADDING_TOP  * this.scale + this.offset.y;
    const cellW = (CELL_WIDTH + CELL_GAP) * this.scale;
    const cellH = (CELL_HEIGHT + CELL_GAP) * this.scale;
    const col = Math.floor((x - startX) / cellW);
    const row = Math.floor((y - startY) / cellH);
    if (row < 0 || col < 0 || row >= this.grid.rows || col >= this.grid.cols) return null;
    const cell = this.grid.cells[row][col];

    return (cell && !cell.isDeleted) ? { row, col } : null;
  }

  setFinishCallback(cb) {
    this.finishCb = cb;
  }

  setAssetsLoadedCallback(cb) {
    this.assetsLoadedCb = cb;
  }

  handleGameOver() {
    console.log("GameOver!");
    this.isGameOver = true;
    if (this.finishCb) {
      const gameData = { 
        score: this.score, 
        currentStep: this.currentStep 
      };
      this.finishCb(gameData);
    }

    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);

    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}

function init(canvas, initGameData, tmp, finishFunc = gameData => { }, assetsLoadedCallback = () => {}) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) console.error("Canvas does not exist!");

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishFunc);
  engine.setAssetsLoadedCallback(assetsLoadedCallback);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}

export { init, deinit };
