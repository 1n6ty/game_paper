const __VERSION__ = "9.1";

const PATH = "/media/assets/healthTracker/";  // /media/assets/healthTracker/

const glassUrl = `${PATH}glass.svg`;
const decorationsUrl = `${PATH}decorations.svg`;
const fillingUrl = `${PATH}filling.svg`;

const MAX_CANVAS_WIDTH = 428;
const MAX_CANVAS_HEIGHT = 845;

const GLASS_WIDTH = 179.77;
const GLASS_HEIGHT = 259;
const FILLING_WIDTH = 154.96;
const FILLING_HEIGHT = 208.68;
const DECOR_WIDTH = 792;
const DECOR_HEIGHT = 448;
const TOTAL_DAYS = 7;  // всего дней для заполнения

const TITLE_COLOR = "#779FBD";
const TEXT_COLOR = "#779FBD";

const INSTRUCTION_CARD_COLOR = "#FFFFFF";
const DAYS_CARD_COLOR = "#FFFFFF4D";

const BG_TOP_COLOR = "#D1E8FF";
const BG_BOTTOM_COLOR = "#FFFFFF";

const DAY_EMPTY_BORDER = "#9FBACF";
const DAY_EMPTY_FILL = "#FFFFFF";
const DAY_FILLED_BORDER = "#9AD99D";
const DAY_FILLED_FILL = "#9AD99D";
const DAY_TEXT_EMPTY = "#9FBACF";
const DAY_TEXT_FILLED = "#FFFFFF";


const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      resolve(null); // fallback – вернуть null
    };
  });


class GameEngine {
  constructor(canvas, initGameData, tmp) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp || {};
    this.tmp.engine = this;

    this.consecutiveDays = parseInt(initGameData.consecutiveDays || "0", 10);
    if (this.consecutiveDays == TOTAL_DAYS) {
      this.handleGameOver();
    }
    this.currentFillLevel = 0;
    this.targetFillLevel = this.consecutiveDays;

    this.dimensions = {
      width: MAX_CANVAS_WIDTH,
      height: MAX_CANVAS_HEIGHT,
    };

    this.uiDimensions = {
      width: MAX_CANVAS_WIDTH,
      height: MAX_CANVAS_HEIGHT,
    };


    // Флаг игры - используется для остановки анимации, если игра завершена
    this.isGameOver = false;
    this.gameLoopId = null;
    this.finishCallback = () => { };

    // Привязываем обработчики событий
    this.boundHandleClick = (e) => this.handleClick(e);
    this.canvas.addEventListener("click", this.boundHandleClick);

    this.boundResizeCanvas = () => this.resizeCanvas();
    window.addEventListener("resize", this.boundResizeCanvas);
    this.resizeCanvas();

    this.lastFrameTime = performance.now();
    this.startGameLoop();

    this.images = {};
    this.loadAssets();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    const newWidth = parentWidth;
    const newHeight = parentHeight - 60;

    this.dimensions.width = newWidth;
    this.dimensions.height = newHeight;

