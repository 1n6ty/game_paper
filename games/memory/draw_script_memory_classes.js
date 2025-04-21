const __VERSION__ = "1.1C";

// const PATH = "./assets/memory/";
const PATH = "/media/assets/memory/";

const CARD_PATHS = {
  bottle: `${PATH}cards/bottle.svg`,
  can: `${PATH}cards/can.svg`,
  cat: `${PATH}cards/cat.svg`,
  cow: `${PATH}cards/cow.svg`,
  flowerPink: `${PATH}cards/flowerPink.svg`,
  flowerPurple: `${PATH}cards/flowerPurple.svg`,
  flowerWhite: `${PATH}cards/flowerWhite.svg`,
  lambumiz: `${PATH}cards/lambumiz.svg`,
  leaf: `${PATH}cards/leaf.svg`,
  milkGlass: `${PATH}cards/milkGlass.svg`,
  yogurtChocolate: `${PATH}cards/yogurtChocolate.svg`,
  yogurtPink: `${PATH}cards/yogurtPink.svg`
};

const bushesUrl = `${PATH}bushes.svg`;
const groundUrl = `${PATH}ground.svg`;

const START_DELAY = 5000;  // милисекунды

const BACK_COOLDOWN = 800;  // милисекунды

const animDuration = {
  open: 400,
  close: 400,
  mismatch: 400,
  match: 500
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
const CELL_PADDING = 4;
const CELL_CARD_RADIUS = 10;

const BUSHES_WIDTH = 428;
const BUSHES_HEIGHT = 91;
const BOTTOM_GROUND_BG_COLOR = "#996A4D";
const BOTTOM_GROUND_HEIGHT = 67;

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
    this.isDeleted = false;
    this.isOpened = false;
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
    this.initGrid();
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
        const j = Math.floor(this.random() * (i + 1));
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
      x: x0 + pos.col * (CELL_WIDTH + CELL_PADDING),
      y: y0 + pos.row * (CELL_HEIGHT + CELL_PADDING),
    };
  }

  drawStepsCard(currentStep, stepsCount) {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const stepsCardX = STEPS_PADDING_LEFT;
    const stepsCardY = STEPS_PADDING_TOP;

    drawCard(this.ctx, stepsCardX, stepsCardY,
      STEPS_CARD_WIDTH, STEPS_CARD_HEIGHT, 12,
      STEPS_STROKE_COLOR, STEPS_BG_COLOR
    );

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

  drawBody(currentStep, stepsCount) {
    const { width, height } = this.dims;

    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0.09, BODY_BG_TOP_COLOR);
    gradient.addColorStop(0.54, BODY_BG_MIDDLE_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();

    this.drawStepsCard(currentStep, stepsCount);

    this.ctx.save();
    this.ctx.fillStyle = BOTTOM_GROUND_BG_COLOR;
    this.ctx.fillRect(0, height - BOTTOM_GROUND_HEIGHT, width, BOTTOM_GROUND_HEIGHT);
    this.ctx.restore();

    this.drawBushes();
  }

  drawCell(cell) {
    const { x, y } = this.getCoords(cell);
    this.ctx.save();
    this.ctx.translate(x, y);
  
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

    let showFace;
    if (flip != null) {
      showFace = flip > 0.5;
    } else {
      showFace = cell.isOpened;
    }
  
    if (showFace) {
      drawCard(this.ctx, 0, 0,
        CELL_WIDTH, CELL_HEIGHT,
        CELL_CARD_RADIUS,
        STEPS_STROKE_COLOR, STEPS_BG_COLOR);
      const img = this.images[cell.type];
      if (img) {
        drawImageInCell(
          this.ctx, img,
          0, 0,
          CELL_WIDTH, CELL_HEIGHT,
          CELL_PADDING
        );
      }
    } else {
      if (this.images.ground) {
        this.ctx.drawImage(
          this.images.ground,
          0, 0,
          CELL_WIDTH, CELL_HEIGHT
        );
      }
    }
  
    this.ctx.restore();
  }
  

  drawGrid(grid) {
    for (const row of grid.cells) {
      for (const cell of row) {
        if (!cell) continue;

        this.drawCell(cell);
      }
    }
  }  

  drawGridZone(grid) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    drawCard(this.ctx, 
      GRID_ZONE_PADDING_LEFT,
      GRID_ZONE_PADDING_TOP,
      GRID_ZONE_WIDTH,
      GRID_ZONE_HEIGHT,
      GRID_ZONE_RADIUS,
      GRID_ZONE_BG_COLOR,
      GRID_ZONE_BG_COLOR
    );

    this.drawGrid(grid);

    this.ctx.restore();
  }

  drawScene(grid, state) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dims;
    this.ctx.clearRect(0, 0, width, height);

    this.drawBody(state.currentStep,
      state.stepsCount);
    this.drawGridZone(grid);

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
    this.assetKeys = Object.keys(CARD_PATHS);

    this.dimensions = { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    this.scale = Math.min(this.dimensions.width / MAX_CANVAS_WIDTH, this.dimensions.height / MAX_CANVAS_HEIGHT);
    this.offset = {
      x: (this.dimensions.width - MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (this.dimensions.height - MAX_CANVAS_HEIGHT * this.scale) / 2
    };

    const seed = initGameData.seed || Date.now().toString(16);
    this.randomGen = new LCG(seed);

    this.trainingCount = +initGameData.trainingCount || 0;
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount || 20;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount || 20;
    this.score = 0;

    this.canDrag = false;

    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GRID_ROWS,
      GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
      (r, c, rows, cols) => {
        if ((r === (rows - 1) / 2) && (c === (cols - 1) / 2)) {
          return false;
        }
    
        return true;
      }
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
        currentStep: this.currentStep,
        stepsCount: this.stepsCount
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

  startFlipOver() {
    this.grid.cells.flat().forEach(cell => { if (cell) cell.isOpened = true; });
    this.requestRender();
    setTimeout(() => {
      this.grid.cells.flat().forEach(cell => { if (cell) this.animClose(cell, animDuration.close); });
      this.canDrag = true;
      this.requestRender();
    }, START_DELAY);
  }

  onAssetsLoaded() {
    this.startFlipOver();
    this.requestRender();
  }

  async loadAssets() {
    const entries = [...Object.entries(CARD_PATHS), 
      ["bushes", bushesUrl],
      ["ground", groundUrl]
    ];
    const imgs = await Promise.all(entries.map(([, p]) => loadImage(p)));
    entries.forEach(([k], i) => (this.images[k] = imgs[i]));

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

  async onCellClicked(cellPosition) {
    if (!cellPosition) return;

    if (!this.selectedCell) {
      this.selectedCell = cellPosition;
      await this.animOpen(cellPosition, animDuration.open);
      this.canDrag = true;
    } else if (this.selectedCell.row === cellPosition.row && this.selectedCell.col === cellPosition.col) {
      // pass
    } else if (!this.secondCell) {
      this.secondCell = cellPosition;
      await this.animOpen(cellPosition, animDuration.open);
      await this.handleMatches();
    }
  }

  async handleMatches() {
    if (!this.selectedCell || !this.secondCell) return;
    
    const p1 = this.selectedCell;
    const p2 = this.secondCell;
    const c1 = this.grid.cells[p1.row][p1.col];
    const c2 = this.grid.cells[p2.row][p2.col];
    
    this.currentStep++;
    
    let animPromise;
    
    if (c1.type === c2.type) {
      this.score++;
      animPromise = this.animMatchRemove([p1, p2], animDuration.match);
    } else {
      animPromise = this.animMismatch([p1, p2], animDuration.mismatch, BACK_COOLDOWN);
    }
    
    this.selectedCell = null;
    this.secondCell = null;
    
    await animPromise;
    
    if (this.currentStep === this.stepsCount || (c1.type === c2.type && this.score === this.targetItemsCount)) {
      this.handleGameOver();
    }
  }

  handlePointerDown(e) {
    if (!this.canDrag) return;
    const pos = this.getCellGridPosition(e);

    if (!pos || this.animMgr.isAnimating()) return;

    this.onCellClicked(pos);
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    const startX = GRID_PADDING_LEFT * this.scale + this.offset.x;
    const startY = GRID_PADDING_TOP  * this.scale + this.offset.y;
    const cellW = (CELL_WIDTH + CELL_PADDING) * this.scale;
    const cellH = (CELL_HEIGHT + CELL_PADDING) * this.scale;
    const col = Math.floor((x - startX) / cellW);
    const row = Math.floor((y - startY) / cellH);
    if (row < 0 || col < 0 || row >= this.grid.rows || col >= this.grid.cols) return null;
    const cell = this.grid.cells[row][col];

    return (cell && !cell.isDeleted) ? { row, col } : null;
  }

  setFinishCallback(cb) {
    this.finishCb = cb;
  }

  handleGameOver() {
    console.log("GameOver!");
    this.isGameOver = true;
    if (this.finishCb)
      this.finishCb({ score: this.score, currentStep: this.currentStep });

    window.removeEventListener("resize", () => {
      this.resizeCanvas();
      this.requestRender();
    });

    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);
  }
}

function init(canvas, initGameData, tmp, finishFunc = gameData => { }) {
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
