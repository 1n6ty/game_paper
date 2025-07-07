const __VERSION__ = "19.5-optimized-v3-final";

// ===================================================================================
// КОНФИГУРАЦИЯ ИГРЫ (ВСЕ "МАГИЧЕСКИЕ" ЧИСЛА ВЫНЕСЕНЫ СЮДА)
// ===================================================================================

const ASSET_PATHS = {
  base: "/media/assets/milkyFly/",
  // base: "./assets/milkyFly/",
  get: fileName => ASSET_PATHS.base + fileName,
};

const ASSETS = {
  ceilEvening: "ceilEvening",
  ceilSunset: "ceilSunset",
  ceilSunrise: "ceilSunrise",
  ceilDay: "ceilDay",
  ceilMorning: "ceilMorning",
};

const GAME_CONFIG = {
  MAX_CANVAS_WIDTH: 428,
  MAX_CANVAS_HEIGHT: 774,
  DEFAULT_FLOOR_HEIGHT: 36,
  INITIAL_SPEED: 2.3,
  SPEED_MULTIPLIER: 1.2,
  // Ограничение DT, чтобы избежать огромных "прыжков" после долгой неактивности вкладки (в секундах)
  // Например, 1/15 ~ 66мс, игра не будет симулировать более 66мс за один кадр.
  MAX_DELTA_TIME: 1 / 15,
};

const PLAYER_CONFIG = {
  WIDTH: 94.65,
  HEIGHT: 64.96,
  GRAVITY: 0.6,
  JUMP_FORCE: -10,
  ROTATION_FALL_ANGLE: 90,
  ROTATION_JUMP_ANGLE: -15,
  ROTATION_SPEED: 2,
  COLLISION_OFFSET: 28,
};

const PIPE_CONFIG = {
  WIDTH: 66,
  GAP: 192,
  SPAWN_INTERVAL: 100, // Базовый интервал
  SPECIAL_PIPE_EVERY: 10,
  ACCELERATE_EVERY: 10,
};

const PARALLAX_CONFIG = {
  CLOUDS_SPEED: 0.01,
  BUSHES_DARK_SPEED: 0.03,
  BUSHES_LIGHT_SPEED: 0.08,
  GROUND_SPEED: 1.0,
};

const UI_CONFIG = {
  CEIL_DRAW_HEIGHT: 33,
  FLOOR_DRAW_HEIGHT: 36,
  TUTORIAL_TEXT: "Тап👆",
  SCORE_FONT: "500 48px Roboto Mono",
  BEST_SCORE_FONT: "500 15px Roboto Mono",
  TEXT_COLOR_WHITE: "white",
  TEXT_COLOR_DARK: "#4b4949",
};

const TUTORIAL_CONFIG = {
  SWING_AMPLITUDE: 50, // px
  SWING_PERIOD: 2.5,   // seconds
  FLOAT_AMPLITUDE: 15, // px
  FLOAT_SPEED: 3,
  TEXT_SWING_AMPLITUDE: 0.1, // radians
  TEXT_SWING_PERIOD: 2,      // seconds
};

// Массив вариантов фона [ключ потолка, [цвет_верх, цвет_середина, цвет_низ]]
const BACKGROUND_DEFINITIONS = [
  [ASSETS.ceilEvening, ["#67AAEB", "#D3E8FF", "#FFFFFF"]],
  [ASSETS.ceilSunset, ["#67AAEB", "#F7CDCE", "#FFFFFF"]],
  [ASSETS.ceilSunrise, ["#97A0FF", "#D1E8FF", "#FFFFFF"]],
  [ASSETS.ceilDay, ["#A1D1FF", "#D1E8FF", "#FFFFFF"]],
  [ASSETS.ceilMorning, ["#AED7FF", "#D9ECFF", "#FEEEEF"]],
];