    this.uiDimensions.width = Math.min(parentWidth, MAX_CANVAS_WIDTH);
    this.uiDimensions.height = Math.min(parentHeight, MAX_CANVAS_HEIGHT);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
  }

  getCanvasCoordinates(e) {
    // Получаем размер и позицию canvas
    const rect = this.canvas.getBoundingClientRect();
    // Вычисляем координаты относительно canvas:
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  /* Обработчик клика по стакану */
  handleClick(e) {
    const pos = this.getCanvasCoordinates(e);
    console.log('Координаты на canvas: ', pos);

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();


    // Определяем координаты клика с учетом масштабирования
    // const rect = this.canvas.getBoundingClientRect();
    // const dpr = window.devicePixelRatio || 1;
    // const x = (e.clientX - rect.left) * dpr;
    // const y = (e.clientY - rect.top) * dpr;

    // this.ctx.strokeStyle = 'red';
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);

    // // Определяем прямоугольную область стакана (центрирован по горизонтали, внизу)
    // const canvasWidth = this.dimensions.width;
    // const canvasHeight = this.dimensions.height;
    // const glassX = (canvasWidth - GLASS_WIDTH) / 2;
    // const glassY = canvasHeight - GLASS_HEIGHT - 50; // 50px от низа как отступ
    // if (
    //   x >= glassX &&
    //   x <= glassX + GLASS_WIDTH &&
    //   y >= glassY &&
    //   y <= glassY + GLASS_HEIGHT
    // ) {
    //   console.log("Стакан нажат");
    //   // При клике обновляем целевой уровень (но не выше TOTAL_DAYS)
    //   if (this.targetFillLevel < TOTAL_DAYS) {
    //     this.targetFillLevel++;
    //   }
    // }
  }

  async loadAssets() {
    const assets = {
      glass: loadImage(glassUrl),
      decorations: loadImage(decorationsUrl),
      filling: loadImage(fillingUrl),
    };
    const keys = Object.keys(assets);
    const loaded = await Promise.all(Object.values(assets));
    keys.forEach((key, idx) => {
      this.images[key] = loaded[idx] || null;
    });
  }

  startGameLoop() {
    this.lastFrameTime = performance.now();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    if (this.isGameOver) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = now;

    // Анимация заполнения стакана: плавное приближение currentFillLevel к targetFillLevel
    const fillSpeed = 1; // уровней в секунду
    if (this.currentFillLevel < this.targetFillLevel) {
      this.currentFillLevel += fillSpeed * dt;
      if (this.currentFillLevel > this.targetFillLevel) {
        this.currentFillLevel = this.targetFillLevel;
      }
    }
    this.drawScene();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  stopGameLoop() {
    console.log("Stop GameLoop");
    this.canvas.removeEventListener("click", this.boundHandleClick);
    window.removeEventListener("resize", this.boundResizeCanvas);
    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  drawScene() {
    const DECOR_HEIGHT_GAP = 20;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = this.dimensions;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, width, height);

    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, BG_TOP_COLOR);
    bgGradient.addColorStop(1, BG_BOTTOM_COLOR);
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    if (this.images.decorations) {
      const decorX = (width - DECOR_WIDTH) / 2;
      const decorY = height - DECOR_HEIGHT + DECOR_HEIGHT_GAP * Math.pow(MAX_CANVAS_HEIGHT / this.uiDimensions.height, 3);
      this.ctx.drawImage(this.images.decorations, decorX, decorY, DECOR_WIDTH, DECOR_HEIGHT);
    }

    this.drawInstructionCard();
    this.drawDaysCard();
    this.drawGlass();

    this.ctx.restore();
  }

  drawInstructionCard() {
    const TEXT_PADDING = 16;
    const GAP_BETWEEN_TITLE_AND_TEXT = 60;
    const LINE_HEIGHT = 23;
    const INSTRUCTION_CARD_HORIZONTAL_PADDING = 14.5;

    const { width, height } = this.uiDimensions;
    const cardW = width - INSTRUCTION_CARD_HORIZONTAL_PADDING * 2;
    const cardH = 183;

    const cardX = this.dimensions.width / 2 - cardW / 2;
    const cardY = 20;

    this.ctx.fillStyle = INSTRUCTION_CARD_COLOR;
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();

    this.ctx.fillStyle = TITLE_COLOR;
    this.ctx.font = "700 20px Roboto";
    this.ctx.fillText("Трекер здоровья", cardX + TEXT_PADDING, cardY + 30);

    const instructionText = `Наполняй стакан молоком каждый день! 
Не забывай нажимать на него — только так он будет заполняться. 
Пропустишь день, и стакан опустеет. 
Заполни его за 7 дней подряд и получи билет!`;

    const maxTextWidth = cardW - TEXT_PADDING * 2;

    const wrapText = (ctx, text, maxWidth) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    this.ctx.fillStyle = TEXT_COLOR;

    this.ctx.font = "600 16px Roboto";

    const boldEnd = instructionText.indexOf("!") + 1;
    const boldText = instructionText.substring(0, boldEnd);
    const normalText = instructionText.substring(boldEnd).trim();

    const boldLines = wrapText(this.ctx, boldText, maxTextWidth);
    const normalLines = wrapText(this.ctx, normalText, maxTextWidth);

    // Рисуем жирные строки
    let offset = 0;
    boldLines.forEach(line => {
      this.ctx.fillText(line, cardX + TEXT_PADDING, cardY + GAP_BETWEEN_TITLE_AND_TEXT + offset);
      offset += LINE_HEIGHT;
    });
    // Рисуем оставшиеся строки
    this.ctx.font = "400 16px Roboto";
    normalLines.forEach(line => {
      this.ctx.fillText(line, cardX + TEXT_PADDING, cardY + GAP_BETWEEN_TITLE_AND_TEXT + offset);
      offset += LINE_HEIGHT;
    });
  }

  drawDaysCard() {
    const DAYS_CARD_HORIZONTAL_PADDING = 14.5;

    const { width } = this.uiDimensions;
    const cardW = width - DAYS_CARD_HORIZONTAL_PADDING * 2;
    const cardH = 75;

    const cardX = this.dimensions.width / 2 - cardW / 2;
    const cardY = 219;
    this.ctx.fillStyle = DAYS_CARD_COLOR;
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();

    const circleRadius = 22.5 * (width / MAX_CANVAS_WIDTH);
    const spacing = (cardW - 14 * circleRadius) / (TOTAL_DAYS + 1);
    let xPos = cardX + spacing + circleRadius;

    const daysFilled = this.consecutiveDays;
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      const filled = i <= daysFilled;
      const fillColor = filled ? DAY_FILLED_FILL : DAY_EMPTY_FILL;
      const borderColor = filled ? DAY_FILLED_BORDER : DAY_EMPTY_BORDER;
      const textColor = filled ? DAY_TEXT_FILLED : DAY_TEXT_EMPTY;
      this.ctx.beginPath();
      this.ctx.arc(xPos, cardY + cardH / 2, circleRadius, 0, 2 * Math.PI);
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = borderColor;
      this.ctx.stroke();
      this.ctx.fillStyle = textColor;
      this.ctx.font = "500 20px/24px Roboto Mono";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(i.toString(), xPos, cardY + cardH / 2);
      xPos += (circleRadius * 2 + spacing);
      this.ctx.closePath();
    }
  }

  drawGlass() {
    const GLASS_GAP = 40;
    const FILLING_GAP = 30;

    const { width, height } = this.dimensions;
    const glassX = width / 2 - GLASS_WIDTH / 2;
    const glassY = height - GLASS_HEIGHT - GLASS_GAP;

    const fillingX = width / 2 - FILLING_WIDTH / 2;
    const fillingY = height - FILLING_HEIGHT - FILLING_GAP;

    // Отрисовка контура стакана
    if (this.images.glass) {
      this.ctx.drawImage(this.images.glass, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    }

    // Отрисовка заливки стакана с клиппингом по контуру
    const fillPercent = Math.min(this.currentFillLevel / TOTAL_DAYS, 1);
    const fillHeight = FILLING_HEIGHT * fillPercent;
    const fillY = fillingY + (FILLING_HEIGHT - fillHeight);
    if (this.images.filling) {
      this.drawGlassOutline(this.ctx, fillingX, fillingY);
      this.ctx.clip();
      this.ctx.drawImage(this.images.filling, fillingX, fillY, FILLING_WIDTH, fillHeight);
    }
  }

  drawGlassOutline(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(131.914 + x, 181.498 + y);
    ctx.lineTo(154.959 + x, 9.41942 + y);
    ctx.lineTo(154.942 + x, 9.40264 + y);
    ctx.bezierCurveTo(154.942 + x, 4.2097 + y, 120.26 + x, 0 + y, 77.4791 + x, 0 + y);
    ctx.bezierCurveTo(34.6978 + x, 0 + y, 0.0168166 + x, 4.2097 + y, 0.0168166 + x, 9.40264 + y);
    ctx.lineTo(0 + x, 9.41509 + y);
    ctx.lineTo(21.5407 + x, 181.493 + y);
    ctx.bezierCurveTo(21.5407 + x, 181.493 + y, 26.7339 + x, 183.54 + y, 36.0109 + x, 185.616 + y);
    ctx.bezierCurveTo(44.1173 + x, 187.393 + y, 55.3018 + x, 189.166 + y, 68.8703 + x, 189.57 + y);
    ctx.bezierCurveTo(86.3925 + x, 190.142 + y, 107.898 + x, 188.399 + y, 131.914 + x, 181.498 + y);
    ctx.closePath();
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  handleGameOver() {
    console.log("Игра завершена!");
    this.isGameOver = true;
    if (this.finishCallback) {
      const gameData = {
        days: this.consecutiveDays,
      };
      this.finishCallback(gameData);
    }
    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  setFinishCallback(callback) {
    this.finishCallback = callback;
  }

  static getInstance(tmp) {
    return tmp.engine;
  }

  getTmp() {
    return this.tmp;
  }
}

function init(canvas, initGameData, tmp, finish_func = (gameData) => { }) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finish_func);

  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop();
}

export { init, deinit };