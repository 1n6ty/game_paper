const __VERSION__ = "6.2";

const PATH = "/media/assets/healthTracker/";
const glassUrl = `${PATH}glass.svg`;
const decorationsUrl = `${PATH}decorations.svg`;
const fillingUrl = `${PATH}filling.svg`;

const GLASS_WIDTH = 179.77;
const GLASS_HEIGHT = 259;
const FILLING_WIDTH = 154.96;
const FILLING_HEIGHT = 208.68;
const DECOR_WIDTH = 425.1;
const DECOR_HEIGHT = 473;
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

const MAX_CANVAS_WIDTH = 425;
const BASE_ASPECT = 845 / MAX_CANVAS_WIDTH;
const baseDimensions = {
  width: MAX_CANVAS_WIDTH,
  height: Math.floor(MAX_CANVAS_WIDTH * BASE_ASPECT),
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      resolve(null); // fallback – вернуть null
    };
  });
}

class GameEngine {
  constructor(canvas, init_game_data, tmp) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp || {};
    this.tmp.engine = this;

    this.consecutiveDays = parseInt(init_game_data.consecutiveDays || "0", 10);
    this.currentFillLevel = 0;
    this.targetFillLevel = this.consecutiveDays;

    // Флаг игры – используется для остановки анимации, если игра завершена
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