// ===================================================================================
// КОНЕЦ КОНФИГУРАЦИИ
// ===================================================================================

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
  constructor(canvas, initGameData, tmp) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });

    this.tmp = tmp || {};
    this.tmp.engine = this;

    const seed = initGameData.seed || Date.now().toString(16);
    console.log("Seed:", seed);
    this.randomGenerator = new LCG(seed);
    this.bestScore = initGameData.best_score;
    console.log("Лучший счет:", this.bestScore);

    const entrances = parseInt(initGameData.entrances);
    this.tutorialActive = entrances && entrances <= 3;
    this.tutorialTimer = 0;
    console.log("Число посещений:", entrances);
    console.log("Туториал активен:", this.tutorialActive);

    this.dimensions = { width: GAME_CONFIG.MAX_CANVAS_WIDTH, height: GAME_CONFIG.MAX_CANVAS_HEIGHT };
    this.inTime = null;
    this.lastTime = 0;

    this.playerHalfWidth = PLAYER_CONFIG.WIDTH / 2;
    this.playerHalfHeight = PLAYER_CONFIG.HEIGHT / 2;
    this.cappedDpr = Math.min(window.devicePixelRatio || 1, 2);

    this.pipePool = [];
    this.pipePoolSize = 10;

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");

    this.state = {
      speed: GAME_CONFIG.INITIAL_SPEED,
      pipeSpawnTimer: 0,
      cloudsX: 0,
      bushesDarkX: 0,
      bushesLightX: 0,
      groundX: 0,
      player: {
        x: this.dimensions.width / 2,
        y: this.dimensions.height / 2,
        velocity: 0,
        frameCounter: 0,
        currentFrame: 0,
        rotation: 0,
        floatOffset: 0,
      },
      ...(() => {
        const index = Math.floor(this.randomGenerator.random() * BACKGROUND_DEFINITIONS.length);
        return {
          selectedCeiling: BACKGROUND_DEFINITIONS[index][0],
          selectedGradient: BACKGROUND_DEFINITIONS[index][1],
        };
      })(),
      pipeCount: 0,
      passedPipes: 0,
      lastAccelerated: 0,
      isStarted: false,
      isGameOver: false,
    };

    this.gameLoopId = null;
    this.finishCb = () => { };

    this.images = {};
    this.isResizing = false;
    this.resizeTimer = null;

    this.loadAssets().then(() => {
      this.initPipePool();
      this.setupEventListeners();
      this.resizeCanvas(true);
      this.preRenderBackground();
      this.onAssetsLoaded();
    });
  }

  initPipePool() {
    for (let i = 0; i < this.pipePoolSize; i++) {
      this.pipePool.push({
        x: 0, top: 0, bottom: 0, width: PIPE_CONFIG.WIDTH,
        special: false, passed: false, active: false,
      });
    }
  }

  setupEventListeners() {
    this.boundHandleJump = e => this.handleJump(e);
    window.addEventListener("keydown", this.boundHandleJump);
    this.canvas.addEventListener("touchstart", this.boundHandleJump);

    this.boundResizeCanvas = () => this.resizeCanvas();
    window.addEventListener("resize", this.boundResizeCanvas);
  }

  resizeCanvas(isInitialSetup = false) {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.isResizing = true;

    const GAP_FOR_GROUND = 60;
    const newWidth = Math.min(parent.clientWidth, GAME_CONFIG.MAX_CANVAS_WIDTH);
    const newHeight = Math.min(parent.clientHeight - GAP_FOR_GROUND, GAME_CONFIG.MAX_CANVAS_HEIGHT);

    this.dimensions.width = newWidth;
    this.dimensions.height = newHeight;

    const dpr = this.cappedDpr;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;

    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;

    if (!isInitialSetup) {
      this.resizeTimer = setTimeout(() => this.resizeCanvasEnd(), 250);
    } else {
      this.isResizing = false;
    }
  }

  resizeCanvasEnd() {
    console.log("Resize END");
    this.isResizing = false;
    this.preRenderBackground();
  }

  preRenderBackground() {
    const { width, height } = this.dimensions;
    const dpr = this.cappedDpr;

    this.offscreenCtx.save();
    this.offscreenCtx.scale(dpr, dpr);

    const gradient = this.offscreenCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, this.state.selectedGradient[0]);
    gradient.addColorStop(0.5, this.state.selectedGradient[1]);
    gradient.addColorStop(1, this.state.selectedGradient[2]);
    this.offscreenCtx.fillStyle = gradient;
    this.offscreenCtx.fillRect(0, 0, width, height);
    this.offscreenCtx.restore();
  }

  handleJump(e) {
    if (e.type === "keydown" && e.code !== "Space") return;
    if (!this.inTime) this.inTime = Date.now();
    const st = this.state;
    if (st.isGameOver) return;
    if (!st.isStarted) st.isStarted = true;
    st.player.velocity = PLAYER_CONFIG.JUMP_FORCE;
    st.player.frameCounter = 0;
  }

  onAssetsLoaded() {
    if (this.assetsLoadedCb) this.assetsLoadedCb();
    this.startGameLoop();
  }

  async loadAssets() {
    const assetMap = {
      clouds: ASSET_PATHS.get("clouds.svg"),
      bushesDark: ASSET_PATHS.get("bushesDark.svg"),
      bushesLight: ASSET_PATHS.get("bushesLight.svg"),
      grass: ASSET_PATHS.get("grass.svg"),
      pipeDefault: ASSET_PATHS.get("pipeDefault.svg"),
      pipeSpecial: ASSET_PATHS.get("pipeSpecial.svg"),
      playerIdle: ASSET_PATHS.get("cowIdle.svg"),
      playerPressed: ASSET_PATHS.get("cowPressed.svg"),
      ceilEvening: ASSET_PATHS.get("ceil_evening.svg"),
      ceilSunset: ASSET_PATHS.get("ceil_sunset.svg"),
      ceilSunrise: ASSET_PATHS.get("ceil_sunrise.svg"),
      ceilDay: ASSET_PATHS.get("ceil_day.svg"),
      ceilMorning: ASSET_PATHS.get("ceil_morning.svg"),
    };
    const promises = Object.entries(assetMap).map(([key, url]) =>
      loadImage(url).then(img => ({ key, img }))
    );
    const results = await Promise.all(promises);
    results.forEach(({ key, img }) => { this.images[key] = img; });
  }

  startGameLoop() {
    console.log("Start GameLoop");
    this.lastTime = performance.now();
    this.gameLoopId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
  }

  gameLoop(timestamp) {
    if (this.state.isGameOver) return;

    // Убираем ограничение 'dt', чтобы симуляция была верной на медленных устройствах.
    // Вместо этого ограничиваем максимальный шаг, чтобы избежать "прыжка" после долгой неактивности.
    const dt = Math.min((timestamp - this.lastTime) / 1000, GAME_CONFIG.MAX_DELTA_TIME);
    this.lastTime = timestamp;

    this.updateLogic(dt);
    this.drawScene();
    this.gameLoopId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
  }

  stopGameLoop() {
    console.log("Stop GameLoop");
    window.removeEventListener("keydown", this.boundHandleJump);
    this.canvas.removeEventListener("touchstart", this.boundHandleJump);
    window.removeEventListener("resize", this.boundResizeCanvas);
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  updateParallax(timeScale) {
    const st = this.state;
    st.cloudsX = (st.cloudsX - st.speed * PARALLAX_CONFIG.CLOUDS_SPEED * timeScale) % GAME_CONFIG.MAX_CANVAS_WIDTH;
    st.bushesDarkX = (st.bushesDarkX - st.speed * PARALLAX_CONFIG.BUSHES_DARK_SPEED * timeScale) % GAME_CONFIG.MAX_CANVAS_WIDTH;
    st.bushesLightX = (st.bushesLightX - st.speed * PARALLAX_CONFIG.BUSHES_LIGHT_SPEED * timeScale) % GAME_CONFIG.MAX_CANVAS_WIDTH;
    st.groundX = (st.groundX - st.speed * PARALLAX_CONFIG.GROUND_SPEED * timeScale) % GAME_CONFIG.MAX_CANVAS_WIDTH;
  }

  animatePlayer(timeScale, dt) {
    const st = this.state;
    if (!st.isStarted) {
      this.tutorialTimer += dt;
      if (this.tutorialActive) {
        st.player.y = this.dimensions.height / 2 - (TUTORIAL_CONFIG.SWING_AMPLITUDE * Math.sin(Math.PI * (this.tutorialTimer % TUTORIAL_CONFIG.SWING_PERIOD) / TUTORIAL_CONFIG.SWING_PERIOD));
      } else {
        st.player.y = this.dimensions.height / 2 + Math.sin(this.tutorialTimer * TUTORIAL_CONFIG.FLOAT_SPEED) * TUTORIAL_CONFIG.FLOAT_AMPLITUDE;
      }

      return;
    }

    st.player.velocity += PLAYER_CONFIG.GRAVITY * timeScale;
    st.player.y += st.player.velocity * timeScale;
    st.player.rotation = st.player.velocity > 0
      ? Math.min(PLAYER_CONFIG.ROTATION_FALL_ANGLE, st.player.rotation + PLAYER_CONFIG.ROTATION_SPEED * timeScale)
      : PLAYER_CONFIG.ROTATION_JUMP_ANGLE;
    st.player.frameCounter += timeScale;
    if (st.player.frameCounter >= (st.player.velocity > 2 ? 3 : 5)) {
      st.player.currentFrame = (st.player.currentFrame + 1) % 2;
      st.player.frameCounter = 0;
    }
  }

  generateTubes() {
    const st = this.state;
    if (!st.isStarted) return;
    const PIPE_SPAWN_INTERVAL = PIPE_CONFIG.SPAWN_INTERVAL / (GAME_CONFIG.INITIAL_SPEED * 0.4);
    while (st.pipeSpawnTimer >= PIPE_SPAWN_INTERVAL) {
      st.pipeSpawnTimer -= PIPE_SPAWN_INTERVAL;
      let pipe = this.pipePool.find(p => !p.active);
      if (pipe) {
        const minTubeTop = this.dimensions.height / 4;
        const maxTubeTop = this.dimensions.height / 2;
        st.pipeCount++;
        const topHeight = Math.floor(this.randomGenerator.random() * (maxTubeTop - minTubeTop)) + minTubeTop;
        pipe.active = true;
        pipe.passed = false;
        pipe.x = this.dimensions.width;
        pipe.top = topHeight;
        pipe.bottom = topHeight + PIPE_CONFIG.GAP;
        pipe.special = (st.pipeCount % PIPE_CONFIG.SPECIAL_PIPE_EVERY === 0);
      }
    }
  }

  moveTubesAndCheckScore() {
    const st = this.state;
    if (!st.isStarted) return;
    for (let pipe of this.pipePool) {
      if (!pipe.active) continue;
      pipe.x -= st.speed;
      if (pipe.x + pipe.width < 0) {
        pipe.active = false;
        continue;
      }

      if (!pipe.passed && pipe.x + PIPE_CONFIG.WIDTH < st.player.x) {
        pipe.passed = true;
        st.passedPipes++;
        if (st.passedPipes > 0
          && st.passedPipes % PIPE_CONFIG.ACCELERATE_EVERY === 0
          && st.lastAccelerated !== st.passedPipes) {
          st.speed *= GAME_CONFIG.SPEED_MULTIPLIER;
          st.lastAccelerated = st.passedPipes;
        }
      }
    }
  }

  detectCollisions() {
    if (this.isResizing || !this.state.isStarted) return;
    const st = this.state;

    // Проверка столкновения с потолком и полом
    if (st.player.y - this.playerHalfHeight < 0 || st.player.y + this.playerHalfHeight > this.dimensions.height - GAME_CONFIG.DEFAULT_FLOOR_HEIGHT) {
      this.handleGameOver();
      return;
    }

    const scaleX = this.dimensions.width / GAME_CONFIG.MAX_CANVAS_WIDTH;
    const playerX = st.player.x * scaleX;
    const playerY = st.player.y;
    const collisionOffset = PLAYER_CONFIG.COLLISION_OFFSET;

    for (let pipe of this.pipePool) {
      if (!pipe.active) continue;
      if (playerX + collisionOffset > pipe.x && playerX - collisionOffset < pipe.x + pipe.width &&
        (playerY - collisionOffset < pipe.top || playerY + collisionOffset > pipe.bottom)) {
        this.handleGameOver();
        return;
      }
    }
  }

  updateLogic(dt) {
    const timeScale = dt * 60;
    this.state.pipeSpawnTimer += timeScale;
    this.updateParallax(timeScale);
    this.animatePlayer(timeScale, dt);
    this.generateTubes();
    this.moveTubesAndCheckScore();
    this.detectCollisions();
  }

  drawScene() {
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);

    this.ctx.save();
    this.ctx.scale(this.cappedDpr, this.cappedDpr);

    const { width, height } = this.dimensions;
    const st = this.state;
    const img = this.images;
    const floorY = height - GAME_CONFIG.DEFAULT_FLOOR_HEIGHT;

    // Параллакс-слои
    if (img.clouds) {
      this.ctx.drawImage(img.clouds, st.cloudsX, floorY - 237, GAME_CONFIG.MAX_CANVAS_WIDTH, 387);
      this.ctx.drawImage(img.clouds, st.cloudsX + GAME_CONFIG.MAX_CANVAS_WIDTH, floorY - 237, GAME_CONFIG.MAX_CANVAS_WIDTH, 387);
    }

    if (img.bushesDark) {
      this.ctx.drawImage(img.bushesDark, st.bushesDarkX, floorY - 78, GAME_CONFIG.MAX_CANVAS_WIDTH, 228);
      this.ctx.drawImage(img.bushesDark, st.bushesDarkX + GAME_CONFIG.MAX_CANVAS_WIDTH, floorY - 78, GAME_CONFIG.MAX_CANVAS_WIDTH, 228);
    }

    if (img.bushesLight) {
      this.ctx.drawImage(img.bushesLight, st.bushesLightX, floorY - 52, GAME_CONFIG.MAX_CANVAS_WIDTH, 202);
      this.ctx.drawImage(img.bushesLight, st.bushesLightX + GAME_CONFIG.MAX_CANVAS_WIDTH, floorY - 52, GAME_CONFIG.MAX_CANVAS_WIDTH, 202);
    }

    // Трубы из пула
    for (let pipe of this.pipePool) {
      if (!pipe.active) continue;
      const pipeImg = pipe.special ? img.pipeSpecial : img.pipeDefault;
      if (!pipeImg) continue;
      const scaledPipeHeight = pipe.width * (pipeImg.naturalHeight / pipeImg.naturalWidth);
      // Верхняя труба (перевернутая)
      this.ctx.save();
      this.ctx.translate(pipe.x, pipe.top);
      this.ctx.scale(1, -1);
      this.ctx.drawImage(pipeImg, 0, 0, pipe.width, scaledPipeHeight);
      this.ctx.restore();
      // Нижняя труба
      this.ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, scaledPipeHeight);
    }

    // Потолок и пол
    const ceilingImg = img[st.selectedCeiling];
    if (ceilingImg) {
      this.ctx.drawImage(ceilingImg, st.groundX, 0, GAME_CONFIG.MAX_CANVAS_WIDTH, UI_CONFIG.CEIL_DRAW_HEIGHT);
      this.ctx.drawImage(ceilingImg, st.groundX + GAME_CONFIG.MAX_CANVAS_WIDTH, 0, GAME_CONFIG.MAX_CANVAS_WIDTH, UI_CONFIG.CEIL_DRAW_HEIGHT);
    }

    if (img.grass) {
      this.ctx.drawImage(img.grass, st.groundX, floorY, GAME_CONFIG.MAX_CANVAS_WIDTH, UI_CONFIG.FLOOR_DRAW_HEIGHT);
      this.ctx.drawImage(img.grass, st.groundX + GAME_CONFIG.MAX_CANVAS_WIDTH, floorY, GAME_CONFIG.MAX_CANVAS_WIDTH, UI_CONFIG.FLOOR_DRAW_HEIGHT);
    }

    // Корова
    this.ctx.save();
    const scaleX = this.dimensions.width / GAME_CONFIG.MAX_CANVAS_WIDTH;
    const playerDrawX = st.player.x * scaleX;
    this.ctx.translate(playerDrawX, st.player.y);
    this.ctx.rotate((st.player.rotation * Math.PI) / 180);
    const playerImg = st.player.currentFrame === 0 ? img.playerIdle : img.playerPressed;
    if (playerImg) {
      this.ctx.drawImage(playerImg, -this.playerHalfWidth, -this.playerHalfHeight, PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    }

    this.ctx.restore();

    // UI (Туториал и счет)
    if (!st.isStarted && this.tutorialActive) {
      const textX = width / 2;
      const textY = height / 2 + this.playerHalfHeight + 24;
      this.ctx.save();
      this.ctx.translate(textX, textY);
      this.ctx.rotate(TUTORIAL_CONFIG.TEXT_SWING_AMPLITUDE * Math.sin((this.tutorialTimer * 2 * Math.PI) / TUTORIAL_CONFIG.TEXT_SWING_PERIOD));
      this.ctx.textAlign = "center";
      this.ctx.font = "500 30px Roboto Mono";
      this.ctx.fillStyle = UI_CONFIG.TEXT_COLOR_DARK;
      this.ctx.fillText(UI_CONFIG.TUTORIAL_TEXT, 0, 0);
      this.ctx.restore();
    }

    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = UI_CONFIG.TEXT_COLOR_WHITE;
    this.ctx.font = UI_CONFIG.BEST_SCORE_FONT;
    this.ctx.textAlign = "left";
    this.ctx.fillText(`лучший результат: ${this.bestScore}`, 21, 60);
    this.ctx.textAlign = "center";
    this.ctx.font = UI_CONFIG.SCORE_FONT;
    this.ctx.fillText(`${st.passedPipes}`, width / 2, 120);

    this.ctx.restore();
  }

  handleGameOver() {
    if (this.state.isGameOver) return;
    console.log("GameOver");
    this.state.isGameOver = true;

    if (this.finishCb) {
      const spentTime = (this.inTime ? Date.now() - this.inTime : 0) / 1000;
      console.log("spentTime", spentTime);
      this.finishCb({ score: this.state.passedPipes, spentTime });
    }
  }

  setFinishCallback(cb) { this.finishCb = cb; }
  setAssetsLoadedCallback(cb) { this.assetsLoadedCb = cb; }
  static getInstance(tmp) { return tmp.engine; }
}

function init(canvas, initGameData, tmp, finishCallback, assetsLoadedCallback) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) {
    console.error("Canvas does not exist!");
    return;
  }

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishCallback || (() => { }));
  engine.setAssetsLoadedCallback(assetsLoadedCallback || (() => { }));
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  if (engine) engine.stopGameLoop();
}

export { init, deinit };