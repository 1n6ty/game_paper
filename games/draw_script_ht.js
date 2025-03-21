/***********************************************************************
 * draw_script.js
 * Версия: __VERSION__
 * 
 * Игра "Трекер здоровья". В этой игре пользователь каждый день 
 * нажимает на стакан (изображённый SVG), который постепенно заполняется.
 * При заполнении стакана за 7 дней подряд (серверная логика) игрок получает билет.
 * 
 * Ассеты:
 *   - glass: изображение контура стакана (179×259)
 *   - decorations: изображение украшений (480×473)
 *   - filling: изображение заливки стакана (будет отрисовываться частично
 *     в зависимости от числа заполненных дней)
 *
 * Дизайн:
 *   - Задний фон игры – градиент от #D1E8FF (верх) до #FFFFFF (низ).
 *   - Карточка с числом дней имеет фон "#FFFFFF4D", а индикаторы дней рисуются
 *     согласно двум состояниям (заполнен/не заполнен) с заданными стилями.
 *
 * При динамическом масштабировании canvas изначально задаётся максимальный размер,
 * а при уменьшении ширины родительского элемента canvas масштабируется вниз.
 *
 * Сервер передаёт init_game_data с полем consecutiveDays (число дней подряд).
 * Клиент хранит targetFillLevel = consecutiveDays, а currentFillLevel анимируется
 * до этого значения.
 ***********************************************************************/

const __VERSION__ = 2;

/* === Параметры ассетов и размеры === */
const PATH = "/media/assets/healthTracker/";
const glassUrl = `${PATH}glass.svg`;        // Стакан (контур)
const decorationsUrl = `${PATH}decorations.svg`;  // Украшения
const fillingUrl = `${PATH}filling.svg`;        // Изображение заливки стакана

// Размеры элементов (в пикселях)
const GLASS_WIDTH = 179.77;
const GLASS_HEIGHT = 259;
const DECOR_WIDTH = 480.1;
const DECOR_HEIGHT = 473;
const TOTAL_DAYS = 7;  // всего дней для заполнения

// Цвета и стили для заднего фона и для карточки с индикаторами
const BG_TOP_COLOR = "#D1E8FF";
const BG_BOTTOM_COLOR = "#FFFFFF";
const DAYS_CARD_BG = "#FFFFFF4D";

const DAY_EMPTY_BORDER = "#9FBACF";
const DAY_EMPTY_FILL = "#FFFFFF";
const DAY_FILLED_BORDER = "#9AD99D";
const DAY_FILLED_FILL = "#9AD99D";
const DAY_TEXT_EMPTY = "#9FBACF";
const DAY_TEXT_FILLED = "#FFFFFF";