  /* Метод динамического масштабирования canvas */
  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const parentWidth = parent.clientWidth;
    const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
    const newHeight = Math.floor(newWidth * BASE_ASPECT);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
  }

  /* Обработчик клика по стакану */
  handleClick(e) {
    // Определяем координаты клика с учетом масштабирования
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;

    // Определяем прямоугольную область стакана (центрирован по горизонтали, внизу)
    const canvasWidth = baseDimensions.width;
    const canvasHeight = baseDimensions.height;
    const glassX = (canvasWidth - GLASS_WIDTH) / 2;
    const glassY = canvasHeight - GLASS_HEIGHT - 50; // 50px от низа как отступ
    if (
      x >= glassX &&
      x <= glassX + GLASS_WIDTH &&
      y >= glassY &&
      y <= glassY + GLASS_HEIGHT
    ) {
      console.log("Стакан нажат");
      // При клике обновляем целевой уровень (но не выше TOTAL_DAYS)
      if (this.targetFillLevel < TOTAL_DAYS) {
        this.targetFillLevel++;
      }
    }
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
    // this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  drawScene() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = baseDimensions;
    this.ctx.clearRect(0, 0, width, height);

    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, BG_TOP_COLOR);
    bgGradient.addColorStop(1, BG_BOTTOM_COLOR);
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    if (this.images.decorations) {
      const decorX = (width - DECOR_WIDTH) / 2;
      const decorY = height - DECOR_HEIGHT;
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

    const { width } = baseDimensions;
    const cardX = INSTRUCTION_CARD_HORIZONTAL_PADDING;
    const cardY = 20;
    const cardW = width - INSTRUCTION_CARD_HORIZONTAL_PADDING * 2;
    const cardH = 183;

    // Отрисовка фона карточки
    this.ctx.fillStyle = INSTRUCTION_CARD_COLOR;
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();

    // Отрисовка заголовка
    this.ctx.fillStyle = TITLE_COLOR;
    this.ctx.font = "700 20px Roboto";
    this.ctx.fillText("Трекер здоровья", cardX + TEXT_PADDING, cardY + 30);

    // Текст инструкции
    const instructionText = "Наполняй стакан молоком каждый день! Не забывай нажимать на него — только так он будет заполняться. Пропустишь день, и стакан опустеет. Заполни его за 7 дней подряд и получи билет!";

    // Вычисляем максимальную ширину текста в карточке
    const maxTextWidth = cardW - TEXT_PADDING * 2;

    // Функция для переноса текста
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

    // Устанавливаем шрифт для первой строки (жирный)
    this.ctx.font = "600 16px Roboto";
    // Для первой части текста можно взять часть до первого знака "!" как жирную
    const boldEnd = instructionText.indexOf("!") + 1;
    const boldText = instructionText.substring(0, boldEnd);
    const normalText = instructionText.substring(boldEnd).trim();

    // Получаем массив строк для жирного текста
    const boldLines = wrapText(this.ctx, boldText, maxTextWidth);
    // Устанавливаем обычный шрифт для оставшегося текста
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

    const { width } = baseDimensions;
    const cardX = DAYS_CARD_HORIZONTAL_PADDING;
    const cardY = 219;
    const cardW = width - DAYS_CARD_HORIZONTAL_PADDING * 2;
    const cardH = 75;
    this.ctx.fillStyle = DAYS_CARD_COLOR;
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();

    const circleRadius = 22.5;
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
    }
  }

  drawGlass() {
    const GLASS_GAP = 81;

    const { width, height } = baseDimensions;
    const centerX = width / 2;
    const bottomY = height - GLASS_GAP;
    const glassX = centerX - GLASS_WIDTH / 2;
    const glassY = bottomY - GLASS_HEIGHT;

    // Отрисовка контура стакана
    if (this.images.glass) {
      this.ctx.drawImage(this.images.glass, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    }

    // Отрисовка заливки стакана с клиппингом по контуру
    const fillPercent = Math.min(this.currentFillLevel / TOTAL_DAYS, 1);
    const fillHeight = FILLING_HEIGHT * fillPercent;
    const fillY = glassY + (GLASS_HEIGHT - fillHeight);
    if (this.images.filling) {
      this.ctx.save();
      // this.ctx.beginPath();
      // Используем roundRect для создания пути, соответствующего контуру стакана,
      // чтобы заливка обрезалась по краям.
      // this.roundRect(this.ctx, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT, 10);
      // this.drawCurvedTrapezoid(this.ctx, glassX, glassY, GLASS_HEIGHT, 100, fillHeight, 20);
      this.ctx.fillStyle = "#FF22AA";
      this.ctx.fill();
      // this.ctx.closePath()
      // this.ctx.clip();
      this.ctx.drawImage(this.images.filling, glassX, fillY, FILLING_WIDTH, fillHeight);
      this.ctx.restore();
    }
  }

  /**
      * Рисует трапецию с изогнутой нижней стороной.
      *
      * @param {CanvasRenderingContext2D} ctx - контекст рисования canvas.
      * @param {number} x - координата X верхнего левого угла трапеции.
      * @param {number} y - координата Y верхнего левого угла трапеции.
      * @param {number} topWidth - ширина верхней стороны.
      * @param {number} bottomWidth - ширина нижней стороны.
      * @param {number} height - высота трапеции.
      * @param {number} curveDepth - величина изгиба нижней стороны.
      */
  drawCurvedTrapezoid(ctx, x, y, topWidth, bottomWidth, height, curveDepth) {
    // Расчёт отступов для нижней стороны
    const deltaWidth = (bottomWidth - topWidth) / 2;

    ctx.beginPath();
    // верхняя сторона: от (x, y) до (x + topWidth, y)
    ctx.moveTo(x, y);
    ctx.lineTo(x + topWidth, y);

    // правая боковая сторона (без изгиба): до (x + topWidth + deltaWidth, y + height)
    ctx.lineTo(x + topWidth + deltaWidth, y + height - curveDepth);

    // нижняя изогнутая сторона: создадим кривую Безье
    // Контрольные точки определены для создания мягкой кривизны.
    ctx.quadraticCurveTo(
      x + topWidth + deltaWidth, y + height,                // контрольная точка
      x + topWidth + deltaWidth + curveDepth, y + height      // конечная точка правой части кривой
    );

    // затем – к левой части нижней стороны.
    ctx.quadraticCurveTo(
      x + deltaWidth, y + height,                            // контрольная точка
      x + deltaWidth - curveDepth, y + height                // конечная точка левой части кривой
    );

    // левая боковая сторона: поднимаемся к (x, y + height - curveDepth)
    ctx.lineTo(x, y + height - curveDepth);

    // замыкаем контур
    ctx.closePath();

    // Настройка стиля обводки и заливки
    ctx.fillStyle = "#cceeff";
    ctx.strokeStyle = "#3366aa";
    ctx.lineWidth = 3;

    ctx.fill();
    ctx.stroke();
  }

  /* Вспомогательная функция для рисования скруглённого прямоугольника */
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
    this.isGameOver = true;
    if (this.finishCallback) {
      const game_data = {
        days: this.consecutiveDays,
      };
      this.finishCallback(game_data);
    }
    cancelAnimationFrame(this.gameLoopId);
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

function init(canvas, init_game_data, tmp) {
  console.log("Version:", __VERSION__);
  const engine = new GameEngine(canvas, init_game_data, tmp);
  return engine.getTmp();
}

function proceed(canvas, tmp, finish_func = (game_data) => { }) {
  const engine = GameEngine.getInstance(tmp);
  engine.setFinishCallback(finish_func);
  engine.gameLoop();
  return tmp;
}

function finish(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop();
}

export { init, proceed, finish };