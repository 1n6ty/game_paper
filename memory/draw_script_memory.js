const __VERSION__ = "2.1";

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
}

const bushesUrl = `${PATH}bushes.svg`;
const groundUrl = `${PATH}ground.svg`;

const BACK_COOLDOWN = 900;

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

    this.maxStepsCount = parseInt(initGameData.maxStepsCount || 40);
    this.currentStepsCount = 0;

    this.targetItemsCount = parseInt(initGameData.targetItemsCount || 12);
    this.score = 0;

    this.isGameOver = false;
    this.canDrag = true;
    this.gameLoopId = null;
    this.finishCallback = () => { };

    this.grid = [];
    this.assetKeys = Object.keys(CARD_PATHS);
    this.initGrid();

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

    this.canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
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
      ...Object.entries(CARD_PATHS),
      ["bushes", bushesUrl],
      ["ground", groundUrl]
    ];
    const promises = entries.map(([key, path]) => loadImage(path));
    const loaded = await Promise.all(promises);
    entries.forEach(([key], idx) => {
      this.images[key] = loaded[idx] || null;
    });

    this.onAssetsLoaded();
  }

  startGameLoop() {
    // this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
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
    if ((row === (GRID_ROWS - 1) / 2) && (col === (GRID_COLS - 1) / 2)) {
      console.log(row, col);
      return false;
    }
    return true;
  }

  initGrid() {
    this.grid = [];
    const activeCells = [];

    for (let r = 0; r < GRID_ROWS; r++) {
      const row = [];
      for (let c = 0; c < GRID_COLS; c++) {
        row.push(null);
        if (this.isCellActive(r, c)) {
          activeCells.push({ r, c });
        }
      }
      this.grid.push(row);
    }

    let numActive = activeCells.length;
    let cellsForPairs = Math.min(numActive, 24);
    if (cellsForPairs % 2 !== 0) {
      cellsForPairs--;
    }

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(this.randomGenerator.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledCells = shuffleArray(activeCells.slice());
    const selectedCells = shuffledCells.slice(0, cellsForPairs);
    const numPairs = cellsForPairs / 2;

    const pairValues = [];
    for (let i = 0; i < numPairs; i++) {
      const key = this.assetKeys[Math.floor(this.randomGenerator.random() * this.assetKeys.length)];
      pairValues.push(key, key);
    }

    const shuffledPairValues = shuffleArray(pairValues);

    for (let i = 0; i < selectedCells.length; i++) {
      const { r, c } = selectedCells[i];
      this.grid[r][c] = { type: shuffledPairValues[i] };
    }

    for (let cell of activeCells) {
      const { r, c } = cell;
      if (this.grid[r][c] === null) {
        this.grid[r][c] = { type: 'disabled' };
      }
    }
  }

  getCellCoordinates(pos) {
    return {
      x: GRID_PADDING_LEFT + pos.col * (CELL_WIDTH + CELL_PADDING),
      y: GRID_PADDING_TOP + pos.row * (CELL_HEIGHT + CELL_PADDING)
    };
  }

  getGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridStartX = this.offset.x + GRID_PADDING_LEFT * this.scale;
    const gridStartY = this.offset.y + GRID_PADDING_TOP * this.scale;

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

  handleMatches() {
    if (this.selectedCell && this.secondSelectedCell) {

      const cell1 = this.grid[this.selectedCell.row][this.selectedCell.col];
      const cell2 = this.grid[this.secondSelectedCell.row][this.secondSelectedCell.col];

      if (!cell1 || !cell2) return;
      this.currentStepsCount++;
      if (this.currentStepsCount == this.maxStepsCount) {
        this.handleGameOver();
      }

      if (cell1.type === cell2.type) {
        cell1.state = 'opened';
        cell2.state = 'opened';
        this.selectedCell = null;
        this.secondSelectedCell = null;
        this.score++;
        if (this.score == this.targetItemsCount) {
          this.handleGameOver();
        }
      } else {
        this.canDrag = false;
        console.log("can drag", this.canDrag);
        const timer = setInterval(() => {
          this.selectedCell = null;
          this.secondSelectedCell = null;
          this.drawScene();
          this.canDrag = true;
          console.log("can drag", this.canDrag);
          if (timer) {
            clearTimeout(timer);
          }
        }, BACK_COOLDOWN);
      }
    }
  }

  onCellClicked(cellPosition) {
    console.log("first can drag", this.canDrag);

    if (cellPosition && this.canDrag) {
      const cell = this.grid[cellPosition.row][cellPosition.col];
      if (!cell || cell.state === 'opened') return;

      if (this.selectedCell === null) { // нажатие первое
        this.selectedCell = cellPosition;
      } else if (this.selectedCell.row === cellPosition.row && this.selectedCell.col === cellPosition.col) {
        return;
      } else {                          // нажатие второе, так как первая выделенная клетка не null
        this.secondSelectedCell = cellPosition;
      }

      this.handleMatches();

      this.drawScene();
    }
  }

  handlePointerDown(e) {
    e.preventDefault && e.preventDefault();
    const pos = this.getGridPosition(e);
    if (pos)
      this.onCellClicked(pos);
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

  drawStepsCard() {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const stepsCardX = STEPS_PADDING_LEFT;
    const stepsCardY = STEPS_PADDING_TOP;

    this.drawCard(stepsCardX, stepsCardY,
      STEPS_CARD_WIDTH, STEPS_CARD_HEIGHT, 12,
      STEPS_STROKE_COLOR, STEPS_BG_COLOR
    )

    this.ctx.fillStyle = STEPS_TEXT_COLOR;
    this.ctx.font = "500 24px/0.15px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(`Шаги ${this.currentStepsCount}/${this.maxStepsCount}`,
      stepsCardX + STEPS_CARD_WIDTH / 2, stepsCardY + STEPS_CARD_HEIGHT / 2, STEPS_CARD_WIDTH - 13);

    this.ctx.restore();
  }

  drawBushes() {
    if (!this.images.bushes) return;

    const { width, height } = this.dimensions;

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

  drawBody() {
    const { width, height } = this.dimensions;

    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0.09, BODY_BG_TOP_COLOR);
    gradient.addColorStop(0.54, BODY_BG_MIDDLE_COLOR);
    gradient.addColorStop(1, BODY_BG_BOTTOM_COLOR);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();

    this.drawStepsCard();

    this.ctx.save();
    this.ctx.fillStyle = BOTTOM_GROUND_BG_COLOR;
    this.ctx.fillRect(0, height - BOTTOM_GROUND_HEIGHT, width, BOTTOM_GROUND_HEIGHT);
    this.ctx.restore();

    this.drawBushes();
  }

  drawGrid() {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const cell = this.grid[r][c];
        if (!cell || !cell.type || cell.type === 'disabled') continue;

        const pos = this.getCellCoordinates({ col: c, row: r });

        let posX = pos.x, posY = pos.y;

        if ((this.selectedCell && this.selectedCell.col === c && this.selectedCell.row === r) ||
          (this.secondSelectedCell && this.secondSelectedCell.col === c && this.secondSelectedCell.row === r) ||
          cell.state === 'opened'
        ) {
          const image = this.images[cell.type];
          this.drawCard(posX, posY, CELL_WIDTH, CELL_HEIGHT, CELL_CARD_RADIUS, STEPS_STROKE_COLOR, STEPS_BG_COLOR);
          if (image) {
            this.drawImageInCell(image, posX, posY, CELL_WIDTH, CELL_HEIGHT, CELL_PADDING);
          }
        } else {
          if (this.images.ground)
            this.ctx.drawImage(this.images.ground, posX, posY);
        }
      }
    }
  }

  drawGridZone() {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    this.drawCard(
      GRID_ZONE_PADDING_LEFT,
      GRID_ZONE_PADDING_TOP,
      GRID_ZONE_WIDTH,
      GRID_ZONE_HEIGHT,
      GRID_ZONE_RADIUS,
      GRID_ZONE_BG_COLOR,
      GRID_ZONE_BG_COLOR
    );

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

    this.drawBody();
    this.drawGridZone();

    this.ctx.restore();
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
