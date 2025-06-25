
const GRID_ROWS = 5;
const GRID_COLS = 5;

const MAX_CANVAS_WIDTH = 428;
const MAX_CANVAS_HEIGHT = 809;

const HEADER_HEIGHT = 279;

const BODY_BG_COLOR = "#FFFFFF";

const GRID_ZONE_BG_COLOR = "#996A4D";

const CELL_BG_COLOR = "#FFFFFF";
const CELL_STROKE_COLOR = "#224C93";

const CELL_WIDTH = 70;
const CELL_HEIGHT = 70;
const CELL_GAP = 5;
const CELL_PADDING = 0;
const CELL_RADIUS = 16;

function drawGroundCell(ctx, x, y, size, radius, 
  hasUp, hasRight, hasDown, hasLeft,
  hasUpLeft, hasUpRight, hasDownRight, hasDownLeft) {

  // идём по часовой: top-left, top-right, bottom-right, bottom-left
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
  } else if (hasUpRight && !hasUp) {
    ctx.lineTo(x + size - radius, y);
    ctx.arcTo(x + size, y, x + size, y - radius, radius);
  } else {
    ctx.lineTo(x + size, y);
  }

  // 3) правая грань
  if (rbr) {
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
  } else if (hasDownRight && !hasRight) {
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + size, x + size + radius, y + size, radius);
  } else {
    ctx.lineTo(x + size, y + size);
  }

  // 4) нижняя
  if (rbl) {
    ctx.lineTo(x + radius, y + size);
    ctx.arcTo(x, y + size, x, y + size - radius, radius);
  } else if (hasDownLeft && !hasDown) {
    ctx.lineTo(x + radius, y + size);
    ctx.arcTo(x, y + size, x, y + size + radius, radius);
  } else {
    ctx.lineTo(x, y + size);
  }

  // 5) левая
  if (rtl) {
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
  } else if (hasUpLeft && !hasLeft) {
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x - radius, y, radius);
  } else {
    ctx.lineTo(x, y);
  }
}

function generateGrid(rows, cols, rule) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(!!rule(r, c, rows, cols));
    }

    grid.push(row);
  }

  return grid;
}

const rectField = (r, c, rows, cols) => true;
const triangleField = (r, c, rows, cols) => c < rows - r;
const plusField = (r, c, rows, cols) => {
  const border =
      (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
  return !border;
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

const withoutCenterField = (r, c, rows, cols) => ((r != (rows - 1) / 2) || (c != (cols - 1) / 2));

const combinedField = (r, c, rows, cols) => plusField(r, c, rows, cols) && withoutCenterField(r, c, rows, cols);

function makeRandomField(rows, cols) {
  // Вспомогательная генерация «размяшенной» матрицы
  const total = rows * cols;
  const minTrue = Math.ceil(total / 2);
  const minEvenTrue = (minTrue % 2 === 0 ? minTrue : minTrue + 1);
  const maxEvenTrue = (total % 2 === 0 ? total : total - 1);
  const rangeCount = (maxEvenTrue - minEvenTrue) / 2;
  // случайный чётный
  const trueCount = minEvenTrue + 2 * Math.floor(Math.random() * (rangeCount + 1));

  // Получаем список всех индексов и тасуем
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Заполняем матрицу
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let k = 0; k < trueCount; k++) {
    const idx = indices[k];
    matrix[Math.floor(idx / cols)][idx % cols] = true;
  }

  // Возвращаем предикат
  return (r, c) => matrix[r][c];
}

let listener;

function init(canvas, initGameData, tmp, finishCallback = gameData => {}, assetsLoadedCallback = () => {}) {
  console.log("Welcome to sandbox!");

  const ctx = canvas.getContext("2d");

  const rows = GRID_ROWS, cols = GRID_COLS;

  const randomField = makeRandomField(rows, cols);

  const grid = generateGrid(rows, cols, heartShapedField);
  console.table(grid);

  const cellSize = CELL_HEIGHT;
  const radius = CELL_RADIUS;

  listener = () => {
    const p = canvas.parentElement;
    if (!p) return;
    const w = p.clientWidth;
    const h = p.clientHeight;
    this.dimensions = { width: w, height: h };
    this.dpr = window.devicePixelRatio || 1;
    canvas.width = w * this.dpr;
    canvas.height = h * this.dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    drawGrid();
  };


  const drawGrid = () => {

    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    
    const x0 = this.dimensions.width / 2 - cols * cellSize / 2;
    const y0 = this.dimensions.height / 2 - rows * cellSize / 2;

    ctx.lineJoin = "round";
    ctx.beginPath();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          const x = x0 + c * cellSize;
          const y = y0 + r * cellSize;

          const up = grid[r - 1]?.[c] ?? false;
          const right = grid[r]?.[c + 1] ?? false;
          const down = grid[r + 1]?.[c] ?? false;
          const left = grid[r]?.[c - 1] ?? false;

          const upLeft = grid[r - 1]?.[c - 1] ?? false;
          const upRight = grid[r - 1]?.[c + 1] ?? false;
          const downRight = grid[r + 1]?.[c + 1] ?? false;
          const downLeft = grid[r + 1]?.[c - 1] ?? false;
      
          ctx.strokeStyle = "#FF0000";
          ctx.fillStyle = GRID_ZONE_BG_COLOR;
      
          drawGroundCell(ctx, x, y, cellSize, radius, 
            up, right, down, left,
            upLeft, upRight, downRight, downLeft);
        }
      }
    }

    ctx.closePath();
    ctx.fill();
  }; 

  window.addEventListener("resize", listener);
  listener();

  return tmp;
}

function deinit(canvas, tmp) {
  window.removeEventListener("resize", listener);
}