/* === Размеры canvas === */
const MAX_CANVAS_WIDTH = 428;
const BASE_ASPECT = 720 / MAX_CANVAS_WIDTH;  // исходное соотношение
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

    // Сервер передаёт число дней подряд в init_game_data.consecutiveDays
    // Если не передано, по умолчанию 0.
    this.consecutiveDays = parseInt(init_game_data.consecutiveDays || "0", 10);
    // Для анимации заполнения: текущий уровень заливки (начинается с 0)
    this.currentFillLevel = 0;
    // Целевой уровень заливки равен consecutiveDays
    this.targetFillLevel = this.consecutiveDays;

    // Флаг игры – используется для остановки анимации, если игра завершена
    this.isGameOver = false;
    this.gameLoopId = null;
    this.finishCallback = () => { };

    // Привязываем обработчики событий
    this.boundHandleClick = (e) => this.handleClick(e);
    this.canvas.addEventListener("click", this.boundHandleClick);

    // this.boundResizeCanvas = () => this.resizeCanvas();
    // window.addEventListener("resize", this.boundResizeCanvas);
    // this.resizeCanvas();

    this.lastFrameTime = performance.now();
    this.startGameLoop();

    this.images = {};
    this.loadAssets();
  }

  /* Метод динамического масштабирования canvas */
  // resizeCanvas() {
  //   const parent = this.canvas.parentElement;
  //   if (!parent) return;
  //   const parentWidth = parent.clientWidth;
  //   const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
  //   const newHeight = Math.floor(newWidth * BASE_ASPECT);
  //   const dpr = window.devicePixelRatio || 1;
  //   this.canvas.width = newWidth * dpr;
  //   this.canvas.height = newHeight * dpr;
  //   this.canvas.style.width = `${newWidth}px`;
  //   this.canvas.style.height = `${newHeight}px`;
  // }

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

  /* Загрузка ассетов */
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

  /* Игровой цикл – для анимации заполнения стакана */
  startGameLoop() {
    this.lastFrameTime = performance.now();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    if (this.isGameOver) return;
    const now = performance.now();
    let dt = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    dt = Math.min(dt, 0.1);

    // Анимация заполнения стакана: плавное приближение currentFillLevel к targetFillLevel
    const fillSpeed = 2; // уровней в секунду
    if (this.currentFillLevel < this.targetFillLevel) {
      this.currentFillLevel += fillSpeed * dt;
      if (this.currentFillLevel > this.targetFillLevel) {
        this.currentFillLevel = this.targetFillLevel;
      }
    }
    this.drawScene();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  /* Метод отрисовки всей сцены */
  drawScene() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = baseDimensions;
    this.ctx.clearRect(0, 0, width, height);

    // Задний фон – градиент от BG_TOP_COLOR до BG_BOTTOM_COLOR
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, BG_TOP_COLOR);
    bgGradient.addColorStop(1, BG_BOTTOM_COLOR);
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    // Отрисовка украшений (если ассет загружен) – центрирован
    if (this.images.decorations) {
      const decorW = DECOR_WIDTH;
      const decorH = DECOR_HEIGHT;
      const decorX = (width - decorW) / 2;
      const decorY = height - decorH; // отступ сверху
      this.ctx.drawImage(this.images.decorations, decorX, decorY, decorW, decorH);
    }

    // Отрисовка карточки с заголовком и инструкцией (текстовые элементы)
    this.drawInstructionCard();

    // Отрисовка карточки с 7 индикаторами (дней)
    this.drawDaysCard();

    // Отрисовка стакана (контур) и заливки
    this.drawGlass();

    this.ctx.restore();
  }

  drawInstructionCard() {
    // Пример отрисовки карточки с заголовком и инструкцией
    // Координаты и размеры задаются относительно baseDimensions
    const { width } = baseDimensions;
    const cardX = 20, cardY = 20, cardW = width - 29, cardH = 183;
    // Фон карточки
    this.ctx.fillStyle = "#FFFFFF";
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();
    // Заголовок
    this.ctx.fillStyle = "#779FBD";
    this.ctx.font = "700 20px Roboto";
    this.ctx.fillText("Трекер здоровья", cardX + 16, cardY + 30);
    // Инструкция (часть жирная)
    this.ctx.font = "600 16px Roboto";
    const lines = [
      "Наполняй бутылку молоком каждый день!",
      "Не забывай нажимать на неё — только так она будет заполняться.",
      "Пропустишь день, и бутылка опустеет.",
      "Заполни её за 7 дней подряд и получи билет!"
    ];
    let offset = 0;
    lines.forEach((line) => {
      this.ctx.fillText(line, cardX + 15, cardY + 80 + offset);
      offset += 20;
    });
  }

  drawDaysCard() {
    // Рисуем карточку с 7 индикаторами дней
    const { width } = baseDimensions;
    const cardX = 20, cardY = 230, cardW = width - 40, cardH = 70;
    this.ctx.fillStyle = DAYS_CARD_BG;
    this.roundRect(this.ctx, cardX, cardY, cardW, cardH, 16);
    this.ctx.fill();

    const circleRadius = 22.5;
    const spacing = (cardW - 14 * circleRadius) / (TOTAL_DAYS + 1);
    let xPos = cardX + spacing + circleRadius;
    // Используем this.consecutiveDays, полученное от сервера
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
      this.ctx.font = "500 20px 'Roboto Mono'";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(i.toString(), xPos, cardY + cardH / 2);
      xPos += (circleRadius * 2 + spacing);
    }
  }

  drawGlass() {
    // Рисуем стакан и его заполнение
    const { width, height } = baseDimensions;
    const centerX = width / 2;
    const bottomY = height - 50; // отступ от низа
    const glassX = centerX - GLASS_WIDTH / 2;
    const glassY = bottomY - GLASS_HEIGHT;

    // Отрисовка контура стакана
    if (this.images.glass) {
      this.ctx.drawImage(this.images.glass, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    } else {
      // fallback: рисуем прямоугольник
      // this.ctx.strokeStyle = "#CCCCCC";
      // this.ctx.strokeRect(glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    }

    // Отрисовка заливки стакана
    // Вычисляем процент заполнения: currentFillLevel (0..TOTAL_DAYS)
    const fillPercent = Math.min(this.currentFillLevel / TOTAL_DAYS, 1);
    const fillHeight = GLASS_HEIGHT * fillPercent;
    const fillY = glassY + (GLASS_HEIGHT - fillHeight);

    if (this.images.filling) {
      // Используем clipping: рисуем filling внутри стакана
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
      this.ctx.clip();
      this.ctx.drawImage(this.images.filling, glassX, fillY, GLASS_WIDTH, fillHeight);
      this.ctx.restore();
    } else {
      // this.ctx.fillStyle = "#9AD99D"; // зелёная заливка
      // this.ctx.fillRect(glassX, fillY, GLASS_WIDTH, fillHeight);
    }
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

  // Остановка игры (например, при завершении)
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

/* === Экспорт API для взаимодействия с серверной частью === */
export { init, proceed, finish };

function init(canvas, init_game_data, tmp) {
  console.log("Version: " + __VERSION__);
  const engine = new GameEngine(canvas, init_game_data, tmp);
  return engine.getTmp();
}

function proceed(canvas, tmp, finish_func = (game_data) => { }) {
  const engine = GameEngine.getInstance(tmp);
  engine.setFinishCallback(finish_func);
  return tmp;
}

function finish(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop();
}
